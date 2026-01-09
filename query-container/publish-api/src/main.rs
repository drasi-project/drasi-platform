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

use std::sync::Arc;

use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::post,
    Router,
};
use publisher::Publisher;

mod publisher;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let query_container_id = match std::env::var("QUERY_NODE_ID") {
        Ok(id) => id,
        Err(_) => {
            log::error!("QUERY_NODE_ID not set");
            std::process::exit(1);
        }
    };
    let redis_url = match std::env::var("REDIS_BROKER") {
        Ok(url) => url,
        Err(_) => String::from("redis://drasi-redis:6379"),
    };

    log::info!("Drasi Publish API starting up for query node: {query_container_id}");

    let topic = format!("{query_container_id}-publish");

    let publisher = match Publisher::connect(&redis_url, topic).await {
        Ok(publisher) => publisher,
        Err(e) => {
            log::error!("Error connecting to the redis broker: {e:?}");
            std::process::exit(1);
        }
    };

    let shared_state = Arc::new(AppState { publisher });

    let app = Router::new()
        .route("/change", post(change))
        .route("/data", post(data))
        .with_state(shared_state);

    let port: u16 = std::env::var("PORT")
        .unwrap_or(String::from("4000"))
        .parse()
        .unwrap_or(4000);

    let addr = format!("0.0.0.0:{port}");
    log::info!("Listening on {addr}");
    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(listener) => listener,
        Err(_e) => {
            log::error!("Error binding to the address: {addr}");
            std::process::exit(1);
        }
    };
    match axum::serve(listener, app).await {
        Ok(_) => {
            log::info!("Server started at: {addr}");
        }
        Err(e) => {
            log::error!("Error starting the server: {e:?}");
        }
    };
}

struct AppState {
    publisher: Publisher,
}

async fn change(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: String,
) -> impl IntoResponse {
    let trace_state = match headers.get("tracestate") {
        Some(trace_state) => match trace_state.to_str() {
            Ok(ts) => Some(ts.to_string()),
            Err(_) => None,
        },
        None => None,
    };

    let trace_parent = match headers.get("traceparent") {
        Some(trace_state) => match trace_state.to_str() {
            Ok(ts) => Some(ts.to_string()),
            Err(_) => None,
        },
        None => None,
    };

    log::info!("Publishing change: {body:?}");

    match state
        .publisher
        .publish(body, trace_state, trace_parent)
        .await
    {
        Ok(_) => {
            log::debug!("Published change");
            StatusCode::OK
        }
        Err(e) => {
            log::error!("Error publishing change: {e:?}");
            StatusCode::BAD_GATEWAY
        }
    }
}

async fn data(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: String,
) -> impl IntoResponse {
    let trace_state = match headers.get("tracestate") {
        Some(trace_state) => match trace_state.to_str() {
            Ok(ts) => Some(ts.to_string()),
            Err(_) => None,
        },
        None => None,
    };

    let trace_parent = match headers.get("traceparent") {
        Some(trace_state) => match trace_state.to_str() {
            Ok(ts) => Some(ts.to_string()),
            Err(_) => None,
        },
        None => None,
    };

    log::info!("Publishing data: {body:?}");

    match state
        .publisher
        .publish(body, trace_state, trace_parent)
        .await
    {
        Ok(_) => {
            log::debug!("Published data");
            StatusCode::OK
        }
        Err(e) => {
            log::error!("Error publishing data: {e:?}");
            StatusCode::BAD_GATEWAY
        }
    }
}
