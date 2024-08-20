use super::models::*;
use crate::domain::models::{
    ConfigValue, Endpoint, EndpointSetting, InlineValue, QueryContainerSpec, QueryContainerStatus,
    QueryJoin, QueryJoinKey, QueryPartitionStatus, QuerySourceLabel, QuerySources, QuerySpec,
    QueryStatus, QuerySubscription, ReactionProviderSpec, ReactionSpec, ReactionStatus, Resource,
    ResourceProvider, RetentionPolicy, Service, SourceMiddlewareConfig, SourceProviderSpec,
    SourceSpec, SourceStatus, StorageSpec, ViewSpec,
};

impl Into<SourceStatus> for SourceStatusDto {
    fn into(self) -> SourceStatus {
        SourceStatus {
            available: self.available,
        }
    }
}

impl From<SourceStatus> for SourceStatusDto {
    fn from(status: SourceStatus) -> Self {
        SourceStatusDto {
            available: status.available,
        }
    }
}

impl From<QueryContainerStatus> for QueryContainerStatusDto {
    fn from(status: QueryContainerStatus) -> Self {
        QueryContainerStatusDto {
            available: status.available,
        }
    }
}

impl From<ReactionStatus> for ReactionStatusDto {
    fn from(status: ReactionStatus) -> Self {
        ReactionStatusDto {
            available: status.available,
        }
    }
}

