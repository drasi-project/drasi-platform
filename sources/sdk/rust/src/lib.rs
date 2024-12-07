use std::{net::SocketAddr, pin::Pin, sync::Arc};

use async_stream::stream;
use axum::{async_trait, extract::State, response::IntoResponse, routing::{get, post}, Json, Router};
use axum_streams::StreamBodyAs;
use futures::{Stream, StreamExt};
use models::{BootstrapRequest, ChangeOp, SourceChange, SourceElement};
use serde_json::Value;
use tokio::{net::TcpListener, pin};

pub mod models;


pub type ChangeStream = Pin<Box<dyn Stream<Item = SourceChange> + Send>>;
pub type ChangeStreamProducer = &'static (dyn Fn(&dyn StateStore) -> ChangeStream + Send + Sync);

pub type BootstrapStream = Pin<Box<dyn Stream<Item = SourceElement> + Send>>;
pub type BootstrapStreamProducer = &'static (dyn Fn(BootstrapRequest) -> BootstrapStream + Send + Sync);

pub struct ReactivatorBuilder {
    stream_producer: Option<ChangeStreamProducer>,
    publisher: Option<Box<dyn Publisher>>,
}

impl ReactivatorBuilder {
    pub fn new() -> Self {
        ReactivatorBuilder {
            stream_producer: None,
            publisher: None,
        }
    }

    pub fn with_stream_producer(mut self, stream_producer: ChangeStreamProducer) -> Self {
        self.stream_producer = Some(stream_producer);
        self
    }

    pub fn with_publisher(mut self, publisher: impl Publisher + 'static) -> Self {
        self.publisher = Some(Box::new(publisher));
        self
    }

    pub fn build(self) -> Reactivator {
        Reactivator {
            stream_fn: self.stream_producer,
            publisher: self.publisher.unwrap(),
        }
    }
}

pub struct Reactivator {
    stream_fn: Option<ChangeStreamProducer>,
    publisher: Box<dyn Publisher>,
    
}

impl Reactivator {
    pub async fn start(&mut self) {

        let producer = self.stream_fn.take();
        let state_store = InMemoryStateStore::new();
        let mut stream = producer.unwrap()(&state_store);

        
        while let Some(data) = stream.next().await {
            self.publisher.publish(data).await;
        }
        
    }
}


#[async_trait]
pub trait Publisher {
    async fn publish(&self, change: SourceChange);
}

pub trait StateStore {
    fn get(&self, id: &str) -> Option<Vec<u8>>;
    fn put(&self, id: &str, data: Vec<u8>);
    fn delete(&self, id: &str);
}

pub struct DebugPublisher {    
}

#[async_trait]
impl Publisher for DebugPublisher {
    async fn publish(&self, change: SourceChange) {
        println!("{:?}", serde_json::to_string(&change));
    }
}

pub struct InMemoryStateStore {
    data: Arc<std::sync::Mutex<std::collections::HashMap<String, Vec<u8>>>>
}

impl InMemoryStateStore {
    pub fn new() -> Self {
        InMemoryStateStore {
            data: Arc::new(std::sync::Mutex::new(std::collections::HashMap::new()))
        }
    }
}

impl StateStore for InMemoryStateStore {
    fn get(&self, id: &str) -> Option<Vec<u8>> {
        let data = self.data.lock().unwrap();
        data.get(id).map(|v| v.clone())
    }

    fn put(&self, id: &str, data: Vec<u8>) {
        panic!("Not implemented");
    }

    fn delete(&self, id: &str) {
        let mut data = self.data.lock().unwrap();
        data.remove(id);
    }
}

pub struct SourceProxy {
    stream_producer: BootstrapStreamProducer,

}

impl SourceProxy {
    

    pub async fn start(&self) {


        let app_state = Arc::new(AppState {
            stream_producer: self.stream_producer,
        });

        let app = Router::new()
            .route("/acquire-stream", post(proxy_stream))
            .with_state(app_state);

        let addr = SocketAddr::from(([0, 0, 0, 0], 8085));

        let listener = match TcpListener::bind(&addr).await {
            Ok(listener) => listener,
            Err(e) => {
                panic!("Error binding to address: {:?}", e);
            }
        };
        if let Err(e) = axum::serve(listener, app).await {
            log::error!("Error starting the server: {:?}", e);
        };

    }

    
}

pub struct SourceProxyBuilder {
    stream_producer: Option<BootstrapStreamProducer>,
}

impl SourceProxyBuilder {
    pub fn new() -> Self {
        SourceProxyBuilder {
            stream_producer: None,
        }
    }

    pub fn with_stream_producer(mut self, stream_producer: BootstrapStreamProducer) -> Self {
        self.stream_producer = Some(stream_producer);
        self
    }

    pub fn build(self) -> SourceProxy {
        SourceProxy {
            stream_producer: self.stream_producer.unwrap(),
        }
    }
}

struct AppState {
    stream_producer: BootstrapStreamProducer,
}

async fn proxy_stream(
    State(state): State<Arc<AppState>>, 
    Json(request): Json<BootstrapRequest>
) -> impl IntoResponse {
    let stream = (state.stream_producer)(request);
    StreamBodyAs::json_nl(stream)
}