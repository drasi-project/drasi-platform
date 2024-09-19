use super::models::*;

impl From<ConfigValue> for resource_provider_api::models::ConfigValue {
    fn from(config_value: ConfigValue) -> resource_provider_api::models::ConfigValue {
        match config_value {
            ConfigValue::Inline { value } => match value {
                InlineValue::String { value } => {
                    resource_provider_api::models::ConfigValue::Inline { value }
                }
                InlineValue::Integer { value } => {
                    resource_provider_api::models::ConfigValue::Inline {
                        value: value.to_string(),
                    }
                }
                InlineValue::Boolean { value } => {
                    resource_provider_api::models::ConfigValue::Inline {
                        value: value.to_string(),
                    }
                }
                InlineValue::List { value } => {
                    let values: Vec<String> = value
                        .into_iter()
                        .map(|v| match v {
                            ConfigValue::Inline { value } => match value {
                                InlineValue::String { value } => value,
                                InlineValue::Integer { value } => value.to_string(),
                                InlineValue::Boolean { value } => value.to_string(),
                                InlineValue::List { value } => "".to_string(),
                            },
                            _ => "".to_string(),
                        })
                        .collect();
                    resource_provider_api::models::ConfigValue::Inline {
                        value: values.join(","),
                    }
                }
            },
            ConfigValue::Secret { name, key } => {
                resource_provider_api::models::ConfigValue::Secret { name, key }
            }
        }
    }
}

impl From<SourceSpec> for resource_provider_api::models::SourceSpec {
    fn from(source_spec: SourceSpec) -> resource_provider_api::models::SourceSpec {
        resource_provider_api::models::SourceSpec {
            kind: source_spec.kind,
            services: source_spec
                .services
                .map(|services| services.into_iter().map(|(k, v)| (k, v.unwrap().into())).collect()),
            properties: source_spec
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.unwrap().into())).collect()),
        }
    }
}

impl From<StorageSpec> for resource_provider_api::models::StorageSpec {
    fn from(storage_spec: StorageSpec) -> resource_provider_api::models::StorageSpec {
        match storage_spec {
            StorageSpec::Memory { enable_archive } => {
                resource_provider_api::models::StorageSpec::Memory { enable_archive }
            }
            StorageSpec::Redis {
                connection_string,
                cache_size,
            } => resource_provider_api::models::StorageSpec::Redis {
                connection_string: connection_string.into(),
                cache_size,
            },
            StorageSpec::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            } => resource_provider_api::models::StorageSpec::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            },
        }
    }
}

impl From<QueryContainerSpec> for resource_provider_api::models::QueryContainerSpec {
    fn from(query_container_spec: QueryContainerSpec) -> resource_provider_api::models::QueryContainerSpec {
        resource_provider_api::models::QueryContainerSpec {
            query_host_count: query_container_spec.query_host_count,
            storage: query_container_spec
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: query_container_spec.default_store,
            results: query_container_spec
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
        }
    }
}

impl From<ReactionSpec> for resource_provider_api::models::ReactionSpec {
    fn from(reaction_spec: ReactionSpec) -> resource_provider_api::models::ReactionSpec {
        resource_provider_api::models::ReactionSpec {
            kind: reaction_spec.kind,
            tag: reaction_spec.tag,
            services: reaction_spec.services.map(|services| services.into_iter().map(|(k, v)| (k, v.unwrap().into())).collect()),
            properties: reaction_spec.properties.map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            queries: reaction_spec.queries,
        }
    }
}


impl From<resource_provider_api::models::ConfigValue> for ConfigValue {
    fn from(config_value: resource_provider_api::models::ConfigValue) -> ConfigValue {
        match config_value {
            resource_provider_api::models::ConfigValue::Inline { value } => ConfigValue::Inline {
                value: { InlineValue::String { value } },
            },
            resource_provider_api::models::ConfigValue::Secret { name, key } => {
                ConfigValue::Secret { name, key }
            }
        }
    }
}

impl From<Endpoint> for resource_provider_api::models::Endpoint {
    fn from(endpoint: Endpoint) -> resource_provider_api::models::Endpoint {
        resource_provider_api::models::Endpoint {
            setting: endpoint.setting.into(),
            target: endpoint.target,
        }
    }
}


