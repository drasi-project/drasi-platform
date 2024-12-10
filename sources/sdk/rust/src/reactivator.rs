use std::net::SocketAddr;
use std::{env, panic, io::Write};
use std::fs::OpenOptions;
use std::{future::Future, pin::Pin, sync::Arc};

use axum::extract::State;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::Router;
use futures::{select, FutureExt, Stream, StreamExt};
use thiserror::Error;
use tokio::net::TcpListener;
use tokio::signal::unix::SignalKind;
use tokio::{signal, task};

use crate::dapr_statestore::DaprStateStore;
use crate::dapr_publisher::DaprPublisher;
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

pub struct ReactivatorBuilder<Response, DeprovisionResponse>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
    DeprovisionResponse: Future<Output = ()> + Send + 'static
{
    stream_producer: Option<fn(Arc<dyn StateStore + Send + Sync>) -> Response>,
    publisher: Option<Box<dyn Publisher>>,
    state_store: Option<Arc<dyn StateStore + Send + Sync>>,
    deprovision_handler: Option<fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse>,
    port: Option<u16>,
}

impl<Response, DeprovisionResponse> ReactivatorBuilder<Response, DeprovisionResponse>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send,
    DeprovisionResponse: Future<Output = ()> + Send + 'static
{
    pub fn new() -> Self {
        ReactivatorBuilder {
            stream_producer: None,
            publisher: None,
            state_store: None,
            deprovision_handler: None,
            port: None
        }
    }

    pub fn with_stream_producer(
        mut self,
        stream_producer: fn(Arc<dyn StateStore + Send + Sync>) -> Response,
    ) -> Self {
        self.stream_producer = Some(stream_producer);
        self
    }

    pub fn with_publisher(mut self, publisher: impl Publisher + 'static) -> Self {
        self.publisher = Some(Box::new(publisher));
        self
    }

    pub fn with_state_store(mut self, state_store: impl StateStore + Send + Sync + 'static) -> Self {
        self.state_store = Some(Arc::new(state_store));
        self
    }

    pub fn with_deprovision_handler(mut self, handler: fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse) -> Self {
        self.deprovision_handler = Some(handler);
        self
    }

    pub fn with_port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }

    pub async fn build(self) -> Reactivator<Response, DeprovisionResponse> {
        Reactivator {
            stream_fn: self.stream_producer.expect("Stream producer is required"),
            publisher: self.publisher.unwrap_or_else(|| Box::new(DaprPublisher::new())),
            state_store: match self.state_store {
                Some(ss) => ss,
                None => Arc::new(DaprStateStore::connect().await.unwrap()),
            },
            deprovision_handler: self.deprovision_handler,
            port: self.port,
        }
    }
}

pub struct Reactivator<Response, DeprovisionResponse>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
    DeprovisionResponse: Future<Output = ()> + Send + 'static
{
    stream_fn: fn(Arc<dyn StateStore + Send + Sync>) -> Response,
    publisher: Box<dyn Publisher>,
    state_store: Arc<dyn StateStore + Send + Sync>,
    deprovision_handler: Option<fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse>,
    port: Option<u16>,
}

impl<Response, DeprovisionResponse> Reactivator<Response, DeprovisionResponse>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
    DeprovisionResponse: Future<Output = ()> + Send + 'static
{
    pub async fn start(&mut self) {
        env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

        panic::set_hook(Box::new(|info| {            
            if let Some(message) = info.payload().downcast_ref::<String>() {                
                log::error!("Panic occurred: {} \n{:?}", message, info.location()); 
                if let Ok(mut file) = OpenOptions::new().create(true).write(true).open("/dev/termination-log") {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            } else if let Some(message) = info.payload().downcast_ref::<&str>() {
                log::error!("Panic occurred: {} \n{:?}", message, info.location()); 
                if let Ok(mut file) = OpenOptions::new().create(true).write(true).open("/dev/termination-log") {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            }           
        }));        
        log::info!("Starting reactivator");
        
        _ = init_tracer(format!("{}-reactivator", env::var("SOURCE_ID").expect("SOURCE_ID required"))).unwrap();

        log::info!("Initialized tracing");

        let producer = &self.stream_fn;
        let state_store = self.state_store.clone();
        let mut stream = producer(state_store.clone()).await.unwrap().fuse();
        let port = self.port.unwrap_or(80);
        let deprovision_handler = self.deprovision_handler;
        let (term_tx, term_rx) = tokio::sync::oneshot::channel::<()>();
        
        task::spawn(async move {
            let app_state = Arc::new(AppState {
                state_store: state_store.clone(),
                deprovision_handler: deprovision_handler
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
            _ = term_tx.send(());
            if let Err(err) = final_result {
                log::error!("Http server: {}", err);
            }
        });

        let mut rx = term_rx.fuse();

        loop {
            select! {
                data = stream.next() => {
                    match data {
                        Some(data) => {
                            if let Err(err) = self.publisher.publish(data).await {
                                panic!("Error publishing: {}", err)
                            }
                        },
                        None => {
                            log::info!("Change stream ended");
                            break;
                        }
                    }
                },
                _ = rx => {
                    log::info!("Terminating");
                    break;
                }
            }
        }
    }
}

struct AppState<DeprovisionResponse> 
where 
    DeprovisionResponse: Future<Output = ()> + Send + 'static
{
    state_store: Arc<dyn StateStore + Send + Sync>,
    deprovision_handler: Option<fn(Arc<dyn StateStore + Send + Sync>) -> DeprovisionResponse>,
}

async fn deprovision<DeprovisionResponse>(State(state): State<Arc<AppState<DeprovisionResponse>>>) -> impl IntoResponse 
where 
    DeprovisionResponse: Future<Output = ()> + Send + 'static
{
    log::info!("Deprovision invoked");
    match state.deprovision_handler {
        Some(handler) => {
            handler(state.state_store.clone()).await;
            (axum::http::StatusCode::NO_CONTENT, "".to_string()).into_response()
        },
        None => (axum::http::StatusCode::NO_CONTENT, "".to_string()).into_response(),
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };
    
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    let interrupt = async {
        signal::unix::signal(signal::unix::SignalKind::interrupt())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
        _ = interrupt => {}
    }
}