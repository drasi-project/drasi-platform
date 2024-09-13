use super::models::*;

impl Into<resource_provider_api::models::ConfigValue> for ConfigValue {
    fn into(self) -> resource_provider_api::models::ConfigValue {
        match self {
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

impl Into<resource_provider_api::models::SourceSpec> for SourceSpec {
    fn into(self) -> resource_provider_api::models::SourceSpec {
        resource_provider_api::models::SourceSpec {
            kind: self.kind,
            services: match self.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| (k, v.unwrap().into()))
                        .collect(),
                ),
                None => None,
            },
            properties: match self.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, v.unwrap().into()))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl Into<resource_provider_api::models::StorageSpec> for StorageSpec {
    fn into(self) -> resource_provider_api::models::StorageSpec {
        match self {
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
                storage_class: storage_class.into(),
                direct_io,
            },
        }
    }
}

impl Into<resource_provider_api::models::QueryContainerSpec> for QueryContainerSpec {
    fn into(self) -> resource_provider_api::models::QueryContainerSpec {
        resource_provider_api::models::QueryContainerSpec {
            query_host_count: self.query_host_count,
            storage: self
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: self.default_store,
            results: self
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
        }
    }
}

impl Into<resource_provider_api::models::ReactionSpec> for ReactionSpec {
    fn into(self) -> resource_provider_api::models::ReactionSpec {
        resource_provider_api::models::ReactionSpec {
            kind: self.kind,
            tag: match self.tag {
                Some(tag) => Some(tag),
                None => None,
            },
            services: match self.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| (k, v.unwrap().into()))
                        .collect(),
                ),
                None => None,
            },
            properties: match self.properties {
                Some(properties) => {
                    Some(properties.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            queries: self.queries,
        }
    }
}

impl Into<ConfigValue> for resource_provider_api::models::ConfigValue {
    fn into(self) -> ConfigValue {
        match self {
            resource_provider_api::models::ConfigValue::Inline { value } => ConfigValue::Inline {
                value: { InlineValue::String { value } },
            },
            resource_provider_api::models::ConfigValue::Secret { name, key } => {
                ConfigValue::Secret { name, key }
            }
        }
    }
}

impl Into<resource_provider_api::models::Endpoint> for Endpoint {
    fn into(self) -> resource_provider_api::models::Endpoint {
        resource_provider_api::models::Endpoint {
            setting: self.setting.into(),
            target: self.target,
        }
    }
}

impl Into<resource_provider_api::models::EndpointSetting> for EndpointSetting {
    fn into(self) -> resource_provider_api::models::EndpointSetting {
        match self {
            EndpointSetting::Internal => resource_provider_api::models::EndpointSetting::Internal,
            EndpointSetting::External => resource_provider_api::models::EndpointSetting::External,
        }
    }
}

