use std::collections::BTreeMap;

use either::Either;
use k8s_openapi::api::{
    apps::v1::{
        Deployment, DeploymentSpec, DeploymentStatus, DeploymentStrategy, RollingUpdateDeployment,
    },
    core::v1::{ConfigMap, PersistentVolumeClaim, Service},
};
use kube::{
    api::{DeleteParams, Patch, PatchParams, PostParams},
    config,
    core::ObjectMeta,
    runtime::wait::delete,
    Api,
};
use serde::Serialize;
use sha1::{Digest, Sha1};

use crate::models::Component;

use super::super::models::KubernetesSpec;

pub struct ResourceReconciler {
    spec: KubernetesSpec,
    hash: String,
    component_api: Api<Component>,
    deployment_api: Api<Deployment>,
    cm_api: Api<ConfigMap>,
    pvc_api: Api<PersistentVolumeClaim>,
    service_api: Api<Service>,
    labels: BTreeMap<String, String>,
    pub status: ReconcileStatus,
}

#[derive(Clone, Debug, Serialize, PartialEq)]
pub enum ReconcileStatus {
    Unknown,
    Offline,
    Online,
}

unsafe impl Send for ResourceReconciler {}

impl ResourceReconciler {
    pub fn new(kube_config: kube::Config, spec: KubernetesSpec) -> Self {
        let labels = spec
            .deployment
            .template
            .metadata
            .as_ref()
            .unwrap()
            .labels
            .as_ref()
            .unwrap()
            .clone();

        let client = kube::Client::try_from(kube_config).unwrap();

        Self {
            hash: calc_hash(&spec.deployment),
            spec,
            component_api: Api::default_namespaced(client.clone()),
            deployment_api: Api::default_namespaced(client.clone()),
            cm_api: Api::default_namespaced(client.clone()),
            pvc_api: Api::default_namespaced(client.clone()),
            service_api: Api::default_namespaced(client.clone()),
            labels,
            status: ReconcileStatus::Unknown,
        }
    }

    fn update_deployment_status(&mut self, status: Option<DeploymentStatus>) {
        match status {
            Some(status) => {
                if status.available_replicas.unwrap_or(0) > 0 {
                    self.status = ReconcileStatus::Online;
                } else {
                    self.status = ReconcileStatus::Offline;
                }
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
                Either::Left(dep) => self.update_deployment_status(dep.status),
                Either::Right(_) => {}
            },
            Err(err) => return Err(Box::new(err)),
        }

        // if servce exist, delete
        for (service_name, _) in &self.spec.services {
            let name = format!("{}-{}", self.spec.resource_id.clone(), service_name.clone());
            log::info!("Deprovisioning service {}", name);
            let pp = DeleteParams::default();
            _ = self.service_api.delete(&name, &pp).await?;
        }

        for (config_name, _) in &self.spec.config_maps {
            log::info!("Deprovisioning config map {}", config_name);
            let pp = DeleteParams::default();
            _ = self.cm_api.delete(&config_name, &pp).await?;
        }

        Ok(())
    }

    async fn reconcile_components(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Reconciling components {}", self.spec.resource_id);

        if let Some(pub_sub) = &self.spec.pub_sub {
            let name = &pub_sub.metadata.name.clone().unwrap();
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
                        _ = self.component_api.create(&pp, &pub_sub).await?;
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
        annotations.insert("drasi/spechash".to_string(), self.hash.clone());

        let mut dep = Deployment::default();
        dep.metadata = ObjectMeta {
            name: Some(name.clone()),
            labels: Some(self.labels.clone()),
            annotations: Some(annotations),
            ..Default::default()
        };
        dep.spec = Some(DeploymentSpec {
            strategy: Some(DeploymentStrategy {
                type_: Some("RollingUpdate".to_string()),
                ..Default::default()
            }),
            ..self.spec.deployment.clone()
        });

        match self.deployment_api.get(&name).await {
            Ok(current) => {
                self.update_deployment_status(current.status);
                let current_hash = current.metadata.annotations.unwrap()["drasi/spechash"].clone();
                if current_hash != self.hash {
                    log::info!("Updating deployment {}", name);
                    let pp = PatchParams::default();
                    let pat = Patch::Merge(&dep);
                    let update_result = self.deployment_api.patch(&name, &pp, &pat).await?;
                    self.update_deployment_status(update_result.status);
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
                    self.update_deployment_status(create_result.status);
                }
                _ => return Err(Box::new(e)),
            },
        }

        Ok(())
    }

    async fn reconcile_config_maps(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Reconciling config maps {}", self.spec.resource_id);

        for (name, cm) in &self.spec.config_maps {
            match self.cm_api.get(&name).await {
                Ok(current) => {
                    if current.data != cm.data {
                        log::info!("Updating config map {}", name);
                        let pp = PostParams::default();
                        self.cm_api.replace(&name, &pp, &cm).await?;
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
                        self.cm_api.create(&pp, &cm).await?;
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

            match self.service_api.get(&name).await {
                Ok(current) => {
                    let current_hash =
                        current.metadata.annotations.unwrap()["drasi/spechash"].clone();
                    if current_hash != self.hash {
                        log::info!("Updating service {}", name);
                        let pp = PostParams::default();
                        self.service_api.replace(&name, &pp, &svc).await?;
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

        if let Err(err) = self.reconcile_deployment().await {
            log::error!("Error reconciling deployment: {}", err);
        }

        if let Err(err) = self.reconcile_services().await {
            log::error!("Error reconciling services: {}", err);
        }
    }

    pub async fn remove(&mut self) {
        self.spec.removed = true;
        self.reconcile().await;
    }
}

fn calc_hash<T: Serialize>(obj: &T) -> String {
    let data = serde_json::to_vec(obj).unwrap();
    let mut hasher = Sha1::new();
    hasher.update(data);
    let hsh = hasher.finalize();
    format!("{:02x}", hsh)
}
