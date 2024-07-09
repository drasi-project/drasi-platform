use change_dispatcher_config::ChangeDispatcherConfig;
use log::info;
use serde_json::Value;

use serde_json::json;
use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

use comms_abstractions::comms::{Headers, Invoker};
use comms_dapr::comms::DaprHttpInvoker;

use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};

mod change_dispatcher_config;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Source Change Dispatcher");

    let config = ChangeDispatcherConfig::new();
    info!("Initializing SourceID: {} ...", config.source_id);

    let dapr_http_port = match config.dapr_http_port.parse::<u16>() {
        Ok(port) => port,
        Err(_) => {
            panic!("Invalid DAPR_HTTP_PORT: {}", config.dapr_http_port);
        }
    };

    let invoker = DaprHttpInvoker::new("127.0.0.1".to_string(), dapr_http_port);
    let shared_state = Arc::new(AppState {
        config: config.clone(),
        invoker,
    });

    let app = Router::new()
        .route("/dapr/subscribe", get(subscribe))
        .route("/receive", post(receive))
        .with_state(shared_state);

    let addr = format!("0.0.0.0:{}", config.app_port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
    Ok(())
}

struct AppState {
    config: ChangeDispatcherConfig,
    invoker: DaprHttpInvoker,
}

#[axum::debug_handler]
async fn subscribe() -> impl IntoResponse {
    let config = ChangeDispatcherConfig::new();
    let subscriptions = vec![json! {
        {
            "pubsubname": config.pubsub_name.clone(),
            "topic": format!("{}-dispatch", config.source_id),
            "route": "receive"
        }
    }];

    Json(subscriptions)
}

async fn receive(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<Value>,
) -> impl IntoResponse {
    let traceparent = match headers.get("traceparent") {
        Some(tp) => tp.to_str().unwrap().to_string(),
        None => {
            return StatusCode::BAD_REQUEST;
        }
    };

    let config = state.config.clone();
    let invoker = &state.invoker;
    let json_data = body["data"].clone();
    process_changes(&invoker, json_data, config, traceparent).await;

    StatusCode::OK
}

async fn process_changes(
    invoker: &DaprHttpInvoker,
    changes: Value,
    config: ChangeDispatcherConfig,
    traceparent: String,
) {
    if let Some(changes) = changes.as_array() {
        for change_event in changes {
            info!(
                "Processing change - id:{}, subscription:{}",
                change_event["id"],
                serde_json::to_string(&change_event["subscriptions"]).unwrap()
            );

            let mut dispatch_event = change_event.clone();
            dispatch_event["metadata"]["tracking"]["source"]["changeDispatcherStart_ms"] =
                serde_json::to_value(chrono::Utc::now().timestamp_millis()).unwrap();
            dispatch_event["metadata"]["tracking"]["source"]["changeDispatcherEnd_ms"] =
                serde_json::to_value(0).unwrap();

            let subscriptions = change_event["subscriptions"].as_array().unwrap().clone();

            let query_nodes: HashSet<&str> = subscriptions
                .iter()
                .map(|x| x["queryNodeId"].as_str().unwrap_or_default())
                .collect();

            for query_node_id in query_nodes {
                let app_id = format!("{}-publish-api", query_node_id);

                dispatch_event["metadata"]["tracking"]["source"]["changeDispatcherEnd_ms"] =
                    serde_json::to_value(chrono::Utc::now().timestamp_millis()).unwrap();
                let queries: Vec<_> = subscriptions
                    .iter()
                    .filter(|x| x["queryNodeId"] == query_node_id)
                    .map(|x| x["queryId"].clone())
                    .collect();
                dispatch_event["queries"] = serde_json::to_value(queries).unwrap();

                let mut headers = HashMap::new();
                headers.insert("traceparent".to_string(), traceparent.clone());
                let headers = Headers::new(headers);
                invoker
                    .invoke(
                        dispatch_event.clone(),
                        app_id,
                        "change".to_string(),
                        headers,
                    )
                    .await
                    .unwrap();
            }
        }
    }
}