impl From<QueryStatus> for QueryStatusDto {
    fn from(status: QueryStatus) -> Self {
        QueryStatusDto {
            partitions: status.partitions.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl From<QueryPartitionStatus> for QueryPartitionStatusDto {
    fn from(status: QueryPartitionStatus) -> Self {
        QueryPartitionStatusDto {
            partition: status.partition,
            host_name: status.host_name,
            status: status.status,
            container: status.container,
            error_message: status.error_message,
        }
    }
}

impl<TSpec, TStatus, TSpecDto, TStatusDto> Into<Resource<TSpec, TStatus>>
    for ResourceDto<TSpecDto, TStatusDto>
where
    TSpecDto: Into<TSpec>,
    TStatusDto: Into<TStatus>,
{
    fn into(self) -> Resource<TSpec, TStatus> {
        Resource {
            id: self.id,
            spec: self.spec.into(),
            status: self.status.map(|s| s.into()),
        }
    }
}

impl<Tspec, TspecDto> Into<ResourceProvider<Tspec>> for ResourceProviderDto<TspecDto>
where
    TspecDto: Into<Tspec>,
{
    fn into(self) -> ResourceProvider<Tspec> {
        ResourceProvider {
            id: self.id,
            spec: self.spec.into(),
        }
    }
}

impl<TSpec, TStatus, TSpecDto, TStatusDto> From<Resource<TSpec, TStatus>>
    for ResourceDto<TSpecDto, TStatusDto>
where
    TSpec: Into<TSpecDto>,
    TStatus: Into<TStatusDto>,
{
    fn from(val: Resource<TSpec, TStatus>) -> Self {
        ResourceDto {
            id: val.id,
            spec: val.spec.into(),
            status: val.status.map(|s| s.into()),
        }
    }
}

impl<TSpec, TSpecDto> From<ResourceProvider<TSpec>> for ResourceProviderDto<TSpecDto>
where
    TSpec: Into<TSpecDto>,
{
    fn from(val: ResourceProvider<TSpec>) -> Self {
        ResourceProviderDto {
            id: val.id,
            spec: val.spec.into(),
        }
    }
}

impl Into<ConfigValue> for ConfigValueDto {
    fn into(self) -> ConfigValue {
        match self {
            ConfigValueDto::Inline { value } => match value {
                InlineValueDto::String { value } => ConfigValue::Inline {
                    value: InlineValue::String { value },
                },
                InlineValueDto::Integer { value } => ConfigValue::Inline {
                    value: InlineValue::Integer { value },
                },
                InlineValueDto::Boolean { value } => ConfigValue::Inline {
                    value: InlineValue::Boolean { value },
                },
                InlineValueDto::List { value } => ConfigValue::Inline {
                    value: InlineValue::List {
                        value: value.into_iter().map(|v| v.into()).collect(),
                    },
                },
            },
            ConfigValueDto::Secret { name, key } => ConfigValue::Secret { name, key },
        }
    }
}

impl From<ConfigValue> for ConfigValueDto {
    fn from(value: ConfigValue) -> Self {
        match value {
            ConfigValue::Inline { value } => match value {
                InlineValue::String { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::String { value },
                },
                InlineValue::Integer { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::Integer { value },
                },
                InlineValue::Boolean { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::Boolean { value },
                },
                InlineValue::List { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::List {
                        value: value.into_iter().map(|v| v.into()).collect(),
                    },
                },
            },
            ConfigValue::Secret { name, key } => ConfigValueDto::Secret { name, key },
        }
    }
}

impl Into<Service> for ServiceDto {
    fn into(self) -> Service {
        Service {
            replica: self.replica,
            image: self.image,
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
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, v.unwrap_or_default().into()))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl Into<Endpoint> for EndpointDto {
    fn into(self) -> Endpoint {
        Endpoint {
            setting: self.setting.into(),
            target: self.target,
        }
    }
}

impl From<Endpoint> for EndpointDto {
    fn from(endpoint: Endpoint) -> Self {
        EndpointDto {
            setting: endpoint.setting.into(),
            target: endpoint.target,
        }
    }
}

impl From<EndpointSetting> for EndpointSettingDto {
    fn from(setting: EndpointSetting) -> Self {
        match setting {
            EndpointSetting::Internal => EndpointSettingDto::Internal,
            EndpointSetting::External => EndpointSettingDto::External,
        }
    }
}

impl Into<EndpointSetting> for EndpointSettingDto {
    fn into(self) -> EndpointSetting {
        match self {
            EndpointSettingDto::Internal => EndpointSetting::Internal,
            EndpointSettingDto::External => EndpointSetting::External,
        }
    }
}

impl From<Service> for ServiceDto {
    fn from(service: Service) -> Self {
        ServiceDto {
            replica: service.replica,
            image: service.image,
            endpoints: match service.endpoints {
                Some(endpoints) => {
                    Some(endpoints.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            dapr: match service.dapr {
                Some(dapr) => Some(dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
                None => None,
            },
            properties: match service.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.into())))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl Into<SourceSpec> for SourceSpecDto {
    fn into(self) -> SourceSpec {
        SourceSpec {
            kind: self.kind,
            services: match self.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| {
                            if let Some(v) = v {
                                (k, Some(v.into()))
                            } else {
                                (k, None)
                            }
                        })
                        .collect(),
                ),
                None => None,
            },
            properties: match self.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.unwrap_or_default().into())))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl From<SourceSpec> for SourceSpecDto {
    fn from(spec: SourceSpec) -> Self {
        SourceSpecDto {
            kind: spec.kind,
            services: match spec.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.unwrap().into())))
                        .collect(),
                ),
                None => None,
            },
            properties: match spec.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.unwrap().into())))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl Into<StorageSpec> for StorageSpecDto {
    fn into(self) -> StorageSpec {
        match self {
            StorageSpecDto::Memory { enable_archive } => StorageSpec::Memory { enable_archive },
            StorageSpecDto::Redis {
                connection_string,
                cache_size,
            } => StorageSpec::Redis {
                connection_string: connection_string.into(),
                cache_size,
            },
            StorageSpecDto::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            } => StorageSpec::RocksDb {
                enable_archive,
                storage_class: storage_class.into(),
                direct_io,
            },
        }
    }
}

impl From<StorageSpec> for StorageSpecDto {
    fn from(spec: StorageSpec) -> Self {
        match spec {
            StorageSpec::Memory { enable_archive } => StorageSpecDto::Memory { enable_archive },
            StorageSpec::Redis {
                connection_string,
                cache_size,
            } => StorageSpecDto::Redis {
                connection_string: connection_string.into(),
                cache_size,
            },
            StorageSpec::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            } => StorageSpecDto::RocksDb {
                enable_archive,
                storage_class: storage_class.into(),
                direct_io,
            },
        }
    }
}

