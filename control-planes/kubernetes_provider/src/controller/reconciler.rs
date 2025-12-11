// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::{
    collections::BTreeMap,
    hash::{Hash, Hasher},
};

use either::Either;
use hashers::jenkins::spooky_hash::SpookyHasher;
use k8s_openapi::{
    api::{
        apps::v1::{Deployment, DeploymentSpec, DeploymentStrategy},
        core::v1::{ConfigMap, PersistentVolumeClaim, Pod, Service, ServiceAccount},
        networking::v1::Ingress,
    },
    Metadata,
};
use kube::{
    api::{DeleteParams, ListParams, Patch, PatchParams, PostParams},
    core::ObjectMeta,
    Api, ResourceExt,
};
use serde::Serialize;

use crate::models::Component;

use super::super::models::{KubernetesSpec, RuntimeConfig};

pub struct ResourceReconciler {
    spec: KubernetesSpec,
    runtime_config: RuntimeConfig,
    deployment_hash: String,
    service_account_hash: String,
    component_api: Api<Component>,
    deployment_api: Api<Deployment>,
    pod_api: Api<Pod>,
    cm_api: Api<ConfigMap>,
    pvc_api: Api<PersistentVolumeClaim>,
    service_api: Api<Service>,
    ingress_api: Api<Ingress>,
    account_api: Api<ServiceAccount>,
    labels: BTreeMap<String, String>,
    pub status: ReconcileStatus,
}

#[derive(Clone, Debug, Serialize, PartialEq)]
pub enum ReconcileStatus {
    Unknown,
    Offline(String),
    Online,
}

unsafe impl Send for ResourceReconciler {}

impl ResourceReconciler {
    pub fn new(
        kube_config: kube::Config,
        spec: KubernetesSpec,
        runtime_config: RuntimeConfig,
    ) -> Self {
        let labels = spec
            .deployment
            .selector
            .match_labels
            .as_ref()
            .expect("deployment selector match_labels required")
            .clone();

        let client =
            kube::Client::try_from(kube_config).expect("failed to create kube client from config");

        Self {
            deployment_hash: calc_deployment_hash(&spec),
            service_account_hash: calc_service_account_hash(&spec),
            spec,
            runtime_config,
            component_api: Api::default_namespaced(client.clone()),
            deployment_api: Api::default_namespaced(client.clone()),
            pod_api: Api::default_namespaced(client.clone()),
            cm_api: Api::default_namespaced(client.clone()),
            pvc_api: Api::default_namespaced(client.clone()),
            service_api: Api::default_namespaced(client.clone()),
            ingress_api: Api::default_namespaced(client.clone()),
            account_api: Api::default_namespaced(client.clone()),
            labels,
            status: ReconcileStatus::Unknown,
        }
    }