impl Into<resource_provider_api::models::Service> for Service {
    fn into(self) -> resource_provider_api::models::Service {
        resource_provider_api::models::Service {
            replica: self.replica,
            image: self.image.unwrap(),
            endpoints: match self.endpoints {
                Some(endpoints) => {
                    Some(endpoints.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            dapr: match self.dapr {
                Some(dapr) => Some(dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
                None => None,
            },
            properties: match self.properties {
                Some(properties) => {
                    Some(properties.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
        }
    }
}

impl Into<resource_provider_api::models::SourceProviderSpec> for SourceProviderSpec {
    fn into(self) -> resource_provider_api::models::SourceProviderSpec {
        resource_provider_api::models::SourceProviderSpec {
            services: self.services.into_iter().map(|(k, v)| (k, v)).collect(),
            config_schema: match self.config_schema {
                Some(properties) => Some(properties),
                None => None,
            },
        }
    }
}

impl Into<resource_provider_api::models::ReactionProviderSpec> for ReactionProviderSpec {
    fn into(self) -> resource_provider_api::models::ReactionProviderSpec {
        resource_provider_api::models::ReactionProviderSpec {
            services: self.services.into_iter().map(|(k, v)| (k, v)).collect(),
            config_schema: match self.config_schema {
                Some(properties) => Some(properties),
                None => None,
            },
        }
    }
}

impl Into<resource_provider_api::models::QuerySourceLabel> for QuerySourceLabel {
    fn into(self) -> resource_provider_api::models::QuerySourceLabel {
        resource_provider_api::models::QuerySourceLabel {
            source_label: self.source_label,
        }
    }
}

impl Into<resource_provider_api::models::QuerySubscription> for QuerySubscription {
    fn into(self) -> resource_provider_api::models::QuerySubscription {
        resource_provider_api::models::QuerySubscription {
            id: self.id,
            nodes: self.nodes.into_iter().map(|v| v.into()).collect(),
            relations: self.relations.into_iter().map(|v| v.into()).collect(),
            pipeline: self.pipeline,
        }
    }
}

impl Into<resource_provider_api::models::QueryJoinKey> for QueryJoinKey {
    fn into(self) -> resource_provider_api::models::QueryJoinKey {
        resource_provider_api::models::QueryJoinKey {
            label: self.label,
            property: self.property,
        }
    }
}

impl Into<resource_provider_api::models::QueryJoin> for QueryJoin {
    fn into(self) -> resource_provider_api::models::QueryJoin {
        resource_provider_api::models::QueryJoin {
            id: self.id,
            keys: self.keys.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl Into<resource_provider_api::models::QuerySources> for QuerySources {
    fn into(self) -> resource_provider_api::models::QuerySources {
        resource_provider_api::models::QuerySources {
            subscriptions: self.subscriptions.into_iter().map(|v| v.into()).collect(),
            joins: self.joins.into_iter().map(|v| v.into()).collect(),
            middleware: self.middleware.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl Into<resource_provider_api::models::SourceMiddlewareConfig> for SourceMiddlewareConfig {
    fn into(self) -> resource_provider_api::models::SourceMiddlewareConfig {
        resource_provider_api::models::SourceMiddlewareConfig {
            kind: self.kind,
            name: self.name,
            config: self.config,
        }
    }
}

impl Into<resource_provider_api::models::QuerySpec> for QuerySpec {
    fn into(self) -> resource_provider_api::models::QuerySpec {
        resource_provider_api::models::QuerySpec {
            mode: self.mode.into(),
            query: self.query,
            sources: self.sources.into(),
            storage_profile: self.storage_profile,
            view: self.view.into(),
        }
    }
}

impl Into<SourceStatus> for resource_provider_api::models::SourceStatus {
    fn into(self) -> SourceStatus {
        SourceStatus {
            available: self.available.into(),
            messages: self.messages,
        }
    }
}

impl Into<QueryContainerStatus> for resource_provider_api::models::QueryContainerStatus {
    fn into(self) -> QueryContainerStatus {
        QueryContainerStatus {
            available: self.available.into(),
            messages: self.messages,
        }
    }
}

impl Into<ReactionStatus> for resource_provider_api::models::ReactionStatus {
    fn into(self) -> ReactionStatus {
        ReactionStatus {
            available: self.available.into(),
            messages: self.messages,
        }
    }
}

impl Into<resource_provider_api::models::SourceProviderStatus> for SourceProviderStatus {
    fn into(self) -> resource_provider_api::models::SourceProviderStatus {
        resource_provider_api::models::SourceProviderStatus {
            available: self.available.into(),
        }
    }
}

impl Into<ReactionProviderStatus> for resource_provider_api::models::ReactionProviderStatus {
    fn into(self) -> ReactionProviderStatus {
        ReactionProviderStatus {
            available: self.available.into(),
        }
    }
}

impl Into<SourceProviderStatus> for resource_provider_api::models::SourceProviderStatus {
    fn into(self) -> SourceProviderStatus {
        SourceProviderStatus {
            available: self.available.into(),
        }
    }
}

impl Into<resource_provider_api::models::QueryStatus> for QueryStatus {
    fn into(self) -> resource_provider_api::models::QueryStatus {
        resource_provider_api::models::QueryStatus {
            host_name: self.host_name,
            status: self.status.into(),
            container: self.container.into(),
            error_message: self.error_message,
        }
    }
}

impl Into<QueryStatus> for resource_provider_api::models::QueryStatus {
    fn into(self) -> QueryStatus {
        QueryStatus {
            host_name: self.host_name,
            status: self.status.into(),
            container: self.container.into(),
            error_message: self.error_message,
        }
    }
}

impl Into<resource_provider_api::models::RetentionPolicy> for RetentionPolicy {
    fn into(self) -> resource_provider_api::models::RetentionPolicy {
        match self {
            RetentionPolicy::Latest => resource_provider_api::models::RetentionPolicy::Latest,
            RetentionPolicy::Expire { after_seconds } => {
                resource_provider_api::models::RetentionPolicy::Expire { after_seconds }
            }
            RetentionPolicy::All => resource_provider_api::models::RetentionPolicy::All,
        }
    }
}

impl Into<resource_provider_api::models::ViewSpec> for ViewSpec {
    fn into(self) -> resource_provider_api::models::ViewSpec {
        resource_provider_api::models::ViewSpec {
            enabled: self.enabled,
            retention_policy: self.retention_policy.into(),
        }
    }
}
