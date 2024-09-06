use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct SubscriptionInput {
    #[serde(rename = "queryId")]
    pub query_id: String,
    #[serde(rename = "queryNodeId")]
    pub query_node_id: String,
    #[serde(rename = "nodeLabels")]
    pub node_labels: Vec<String>,
    #[serde(rename = "relLabels")]
    pub rel_labels: Vec<String>,
}

// Define the control event structure for publishing
#[derive(Serialize)]
pub struct ControlEvent {
    pub op: String,
    pub ts_ms: u64,
    pub payload: Payload,
}

#[derive(Serialize)]
pub struct Payload {
    pub source: Source,
    pub before: Option<()>,
    pub after: AfterData,
}

#[derive(Serialize)]
pub struct Source {
    pub db: String,
    pub table: String,
}

#[derive(Serialize)]
pub struct AfterData {
    #[serde(rename = "queryId")]
    pub query_id: String,
    #[serde(rename = "queryNodeId")]
    pub query_node_id: String,
    #[serde(rename = "nodeLabels")]
    pub node_labels: Vec<String>,
    #[serde(rename = "relLabels")]
    pub rel_labels: Vec<String>,
}
