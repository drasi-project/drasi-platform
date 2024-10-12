use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    response::Json,
    routing::post,
    Router,
};
use chrono::Utc;
use control_event::{ControlEvent, Payload, Source, SubscriptionData, SubscriptionInput};
use log::debug;
use query_api_config::QueryApiConfig;
use serde_json::{json, Value};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

use drasi_comms_abstractions::comms::{Headers, Invoker, Publisher};
use drasi_comms_dapr::comms::{DaprHttpInvoker, DaprHttpPublisher};

mod control_event;
mod query_api_config;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = match QueryApiConfig::new() {
        Ok(config) => config,
        Err(e) => {
            panic!("Error parsing the configuration: {:?}", e);
        }
    };
    log::info!(
        "Starting the query API server for the source: {}",
        &config.source_id
    );

    let dapr_port: u16 = match config.dapr_port.parse() {
        Ok(port) => port,
        Err(_) => {
            panic!("Error parsing the Dapr port");
        }
    };

    let pubsub_topic = format!("{}-change", config.source_id.clone()).to_string();
    let publisher = DaprHttpPublisher::new(
        "127.0.0.1".to_string(),
        dapr_port,
        config.pubsub_name.clone(),
        pubsub_topic,
    );

    let invoker = DaprHttpInvoker::new("127.0.0.1".to_string(), dapr_port);

    let shared_state = Arc::new(AppState {
        config: config.clone(),
        publisher,
        invoker,
    });

    let app = Router::new()
        .route("/subscription", post(handle_subscription))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .with_state(shared_state);

    let addr = format!("0.0.0.0:{}", &config.app_port);
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

async fn handle_subscription(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(input): Json<Value>,
) -> impl IntoResponse {
    let subscription_input: SubscriptionInput = match serde_json::from_value(input) {
        Ok(subscription_input) => subscription_input,
        Err(e) => {
            log::error!("Error parsing the subscription input: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error parsing the subscription input: {:?}", e),
            )
                .into_response();
        }
    };
    log::info!(
        "Creating new subscription for query_id: {}",
        subscription_input.query_id
    );

    let mut headers_map = std::collections::HashMap::new();
    match headers.get("traceparent") {
        Some(tp) => match tp.to_str() {
            Ok(tp) => {
                headers_map.insert("traceparent".to_string(), tp.to_string());
            }
            Err(_e) => {} //
        },
        None => {
            log::warn!("No traceparent header found in the request");
        }
    };
    let control_event = ControlEvent {
        op: "i".to_string(),
        ts_ms: Utc::now().timestamp_millis() as u64,
        payload: Payload {
            source: Source {
                db: "Drasi".to_string(),
                table: "SourceSubscription".to_string(),
            },
            before: None,
            after: SubscriptionData {
                query_id: subscription_input.query_id.clone(),
                query_node_id: subscription_input.query_node_id.clone(),
                node_labels: subscription_input.node_labels.clone(),
                rel_labels: subscription_input.rel_labels.clone(),
            },
        },
    };
    let publisher = &state.publisher;
    let control_event_json = json!([control_event]);
    let headers = Headers::new(headers_map);
    match publisher.publish(control_event_json, headers.clone()).await {
        Ok(_) => {
            debug!("Published the subscription event");
        }
        Err(e) => {
            log::error!("Error publishing the subscription event: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error publishing the subscription event: {:?}", e),
            )
                .into_response();
        }
    }

    // Query DB and send initial results to query node
    let input_node_labels = match serde_json::to_string(&subscription_input.node_labels) {
        Ok(labels) => labels,
        Err(e) => {
            log::error!("Error serializing the node labels: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error serializing the node labels: {:?}", e),
            )
                .into_response();
        }
    };
    let input_rel_labels = match serde_json::to_string(&subscription_input.rel_labels) {
        Ok(labels) => labels,
        Err(e) => {
            log::error!("Error serializing the relationship labels: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error serializing the relationship labels: {:?}", e),
            )
                .into_response();
        }
    };

    log::info!(
        "queryApi.main/subscription - queryId: {} - fetching nodeLabels:{}, relLabels:{}",
        subscription_input.query_id,
        input_node_labels,
        input_rel_labels
    );

    let subscription_data = SubscriptionData {
        query_id: subscription_input.query_id.clone(),
        query_node_id: subscription_input.query_node_id.clone(),
        node_labels: subscription_input.node_labels.clone(),
        rel_labels: subscription_input.rel_labels.clone(),
    };
    let subscription_data_json = match serde_json::to_value(&subscription_data) {
        Ok(json) => json,
        Err(e) => {
            log::error!("Error serializing the subscription data: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error serializing the subscription data: {:?}", e),
            )
                .into_response();
        }
    };

    let config = &state.config;
    let proxy_name = format!("{}-proxy", config.source_id);
    let invoker = &state.invoker;
    let response = match invoker
        .invoke(
            drasi_comms_abstractions::comms::Payload::Json(subscription_data_json),
            &proxy_name,
            "acquire",
            Some(headers.clone()),
        )
        .await
    {
        Ok(response) => {
            // if the response is successful
            response
        }
        Err(e) => {
            log::error!("Error invoking the acquire method on the proxy: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error invoking the acquire method on the proxy: {:?}", e),
            )
                .into_response();
        }
    };

    // response is bytes, convert to json
    let response_json: Value = match serde_json::from_slice(&response) {
        Ok(json) => json,
        Err(e) => {
            log::error!("Error parsing the response from the proxy: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error parsing the response from the proxy: {:?}", e),
            )
                .into_response();
        }
    };

    debug!(
        "queryApi.main/subscription - queryId: {} - response: {:?}",
        subscription_input.query_id, response_json
    );
    // Return the response from the proxy
    Json(response_json).into_response()
}

struct AppState {
    config: QueryApiConfig,
    publisher: DaprHttpPublisher,
    invoker: DaprHttpInvoker,
}
