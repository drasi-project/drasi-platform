use std::collections::BTreeMap;

use k8s_openapi::api::{
    apps::v1::DeploymentSpec,
    core::v1::{ConfigMap, EnvVar, PersistentVolumeClaim, ServiceSpec},
};
use kube_derive::CustomResource;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct KubernetesSpec {
    pub resource_id: String,
    pub service_name: String,
    pub deployment: DeploymentSpec,
    pub services: BTreeMap<String, ServiceSpec>,
    pub config_maps: BTreeMap<String, ConfigMap>,
    pub volume_claims: BTreeMap<String, PersistentVolumeClaim>,
    pub pub_sub: Option<Component>,
    pub removed: bool,
}

impl KubernetesSpec {
    pub fn new(
        resource_id: String,
        service_name: String,
        deployment: DeploymentSpec,
    ) -> KubernetesSpec {
        KubernetesSpec {
            resource_id,
            service_name,
            deployment,
            services: BTreeMap::new(),
            config_maps: BTreeMap::new(),
            volume_claims: BTreeMap::new(),
            pub_sub: None,
            removed: false,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RuntimeConfig {
    pub image_prefix: String,
    pub image_tag: String,
    pub image_pull_policy: String,
    pub dapr_config: String,
    pub dapr_sidecar: String,
    pub pub_sub_type: String,
    pub pub_sub_version: String,
    pub pub_sub_config: Vec<EnvVar>,
}

impl RuntimeConfig {
    pub fn default() -> RuntimeConfig {
        //todo: read from config map
        let pub_sub_config = vec![
            EnvVar {
                name: "redisHost".to_string(),
                value: Some("rg-redis:6379".to_string()),
                value_from: None,
            },
            EnvVar {
                name: "redisPassword".to_string(),
                value: Some("".to_string()),
                value_from: None,
            },
            EnvVar {
                name: "concurrency".to_string(),
                value: Some("1".to_string()),
                value_from: None,
            },
            EnvVar {
                name: "queueDepth".to_string(),
                value: Some("100000".to_string()),
                value_from: None,
            },
        ];

        RuntimeConfig {
            image_prefix: match std::env::var("ACR") {
                Ok(acr) => format!("{}/drasi/", acr),
                Err(_) => "drasi/".to_string(),
            },
            image_tag: match std::env::var("IMAGE_VERSION_TAG") {
                Ok(tag) => tag,
                Err(_) => "latest".to_string(),
            },
            image_pull_policy: match std::env::var("IMAGE_PULL_POLICY") {
                Ok(pp) => pp,
                Err(_) => "Always".to_string(),
            },
            dapr_config: match std::env::var("DAPR_CONFIG") {
                Ok(config) => config,
                Err(_) => "dapr-config".to_string(),
            },
            dapr_sidecar: match std::env::var("DAPR_SIDECAR") {
                Ok(sidecar) => sidecar,
                Err(_) => "daprio/daprd:1.9.0".to_string(),
            },
            pub_sub_type: match std::env::var("PUB_SUB_TYPE") {
                Ok(pub_sub_type) => pub_sub_type,
                Err(_) => "pubsub.redis".to_string(),
            },
            pub_sub_version: match std::env::var("PUB_SUB_VERSION") {
                Ok(pub_sub_version) => pub_sub_version,
                Err(_) => "v1".to_string(),
            },
            pub_sub_config,
        }
    }
}

#[derive(CustomResource, Clone, Debug, Deserialize, Serialize, JsonSchema, PartialEq)]
#[kube(
    group = "dapr.io",
    version = "v1alpha1",
    kind = "Component",
    namespaced
)]
pub struct ComponentSpec {
    #[serde(rename = "type")]
    pub _type: String,

    pub version: String,

    pub metadata: Vec<EnvVar>,
}