impl Into<QueryContainerSpec> for QueryContainerSpecDto {
    fn into(self) -> QueryContainerSpec {
        QueryContainerSpec {
            query_host_count: self.query_host_count,
            storage: self
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            results: self
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: self.default_store,
        }
    }
}

impl From<QueryContainerSpec> for QueryContainerSpecDto {
    fn from(spec: QueryContainerSpec) -> Self {
        QueryContainerSpecDto {
            query_host_count: spec.query_host_count,
            storage: spec
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            results: spec
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: spec.default_store,
        }
    }
}

impl Into<ReactionSpec> for ReactionSpecDto {
    fn into(self) -> ReactionSpec {
        ReactionSpec {
            kind: self.kind,
            tag: match self.tag {
                Some(tag) => Some(tag),
                None => None,
            },
            services: match self.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| {
                            if let Some(v) = v {
                                (k, Some(v.into()))
                            } else {
                                (k, None)
                            }
                        })
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
            queries: self
                .queries
                .into_iter()
                .map(|(k, v)| (k, v.unwrap_or_default()))
                .collect(),
        }
    }
}

impl From<ReactionSpec> for ReactionSpecDto {
    fn from(spec: ReactionSpec) -> Self {
        ReactionSpecDto {
            kind: spec.kind,
            tag: match spec.tag {
                Some(tag) => Some(tag),
                None => None,
            },
            services: match spec.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| {
                            if let Some(v) = v {
                                (k, Some(v.into()))
                            } else {
                                (k, None)
                            }
                        })
                        .collect(),
                ),
                None => None,
            },
            properties: match spec.properties {
                Some(properties) => {
                    Some(properties.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            queries: spec
                .queries
                .into_iter()
                .map(|(k, v)| (k, Some(v)))
                .collect(),
        }
    }
}

