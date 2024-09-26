use serde::Serialize;
use thiserror::Error;

pub struct ChangeStreamConfig {
    pub redis_url: String,
    pub buffer_size: usize,
    pub fetch_batch_size: usize,
}

#[derive(Debug, Error)]
pub enum ViewError {
    #[error("`{0}`")]
    StoreError(Box<dyn std::error::Error + Send + Sync>),

    #[error("`{0}`")]
    Other(String),

    #[error("Not Found")]
    NotFound,
}