    async fn update_deployment_status(&mut self, deployment: &Deployment) {
        match &deployment.status {
            Some(status) => {
                if status.available_replicas.unwrap_or(0) == 0 {
                    let spec = match &deployment.spec {
                        Some(spec) => spec,
                        None => {
                            self.status = ReconcileStatus::Offline("-".to_string());
                            return;
                        }
                    };

                    let deployment_labels = match &spec.selector.match_labels {
                        Some(labels) => labels,
                        None => {
                            self.status = ReconcileStatus::Offline("-".to_string());
                            return;
                        }
                    };

                    let label_selector = deployment_labels
                        .iter()
                        .map(|(k, v)| format!("{k}={v}"))
                        .collect::<Vec<String>>()
                        .join(",");

                    let lp = ListParams::default().labels(&label_selector);
                    let pod_list = match self.pod_api.list(&lp).await {
                        Ok(pod_list) => pod_list,
                        Err(_) => {
                            self.status = ReconcileStatus::Offline("-".to_string());
                            return;
                        }
                    };

                    let mut errors = Vec::new();
                    for pod in pod_list.items {
                        if pod.metadata.deletion_timestamp.is_some() {
                            continue;
                        }
                        match pod.status {
                            Some(pod_status) => match pod_status.container_statuses {
                                Some(container_statuses) => {
                                    let not_ready = container_statuses.iter().any(|x| !x.ready);

                                    for container_status in container_statuses {
                                        let state = match not_ready {
                                            false => container_status.state,
                                            true => container_status
                                                .last_state
                                                .or(container_status.state),
                                        };
                                        match state {
                                            Some(state) => {
                                                if let Some(terminated) = state.terminated {
                                                    errors.push(format!(
                                                        "{}: {} {}",
                                                        container_status.name,
                                                        terminated.reason.unwrap_or_default(),
                                                        terminated
                                                            .message
                                                            .unwrap_or("Terminated".to_string())
                                                    ));
                                                }
                                                if let Some(waiting) = state.waiting {
                                                    errors.push(format!(
                                                        "{}: waiting: {} {}",
                                                        container_status.name,
                                                        waiting.reason.unwrap_or_default(),
                                                        waiting.message.unwrap_or_default()
                                                    ));
                                                }
                                            }
                                            None => continue,
                                        }
                                    }
                                }
                                None => continue,
                            },
                            None => continue,
                        }
                    }

                    self.status = ReconcileStatus::Offline(errors.join("\n"));
                    return;
                }

                self.status = ReconcileStatus::Online;
            }
            None => self.status = ReconcileStatus::Unknown,
        }
    }

    async fn deprovision(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let name = format!(
            "{}-{}",
            self.spec.resource_id.clone(),
            self.spec.service_name.clone()
        );
        log::info!("Deprovisioning deployment {}", name);
        let pp = DeleteParams::default();
        match self.deployment_api.delete(&name, &pp).await {
            Ok(delete_result) => match delete_result {
                Either::Left(dep) => self.update_deployment_status(&dep).await,
                Either::Right(_) => {}
            },
            Err(err) => match err {
                kube::Error::Api(api_err) => {
                    if api_err.code != 404 {
                        return Err(Box::new(api_err));
                    }
                }
                _ => return Err(Box::new(err)),
            },
        }

        // if service exist, delete
        for service_name in self.spec.services.keys() {
            let name = format!("{}-{}", self.spec.resource_id.clone(), service_name.clone());
            log::info!("Deprovisioning service {}", name);
            let pp = DeleteParams::default();
            if let Err(err) = self.service_api.delete(&name, &pp).await {
                match err {
                    kube::Error::Api(api_err) => {
                        if api_err.code != 404 {
                            return Err(Box::new(api_err));
                        }
                    }
                    _ => return Err(Box::new(err)),
                }
            }
        }

        for config_name in self.spec.config_maps.keys() {
            log::info!("Deprovisioning config map {}", config_name.clone());
            let pp = DeleteParams::default();
            if let Err(err) = self.cm_api.delete(config_name, &pp).await {
                match err {
                    kube::Error::Api(api_err) => {
                        if api_err.code != 404 {
                            return Err(Box::new(api_err));
                        }
                    }
                    _ => return Err(Box::new(err)),
                }
            }
        }

        // if ingresses exist, delete them
        if let Some(ingresses) = &self.spec.ingresses {
            for ingress_name in ingresses.keys() {
                log::info!("Deprovisioning ingress {}", ingress_name);
                let pp = DeleteParams::default();
                if let Err(err) = self.ingress_api.delete(ingress_name, &pp).await {
                    match err {
                        kube::Error::Api(api_err) => {
                            if api_err.code != 404 {
                                return Err(Box::new(api_err));
                            }
                        }
                        _ => return Err(Box::new(err)),
                    }
                }
            }
        }

        if let Some(service_account) = &self.spec.service_account {
            if let Some(name) = &service_account.metadata().name {
                log::info!("Deprovisioning service account {}", name);
                let pp = DeleteParams::default();
                if let Err(err) = self.account_api.delete(name, &pp).await {
                    match err {
                        kube::Error::Api(api_err) => {
                            if api_err.code != 404 {
                                return Err(Box::new(api_err));
                            }
                        }
                        _ => return Err(Box::new(err)),
                    }
                }
            }
        }

        Ok(())
    }