impl Into<SourceProviderSpec> for SourceProviderSpecDto {
    fn into(self) -> SourceProviderSpec {
        SourceProviderSpec {
            services: self
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match self.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl Into<ReactionProviderSpec> for ReactionProviderSpecDto {
    fn into(self) -> ReactionProviderSpec {
        ReactionProviderSpec {
            services: self
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match self.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl From<ReactionProviderSpec> for ReactionProviderSpecDto {
    fn from(spec: ReactionProviderSpec) -> Self {
        ReactionProviderSpecDto {
            services: spec
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match spec.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl From<SourceProviderSpec> for SourceProviderSpecDto {
    fn from(spec: SourceProviderSpec) -> Self {
        SourceProviderSpecDto {
            services: spec
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match spec.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl Into<QuerySpec> for QuerySpecDto {
    fn into(self) -> QuerySpec {
        QuerySpec {
            container: self.container,
            mode: self.mode,
            query: self.query,
            sources: self.sources.into(),
            storage_profile: self.storage_profile,
            view: self.view.unwrap_or_default().into(),
            partition_count: self.partition_count,
        }
    }
}

impl From<QuerySpec> for QuerySpecDto {
    fn from(spec: QuerySpec) -> Self {
        QuerySpecDto {
            container: spec.container,
            mode: spec.mode,
            query: spec.query,
            sources: spec.sources.into(),
            storage_profile: spec.storage_profile,
            view: Some(spec.view.into()),
            partition_count: spec.partition_count,
        }
    }
}

impl Into<QuerySources> for QuerySourcesDto {
    fn into(self) -> QuerySources {
        QuerySources {
            subscriptions: self.subscriptions.into_iter().map(|v| v.into()).collect(),
            joins: match self.joins {
                Some(joins) => joins.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
            middleware: match self.middleware {
                Some(middleware) => middleware.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
        }
    }
}

impl From<QuerySources> for QuerySourcesDto {
    fn from(sources: QuerySources) -> Self {
        QuerySourcesDto {
            subscriptions: sources
                .subscriptions
                .into_iter()
                .map(|v| v.into())
                .collect(),
            joins: Some(sources.joins.into_iter().map(|v| v.into()).collect()),
            middleware: Some(sources.middleware.into_iter().map(|v| v.into()).collect()),
        }
    }
}

impl Into<QuerySubscription> for QuerySubscriptionDto {
    fn into(self) -> QuerySubscription {
        QuerySubscription {
            id: self.id,
            nodes: match self.nodes {
                Some(nodes) => nodes.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
            relations: match self.relations {
                Some(relations) => relations.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
            pipeline: match self.pipeline {
                Some(pipeline) => pipeline,
                None => Vec::new(),
            },
        }
    }
}

impl From<QuerySubscription> for QuerySubscriptionDto {
    fn from(subscription: QuerySubscription) -> Self {
        QuerySubscriptionDto {
            id: subscription.id,
            nodes: Some(subscription.nodes.into_iter().map(|v| v.into()).collect()),
            relations: Some(
                subscription
                    .relations
                    .into_iter()
                    .map(|v| v.into())
                    .collect(),
            ),
            pipeline: Some(subscription.pipeline),
        }
    }
}

impl Into<SourceMiddlewareConfig> for SourceMiddlewareConfigDto {
    fn into(self) -> SourceMiddlewareConfig {
        SourceMiddlewareConfig {
            kind: self.kind,
            name: self.name,
            config: self.config,
        }
    }
}

impl From<SourceMiddlewareConfig> for SourceMiddlewareConfigDto {
    fn from(config: SourceMiddlewareConfig) -> Self {
        SourceMiddlewareConfigDto {
            kind: config.kind,
            name: config.name,
            config: config.config,
        }
    }
}

impl Into<QuerySourceLabel> for QuerySourceLabelDto {
    fn into(self) -> QuerySourceLabel {
        QuerySourceLabel {
            source_label: self.source_label,
            partition_key: self.partition_key,
        }
    }
}

impl From<QuerySourceLabel> for QuerySourceLabelDto {
    fn from(label: QuerySourceLabel) -> Self {
        QuerySourceLabelDto {
            source_label: label.source_label,
            partition_key: label.partition_key,
        }
    }
}

impl Into<QueryJoin> for QueryJoinDto {
    fn into(self) -> QueryJoin {
        QueryJoin {
            id: self.id,
            keys: self.keys.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl From<QueryJoin> for QueryJoinDto {
    fn from(join: QueryJoin) -> Self {
        QueryJoinDto {
            id: join.id,
            keys: join.keys.into_iter().map(|v| v.into()).collect(),
        }
    }
}

impl Into<QueryJoinKey> for QueryJoinKeyDto {
    fn into(self) -> QueryJoinKey {
        QueryJoinKey {
            label: self.label,
            property: self.property,
        }
    }
}

impl From<QueryJoinKey> for QueryJoinKeyDto {
    fn from(key: QueryJoinKey) -> Self {
        QueryJoinKeyDto {
            label: key.label,
            property: key.property,
        }
    }
}

impl Into<RetentionPolicy> for RetentionPolicyDto {
    fn into(self) -> RetentionPolicy {
        match self {
            RetentionPolicyDto::Latest => RetentionPolicy::Latest,
            RetentionPolicyDto::Expire { after_seconds } => {
                RetentionPolicy::Expire { after_seconds }
            }
            RetentionPolicyDto::All => RetentionPolicy::All,
        }
    }
}

impl Into<ViewSpec> for ViewSpecDto {
    fn into(self) -> ViewSpec {
        ViewSpec {
            enabled: self.enabled,
            retention_policy: self.retention_policy.into(),
        }
    }
}

impl From<RetentionPolicy> for RetentionPolicyDto {
    fn from(policy: RetentionPolicy) -> Self {
        match policy {
            RetentionPolicy::Latest => RetentionPolicyDto::Latest,
            RetentionPolicy::Expire { after_seconds } => {
                RetentionPolicyDto::Expire { after_seconds }
            }
            RetentionPolicy::All => RetentionPolicyDto::All,
        }
    }
}

impl From<ViewSpec> for ViewSpecDto {
    fn from(spec: ViewSpec) -> Self {
        ViewSpecDto {
            enabled: spec.enabled,
            retention_policy: spec.retention_policy.into(),
        }
    }
}
