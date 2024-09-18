use std::{
    collections::HashMap,
    fmt::{Display, Formatter},
    net::SocketAddr,
    sync::Arc,
};

use axum::{
    extract::{Path, Query, State},
    response::IntoResponse,
    routing::get,
    Router,
};
use axum_streams::StreamBodyAs;

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

use crate::{models::ViewError, view_store::ViewStore};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ViewSpec {
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

#[derive(Deserialize, Debug, Clone)]
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

impl Display for ControlSignal {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ControlSignal::BootstrapStarted => write!(f, "bootstrapping"),
            ControlSignal::BootstrapCompleted => write!(f, "bootstrap complete"),
            ControlSignal::Running => write!(f, "running"),
            ControlSignal::Stopped => write!(f, "stopped"),
            ControlSignal::QueryDeleted => write!(f, "deleted"),
        }
    }
}

#[derive(Deserialize, Debug)]
#[serde(tag = "kind")]
pub enum ResultEvent {
    #[serde(rename = "change")]
    Change(ResultChangeEvent),

    #[serde(rename = "control")]
    Control(ResultControlEvent),
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResultChangeEvent {
    pub query_id: String,
    pub sequence: u64,
    pub source_time_ms: u64,
    pub added_results: Vec<Map<String, Value>>,
    pub updated_results: Vec<UpdatePayload>,
    pub deleted_results: Vec<Map<String, Value>>,
    pub metadata: Option<Map<String, Value>>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResultControlEvent {
    pub query_id: String,
    pub sequence: u64,
    pub source_time_ms: u64,
    pub metadata: Option<Map<String, Value>>,
    pub control_signal: ControlSignal,
}

#[derive(Deserialize, Debug)]
pub struct UpdatePayload {
    pub before: Option<Map<String, Value>>,
    pub after: Option<Map<String, Value>>,
    pub grouping_keys: Option<Vec<String>>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub enum ViewElement {
    Header {
        sequence: u64,
        timestamp: u64,
        state: Option<String>,
    },
    Data(Map<String, Value>),
}

pub async fn start_view_service(view_store: Arc<dyn ViewStore>, port: u16) {
    let app = Router::new()
        .route("/:query_id", get(view_stream))
        .with_state(view_store.clone());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn view_stream(
    State(store): State<Arc<dyn ViewStore>>,
    Path(query_id): Path<String>,
    Query(params): Query<HashMap<String, String>>,
) -> impl IntoResponse {
    let timestamp = match params.get("timestamp") {
        Some(ts) => match ts.parse::<u64>() {
            Ok(ts) => Some(ts),
            Err(_) => None,
        },
        None => None,
    };

    match store.get_view(&query_id, timestamp).await {
        Ok(stream) => StreamBodyAs::json_array(stream).into_response(),
        Err(e) => match e {
            ViewError::NotFound => {
                let body = format!("View `{}` not found", query_id);
                (axum::http::StatusCode::NOT_FOUND, body).into_response()
            }
            _ => {
                let body = format!("Error: {}", e);
                (axum::http::StatusCode::INTERNAL_SERVER_ERROR, body).into_response()
            }
        },
    }
}
