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

use std::fs::OpenOptions;
use std::net::SocketAddr;
use std::{env, io::Write, panic};
use std::{future::Future, pin::Pin, sync::Arc};

use axum::extract::State;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::Router;
use futures::{select, FutureExt, Stream, StreamExt};
use thiserror::Error;
use tokio::net::TcpListener;
use tokio::task;
use tracing::Instrument;
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::dapr_publisher::DaprPublisher;
use crate::dapr_statestore::DaprStateStore;
use crate::shutdown_signal;
use crate::telemetry::init_tracer;
use crate::{models::SourceChange, Publisher, StateStore};

#[derive(Error, Debug)]
pub enum ReactivatorError {
    #[error("Internal error: {0}")]
    InternalError(String),

    #[error("Error from state store: {0}")]
    StateStoreError(Box<dyn std::error::Error>),
}

pub type ChangeStream = Pin<Box<dyn Stream<Item = SourceChange> + Send>>;

pub struct ReactivatorBuilder<Response, DeprovisionResponse, Context = ()>
where
    Context: Send + Sync + 'static,
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{
    stream_producer: Option<fn(Context, Arc<dyn StateStore + Send + Sync>) -> Response>,
    publisher: Option<Box<dyn Publisher>>,
    state_store: Option<Arc<dyn StateStore + Send + Sync>>,
    context: Option<Context>,
    deprovision_handler: Option<fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse>,
    port: Option<u16>,
}

impl<Response, DeprovisionResponse, Context> ReactivatorBuilder<Response, DeprovisionResponse, Context>
where
    Context: Send + Sync,
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send,
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{
    pub fn new() -> Self {
        ReactivatorBuilder {
            stream_producer: None,
            publisher: None,
            state_store: None,
            context: None,
            deprovision_handler: None,
            port: None,
        }
    }

    pub fn with_stream_producer(
        mut self,
        stream_producer: fn(Context, Arc<dyn StateStore + Send + Sync>) -> Response,
    ) -> Self {
        self.stream_producer = Some(stream_producer);
        self
    }

    pub fn with_publisher(mut self, publisher: impl Publisher + 'static) -> Self {
        self.publisher = Some(Box::new(publisher));
        self
    }

    pub fn with_state_store(
        mut self,
        state_store: impl StateStore + Send + Sync + 'static,
    ) -> Self {
        self.state_store = Some(Arc::new(state_store));
        self
    }

    pub fn with_context(
        mut self,
        context: Context
    ) -> Self {
        self.context = Some(context);
        self
    }

    pub fn with_deprovision_handler(
        mut self,
        handler: fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse,
    ) -> Self {
        self.deprovision_handler = Some(handler);
        self
    }

    pub fn with_port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }

}

impl<Response, DeprovisionResponse, Context> ReactivatorBuilder<Response, DeprovisionResponse, Context>
where
    Context: Send + Sync,
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send,
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{ 
    pub async fn build(self) -> Reactivator<Context, Response, DeprovisionResponse> {
        Reactivator {
            stream_fn: self.stream_producer.expect("Stream producer is required"),
            publisher: self
                .publisher
                .unwrap_or_else(|| Box::new(DaprPublisher::new())),
            state_store: match self.state_store {
                Some(ss) => ss,
                None => Arc::new(DaprStateStore::connect().await.unwrap()),
            },
            context: match self.context {
                Some(s) => s,
                None => panic!("context not defined"),
            },
            deprovision_handler: self.deprovision_handler,
            port: self.port,
        }
    }
}

impl<Response, DeprovisionResponse> ReactivatorBuilder<Response, DeprovisionResponse, ()>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send,
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{ 
    pub fn without_context(
        mut self
    ) -> Self {
        self.context = Some(());
        self
    }    
}

pub struct Reactivator<Context, Response, DeprovisionResponse>
where
    Context: Send + Sync + 'static,
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{
    stream_fn: fn(Context, Arc<dyn StateStore + Send + Sync>) -> Response,
    publisher: Box<dyn Publisher>,
    state_store: Arc<dyn StateStore + Send + Sync>,
    context: Context,
    deprovision_handler: Option<fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse>,
    port: Option<u16>,
}

impl<Context, Response, DeprovisionResponse> Reactivator<Context, Response, DeprovisionResponse>
where
    Context: Send + Sync,
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{
    pub async fn start(self) {
        panic::set_hook(Box::new(|info| {
            if let Some(message) = info.payload().downcast_ref::<String>() {
                log::error!("Panic occurred: {} \n{:?}", message, info.location());
                if let Ok(mut file) = OpenOptions::new()
                    .create(true)
                    .write(true)
                    .open("/dev/termination-log")
                {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            } else if let Some(message) = info.payload().downcast_ref::<&str>() {
                log::error!("Panic occurred: {} \n{:?}", message, info.location());
                if let Ok(mut file) = OpenOptions::new()
                    .create(true)
                    .write(true)
                    .open("/dev/termination-log")
                {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            }
        }));
        log::info!("Starting reactivator");
        let source_id = env::var("SOURCE_ID").expect("SOURCE_ID required");
        _ = init_tracer(format!("{}-reactivator", source_id.clone())).unwrap();

        log::info!("Initialized tracing");

        let producer = self.stream_fn;        
        let state_store = self.state_store.clone();
        let mut stream = producer(self.context, state_store.clone()).await.unwrap().fuse();
        let port = self.port.unwrap_or(80);
        let deprovision_handler = self.deprovision_handler;

        task::spawn(async move {
            let app_state = Arc::new(AppState {
                state_store: state_store.clone(),
                deprovision_handler,
            });

            let app = Router::new()
                .route("/deprovision", post(deprovision))
                .with_state(app_state);

            let addr = SocketAddr::from(([127, 0, 0, 1], port));

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
        });

        let shutdown = shutdown_signal().fuse();
        futures::pin_mut!(shutdown);

        loop {
            select! {
                data = stream.next() => {
                    match data {
                        Some(data) => {
                            let span = tracing::span!(tracing::Level::INFO, "publish_change");
                            span.set_attribute("drasi.source.id", source_id.clone());

                            if let Err(err) = self.publisher.publish(data).instrument(span).await {
                                panic!("Error publishing: {}", err)
                            }
                        },
                        None => {
                            log::info!("Change stream ended");
                            break;
                        }
                    }
                },
                _ = shutdown => {
                    log::info!("Terminating");
                    break;
                }
            }
        }

        opentelemetry::global::shutdown_tracer_provider();
        tokio::task::yield_now().await;
    }
}

struct AppState<DeprovisionResponse>
where
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{
    state_store: Arc<dyn StateStore + Send + Sync>,
    deprovision_handler: Option<fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse>,
}

async fn deprovision<DeprovisionResponse>(
    State(state): State<Arc<AppState<DeprovisionResponse>>>,
) -> impl IntoResponse
where
    DeprovisionResponse: Future<Output = ()> + Send + 'static,
{
    log::info!("Deprovision invoked");
    match state.deprovision_handler {
        Some(handler) => {
            handler(state.state_store.clone()).await;
            (axum::http::StatusCode::NO_CONTENT, "".to_string()).into_response()
        }
        None => (axum::http::StatusCode::NO_CONTENT, "".to_string()).into_response(),
    }
}
