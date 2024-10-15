use std::collections::BTreeMap;

use k8s_openapi::{
    api::{
        apps::v1::DeploymentSpec,
        core::v1::{
            Container, ContainerPort, EnvVar, EnvVarSource, PodSpec, PodTemplateSpec,
            ResourceRequirements, SecretKeySelector,
        },
    },
    apimachinery::pkg::apis::meta::v1::LabelSelector,
};
use kube::core::ObjectMeta;
use resource_provider_api::models::{ConfigValue, ResourceRequest};
use serde_json::json;

use super::models::{KubernetesSpec, RuntimeConfig};
pub mod query_container;
pub mod reaction;
pub mod source;

pub trait SpecBuilder<TSpec> {
    fn build(
        &self,
        source: ResourceRequest<TSpec>,
        runtime_config: &RuntimeConfig,
        instance_id: &str,
    ) -> Vec<KubernetesSpec>;
}

#[allow(clippy::too_many_arguments)]
pub fn build_deployment_spec(
    runtime_config: &RuntimeConfig,
    resource_type: &str,
    resource_id: &str,
    service_name: &str,
    image: &str,
    replicas: i32,
    app_port: Option<u16>,
    env_vars: BTreeMap<String, ConfigValue>,
    endpoints: Option<BTreeMap<String, i32>>,
    config_volumes: Option<BTreeMap<String, String>>,
    // claim => mount path
    persistent_volumes: Option<BTreeMap<String, String>>,
    app_protocol: Option<String>,
) -> DeploymentSpec {
    let app_id = format!("{}-{}", resource_id, service_name);

    let mut env = map_env_vars(env_vars);
    let mut ports = Vec::new();
    let mut volume_mounts = Vec::new();
    let mut volumes = Vec::new();
    let mut pod_annotations = BTreeMap::new();
    pod_annotations.insert("dapr.io/enabled".to_string(), "true".to_string());
    pod_annotations.insert("dapr.io/app-id".to_string(), app_id.clone());
    pod_annotations.insert(
        "dapr.io/config".to_string(),
        runtime_config.dapr_config.clone(),
    );
    pod_annotations.insert(
        "dapr.io/sidecar-image".to_string(),
        runtime_config.dapr_sidecar.clone(),
    );

    if let Some(port) = app_port {
        pod_annotations.insert("dapr.io/app-port".to_string(), port.to_string());
    }

    if let Some(protocol) = app_protocol {
        pod_annotations.insert("dapr.io/app-protocol".to_string(), protocol);
    }
    let mut labels = BTreeMap::new();
    labels.insert("drasi/type".to_string(), resource_type.to_string());
    labels.insert("drasi/resource".to_string(), resource_id.to_string());
    labels.insert("drasi/service".to_string(), service_name.to_string());

    if let Some(endpoints) = endpoints {
        for (name, port) in endpoints {
            ports.push(ContainerPort {
                name: Some(name),
                container_port: port,
                ..Default::default()
            });
        }
    }

    if let Some(persistent_volumes) = persistent_volumes {
        for (name, path) in persistent_volumes {
            volume_mounts.push(k8s_openapi::api::core::v1::VolumeMount {
                name: name.clone(),
                mount_path: path.clone(),
                ..Default::default()
            });
            volumes.push(k8s_openapi::api::core::v1::Volume {
                name: name.clone(),
                persistent_volume_claim: Some(
                    k8s_openapi::api::core::v1::PersistentVolumeClaimVolumeSource {
                        claim_name: name.clone(),
                        ..Default::default()
                    },
                ),
                ..Default::default()
            });
        }
    }

    if let Some(config_volumes) = config_volumes {
        for (name, path) in config_volumes {
            volume_mounts.push(k8s_openapi::api::core::v1::VolumeMount {
                name: name.clone(),
                read_only: Some(true),
                mount_path: path.clone(),
                ..Default::default()
            });
            volumes.push(k8s_openapi::api::core::v1::Volume {
                name: name.clone(),
                config_map: Some(k8s_openapi::api::core::v1::ConfigMapVolumeSource {
                    name: Some(name.clone()),
                    ..Default::default()
                }),
                ..Default::default()
            });
        }
    }

    env.sort_by_key(|e| e.name.clone());

    DeploymentSpec {
        replicas: Some(replicas),
        selector: LabelSelector {
            match_labels: Some(labels.clone()),
            ..Default::default()
        },
        template: PodTemplateSpec {
            metadata: Some(ObjectMeta {
                labels: Some(labels.clone()),
                annotations: Some(pod_annotations),
                ..Default::default()
            }),
            spec: Some(PodSpec {
                containers: vec![Container {
                    name: service_name.to_string(),
                    image: Some(format!(
                        "{}{}:{}",
                        runtime_config.image_prefix, image, runtime_config.image_tag
                    )),
                    image_pull_policy: Some(runtime_config.image_pull_policy.clone()),
                    termination_message_policy: Some("FallbackToLogsOnError".to_string()),
                    env: Some(env),
                    resources: Some(get_default_resource_requirements(image)),
                    ports: Some(ports),
                    volume_mounts: Some(volume_mounts),
                    ..Default::default()
                }],
                volumes: Some(volumes),
                ..Default::default()
            }),
        },
        ..Default::default()
    }
}

fn map_env_vars(env_vars: BTreeMap<String, ConfigValue>) -> Vec<EnvVar> {
    let mut env: Vec<EnvVar> = vec![];

    for (k, v) in env_vars.iter() {
        env.push(EnvVar {
            name: k.to_string(),
            value: match v {
                ConfigValue::Inline { value } => Some(value.clone()),
                _ => None,
            },
            value_from: match v {
                ConfigValue::Secret { name, key } => Some(EnvVarSource {
                    secret_key_ref: Some(SecretKeySelector {
                        key: key.clone(),
                        name: Some(name.clone()),
                        optional: None,
                    }),
                    config_map_key_ref: None,
                    field_ref: None,
                    resource_field_ref: None,
                }),
                _ => None,
            },
        });
    }
    env
}

fn get_default_resource_requirements(image: &str) -> ResourceRequirements {
    let result: ResourceRequirements = match image {
        "query-container-query-host" => serde_json::from_value(json!({
          "limits": {
            "cpu": "250m",
            "memory": "4Gi"
          },
          "requests": {
            "cpu": "250m",
            "memory": "512Mi"
          },
        }))
        .unwrap(),
        _ => serde_json::from_value(json!({
          "limits": {
            "cpu": "200m",
            "memory": "512Mi"
          },
          "requests": {
            "cpu": "50m",
            "memory": "128Mi"
          },
        }))
        .unwrap(),
    };

    result
}
