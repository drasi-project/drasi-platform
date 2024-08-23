use crate::domain::models::{
    QueryJoin, QueryJoinKey, QuerySourceLabel, QuerySources, QuerySpec, QueryStatus,
    QuerySubscription, RetentionPolicy, SourceMiddlewareConfig, ViewSpec,
};

use super::{
    QueryJoinDto, QueryJoinKeyDto, QuerySourceLabelDto, QuerySourcesDto, QuerySpecDto,
    QueryStatusDto, QuerySubscriptionDto, RetentionPolicyDto, SourceMiddlewareConfigDto,
    ViewSpecDto,
};

impl From<QueryStatus> for QueryStatusDto {
    fn from(status: QueryStatus) -> Self {
        QueryStatusDto {
            host_name: status.host_name,
            status: status.status,
            container: status.container,
            error_message: status.error_message,
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
        }
    }
}

impl From<QuerySourceLabel> for QuerySourceLabelDto {
    fn from(label: QuerySourceLabel) -> Self {
        QuerySourceLabelDto {
            source_label: label.source_label,
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
