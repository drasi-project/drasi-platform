use super::{
    super::models::{KubernetesSpec, RuntimeConfig},
    build_deployment_spec, SpecBuilder,
};
use k8s_openapi::{
    api::core::v1::{
        PersistentVolumeClaim, PersistentVolumeClaimSpec, ResourceRequirements, ServicePort,
        ServiceSpec,
    },
    apimachinery::pkg::{api::resource::Quantity, util::intstr::IntOrString},
};
use kube::core::ObjectMeta;
use resource_provider_api::models::{ConfigValue, QueryContainerSpec, ResourceRequest};
use std::collections::BTreeMap;

const DEFAULT_STORAGE_CLASS: &str = "azurefile-csi-premium";
const DEFAULT_STORAGE_SIZE: &str = "10Gi";

macro_rules! hashmap {
  ($( $key: expr => $val: expr ),*) => {{
       let mut map = ::std::collections::BTreeMap::new();
       $( map.insert($key.to_string(), $val); )*
       map
  }}
}

pub struct QueryContainerSpecBuilder {}

impl SpecBuilder<QueryContainerSpec> for QueryContainerSpecBuilder {
    fn build(
        &self,
        source: ResourceRequest<QueryContainerSpec>,
        runtime_config: &RuntimeConfig,
        instance_id: &str,
    ) -> Vec<KubernetesSpec> {
        let mut specs = Vec::new();

        specs.push(KubernetesSpec {
            resource_id: source.id.to_string(),
            service_name: "publish-api".to_string(),
            deployment: build_deployment_spec(
                runtime_config,
                "querycontainer",
                &source.id,
                "publish-api",
                "query-container-publish-api",
                1,
                Some(4000),
                hashmap![
                "QUERY_NODE_ID" => ConfigValue::Inline { value: source.id.clone() },
                "INSTANCE_ID" => ConfigValue::Inline { value: instance_id.to_string() }
                ],
                None,
                None,
                None,
                None,
            ),
            services: BTreeMap::new(),
            config_maps: BTreeMap::new(),
            volume_claims: BTreeMap::new(),
            pub_sub: None,
            removed: false,
        });

        let mut persistent_volumes = BTreeMap::new();
        let mut persistent_volume_claims = BTreeMap::new();

        let mut env = BTreeMap::new();
        env.insert(
            "QUERY_NODE_ID".to_string(),
            ConfigValue::Inline {
                value: source.id.clone(),
            },
        );

        env.extend(source.spec.results);

        env.insert(
            "DEFAULT_STORE".to_string(),
            ConfigValue::Inline {
                value: source.spec.default_store.clone(),
            },
        );

        for (store_index, (name, storage_spec)) in source.spec.storage.into_iter().enumerate() {
            env.insert(
                format!("STORE_{}", store_index),
                ConfigValue::Inline {
                    value: name.clone(),
                },
            );

            match storage_spec {
                resource_provider_api::models::StorageSpec::Memory { enable_archive } => {
                    env.insert(
                        format!("STORE_{}_TYPE", store_index),
                        ConfigValue::Inline {
                            value: "Memory".to_string(),
                        },
                    );

                    env.insert(
                        format!("STORE_{}_ENABLE_ARCHIVE", store_index),
                        ConfigValue::Inline {
                            value: enable_archive.to_string(),
                        },
                    );
                }
                resource_provider_api::models::StorageSpec::Redis {
                    connection_string,
                    cache_size,
                } => {
                    env.insert(
                        format!("STORE_{}_TYPE", store_index),
                        ConfigValue::Inline {
                            value: "Redis".to_string(),
                        },
                    );

                    env.insert(
                        format!("STORE_{}_CONNECTION_STRING", store_index),
                        connection_string,
                    );

                    if let Some(cache_size) = cache_size {
                        env.insert(
                            format!("STORE_{}_CACHE_SIZE", store_index),
                            ConfigValue::Inline {
                                value: cache_size.to_string(),
                            },
                        );
                    }
                }
                resource_provider_api::models::StorageSpec::RocksDb {
                    enable_archive,
                    storage_class,
                    direct_io,
                } => {
                    let storage_class = storage_class.unwrap_or(DEFAULT_STORAGE_CLASS.into());
                    let pv_name = format!("{}-{}-store-{}", source.id, name, storage_class);
                    persistent_volume_claims.insert(
                        pv_name.clone(),
                        PersistentVolumeClaim {
                            metadata: ObjectMeta {
                                name: Some(pv_name.clone()),
                                ..Default::default()
                            },
                            spec: Some(PersistentVolumeClaimSpec {
                                access_modes: Some(vec!["ReadWriteMany".to_string()]),
                                resources: Some(ResourceRequirements {
                                    requests: Some(storage_requests(
                                        DEFAULT_STORAGE_SIZE.to_string(),
                                    )),
                                    ..Default::default()
                                }),
                                storage_class_name: Some(storage_class),
                                ..Default::default()
                            }),
                            ..Default::default()
                        },
                    );

                    persistent_volumes.insert(pv_name.clone(), "/data".into());

                    env.insert(
                        format!("STORE_{}_TYPE", store_index),
                        ConfigValue::Inline {
                            value: "RocksDb".to_string(),
                        },
                    );

                    env.insert(
                        format!("STORE_{}_ENABLE_ARCHIVE", store_index),
                        ConfigValue::Inline {
                            value: enable_archive.to_string(),
                        },
                    );

                    env.insert(
                        format!("STORE_{}_DIRECT_IO", store_index),
                        ConfigValue::Inline {
                            value: direct_io.to_string(),
                        },
                    );
                }
            }
        }

        specs.push(KubernetesSpec {
            resource_id: source.id.to_string(),
            service_name: "query-host".to_string(),
            deployment: build_deployment_spec(
                runtime_config,
                "querycontainer",
                &source.id,
                "query-host",
                "query-container-query-host",
                source.spec.query_host_count as i32,
                Some(3000),
                env.clone(),
                None,
                None,
                Some(persistent_volumes),
                None,
            ),
            services: BTreeMap::new(),
            config_maps: BTreeMap::new(),
            volume_claims: persistent_volume_claims,
            pub_sub: None,
            removed: false,
        });

        specs.push(KubernetesSpec {
            resource_id: source.id.to_string(),
            service_name: "view-svc".to_string(),
            deployment: build_deployment_spec(
                runtime_config,
                "querycontainer",
                &source.id,
                "view-svc",
                "query-container-view-svc",
                1,
                Some(8080),
                hashmap![
                    "QUERY_NODE_ID" => ConfigValue::Inline { value: source.id.clone() },
                    "VIEW_STORE_TYPE" => ConfigValue::Inline { value: "mongo".to_string() },
                    "INSTANCE_ID" => ConfigValue::Inline { value: instance_id.to_string() }
                ],
                Some(hashmap![
                    "api" => 80
                ]),
                None,
                None,
                None,
            ),
            services: hashmap!(
                "view-svc".to_string() => ServiceSpec {
                    type_: Some("ClusterIP".to_string()),
                    selector: Some(hashmap![
                        "drasi/type".to_string() => "querycontainer".to_string(),
                        "drasi/resource".to_string() => source.id.to_string(),
                        "drasi/service".to_string() => "view-svc".to_string()
                    ]),
                    ports: Some(vec![ServicePort {
                        port: 80,
                        target_port: Some(IntOrString::String("api".to_string())),
                        ..Default::default()
                    }]),
                    ..Default::default()
                }
            ),
            config_maps: BTreeMap::new(),
            volume_claims: BTreeMap::new(),
            pub_sub: None,
            removed: false,
        });

        specs
    }
}

fn storage_requests(storage: String) -> BTreeMap<String, Quantity> {
    let mut storage_requirements = BTreeMap::new();
    storage_requirements.insert("storage".to_string(), Quantity(storage));
    storage_requirements
}