    async fn reconcile_components(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Reconciling components {}", self.spec.resource_id);

        if let Some(pub_sub) = &self.spec.pub_sub {
            let name = &pub_sub
                .metadata
                .name
                .clone()
                .expect("pub_sub metadata name required");
            match self.component_api.get(name).await {
                Ok(current) => {
                    if current.spec != pub_sub.spec {
                        log::info!("Updating component {}", name);
                        let pp = PostParams::default();
                        _ = self.component_api.replace(name, &pp, pub_sub).await?;
                    }
                }
                Err(e) => match e {
                    kube::Error::Api(api_err) => {
                        if api_err.code != 404 {
                            log::error!("Error getting pubsub component: {}", api_err.code);
                            return Err(Box::new(api_err));
                        }
                        log::info!("Creating component {}", name);
                        let pp = PostParams::default();
                        _ = self.component_api.create(&pp, pub_sub).await?;
                    }
                    _ => return Err(Box::new(e)),
                },
            }
        }

        Ok(())
    }

    async fn reconcile_deployment(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let name = format!(
            "{}-{}",
            self.spec.resource_id.clone(),
            self.spec.service_name.clone()
        );
        log::info!("Reconciling deployment {}", name);
        let mut annotations = BTreeMap::new();
        annotations.insert("drasi/spechash".to_string(), self.deployment_hash.clone());

        let dep = Deployment {
            metadata: ObjectMeta {
                name: Some(name.clone()),
                labels: Some(self.labels.clone()),
                annotations: Some(annotations),
                ..Default::default()
            },
            spec: Some(DeploymentSpec {
                strategy: Some(DeploymentStrategy {
                    type_: Some("RollingUpdate".to_string()),
                    ..Default::default()
                }),
                ..self.spec.deployment.clone()
            }),
            ..Default::default()
        };

        match self.deployment_api.get(&name).await {
            Ok(current) => {
                self.update_deployment_status(&current).await;
                let current_hash = current
                    .metadata
                    .annotations
                    .expect("deployment annotations required")["drasi/spechash"]
                    .clone();
                if current_hash != self.deployment_hash {
                    log::info!("Updating deployment {}", name);
                    let pp = PatchParams::default();
                    let pat = Patch::Merge(&dep);
                    let update_result = self.deployment_api.patch(&name, &pp, &pat).await?;
                    self.update_deployment_status(&update_result).await;
                }
            }
            Err(e) => match e {
                kube::Error::Api(api_err) => {
                    if api_err.code != 404 {
                        log::error!("Error getting deployment: {}", api_err.code);
                        return Err(Box::new(api_err));
                    }
                    log::info!("Creating deployment {}", name);
                    let pp = PostParams::default();
                    let create_result = self.deployment_api.create(&pp, &dep).await?;
                    self.update_deployment_status(&create_result).await;
                }
                _ => return Err(Box::new(e)),
            },
        }

        Ok(())
    }

    async fn reconcile_config_maps(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Reconciling config maps {}", self.spec.resource_id);

        for (name, cm) in &self.spec.config_maps {
            match self.cm_api.get(name).await {
                Ok(current) => {
                    if current.data != cm.data {
                        log::info!("Updating config map {}", name);
                        let pp = PostParams::default();
                        self.cm_api.replace(name, &pp, cm).await?;
                    }
                }
                Err(e) => match e {
                    kube::Error::Api(api_err) => {
                        if api_err.code != 404 {
                            log::error!("Error getting config map: {}", api_err.code);
                            return Err(Box::new(api_err));
                        }
                        log::info!("Creating config map {}", name);
                        let pp = PostParams::default();
                        self.cm_api.create(&pp, cm).await?;
                    }
                    _ => return Err(Box::new(e)),
                },
            }
        }

        Ok(())
    }

