use axum::async_trait;

use crate::models::SourceChange;
use super::Publisher;

pub struct DebugPublisher {    
}

impl DebugPublisher {
    pub fn new() -> Self {
        DebugPublisher { }
    }
}

#[async_trait]
impl Publisher for DebugPublisher {
    async fn publish(&self, change: SourceChange) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::info!("{:?}", serde_json::to_string(&change));
        Ok(())
    }
}
