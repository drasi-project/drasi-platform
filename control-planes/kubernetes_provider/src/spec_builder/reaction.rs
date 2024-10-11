use crate::models::{Component, ComponentSpec};

use super::{
    super::models::{KubernetesSpec, RuntimeConfig},
    build_deployment_spec, SpecBuilder,
};
use hashers::jenkins::spooky_hash::SpookyHasher;
use k8s_openapi::{
    api::core::v1::{ConfigMap, EnvVar, ServicePort, ServiceSpec},
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
        source: ResourceRequest<ReactionSpec>,
        runtime_config: &RuntimeConfig,
        instance_id: &str,
    ) -> Vec<KubernetesSpec> {
        let mut specs = Vec::new();

        let properties = source.spec.properties.clone().unwrap_or_default();
        let mut env: BTreeMap<String, ConfigValue> = properties.into_iter().collect();

        env.insert(
            "RESTART_HACK".to_string(),
            ConfigValue::Inline {
                value: calc_hash(&source.spec),
            },
        );

        env.insert(
            "INSTANCE_ID".to_string(),
            ConfigValue::Inline {
                value: instance_id.to_string(),
            },
        );

        let pub_sub_name = format!("drasi-pubsub-{}", source.id);
        env.insert(
            "PubsubName".to_string(),
            ConfigValue::Inline {
                value: pub_sub_name.clone(),
            },
        );

        let mut labels = BTreeMap::new();
        labels.insert("drasi/type".to_string(), "reaction".to_string());
        labels.insert("drasi/resource".to_string(), source.id.to_string());
        labels.insert("drasi/service".to_string(), "reaction".to_string());

        let config_name = format!("{}-{}-{}", source.id, "reaction", "queries");

        let services = source.spec.services.clone().unwrap_or_default();

        for (service_name, service_spec) in services {
            let mut config_volumes = BTreeMap::new();
            let mut config_maps = BTreeMap::new();
            config_maps.insert(
                config_name.clone(),
                ConfigMap {
                    metadata: ObjectMeta {
                        name: Some(config_name.clone()),
                        labels: Some(labels.clone()),
                        ..Default::default()
                    },
                    data: Some(source.spec.queries.clone().into_iter().collect()),
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
                            unimplemented!();
                        }
                    }
                }
            }

            config_volumes.insert(config_name.clone(), "/etc/queries".to_string());

            let deployment_spec = build_deployment_spec(
                runtime_config,
                "reaction",
                &source.id,
                "reaction",
                image.as_str(),
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
                value: Some(source.id.to_string()),
                value_from: None,
            });

            specs.push(KubernetesSpec {
                resource_id: source.id.to_string(),
                service_name: "reaction".to_string(),
                deployment: deployment_spec,
                services: k8s_services,
                config_maps,
                volume_claims: BTreeMap::new(),
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
                removed: false,
            });
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
