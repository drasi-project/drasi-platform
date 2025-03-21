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

use api::{v2::AcquireRequest, ControlEvent, Source, SubscriptionPayload, SubscriptionRequest};
use async_stream::stream;
use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    response::Json,
    routing::{delete, post},
    Router,
};
use axum_streams::StreamBodyAs;
use chrono::Utc;
use drasi_comms_http::{HttpStreamingInvoker, StreamType, Verb};
use futures::StreamExt;
use query_api_config::QueryApiConfig;
use serde_json::json;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

use drasi_comms_abstractions::comms::{Headers, Invoker, Payload, Publisher};
use drasi_comms_dapr::comms::{DaprHttpInvoker, DaprHttpPublisher};

mod api;
mod query_api_config;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
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
    let streaming_invoker = HttpStreamingInvoker::new();

    let shared_state = Arc::new(AppState {
        config: config.clone(),
        publisher,
        invoker,
        streaming_invoker,
    });

    let app = Router::new()
        .route("/subscription", post(handle_subscription))
        .route(
            "/subscription/:queryNodeId/:queryId",
            delete(handle_unsubscription),
        )
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
    if let Err(e) = axum::serve(listener, app).await {
        log::error!("Error starting the server: {:?}", e);
    };

    Ok(())
}

async fn handle_subscription(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(subscription_request): Json<SubscriptionRequest>,
) -> impl IntoResponse {
    log::info!(
        "Creating new subscription for query_id: {}",
        subscription_request.query_id
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
    let headers = Headers::new(headers_map);

    if let Err(err) = dispatch_control_event(&subscription_request, &state, headers.clone()).await {
        return err;
    }

    log::info!("Checking if the source supports streaming");
    let proxy_app_id = format!("{}-proxy", state.config.source_id);
    let supports_streaming = state
        .invoker
        .invoke(Payload::None, &proxy_app_id, "supports-stream", None)
        .await
        .is_ok();

    if supports_streaming {
        log::info!("Source supports streaming");
        acquire_v2(&state, subscription_request, headers)
            .await
            .into_response()
    } else {
        log::info!("Source does not support streaming");
        acquire_v1(&state, subscription_request)
            .await
            .into_response()
    }
}

async fn handle_unsubscription(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Path((query_node_id, query_id)): Path<(String, String)>,
) -> impl IntoResponse {
    log::info!("Creating new unsubscription for query_id: {}", query_id);

    if let Err(err) = dispatch_unsubscription_event(&query_node_id, &query_id, &state).await {
        return err;
    }

    "Unsubscription event dispatched".into_response()
}

async fn dispatch_control_event(
    subscription_request: &SubscriptionRequest,
    state: &Arc<AppState>,
    headers: Headers,
) -> Result<(), axum::http::Response<axum::body::Body>> {
    let control_event = ControlEvent {
        op: "i".to_string(),
        ts_ns: Utc::now().timestamp_millis() as u64,
        payload: SubscriptionPayload {
            source: Source {
                db: "Drasi".to_string(),
                table: "SourceSubscription".to_string(),
            },
            before: None,
            after: Some(subscription_request.clone()),
        },
    };
    let publisher = &state.publisher;
    let control_event_json = json!([control_event]);
    match publisher.publish(control_event_json, headers.clone()).await {
        Ok(_) => {
            log::info!("Published the subscription event");
        }
        Err(e) => {
            log::error!("Error publishing the subscription event: {:?}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error publishing the subscription event: {:?}", e),
            )
                .into_response());
        }
    }
    Ok(())
}

async fn dispatch_unsubscription_event(
    query_node_id: &str,
    query_id: &str,
    state: &Arc<AppState>,
) -> Result<(), axum::http::Response<axum::body::Body>> {
    let publisher = &state.publisher;
    let request = SubscriptionRequest {
        query_id: query_id.to_string(),
        query_node_id: query_node_id.to_string(),
        node_labels: vec![],
        rel_labels: vec![],
    };
    let control_event = ControlEvent {
        op: "d".to_string(),
        ts_ns: Utc::now().timestamp_millis() as u64,
        payload: SubscriptionPayload {
            source: Source {
                db: "Drasi".to_string(),
                table: "SourceSubscription".to_string(),
            },
            before: Some(request.clone()),
            after: None,
        },
    };
    let unsubscription_event_json = json!([control_event]);
    match publisher
        .publish(
            unsubscription_event_json,
            Headers::new(std::collections::HashMap::new()),
        )
        .await
    {
        Ok(_) => {
            log::info!("Published the unsubscription event");
        }
        Err(e) => {
            log::error!("Error publishing the unsubscription event: {:?}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error publishing the unsubscription event: {:?}", e),
            )
                .into_response());
        }
    }

    Ok(())
}

async fn acquire_v1(
    state: &AppState,
    subscription_request: SubscriptionRequest,
) -> impl IntoResponse {
    let acquire_request = match serde_json::to_value(&subscription_request) {
        Ok(json) => json,
        Err(e) => {
            log::error!("Error serializing the subscription request: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error serializing the subscription request: {:?}", e),
            )
                .into_response();
        }
    };

    let config = &state.config;
    let proxy_name = format!("{}-proxy", config.source_id);
    let invoker = &state.invoker;
    let response = match invoker
        .invoke(
            drasi_comms_abstractions::comms::Payload::Json(acquire_request),
            &proxy_name,
            "acquire",
            None,
        )
        .await
    {
        Ok(response) => response,
        Err(e) => {
            log::error!("Error invoking the acquire method on the proxy: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error invoking acquire: {:?}", e),
            )
                .into_response();
        }
    };

    let response_json: api::v1::BootstrapEvents = match serde_json::from_slice(&response) {
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

    let stream = stream! {
        for node in response_json.nodes {
            log::info!("loading node: {:?}", node.id);
            yield api::v2::BootstrapElement::from(node);
        }
        for rel in response_json.rels {
            yield api::v2::BootstrapElement::from(rel);
        }
    };

    log::info!("Returning the stream");

    StreamBodyAs::json_nl(stream).into_response()
}

async fn acquire_v2(
    state: &AppState,
    subscription_request: SubscriptionRequest,
    headers: Headers,
) -> impl IntoResponse {
    let acquire_request: AcquireRequest = subscription_request.into();
    let acquire_request = match serde_json::to_value(&acquire_request) {
        Ok(json) => json,
        Err(e) => {
            log::error!("Error serializing the subscription request: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error serializing the subscription request: {:?}", e),
            )
                .into_response();
        }
    };
    let app_id = format!("{}-proxy", state.config.source_id);
    let mut resp = match state
        .streaming_invoker
        .invoke(
            Payload::Json(acquire_request),
            &app_id,
            Verb::Post,
            "acquire-stream",
            StreamType::JsonNewLine,
            Some(headers),
        )
        .await
    {
        Ok(resp) => resp,
        Err(e) => {
            log::error!(
                "Error invoking the acquire-stream method on the proxy: {:?}",
                e
            );
            return (
                StatusCode::BAD_GATEWAY,
                format!("Error invoking acquire-stream: {:?}", e),
            )
                .into_response();
        }
    };

    let stream = stream! {
        while let Some(element) = resp.next().await {
            match element {
                Ok(element) => yield element,
                Err(e) => {
                    log::error!("Error reading the stream: {:?}", e);
                    break;
                }
            }
        }
    };

    StreamBodyAs::json_nl(stream).into_response()
}

struct AppState {
    config: QueryApiConfig,
    publisher: DaprHttpPublisher,
    invoker: DaprHttpInvoker,
    streaming_invoker: HttpStreamingInvoker,
}