    async fn reconcile_services(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Reconciling services {}", self.spec.resource_id);

        for (name, svc_spec) in &self.spec.services {
            let svc = Service {
                metadata: ObjectMeta {
                    name: Some(format!(
                        "{}-{}",
                        self.spec.resource_id.clone(),
                        name.clone()
                    )),
                    labels: Some(self.labels.clone()),
                    ..Default::default()
                },
                spec: Some(svc_spec.clone()),
                ..Default::default()
            };

            match self.service_api.get(name).await {
                Ok(current) => {
                    let current_hash = current
                        .metadata
                        .annotations
                        .expect("service annotations required")["drasi/spechash"]
                        .clone();
                    if current_hash != self.deployment_hash {
                        log::info!("Updating service {}", name);
                        let pp = PostParams::default();
                        self.service_api.replace(name, &pp, &svc).await?;
                    }
                }
                Err(e) => match e {
                    kube::Error::Api(api_err) => {
                        if api_err.code != 404 {
                            log::error!("Error getting service: {}", api_err.code);
                            return Err(Box::new(api_err));
                        }
                        log::info!("Creating service {}", name);
                        let pp = PostParams::default();
                        self.service_api.create(&pp, &svc).await?;
                    }
                    _ => return Err(Box::new(e)),
                },
            }
        }

        Ok(())
    }

    async fn get_dynamic_ingress_config(
        &self,
    ) -> (
        String,
        String,
        String,
        Option<String>,
        BTreeMap<String, String>,
    ) {
        // Try to read from drasi-config ConfigMap, fall back to defaults
        let mut ingress_service = self.runtime_config.ingress_load_balancer_service.clone();
        let mut ingress_namespace = self.runtime_config.ingress_load_balancer_namespace.clone();
        let mut ingress_class_name = self.runtime_config.ingress_class_name.clone();
        let mut ingress_ip: Option<String> = None;
        let mut ingress_annotations = BTreeMap::new();

        match self.cm_api.get("drasi-config").await {
            Ok(config_map) => {
                if let Some(data) = &config_map.data {
                    if let Some(service) = data.get("INGRESS_LOAD_BALANCER_SERVICE") {
                        if !service.is_empty() {
                            ingress_service = service.clone();
                        }
                    }
                    if let Some(namespace) = data.get("INGRESS_LOAD_BALANCER_NAMESPACE") {
                        if !namespace.is_empty() {
                            ingress_namespace = namespace.clone();
                        }
                    }
                    if let Some(class_name) = data.get("INGRESS_CLASS_NAME") {
                        if !class_name.is_empty() {
                            ingress_class_name = class_name.clone();
                        }
                    }
                    if let Some(ip) = data.get("INGRESS_IP") {
                        if !ip.is_empty() {
                            ingress_ip = Some(ip.clone());
                        }
                    }

                    // Parse INGRESS_ANNOTATIONS from ConfigMap
                    if let Some(annotations_str) = data.get("INGRESS_ANNOTATIONS") {
                        for pair in annotations_str.split(',') {
                            if let Some((key, value)) = pair.split_once('=') {
                                ingress_annotations
                                    .insert(key.trim().to_string(), value.trim().to_string());
                            }
                        }
                    }
                }
            }
            Err(e) => {
                log::warn!(
                    "Could not read drasi-config ConfigMap, using defaults: {}",
                    e
                );
            }
        }

        (
            ingress_service,
            ingress_namespace,
            ingress_class_name,
            ingress_ip,
            ingress_annotations,
        )
    }

