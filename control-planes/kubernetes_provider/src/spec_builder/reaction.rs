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

use crate::models::{Component, ComponentSpec, ResourceType};

use super::{
    super::models::{KubernetesSpec, RuntimeConfig},
    build_deployment_spec,
    identity::apply_identity,
    SpecBuilder,
};
use hashers::jenkins::spooky_hash::SpookyHasher;
use k8s_openapi::{
    api::{
        core::v1::{ConfigMap, EnvVar, ServicePort, ServiceSpec},
        networking::v1::{
            HTTPIngressPath, HTTPIngressRuleValue, Ingress, IngressBackend, IngressRule,
            IngressServiceBackend, IngressSpec, ServiceBackendPort,
        },
    },
    apimachinery::pkg::util::intstr::IntOrString,
};
use kube::core::ObjectMeta;
use resource_provider_api::models::{ConfigValue, EndpointSetting, ReactionSpec, ResourceRequest};
use serde::Serialize;
use std::{
    collections::BTreeMap,
    hash::{Hash, Hasher},
};

pub struct ReactionSpecBuilder {}

impl SpecBuilder<ReactionSpec> for ReactionSpecBuilder {
    fn build(
        &self,
        reaction: ResourceRequest<ReactionSpec>,
        runtime_config: &RuntimeConfig,
        instance_id: &str,
    ) -> Vec<KubernetesSpec> {
        let mut specs = Vec::new();

        let properties = reaction.spec.properties.clone().unwrap_or_default();
        let mut env: BTreeMap<String, ConfigValue> = properties.into_iter().collect();

        env.insert(
            "CONFIG_HASH".to_string(),
            ConfigValue::Inline {
                value: calc_hash(&reaction.spec),
            },
        );

        env.insert(
            "INSTANCE_ID".to_string(),
            ConfigValue::Inline {
                value: instance_id.to_string(),
            },
        );

        let pub_sub_name = format!("drasi-pubsub-{}", reaction.id);
        env.insert(
            "PubsubName".to_string(),
            ConfigValue::Inline {
                value: pub_sub_name.clone(),
            },
        );

        let services = reaction.spec.services.clone().unwrap_or_default();

        for (service_name, service_spec) in services {
            let mut config_volumes = BTreeMap::new();
            let mut config_maps = BTreeMap::new();

            let mut labels = BTreeMap::new();
            labels.insert("drasi/type".to_string(), ResourceType::Reaction.to_string());
            labels.insert("drasi/resource".to_string(), reaction.id.to_string());
            labels.insert("drasi/service".to_string(), service_name.clone());

            let config_name = format!("{}-{}-{}", reaction.id, service_name, "queries");

            config_maps.insert(
                config_name.clone(),
                ConfigMap {
                    metadata: ObjectMeta {
                        name: Some(config_name.clone()),
                        labels: Some(labels.clone()),
                        ..Default::default()
                    },
                    data: Some(reaction.spec.queries.clone().into_iter().collect()),
                    ..Default::default()
                },
            );
            let image = service_spec.image.clone();

            let replica = service_spec.replica.unwrap_or("1".to_string());

            let app_port = match service_spec.dapr {
                Some(ref dapr) => match dapr.get("app-port") {
                    Some(ConfigValue::Inline { value }) => Some(value.parse::<u16>().unwrap()),
                    _ => None,
                },
                None => None,
            };

            let app_protocol = match service_spec.dapr {
                Some(ref dapr) => match dapr.get("app-protocol") {
                    Some(ConfigValue::Inline { value }) => Some(value.clone()),
                    _ => None,
                },
                None => None,
            };

            let mut k8s_services = BTreeMap::new();
            let mut k8s_ingresses = BTreeMap::new();
            let mut ports = BTreeMap::new();
            if let Some(endpoints) = service_spec.endpoints {
                for (endpoint_name, endpoint) in endpoints {
                    match endpoint.setting {
                        EndpointSetting::Internal => {
                            let port = endpoint.target.parse::<i32>().unwrap();
                            ports.insert(endpoint_name.clone(), port);
                            let service_spec = ServiceSpec {
                                type_: Some("ClusterIP".to_string()),
                                selector: Some(labels.clone()),
                                ports: Some(vec![ServicePort {
                                    name: Some(endpoint_name.clone()),
                                    port,
                                    target_port: Some(IntOrString::String(endpoint_name.clone())),
                                    ..Default::default()
                                }]),
                                ..Default::default()
                            };
                            k8s_services.insert(endpoint_name.clone(), service_spec);
                        }
                        EndpointSetting::External => {
                            println!("REACHED EXTERNAL ENDPOINT: {}", endpoint_name);
                            let port = endpoint.target.parse::<i32>().unwrap();
                            ports.insert(endpoint_name.clone(), port);

                            // Create ClusterIP service for the ingress to target
                            let service_spec = ServiceSpec {
                                type_: Some("ClusterIP".to_string()),
                                selector: Some(labels.clone()),
                                ports: Some(vec![ServicePort {
                                    name: Some(endpoint_name.clone()),
                                    port,
                                    target_port: Some(IntOrString::String(endpoint_name.clone())),
                                    ..Default::default()
                                }]),
                                ..Default::default()
                            };
                            // Use just endpoint_name as key - ResourceReconciler will add reaction.id prefix
                            let service_key = format!("{}-{}", service_name, endpoint_name);
                            k8s_services.insert(service_key.clone(), service_spec);

                            // Create Ingress resource with hostname-based routing
                            let ingress_name = format!("{}-reaction-ingress", reaction.id);
                            let mut annotations = BTreeMap::new();
                            annotations.insert(
                                "kubernetes.io/ingress.class".to_string(),
                                runtime_config.ingress_class_name.clone(),
                            );

                            // Generate hostname: <reaction-name>.drasi.PLACEHOLDER
                            // The PLACEHOLDER will be replaced with actual IP during reconciliation
                            let hostname = format!("{}.drasi.PLACEHOLDER", reaction.id);

                            let ingress = Ingress {
                                metadata: ObjectMeta {
                                    name: Some(ingress_name.clone()),
                                    labels: Some(labels.clone()),
                                    annotations: Some(annotations),
                                    ..Default::default()
                                },
                                spec: Some(IngressSpec {
                                    ingress_class_name: Some(
                                        runtime_config.ingress_class_name.clone(),
                                    ),
                                    rules: Some(vec![IngressRule {
                                        host: Some(hostname),
                                        http: Some(HTTPIngressRuleValue {
                                            paths: vec![HTTPIngressPath {
                                                path: Some("/".to_string()),
                                                path_type: "Prefix".to_string(),
                                                backend: IngressBackend {
                                                    service: Some(IngressServiceBackend {
                                                        name: format!(
                                                            "{}-{}",
                                                            reaction.id,
                                                            service_key.clone()
                                                        ),
                                                        port: Some(ServiceBackendPort {
                                                            number: Some(port),
                                                            ..Default::default()
                                                        }),
                                                    }),
                                                    ..Default::default()
                                                },
                                            }],
                                        }),
                                    }]),
                                    ..Default::default()
                                }),
                                ..Default::default()
                            };
                            k8s_ingresses.insert(ingress_name, ingress);
                        }
                    }
                }
            }

            config_volumes.insert(config_name.clone(), "/etc/queries".to_string());

            let deployment_spec = build_deployment_spec(
                runtime_config,
                ResourceType::Reaction,
                &reaction.id,
                &service_name,
                image.as_str(),
                service_spec.external_image.unwrap_or(false),
                replica.parse::<i32>().unwrap(),
                Some(app_port.unwrap_or(80)),
                env.clone(),
                Some(ports),
                Some(config_volumes),
                None,
                app_protocol,
            );

            let mut pub_sub_metadata = runtime_config.pub_sub_config.clone();
            pub_sub_metadata.push(EnvVar {
                name: "consumerID".to_string(),
                value: Some(reaction.id.to_string()),
                value_from: None,
            });

            let mut k8s_spec = KubernetesSpec {
                resource_type: ResourceType::Reaction,
                resource_id: reaction.id.to_string(),
                service_name: service_name.clone(),
                deployment: deployment_spec,
                services: k8s_services,
                config_maps,
                volume_claims: BTreeMap::new(),
                ingresses: Some(k8s_ingresses),
                pub_sub: Some(Component {
                    metadata: ObjectMeta {
                        name: Some(pub_sub_name.clone()),
                        labels: Some(labels.clone()),
                        ..Default::default()
                    },
                    spec: ComponentSpec {
                        _type: runtime_config.pub_sub_type.clone(),
                        version: runtime_config.pub_sub_version.clone(),
                        metadata: pub_sub_metadata,
                    },
                }),
                service_account: None,
                removed: false,
            };

            if let Some(identity) = &reaction.spec.identity {
                apply_identity(&mut k8s_spec, identity);
            }

            specs.push(k8s_spec);
        }

        specs
    }
}

fn calc_hash<T: Serialize>(obj: &T) -> String {
    let data = serde_json::to_vec(obj).unwrap();
    let mut hash = SpookyHasher::default();
    data.hash(&mut hash);
    let hsh = hash.finish();
    format!("{:02x}", hsh)
}
