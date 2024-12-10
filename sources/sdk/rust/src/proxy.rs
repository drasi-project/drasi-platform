use std::{env, fs::OpenOptions, future::Future, net::SocketAddr, panic, pin::Pin, sync::Arc, io::Write};

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

use crate::{models::{BootstrapRequest, SourceElement}, shutdown_signal, telemetry::init_tracer};

pub type BootstrapStream = Pin<Box<dyn Stream<Item = SourceElement> + Send>>;

#[derive(Error, Debug)]
pub enum BootstrapError {
    #[error("Invalid request: {0}")]
    InvalidRequest(String),

    #[error("Internal error: {0}")]
    InternalError(String),
}

pub struct SourceProxy<Response>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
{
    stream_producer: fn(BootstrapRequest) -> Response,
    port: u16,
}

impl<Response> SourceProxy<Response>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync + 'static,
{
    pub async fn start(&self) {

        panic::set_hook(Box::new(|info| {            
            if let Some(message) = info.payload().downcast_ref::<String>() {                   
                log::error!("Panic occurred: {}", message); 
                if let Ok(mut file) = OpenOptions::new().create(true).write(true).open("/dev/termination-log") {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            } else if let Some(message) = info.payload().downcast_ref::<&str>() {
                log::error!("Panic occurred: {}", message); 
                if let Ok(mut file) = OpenOptions::new().create(true).write(true).open("/dev/termination-log") {
                    let _ = writeln!(file, "Panic occurred: {}", message);
                }
            }           
        }));

        env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
        log::info!("Starting proxy");
        _ = init_tracer(format!("{}-proxy", env::var("SOURCE_ID").expect("SOURCE_ID required"))).unwrap();

        let app_state = Arc::new(AppState::<Response> {
            stream_producer: self.stream_producer,
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

pub struct SourceProxyBuilder<Response>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
{
    stream_producer: Option<fn(BootstrapRequest) -> Response>,
    port: Option<u16>,
}

impl<Response> SourceProxyBuilder<Response>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
{
    pub fn new() -> Self {
        SourceProxyBuilder {
            stream_producer: None,
            port: None,
        }
    }

    pub fn with_stream_producer(
        mut self,
        stream_producer: fn(BootstrapRequest) -> Response,
    ) -> Self {
        self.stream_producer = Some(stream_producer);
        self
    }

    pub fn with_port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }

    pub fn build(self) -> SourceProxy<Response> {
        SourceProxy {
            stream_producer: self.stream_producer.unwrap(),
            port: self.port.unwrap_or(80),
        }
    }
}

struct AppState<Response>
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
{
    stream_producer: fn(BootstrapRequest) -> Response,
}

async fn proxy_stream<Response>(
    State(state): State<Arc<AppState<Response>>>,
    Json(request): Json<BootstrapRequest>,
) -> impl IntoResponse
where
    Response: Future<Output = Result<BootstrapStream, BootstrapError>> + Send + Sync,
{
    match (state.stream_producer)(request).await {
        Ok(stream) => StreamBodyAs::json_nl(stream).into_response(),
        Err(e) => match e {
            BootstrapError::InvalidRequest(e) => (axum::http::StatusCode::BAD_REQUEST, e.to_string()).into_response(),
            BootstrapError::InternalError(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
        }
    }
}
