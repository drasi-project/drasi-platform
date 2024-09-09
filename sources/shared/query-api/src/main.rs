use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    response::Json,
    routing::post,
    Router,
};
use chrono::Utc;
use control_event::{AfterData, ControlEvent, Payload, Source, SubscriptionInput};
use log::debug;
use query_api_config::QueryApiConfig;
use serde_json::{Value, json};
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
    println!(
        "Starting the query API server for the source: {}",
        &config.source_id
    );
    println!("config : {:?}", config.clone());

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
        publisher: publisher,
        invoker: invoker,
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
            return Err(Box::<dyn std::error::Error>::from("Error binding to the address").into());
        }
    };
    match axum::serve(listener, app).await {
        Ok(_) => {
            println!("Server started at: {}", &addr);
        }
        Err(e) => {
            println!("Error starting the server: {:?}", e);
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
            println!("Error parsing the subscription input: {:?}", e);
            return StatusCode::BAD_REQUEST.into_response();
        }
    };
    println!(
        "Creating new subscription for query_id: {}",
        subscription_input.query_id
    );

    let mut headers_map = std::collections::HashMap::new();
    _ = match headers.get("traceparent") {
        Some(tp) => headers_map.insert("traceparent".to_string(), tp.to_str().unwrap().to_string()),
        None => {
            // no traceparent header found
            None
        }
    };
    let control_event = ControlEvent {
        op: "i".to_string(),
        ts_ms: Utc::now().timestamp_millis() as u64,
        payload: Payload {
            source: Source {
                db: "ReactiveGraph".to_string(), // Change to Drasi after merging PR #42
                table: "SourceSubscription".to_string(),
            },
            before: None,
            after: AfterData {
                query_id: subscription_input.query_id.clone(),
                query_node_id: subscription_input.query_node_id.clone(),
                node_labels: subscription_input.node_labels.clone(),
                rel_labels: subscription_input.rel_labels.clone(),
            },
        },
    };
    // control_event_vec.push(control_event);

    let publisher = &state.publisher;

    // let control_event_json = serde_json::to_value(&control_event_vec).unwrap();
    let control_event_json = json!([control_event]);
    let headers = Headers::new(headers_map);
    println!("control_event_json: {:?}", control_event_json);
    match publisher.publish(control_event_json, headers.clone()).await {
        Ok(_) => {
            println!("Published the subscription event");
        }
        Err(e) => {
            println!("Error publishing the subscription event: {:?}", e);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    }

    // Query DB and send initial results to query node
    let input_node_labels = serde_json::to_string(&subscription_input.node_labels).unwrap();
    let input_rel_labels = serde_json::to_string(&subscription_input.rel_labels).unwrap();

    println!(
        "queryApi.main/subscription - queryId: {} - fetching nodeLabels:{}, relLabels:{}",
        subscription_input.query_id, input_node_labels, input_rel_labels
    );

    let subscription_data = AfterData {
        query_id: subscription_input.query_id.clone(),
        query_node_id: subscription_input.query_node_id.clone(),
        node_labels: subscription_input.node_labels.clone(),
        rel_labels: subscription_input.rel_labels.clone(),
    };
    let subscription_data_json = serde_json::to_value(&subscription_data).unwrap();

    let config = &state.config;
    let proxy_name = format!("{}-proxy", config.source_id);
    let invoker = &state.invoker;
    let response = match invoker
        .invoke(
            subscription_data_json,
            proxy_name,
            "acquire".to_string(),
            headers.clone(),
        )
        .await
    {
        Ok(response) => {
            response
        }
        Err(e) => {
            println!("Error invoking the acquire method on the proxy: {:?}", e);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };

    let response_json: Value = match serde_json::from_slice(&response) {
        Ok(json) => json,
        Err(e) => {
            println!("Error parsing the response from the proxy: {:?}", e);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
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
