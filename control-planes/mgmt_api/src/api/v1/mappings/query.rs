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

use crate::domain::models::{
    QueryJoin, QueryJoinKey, QueryLanguage, QuerySourceLabel, QuerySources, QuerySpec, QueryStatus,
    QuerySubscription, RetentionPolicy, SourceMiddlewareConfig, ViewSpec,
};

use super::{
    QueryJoinDto, QueryJoinKeyDto, QueryLanguageDto, QuerySourceLabelDto, QuerySourcesDto, QuerySpecDto,
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

impl From<QuerySpecDto> for QuerySpec {
    fn from(spec: QuerySpecDto) -> Self {
        QuerySpec {
            container: spec.container,
            mode: spec.mode,
            query: spec.query,
            query_language: spec.query_language.map(|lang| lang.into()),
            sources: spec.sources.into(),
            storage_profile: spec.storage_profile,
            view: spec.view.unwrap_or_default().into(),
            transient: None,
        }
    }
}

impl From<QuerySpec> for QuerySpecDto {
    fn from(spec: QuerySpec) -> Self {
        QuerySpecDto {
            container: spec.container,
            mode: spec.mode,
            query: spec.query,
            query_language: spec.query_language.map(|lang| lang.into()),
            sources: spec.sources.into(),
            storage_profile: spec.storage_profile,
            view: Some(spec.view.into()),
        }
    }
}

impl From<QuerySourcesDto> for QuerySources {
    fn from(sources: QuerySourcesDto) -> Self {
        QuerySources {
            subscriptions: sources
                .subscriptions
                .into_iter()
                .map(|v| v.into())
                .collect(),
            joins: match sources.joins {
                Some(joins) => joins.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
            middleware: match sources.middleware {
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

impl From<QuerySubscriptionDto> for QuerySubscription {
    fn from(subscription: QuerySubscriptionDto) -> Self {
        QuerySubscription {
            id: subscription.id,
            nodes: match subscription.nodes {
                Some(nodes) => nodes.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
            relations: match subscription.relations {
                Some(relations) => relations.into_iter().map(|v| v.into()).collect(),
                None => Vec::new(),
            },
            pipeline: subscription.pipeline.unwrap_or_default(),
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

impl From<SourceMiddlewareConfigDto> for SourceMiddlewareConfig {
    fn from(config: SourceMiddlewareConfigDto) -> Self {
        SourceMiddlewareConfig {
            kind: config.kind,
            name: config.name,
            config: config.config,
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
impl From<QuerySourceLabelDto> for QuerySourceLabel {
    fn from(label: QuerySourceLabelDto) -> Self {
        QuerySourceLabel {
            source_label: label.source_label,
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

impl From<QueryJoinDto> for QueryJoin {
    fn from(join: QueryJoinDto) -> Self {
        QueryJoin {
            id: join.id,
            keys: join.keys.into_iter().map(|v| v.into()).collect(),
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

impl From<QueryJoinKeyDto> for QueryJoinKey {
    fn from(key: QueryJoinKeyDto) -> Self {
        QueryJoinKey {
            label: key.label,
            property: key.property,
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

impl From<RetentionPolicyDto> for RetentionPolicy {
    fn from(policy: RetentionPolicyDto) -> Self {
        match policy {
            RetentionPolicyDto::Latest => RetentionPolicy::Latest,
            RetentionPolicyDto::Expire { after_seconds } => {
                RetentionPolicy::Expire { after_seconds }
            }
            RetentionPolicyDto::All => RetentionPolicy::All,
        }
    }
}

impl From<ViewSpecDto> for ViewSpec {
    fn from(spec: ViewSpecDto) -> Self {
        ViewSpec {
            enabled: spec.enabled,
            retention_policy: spec.retention_policy.into(),
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

impl From<QueryLanguageDto> for QueryLanguage {
    fn from(lang: QueryLanguageDto) -> Self {
        match lang {
            QueryLanguageDto::Cypher => QueryLanguage::Cypher,
            QueryLanguageDto::GQL => QueryLanguage::GQL,
        }
    }
}

impl From<QueryLanguage> for QueryLanguageDto {
    fn from(lang: QueryLanguage) -> Self {
        match lang {
            QueryLanguage::Cypher => QueryLanguageDto::Cypher,
            QueryLanguage::GQL => QueryLanguageDto::GQL,
        }
    }
}
