use change_dispatcher_config::ChangeDispatcherConfig;
use drasi_comms_abstractions::comms::Payload;
use log::info;
use serde_json::Value;

use serde_json::json;
use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

use drasi_comms_abstractions::comms::{Headers, Invoker};
use drasi_comms_dapr::comms::DaprHttpInvoker;

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
    info!("Starting Source Change Dispatcher");

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
    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(listener) => listener,
        Err(_e) => {
            return Err(Box::<dyn std::error::Error>::from(
                "Error binding to the address",
            ));
        }
    };
    match axum::serve(listener, app).await {
        Ok(_) => {
            log::info!("Server started at: {}", &addr);
        }
        Err(e) => {
            log::error!("Error starting the server: {:?}", e);
        }
    };
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
        Some(tp) => match tp.to_str() {
            Ok(tp) => tp.to_string(),
            Err(_) => "".to_string(),
        },
        None => "".to_string(),
    };

    let config = state.config.clone();
    let invoker = &state.invoker;
    let json_data = body["data"].clone();
    match process_changes(invoker, json_data, config, traceparent).await {
        Ok(_) => StatusCode::OK.into_response(),
        Err(e) => {
            log::error!("Error processing changes: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error processing changes: {:?}", e),
            )
                .into_response()
        }
    }
}

async fn process_changes(
    invoker: &DaprHttpInvoker,
    changes: Value,
    _config: ChangeDispatcherConfig,
    traceparent: String,
) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(changes) = changes.as_array() {
        for change_event in changes {
            info!(
                "Processing change - id:{}, subscription:{}",
                change_event["id"],
                match serde_json::to_string(&change_event["subscriptions"]) {
                    Ok(subs) => subs,
                    Err(_) =>
                        return Err(Box::<dyn std::error::Error>::from(
                            "Error serializing subscriptions into a string"
                        )),
                }
            );

            let mut dispatch_event = change_event.clone();
            dispatch_event["metadata"]["tracking"]["source"]["changeDispatcherStart_ms"] =
                match serde_json::to_value(chrono::Utc::now().timestamp_millis()) {
                    Ok(val) => val,
                    Err(_) => {
                        return Err(Box::<dyn std::error::Error>::from(
                            "Error serializing timestamp into json value",
                        ));
                    }
                };
            dispatch_event["metadata"]["tracking"]["source"]["changeDispatcherEnd_ms"] =
                match serde_json::to_value(0) {
                    Ok(val) => val,
                    Err(_) => {
                        unreachable!();
                    }
                };

            let subscriptions = match change_event["subscriptions"].as_array() {
                Some(subs) => subs.clone(),
                None => {
                    return Err(Box::<dyn std::error::Error>::from(
                        "Error getting subscriptions from change event",
                    ));
                }
            };

            let query_nodes: HashSet<&str> = subscriptions
                .iter()
                .map(|x| x["queryNodeId"].as_str().unwrap_or_default())
                .collect();

            for query_node_id in query_nodes {
                let app_id = format!("{}-publish-api", query_node_id);

                dispatch_event["metadata"]["tracking"]["source"]["changeDispatcherEnd_ms"] =
                    match serde_json::to_value(chrono::Utc::now().timestamp_millis()) {
                        Ok(val) => val,
                        Err(_) => {
                            return Err(Box::<dyn std::error::Error>::from(
                                "Error serializing timestamp into json value",
                            ));
                        }
                    };
                let queries: Vec<_> = subscriptions
                    .iter()
                    .filter(|x| x["queryNodeId"] == query_node_id)
                    .map(|x| x["queryId"].clone())
                    .collect();
                dispatch_event["queries"] = match serde_json::to_value(queries) {
                    Ok(val) => val,
                    Err(_) => {
                        return Err(Box::<dyn std::error::Error>::from(
                            "Error serializing queries into json value",
                        ));
                    }
                };

                let mut headers = HashMap::new();
                if !traceparent.is_empty() {
                    headers.insert("traceparent".to_string(), traceparent.clone());
                }
                let headers = Headers::new(headers);
                match invoker
                    .invoke(
                        Payload::Json(dispatch_event.clone()),
                        &app_id,
                        "change",
                        Some(headers),
                    )
                    .await
                {
                    Ok(_) => {}
                    Err(e) => {
                        return Err(Box::<dyn std::error::Error>::from(format!(
                            "Error invoking app: {}",
                            e
                        )));
                    }
                }
            }
        }
    }
    Ok(())
}
