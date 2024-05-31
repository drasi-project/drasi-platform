use std::fmt::Debug;

use serde::Serialize;
use serde_json::Value;



#[derive(Debug, Serialize, Clone)]
pub struct ChangeElement {
    pub id: String,
    pub labels: Vec<String>,
    pub properties: serde_json::Map<String, Value>,
    
    #[serde(rename = "startId")]
    pub start_id: Option<String>,

    #[serde(rename = "endId")]
    pub end_id: Option<String>,   
}

#[derive(Debug, Serialize)]
pub struct BootstrapElement {
    pub id: String,
    pub label: String,
    pub properties: serde_json::Map<String, Value>,    
    #[serde(rename = "startId")]
    pub start_id: Option<String>,

    #[serde(rename = "endId")]
    pub end_id: Option<String>,   
}


#[derive(Debug, Serialize)]
pub struct ChangeSource {
    pub db: String,
    pub table: String,
    pub ts_ms: u64,
    pub ts_sec: u64,
    pub lsn: u64,
}

#[derive(Debug, Serialize)]
pub struct ChangePayload<TElement: Serialize + Debug> {
    pub after: Option<TElement>,
    pub before: Option<TElement>,
    pub source: ChangeSource,
}

#[derive(Debug, Serialize)]
pub struct ChangeMessage<TElement: Serialize + Debug> {
    pub op: String,
    pub payload: ChangePayload<TElement>,
    pub ts_ms: u64,
}

#[derive(Debug, Serialize)]
pub struct BootstrapData {
    pub nodes: Vec<BootstrapElement>,
    pub rels: Vec<BootstrapElement>,
}