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

use std::{
    env, fs::OpenOptions, future::Future, io::Write, net::SocketAddr, panic, pin::Pin, sync::Arc,
};

use axum::{
    extract::State,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use axum_streams::StreamBodyAs;
use futures::Stream;
use thiserror::Error;
use tokio::net::TcpListener;

use crate::{
    models::{BootstrapRequest, SourceElement},
    shutdown_signal,
    telemetry::init_tracer,
};

pub type BootstrapStream = Pin<Box<dyn Stream<Item = SourceElement> + Send>>;

#[derive(Error, Debug)]
pub enum BootstrapError {
    #[error("Invalid request: {0}")]
    InvalidRequest(String),

    #[error("Internal error: {0}")]
    InternalError(String),
}

pub struct SourceProxy<Response, Context>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
    Context: Send + Sync + Clone + 'static,
{
    stream_producer: fn(Context, BootstrapRequest) -> Response,
    port: u16,
    context: Context
}

impl<Response, Context> SourceProxy<Response, Context>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync + 'static,
    Context: Send + Sync + Clone + 'static,
{
    pub async fn start(&self) {
        panic::set_hook(Box::new(|info| {
            if let Some(message) = info.payload().downcast_ref::<String>() {
                log::error!("Panic occurred: {}", message);
                if let Ok(mut file) = OpenOptions::new()
                    .create(true)
                    .write(true)
                    .open("/dev/termination-log")
                {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            } else if let Some(message) = info.payload().downcast_ref::<&str>() {
                log::error!("Panic occurred: {}", message);
                if let Ok(mut file) = OpenOptions::new()
                    .create(true)
                    .write(true)
                    .open("/dev/termination-log")
                {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            }
        }));

        env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
        log::info!("Starting proxy");
        _ = init_tracer(format!(
            "{}-proxy",
            env::var("SOURCE_ID").expect("SOURCE_ID required")
        ))
        .unwrap();

        let app_state = Arc::new(AppState::<Response, Context> {
            stream_producer: self.stream_producer,
            context: self.context.clone()
        });

        let app = Router::new()
            .route("/acquire-stream", post(proxy_stream))
            .route(
                "/supports-stream",
                get(|| async { (axum::http::StatusCode::NO_CONTENT, "") })
                    .post(|| async { (axum::http::StatusCode::NO_CONTENT, "") }),
            )
            .with_state(app_state);

        let addr = SocketAddr::from(([0, 0, 0, 0], self.port));

        let listener = match TcpListener::bind(&addr).await {
            Ok(listener) => listener,
            Err(e) => {
                panic!("Error binding to address: {:?}", e);
            }
        };

        let final_result = axum::serve(listener, app.into_make_service())
            .with_graceful_shutdown(shutdown_signal())
            .await;

        log::info!("Http server shutting down");
        if let Err(err) = final_result {
            log::error!("Http server: {}", err);
        }

        opentelemetry::global::shutdown_tracer_provider();
        tokio::task::yield_now().await;
    }
}

pub struct SourceProxyBuilder<Response, Context>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
    Context: Send + Sync + 'static,
{
    stream_producer: Option<fn(Context, BootstrapRequest) -> Response>,
    port: Option<u16>,
    context: Option<Context>,
}

impl<Response, Context> SourceProxyBuilder<Response, Context>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
    Context: Send + Sync + Clone + 'static,
{
    pub fn new() -> Self {
        SourceProxyBuilder {
            stream_producer: None,
            port: None,
            context: None,
        }
    }

    pub fn with_stream_producer(
        mut self,
        stream_producer: fn(Context, BootstrapRequest) -> Response,
    ) -> Self {
        self.stream_producer = Some(stream_producer);
        self
    }

    pub fn with_port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }

    pub fn with_context(
        mut self,
        context: Context
    ) -> Self {
        self.context = Some(context);
        self
    }

    pub fn build(self) -> SourceProxy<Response, Context> {
        SourceProxy {
            stream_producer: self.stream_producer.unwrap(),
            port: self.port.unwrap_or(80),
            context: match self.context {
                Some(s) => s,
                None => panic!("context not defined"),
            },
        }
    }
}

impl<Response> SourceProxyBuilder<Response, ()>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
{
    pub fn without_context(
        mut self
    ) -> Self {
        self.context = Some(());
        self
    }    
}

struct AppState<Response, Context>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
    Context: Send + Sync + Clone + 'static,
{
    stream_producer: fn(Context, BootstrapRequest) -> Response,
    context: Context,
}

async fn proxy_stream<Response, Context>(
    State(state): State<Arc<AppState<Response, Context>>>,
    Json(request): Json<BootstrapRequest>,
) -> impl IntoResponse
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
    Context: Send + Sync + Clone + 'static,
{
    match (state.stream_producer)(state.context.clone(), request).await {
        Ok(stream) => StreamBodyAs::json_nl(stream).into_response(),
        Err(e) => match e {
            BootstrapError::InvalidRequest(e) => {
                (axum::http::StatusCode::BAD_REQUEST, e.to_string()).into_response()
            }
            BootstrapError::InternalError(e) => {
                (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
            }
        },
    }
}