    async fn get_ingress_external_ip(&self) -> Option<String> {
        let (
            ingress_service,
            ingress_namespace,
            _ingress_class_name,
            ingress_ip,
            _ingress_annotations,
        ) = self.get_dynamic_ingress_config().await;

        if let Some(ip) = ingress_ip {
            return Some(ip);
        }

        // For traditional ingress controllers, lookup IP from LoadBalancer service
        let client = self.service_api.clone().into_client();
        let service_api: Api<Service> = Api::namespaced(client, &ingress_namespace);

        match service_api.get(&ingress_service).await {
            Ok(service) => {
                if let Some(status) = &service.status {
                    if let Some(load_balancer) = &status.load_balancer {
                        if let Some(ingresses) = &load_balancer.ingress {
                            for ingress in ingresses {
                                if let Some(ip) = &ingress.ip {
                                    return Some(ip.clone());
                                }
                                if let Some(hostname) = &ingress.hostname {
                                    return Some(hostname.clone());
                                }
                            }
                        }
                    }
                }
            }
            Err(e) => {
                log::warn!(
                    "Could not get ingress controller LoadBalancer IP from service {}/{}: {}",
                    &ingress_namespace,
                    &ingress_service,
                    e
                );
            }
        }
        None
    }

    async fn reconcile_ingresses(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(ingresses) = &self.spec.ingresses {
            log::info!("Reconciling ingresses {}", self.spec.resource_id);

            let ip_suffix = match self.get_ingress_external_ip().await {
                Some(ip) => format!("{ip}.nip.io"),
                None => {
                    log::warn!("Could not determine external IP, using UNAVAILABLE");
                    "UNAVAILABLE".to_string()
                }
            };

            for (name, mut ingress_spec) in ingresses.clone() {
                let (
                    _ingress_service,
                    _ingress_namespace,
                    ingress_class_name,
                    _ingress_ip,
                    dynamic_annotations,
                ) = self.get_dynamic_ingress_config().await;

                // Apply dynamic annotations from ConfigMap
                if !dynamic_annotations.is_empty() {
                    let metadata = &mut ingress_spec.metadata;
                    if metadata.annotations.is_none() {
                        metadata.annotations = Some(BTreeMap::new());
                    }
                    if let Some(annotations) = &mut metadata.annotations {
                        for (key, value) in &dynamic_annotations {
                            annotations.insert(key.clone(), value.clone());
                        }
                    }
                }

                if let Some(spec) = &mut ingress_spec.spec {
                    spec.ingress_class_name = Some(ingress_class_name);
                }

                if let Some(spec) = &mut ingress_spec.spec {
                    if let Some(rules) = &mut spec.rules {
                        for rule in rules {
                            if let Some(host) = &rule.host {
                                if host.contains("PLACEHOLDER") {
                                    if ip_suffix != "UNAVAILABLE" {
                                        rule.host = Some(host.replace("PLACEHOLDER", &ip_suffix));
                                    } else {
                                        log::warn!(
                                            "Could not determine external IP, using 127.0.0.1"
                                        );
                                        rule.host = Some(host.replace("PLACEHOLDER", "127.0.0.1"));
                                    }
                                }
                            }

                            if let Some(http) = &mut rule.http {
                                for path in &mut http.paths {
                                    path.path_type = "Prefix".to_string();
                                }
                            }
                        }
                    }
                }

                match self.ingress_api.get(&name).await {
                    Ok(current) => {
                        if current.spec != ingress_spec.spec {
                            log::info!("Updating ingress {}", name);
                            let pp = PostParams::default();
                            self.ingress_api.replace(&name, &pp, &ingress_spec).await?;
                        }
                    }
                    Err(e) => match e {
                        kube::Error::Api(api_err) => {
                            if api_err.code != 404 {
                                log::error!("Error getting ingress: {}", api_err.code);
                                return Err(Box::new(api_err));
                            }
                            log::info!("Creating ingress {}", name);
                            let pp = PostParams::default();
                            self.ingress_api.create(&pp, &ingress_spec).await?;
                        }
                        _ => return Err(Box::new(e)),
                    },
                }
            }
        }

        Ok(())
    }

