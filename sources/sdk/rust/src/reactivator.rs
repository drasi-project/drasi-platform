use std::{env, panic, io::Write};
use std::fs::OpenOptions;
use std::{future::Future, pin::Pin, sync::Arc};

use futures::{Stream, StreamExt};
use thiserror::Error;

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

pub struct ReactivatorBuilder<Response>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
{
    stream_producer: Option<fn(Arc<dyn StateStore + Send + Sync>) -> Response>,
    publisher: Option<Box<dyn Publisher>>,
    state_store: Option<Arc<dyn StateStore + Send + Sync>>,
}

impl<Response> ReactivatorBuilder<Response>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send,
{
    pub fn new() -> Self {
        ReactivatorBuilder {
            stream_producer: None,
            publisher: None,
            state_store: None,
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

    pub async fn build(self) -> Reactivator<Response> {
        Reactivator {
            stream_fn: self.stream_producer.expect("Stream producer is required"),
            publisher: self.publisher.unwrap_or_else(|| Box::new(DaprPublisher::new())),
            state_store: match self.state_store {
                Some(ss) => ss,
                None => Arc::new(DaprStateStore::connect().await.unwrap()),
            },
        }
    }
}

pub struct Reactivator<Response>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
{
    stream_fn: fn(Arc<dyn StateStore + Send + Sync>) -> Response,
    publisher: Box<dyn Publisher>,
    state_store: Arc<dyn StateStore + Send + Sync>,
}

impl<Response> Reactivator<Response>
where
    Response: Future<Output = Result<ChangeStream, ReactivatorError>> + Send + 'static,
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
        let mut stream = producer(state_store).await.unwrap();

        while let Some(data) = stream.next().await {
            if let Err(err) = self.publisher.publish(data).await {
                panic!("Error publishing: {}", err)
            }
        }
    }
}
