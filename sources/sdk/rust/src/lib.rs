use std::{env, error::Error};

pub use async_stream::stream;
use axum::async_trait;

mod models;
mod reactivator;
mod proxy;
mod debug_publisher;
mod memory_statestore;
mod dapr_statestore;
mod dapr_publisher;
mod telemetry;

pub use models::*;
pub use reactivator::*;
pub use proxy::*;
pub use debug_publisher::DebugPublisher;
pub use memory_statestore::MemoryStateStore;


#[async_trait]
pub trait Publisher {
    async fn publish(&self, change: SourceChange) -> Result<(), Box<dyn Error + Send + Sync>>;
}

#[async_trait]
pub trait StateStore {
    async fn get(&self, id: &str) -> Result<Option<Vec<u8>>, Box<dyn Error + Send + Sync>>;
    async fn put(&self, id: &str, data: Vec<u8>) -> Result<(), Box<dyn Error + Send + Sync>>;
    async fn delete(&self, id: &str) -> Result<(), Box<dyn Error + Send + Sync>>;
}


pub fn get_config_value(key: &str) -> Option<String> {
    match env::var(key) {
        Ok(s) => Some(s),
        Err(_) => None,
    }
}