    async fn reconcile_persistent_volume_claims(
        &mut self,
    ) -> Result<(), Box<dyn std::error::Error>> {
        log::info!(
            "Reconciling persistent volume claims {}",
            self.spec.resource_id
        );

        for (name, pvc) in &self.spec.volume_claims {
            let pp = PostParams::default();
            self.pvc_api
                .entry(name)
                .await?
                .or_insert(move || pvc.clone())
                .commit(&pp)
                .await?;
        }

        Ok(())
    }

    async fn reconcile_service_account(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(service_account) = &self.spec.service_account {
            log::info!("Reconciling service account {}", self.spec.resource_id);
            let mut new_service_account = service_account.clone();
            new_service_account.annotations_mut().insert(
                "drasi/spechash".to_string(),
                self.service_account_hash.clone(),
            );

            let name = service_account
                .metadata
                .name
                .clone()
                .expect("service account name required");
            match self.account_api.get(&name).await {
                Ok(current) => {
                    let current_hash = current
                        .metadata
                        .annotations
                        .expect("service account annotations required")["drasi/spechash"]
                        .clone();
                    if current_hash != self.service_account_hash {
                        log::info!("Updating service account {}", name);
                        let pp = PostParams::default();
                        self.account_api
                            .replace(&name, &pp, &new_service_account)
                            .await?;
                    }
                }
                Err(e) => match e {
                    kube::Error::Api(api_err) => {
                        if api_err.code != 404 {
                            log::error!("Error getting service account: {}", api_err.code);
                            return Err(Box::new(api_err));
                        }
                        log::info!("Creating service account {}", name);
                        let pp = PostParams::default();
                        self.account_api.create(&pp, &new_service_account).await?;
                    }
                    _ => return Err(Box::new(e)),
                },
            }
        }

        Ok(())
    }

    pub async fn reconcile(&mut self) {
        log::debug!("Reconciling {}", self.spec.resource_id);
        if self.spec.removed {
            if let Err(err) = self.deprovision().await {
                log::error!("Error deprovisioning: {}", err);
            }
            return;
        }

        if let Err(err) = self.reconcile_config_maps().await {
            log::error!("Error reconciling config maps: {}", err);
        }

        if let Err(err) = self.reconcile_persistent_volume_claims().await {
            log::error!("Error reconciling persistent volume claims: {}", err);
        }

        if let Err(err) = self.reconcile_components().await {
            log::error!("Error reconciling components: {}", err);
        }

        if let Err(err) = self.reconcile_service_account().await {
            log::error!("Error reconciling service account: {}", err);
        }

        if let Err(err) = self.reconcile_deployment().await {
            log::error!("Error reconciling deployment: {}", err);
        }

        if let Err(err) = self.reconcile_services().await {
            log::error!("Error reconciling services: {}", err);
        }

        if let Err(err) = self.reconcile_ingresses().await {
            log::error!("Error reconciling ingresses: {}", err);
        }
    }

    pub async fn remove(&mut self) {
        self.spec.removed = true;
        self.reconcile().await;
    }
}

fn calc_deployment_hash(spec: &KubernetesSpec) -> String {
    let mut hash = SpookyHasher::default();

    let dep_data =
        serde_json::to_vec(&spec.deployment).expect("deployment serialization should not fail");
    dep_data.hash(&mut hash);

    let cm_data =
        serde_json::to_vec(&spec.config_maps).expect("config_maps serialization should not fail");
    cm_data.hash(&mut hash);

    let hsh = hash.finish();
    format!("{hsh:02x}")
}

fn calc_service_account_hash(spec: &KubernetesSpec) -> String {
    let mut hash = SpookyHasher::default();

    let sa_data = serde_json::to_vec(&spec.service_account)
        .expect("service_account serialization should not fail");
    sa_data.hash(&mut hash);

    let hsh = hash.finish();
    format!("{hsh:02x}")
}
