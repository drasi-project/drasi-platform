use std::{
    collections::HashSet,
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
    pub partition_key: Option<String>,
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
    pub partition: Option<QueryPartitionSpec>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryPartitionSpec {
    pub id: u64,
    pub count: u64,
    pub result_stream: String,
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
    pub partition: Option<u64>,
    pub host_name: String,
    pub status: String,
    pub container: String,
    pub error_message: String,
}

/// Represents an incoming change event from the source
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ChangeEvent {
    pub id: String,
    pub source_id: String,
    pub time: ChangeEventTime,

    pub queries: Vec<String>,

    #[serde(rename = "type")]
    pub op: ChangeType,

    pub element_type: Option<ElementType>,

    pub before: Option<ChangePayload>,
    pub after: Option<ChangePayload>,

    pub future_due_time: Option<u64>,
    pub future_signature: Option<u64>,

    pub metadata: Option<Map<String, Value>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChangeEventTime {
    seq: u64,
    ms: u64,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ChangePayload {
    pub id: Option<String>,
    pub labels: Option<HashSet<String>>,
    pub properties: Option<Map<String, Value>>,
    pub start_id: Option<String>,
    pub end_id: Option<String>,
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
pub enum ChangeType {
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
pub enum ElementType {
    #[serde(rename = "node")]
    Node,
    #[serde(rename = "rel")]
    Relation,
}

impl ChangeEvent {
    pub fn get_timestamp(&self) -> u64 {
        self.time.ms
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
                ms: future_ref.original_time,
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
                        self.time.ms,
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
                        self.time.ms,
                    )?,
            },
            ChangeType::Delete => SourceChange::Delete {
                metadata: ElementMetadata {
                    effective_from: self.time.ms,
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
                    original_time: self.time.ms,
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
    partition: u64,
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
    partition: u64,
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
        partition: u64,
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
                        before: match before {
                            Some(before) => Some(variables_to_json(before)),
                            None => None,
                        },
                        after: Some(variables_to_json(after)),
                        grouping_keys: Some(grouping_keys),
                    });
                }
                QueryPartEvaluationContext::Noop => {}
            }
        }

        ResultEvent::Change(ResultChangeEvent {
            query_id: query_id.to_string(),
            partition,
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
        partition: u64,
        sequence: u64,
        source_time_ms: u64,
        control_signal: ControlSignal,
    ) -> Self {
        ResultEvent::Control(ResultControlEvent {
            query_id: query_id.to_string(),
            partition,
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
    use crate::{api, models};
    use std::sync::Arc;

    impl Into<models::QuerySourceElement> for api::QuerySourceLabel {
        fn into(self) -> models::QuerySourceElement {
            models::QuerySourceElement {
                source_label: self.source_label,
                partition_key: self.partition_key,
            }
        }
    }

    impl Into<models::QuerySubscription> for api::QuerySubscription {
        fn into(self) -> models::QuerySubscription {
            models::QuerySubscription {
                nodes: self.nodes.into_iter().map(|v| v.into()).collect(),
                relations: self.relations.into_iter().map(|v| v.into()).collect(),
                pipeline: self.pipeline.into_iter().map(Arc::from).collect(),
            }
        }
    }

    impl Into<drasi_core::models::QueryJoinKey> for api::QueryJoinKey {
        fn into(self) -> drasi_core::models::QueryJoinKey {
            drasi_core::models::QueryJoinKey {
                label: self.label,
                property: self.property,
            }
        }
    }

    impl Into<drasi_core::models::QueryJoin> for api::QueryJoin {
        fn into(self) -> drasi_core::models::QueryJoin {
            drasi_core::models::QueryJoin {
                id: self.id,
                keys: self.keys.into_iter().map(|v| v.into()).collect(),
            }
        }
    }

    impl Into<models::QuerySources> for api::QuerySources {
        fn into(self) -> models::QuerySources {
            models::QuerySources {
                subscriptions: self
                    .subscriptions
                    .into_iter()
                    .map(|v| (v.id.clone(), v.into()))
                    .collect(),
                joins: self.joins.into_iter().map(|v| v.into()).collect(),
                middleware: self.middleware.into_iter().map(|v| v.into()).collect(),
            }
        }
    }

    impl Into<models::QueryConfig> for api::QuerySpec {
        fn into(self) -> models::QueryConfig {
            models::QueryConfig {
                mode: self.mode.into(),
                query: self.query,
                sources: self.sources.into(),
                storage_profile: self.storage_profile,
            }
        }
    }

    impl Into<drasi_core::models::SourceMiddlewareConfig> for api::SourceMiddlewareConfig {
        fn into(self) -> drasi_core::models::SourceMiddlewareConfig {
            drasi_core::models::SourceMiddlewareConfig {
                kind: Arc::from(self.kind),
                name: Arc::from(self.name),
                config: self.config,
            }
        }
    }
}