impl From<EndpointSetting> for resource_provider_api::models::EndpointSetting {
    fn from(endpoint_setting: EndpointSetting) -> resource_provider_api::models::EndpointSetting {
        match endpoint_setting {
            EndpointSetting::Internal => resource_provider_api::models::EndpointSetting::Internal,
            EndpointSetting::External => resource_provider_api::models::EndpointSetting::External,
        }
    }
}

impl From<Service> for resource_provider_api::models::Service {
    fn from(service: Service) -> resource_provider_api::models::Service {
        resource_provider_api::models::Service {
            replica: service.replica,
            image: service.image.unwrap(),
            endpoints: service
                .endpoints
                .map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            dapr: service.dapr.map(|dapr| dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: service.properties.map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
        }
    }
}

impl From<SourceProviderSpec> for resource_provider_api::models::SourceProviderSpec {
    fn from(source_provider_spec: SourceProviderSpec) -> resource_provider_api::models::SourceProviderSpec {
        resource_provider_api::models::SourceProviderSpec {
            services: source_provider_spec.services,
            config_schema: source_provider_spec.config_schema,
        }
    }
}


impl From<ReactionProviderSpec> for resource_provider_api::models::ReactionProviderSpec {
    fn from(reaction_provider_spec: ReactionProviderSpec) -> resource_provider_api::models::ReactionProviderSpec {
        resource_provider_api::models::ReactionProviderSpec {
            services: reaction_provider_spec.services,
            config_schema: reaction_provider_spec.config_schema,
        }
    }
}

impl From<QuerySourceLabel> for resource_provider_api::models::QuerySourceLabel {
    fn from(query_source_label: QuerySourceLabel) -> resource_provider_api::models::QuerySourceLabel {
        resource_provider_api::models::QuerySourceLabel {
            source_label: query_source_label.source_label,
        }
    }
}

impl From<QuerySubscription> for resource_provider_api::models::QuerySubscription {
    fn from(query_subscription: QuerySubscription) -> resource_provider_api::models::QuerySubscription {
        resource_provider_api::models::QuerySubscription {
            id: query_subscription.id,
            nodes: query_subscription.nodes.into_iter().map(|v| v.into()).collect(),
            relations: query_subscription.relations.into_iter().map(|v| v.into()).collect(),
            pipeline: query_subscription.pipeline,
        }
    }
}

impl From<QueryJoinKey> for resource_provider_api::models::QueryJoinKey {
    fn from(query_join_key: QueryJoinKey) -> resource_provider_api::models::QueryJoinKey {
        resource_provider_api::models::QueryJoinKey {
            label: query_join_key.label,
            property: query_join_key.property,
        }
    }
}

impl From<QueryJoin> for resource_provider_api::models::QueryJoin {
    fn from(query_join: QueryJoin) -> resource_provider_api::models::QueryJoin {
        resource_provider_api::models::QueryJoin {
            id: query_join.id,
            keys: query_join.keys.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl From<QuerySources> for resource_provider_api::models::QuerySources {
    fn from(query_sources: QuerySources) -> resource_provider_api::models::QuerySources {
        resource_provider_api::models::QuerySources {
            subscriptions: query_sources.subscriptions.into_iter().map(|v| v.into()).collect(),
            joins: query_sources.joins.into_iter().map(|v| v.into()).collect(),
            middleware: query_sources.middleware.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl From<SourceMiddlewareConfig> for resource_provider_api::models::SourceMiddlewareConfig {
    fn from(source_middleware_config: SourceMiddlewareConfig) -> resource_provider_api::models::SourceMiddlewareConfig {
        resource_provider_api::models::SourceMiddlewareConfig {
            kind: source_middleware_config.kind,
            name: source_middleware_config.name,
            config: source_middleware_config.config,
        }
    }
}

impl From<QuerySpec> for resource_provider_api::models::QuerySpec {
    fn from(query_spec: QuerySpec) -> resource_provider_api::models::QuerySpec {
        resource_provider_api::models::QuerySpec {
            mode: query_spec.mode,
            query: query_spec.query,
            sources: query_spec.sources.into(),
            storage_profile: query_spec.storage_profile,
            view: query_spec.view.into(),
        }
    }
}

impl From<SourceStatus> for resource_provider_api::models::SourceStatus {
    fn from(source_status: SourceStatus) -> resource_provider_api::models::SourceStatus {
        resource_provider_api::models::SourceStatus {
            available: source_status.available,
        }
    }
}

impl From<resource_provider_api::models::SourceStatus> for SourceStatus {
    fn from(source_status: resource_provider_api::models::SourceStatus) -> SourceStatus {
        SourceStatus {
            available: source_status.available,
        }
    }
}

impl From<QueryContainerStatus> for resource_provider_api::models::QueryContainerStatus {
    fn from(query_container_status: QueryContainerStatus) -> resource_provider_api::models::QueryContainerStatus {
        resource_provider_api::models::QueryContainerStatus {
            available: query_container_status.available,
        }
    }
}

impl From<resource_provider_api::models::QueryContainerStatus> for QueryContainerStatus {
    fn from(query_container_status: resource_provider_api::models::QueryContainerStatus) -> QueryContainerStatus {
        QueryContainerStatus {
            available: query_container_status.available,
        }
    }
}

impl From<ReactionStatus> for resource_provider_api::models::ReactionStatus {
    fn from(reaction_status: ReactionStatus) -> resource_provider_api::models::ReactionStatus {
        resource_provider_api::models::ReactionStatus {
            available: reaction_status.available,
        }
    }
}

impl From<resource_provider_api::models::ReactionStatus> for ReactionStatus {
    fn from(reaction_status: resource_provider_api::models::ReactionStatus) -> ReactionStatus {
        ReactionStatus {
            available: reaction_status.available,
        }
    }
}

impl From<SourceProviderStatus> for resource_provider_api::models::SourceProviderStatus {
    fn from(source_provider_status: SourceProviderStatus) -> resource_provider_api::models::SourceProviderStatus {
        resource_provider_api::models::SourceProviderStatus {
            available: source_provider_status.available,
        }
    }
}

impl From<resource_provider_api::models::ReactionProviderStatus> for ReactionProviderStatus {
    fn from(reaction_provider_status: resource_provider_api::models::ReactionProviderStatus) -> ReactionProviderStatus {
        ReactionProviderStatus {
            available: reaction_provider_status.available,
        }
    }
}

impl From<resource_provider_api::models::SourceProviderStatus> for SourceProviderStatus {
    fn from(source_provider_status: resource_provider_api::models::SourceProviderStatus) -> SourceProviderStatus {
        SourceProviderStatus {
            available: source_provider_status.available,
        }
    }
}


impl From<QueryStatus> for resource_provider_api::models::QueryStatus {
    fn from(query_status: QueryStatus) -> resource_provider_api::models::QueryStatus {
        resource_provider_api::models::QueryStatus {
            host_name: query_status.host_name,
            status: query_status.status,
            container: query_status.container,
            error_message: query_status.error_message,
        }
    }
}

impl From<resource_provider_api::models::QueryStatus> for QueryStatus {
    fn from(query_status: resource_provider_api::models::QueryStatus) -> QueryStatus {
        QueryStatus {
            host_name: query_status.host_name,
            status: query_status.status,
            container: query_status.container,
            error_message: query_status.error_message,
        }
    }
}

impl From<RetentionPolicy> for resource_provider_api::models::RetentionPolicy {
    fn from(retention_policy: RetentionPolicy) -> resource_provider_api::models::RetentionPolicy {
        match retention_policy {
            RetentionPolicy::Latest => resource_provider_api::models::RetentionPolicy::Latest,
            RetentionPolicy::Expire { after_seconds } => {
                resource_provider_api::models::RetentionPolicy::Expire { after_seconds }
            }
            RetentionPolicy::All => resource_provider_api::models::RetentionPolicy::All,
        }
    }
}


impl From<ViewSpec> for resource_provider_api::models::ViewSpec {
    fn from(view_spec: ViewSpec) -> resource_provider_api::models::ViewSpec {
        resource_provider_api::models::ViewSpec {
            enabled: view_spec.enabled,
            retention_policy: view_spec.retention_policy.into(),
        }
    }
}
