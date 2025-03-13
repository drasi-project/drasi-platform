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

use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use drasi_core::{
    evaluation::context::{QueryPartEvaluationContext, QueryVariables},
    interface::FutureElementRef,
    models::{Element, ElementMetadata, ElementReference, SourceChange},
};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

#[derive(Serialize, Deserialize, Debug)]
pub struct QueryRequest {
    pub id: String,
    pub spec: QuerySpec,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourceLabel {
    pub source_label: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QuerySubscription {
    pub id: String,

    #[serde(default)]
    pub nodes: Vec<QuerySourceLabel>,

    #[serde(default)]
    pub relations: Vec<QuerySourceLabel>,

    #[serde(default)]
    pub pipeline: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinKey {
    pub label: String,
    pub property: String,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoin {
    pub id: String,
    pub keys: Vec<QueryJoinKey>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SourceMiddlewareConfig {
    pub kind: String,
    pub name: String,

    #[serde(flatten)]
    pub config: Map<String, Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QuerySpec {
    pub mode: String,
    pub query: String,
    pub sources: QuerySources,
    pub storage_profile: Option<String>,
    pub view: ViewSpec,
    pub transient: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QuerySources {
    pub subscriptions: Vec<QuerySubscription>,
    pub joins: Vec<QueryJoin>,

    #[serde(default)]
    pub middleware: Vec<SourceMiddlewareConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ViewSpec {
    pub enabled: bool,
    pub retention_policy: RetentionPolicy,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
#[serde(rename_all = "camelCase")]
pub enum RetentionPolicy {
    #[serde(rename = "latest")]
    Latest,

    #[serde(rename = "expire")]
    Expire {
        #[serde(rename = "afterSeconds")]
        after_seconds: u64,
    },

    #[serde(rename = "all")]
    All,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VoidRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct VoidResponse {}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryStatus {
    pub host_name: String,
    pub status: String,
    pub container: String,
    pub error_message: String,
}

/// Represents an incoming change event from the source
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ChangeEvent {
    id: String,
    source_id: String,
    time: ChangeEventTime,

    queries: Vec<String>,

    #[serde(rename = "type")]
    op: ChangeType,

    element_type: Option<ElementType>,

    before: Option<ChangePayload>,
    after: Option<ChangePayload>,

    future_due_time: Option<u64>,
    future_signature: Option<u64>,

    metadata: Option<Map<String, Value>>,
}

#[derive(Serialize, Deserialize, Debug)]
struct ChangeEventTime {
    seq: u64,
    ns: u64,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct ChangePayload {
    id: Option<String>,
    labels: Option<Vec<String>>,
    properties: Option<Map<String, Value>>,
    start_id: Option<String>,
    end_id: Option<String>,
}

impl ChangePayload {
    fn into_element_reference(self, source_id: &str) -> Result<ElementReference, ApiError> {
        let id = self
            .id
            .ok_or(ApiError::BadRequest("Missing id".to_string()))?;
        Ok(ElementReference::new(source_id, &id))
    }

    fn into_element(
        self,
        source_id: &str,
        element_type: ElementType,
        timestamp: u64,
    ) -> Result<Element, ApiError> {
        let id = self
            .id
            .ok_or(ApiError::BadRequest("Missing id".to_string()))?;
        let labels = self.labels.unwrap_or_default();
        let properties = self.properties.unwrap_or_default();

        let metadata = ElementMetadata {
            reference: ElementReference::new(source_id, &id),
            labels: Arc::from(labels.into_iter().map(Arc::from).collect::<Vec<Arc<str>>>()),
            effective_from: timestamp,
        };

        match element_type {
            ElementType::Node => Ok(Element::Node {
                metadata,
                properties: (&properties).into(),
            }),
            ElementType::Relation => {
                let start_id = self
                    .start_id
                    .ok_or(ApiError::BadRequest("Missing start id".to_string()))?;
                let end_id = self
                    .end_id
                    .ok_or(ApiError::BadRequest("Missing end id".to_string()))?;
                Ok(Element::Relation {
                    metadata,
                    properties: (&properties).into(),
                    in_node: ElementReference::new(source_id, &start_id),
                    out_node: ElementReference::new(source_id, &end_id),
                })
            }
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
enum ChangeType {
    #[serde(rename = "i")]
    Insert,
    #[serde(rename = "u")]
    Update,
    #[serde(rename = "d")]
    Delete,
    #[serde(rename = "f")]
    Future,
}

#[derive(Serialize, Deserialize, Debug)]
enum ElementType {
    #[serde(rename = "node")]
    Node,
    #[serde(rename = "rel")]
    Relation,
}

impl ChangeEvent {
    pub fn get_timestamp(&self) -> u64 {
        self.time.ns
    }

    pub fn has_query(&self, query_id: &str) -> bool {
        self.queries.contains(&query_id.to_string())
    }

    pub fn get_metadata(&self) -> Map<String, Value> {
        match self.metadata {
            Some(ref metadata) => metadata.clone(),
            None => Map::new(),
        }
    }

    pub fn from_future_ref(future_ref: &FutureElementRef, query_id: &str) -> Self {
        ChangeEvent {
            id: future_ref.element_ref.element_id.to_string(),
            source_id: future_ref.element_ref.source_id.to_string(),
            time: ChangeEventTime {
                seq: 0,
                ns: future_ref.original_time,
            },
            queries: vec![query_id.to_string()],
            op: ChangeType::Future,
            future_due_time: Some(future_ref.due_time),
            future_signature: Some(future_ref.group_signature),
            element_type: None,
            before: None,
            after: None,
            metadata: None,
        }
    }
}

impl TryInto<SourceChange> for ChangeEvent {
    type Error = ApiError;

    fn try_into(self) -> Result<SourceChange, ApiError> {
        let change = match self.op {
            ChangeType::Insert => SourceChange::Insert {
                element: self
                    .after
                    .ok_or(ApiError::BadRequest("Missing after payload".to_string()))?
                    .into_element(
                        &self.source_id,
                        self.element_type
                            .ok_or(ApiError::BadRequest("missing element type".into()))?,
                        self.time.ns,
                    )?,
            },
            ChangeType::Update => SourceChange::Update {
                element: self
                    .after
                    .ok_or(ApiError::BadRequest("Missing after payload".to_string()))?
                    .into_element(
                        &self.source_id,
                        self.element_type
                            .ok_or(ApiError::BadRequest("missing element type".into()))?,
                        self.time.ns,
                    )?,
            },
            ChangeType::Delete => SourceChange::Delete {
                metadata: ElementMetadata {
                    effective_from: self.time.ns,
                    labels: Arc::from(match &self.before {
                        Some(before) => match &before.labels {
                            Some(labels) => labels.iter().map(|l| Arc::from(l.as_str())).collect(),
                            None => Vec::new(),
                        },
                        None => Vec::new(),
                    }),
                    reference: self
                        .before
                        .ok_or(ApiError::BadRequest("Missing before payload".to_string()))?
                        .into_element_reference(&self.source_id)?,
                },
            },
            ChangeType::Future => SourceChange::Future {
                future_ref: FutureElementRef {
                    element_ref: ElementReference::new(&self.source_id, &self.id),
                    original_time: self.time.ns,
                    due_time: self
                        .future_due_time
                        .ok_or(ApiError::BadRequest("Missing future due time".to_string()))?,
                    group_signature: self
                        .future_signature
                        .ok_or(ApiError::BadRequest("Missing future signature".to_string()))?,
                },
            },
        };

        Ok(change)
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(tag = "kind")]
pub enum ControlSignal {
    #[serde(rename = "bootstrapStarted")]
    BootstrapStarted,

    #[serde(rename = "bootstrapCompleted")]
    BootstrapCompleted,

    #[serde(rename = "running")]
    Running,

    #[serde(rename = "stopped")]
    Stopped,

    #[serde(rename = "deleted")]
    QueryDeleted,
}

/// Represents an outgoing result event

#[derive(Serialize, Debug)]
#[serde(tag = "kind")]
pub enum ResultEvent {
    #[serde(rename = "change")]
    Change(ResultChangeEvent),

    #[serde(rename = "control")]
    Control(ResultControlEvent),
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResultChangeEvent {
    query_id: String,
    sequence: u64,
    source_time_ms: u64,
    added_results: Vec<Map<String, Value>>,
    updated_results: Vec<UpdatePayload>,
    deleted_results: Vec<Map<String, Value>>,
    metadata: Option<Map<String, Value>>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResultControlEvent {
    query_id: String,
    sequence: u64,
    source_time_ms: u64,
    metadata: Option<Map<String, Value>>,
    control_signal: ControlSignal,
}

#[derive(Serialize, Debug)]
struct UpdatePayload {
    before: Option<Map<String, Value>>,
    after: Option<Map<String, Value>>,
    grouping_keys: Option<Vec<String>>,
}

impl ResultEvent {
    #[tracing::instrument(skip_all)]
    pub fn from_query_results(
        query_id: &str,
        data: Vec<QueryPartEvaluationContext>,
        sequence: u64,
        source_time_ms: u64,
        metadata: Option<Map<String, Value>>,
    ) -> Self {
        let mut added_results = Vec::new();
        let mut updated_results = Vec::new();
        let mut deleted_results = Vec::new();

        for ctx in data {
            match ctx {
                QueryPartEvaluationContext::Adding { after } => {
                    added_results.push(variables_to_json(after));
                }
                QueryPartEvaluationContext::Updating { before, after } => {
                    updated_results.push(UpdatePayload {
                        before: Some(variables_to_json(before)),
                        after: Some(variables_to_json(after)),
                        grouping_keys: None,
                    });
                }
                QueryPartEvaluationContext::Removing { before } => {
                    deleted_results.push(variables_to_json(before));
                }
                QueryPartEvaluationContext::Aggregation {
                    before,
                    after,
                    grouping_keys,
                    ..
                } => {
                    updated_results.push(UpdatePayload {
                        before: before.map(variables_to_json),
                        after: Some(variables_to_json(after)),
                        grouping_keys: Some(grouping_keys),
                    });
                }
                QueryPartEvaluationContext::Noop => {}
            }
        }

        ResultEvent::Change(ResultChangeEvent {
            query_id: query_id.to_string(),
            sequence,
            source_time_ms,
            added_results,
            updated_results,
            deleted_results,
            metadata,
        })
    }

    pub fn from_control_signal(
        query_id: &str,
        sequence: u64,
        source_time_ms: u64,
        control_signal: ControlSignal,
    ) -> Self {
        ResultEvent::Control(ResultControlEvent {
            query_id: query_id.to_string(),
            sequence,
            source_time_ms,
            metadata: None,
            control_signal,
        })
    }
}

fn variables_to_json(source: QueryVariables) -> Map<String, Value> {
    let mut map = Map::new();
    for (key, value) in source {
        map.insert(key.to_string(), value.into());
    }
    map
}

#[derive(Debug)]
pub enum ApiError {
    BadRequest(String),
}

impl Display for ApiError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::BadRequest(msg) => write!(f, "Bad request: {}", msg),
        }
    }
}

impl std::error::Error for ApiError {}

mod mappings {
    use std::sync::Arc;

    use crate::api;
    use drasi_core::models;

    impl From<api::QuerySourceLabel> for models::QuerySourceElement {
        fn from(val: api::QuerySourceLabel) -> Self {
            models::QuerySourceElement {
                source_label: val.source_label,
            }
        }
    }

    impl From<api::QuerySubscription> for models::QuerySubscription {
        fn from(val: api::QuerySubscription) -> Self {
            models::QuerySubscription {
                id: Arc::from(val.id),
                nodes: val.nodes.into_iter().map(|v| v.into()).collect(),
                relations: val.relations.into_iter().map(|v| v.into()).collect(),
                pipeline: val.pipeline.into_iter().map(Arc::from).collect(),
            }
        }
    }

    impl From<api::QueryJoinKey> for models::QueryJoinKey {
        fn from(val: api::QueryJoinKey) -> Self {
            models::QueryJoinKey {
                label: val.label,
                property: val.property,
            }
        }
    }

    impl From<api::QueryJoin> for models::QueryJoin {
        fn from(val: api::QueryJoin) -> Self {
            models::QueryJoin {
                id: val.id,
                keys: val.keys.into_iter().map(|v| v.into()).collect(),
            }
        }
    }

    impl From<api::QuerySources> for models::QuerySources {
        fn from(val: api::QuerySources) -> Self {
            models::QuerySources {
                subscriptions: val.subscriptions.into_iter().map(|v| v.into()).collect(),
                joins: val.joins.into_iter().map(|v| v.into()).collect(),
                middleware: val.middleware.into_iter().map(|v| v.into()).collect(),
            }
        }
    }

    impl From<api::QuerySpec> for models::QueryConfig {
        fn from(val: api::QuerySpec) -> Self {
            models::QueryConfig {
                mode: val.mode,
                query: val.query,
                sources: val.sources.into(),
                storage_profile: val.storage_profile,
            }
        }
    }

    impl From<api::SourceMiddlewareConfig> for models::SourceMiddlewareConfig {
        fn from(val: api::SourceMiddlewareConfig) -> Self {
            models::SourceMiddlewareConfig {
                kind: Arc::from(val.kind),
                name: Arc::from(val.name),
                config: val.config,
            }
        }
    }
}
