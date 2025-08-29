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

use crate::{
    controller::reconciler::ReconcileStatus,
    models::{ResourceType, RuntimeConfig},
    spec_builder::reaction::ReactionSpecBuilder,
};
use axum::{response::IntoResponse, Json};
use dapr::server::actor::context_client::ActorContextClient;
use dapr_macros::actor;
use k8s_openapi::api::networking::v1::Ingress;
use kube::{Api, Client};
use resource_provider_api::models::{ReactionSpec, ReactionStatus};
use std::{collections::BTreeMap, marker};
use tokio::sync::RwLock;

use super::ResourceActor;

#[actor]
pub type ReactionActor = ResourceActor<ReactionSpec, ReactionStatus>;

impl ReactionActor {
    pub fn new(
        actor_type: &str,
        id: &str,
        runtime_config: RuntimeConfig,
        dapr_client: ActorContextClient,
        kube_config: kube::Config,
    ) -> Self {
        ResourceActor {
            actor_type: actor_type.to_string(),
            id: id.to_string(),
            dapr_client,
            resource_type: ResourceType::Reaction.to_string(),
            runtime_config,
            spec_builder: Box::new(ReactionSpecBuilder {}),
            controllers: RwLock::new(BTreeMap::new()),
            kube_config,
            _owns_tstatus: marker::PhantomData,
        }
    }

    pub async fn get_status(&self) -> impl IntoResponse {
        let controllers = self.controllers.read().await;
        let available = controllers
            .iter()
            .all(|c| c.1.status() == ReconcileStatus::Online);

        let mut messages = BTreeMap::new();
        for (name, controller) in controllers.iter() {
            match controller.status() {
                ReconcileStatus::Unknown => messages.insert(name.clone(), "Unknown".to_string()),
                ReconcileStatus::Offline(msg) => messages.insert(name.clone(), msg),
                ReconcileStatus::Online => continue,
            };
        }

        // Get ingress URL
        let ingress_url = self.get_ingress_url().await;

        Json(ReactionStatus {
            available,
            messages: Some(messages),
            ingress_url,
        })
    }

    async fn get_ingress_url(&self) -> Option<String> {
        match Client::try_from(self.kube_config.clone()) {
            Ok(client) => {
                let ingresses: Api<Ingress> = Api::default_namespaced(client);
                let label_selector = format!("drasi/resource={}", self.id);
                
                match ingresses.list(&kube::api::ListParams::default().labels(&label_selector)).await {
                    Ok(ingress_list) => {
                        if ingress_list.items.is_empty() {
                            return None;
                        }

                        let ingress = &ingress_list.items[0];

                        if let Some(spec) = &ingress.spec {
                            if let Some(rules) = &spec.rules {
                                if !rules.is_empty() {
                                    let rule = &rules[0];

                                    // If host is set and not "*", use the hostname
                                    if let Some(host) = &rule.host {
                                        if !host.is_empty() && host != "*" {
                                            return Some(format!("http://{}", host));
                                        }
                                    }

                                    // If host is "*" or empty, use the ingress address directly
                                    if rule.host.as_deref() == Some("*") || rule.host.is_none() {
                                        if let Some(status) = &ingress.status {
                                            if let Some(load_balancer) = &status.load_balancer {
                                                if let Some(ingress_list) = &load_balancer.ingress {
                                                    if !ingress_list.is_empty() {
                                                        let ingress_item = &ingress_list[0];
                                                        if let Some(ip) = &ingress_item.ip {
                                                            return Some(format!("http://{}", ip));
                                                        } else if let Some(hostname) = &ingress_item.hostname {
                                                            return Some(format!("http://{}", hostname));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        None
                    }
                    Err(e) => {
                        log::debug!("Failed to list ingresses for reaction {}: {}", self.id, e);
                        None
                    }
                }
            }
            Err(e) => {
                log::error!("Failed to create Kubernetes client: {}", e);
                None
            }
        }
    }
}
