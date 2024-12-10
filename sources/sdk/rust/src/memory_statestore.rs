use std::{collections::HashMap, sync::Arc};

use axum::async_trait;
use tokio::sync::Mutex;

use crate::StateStore;


pub struct MemoryStateStore {
    data: Arc<Mutex<HashMap<String, Vec<u8>>>>,
}

impl MemoryStateStore {
    pub fn new() -> Self {
        MemoryStateStore {
            data: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl StateStore for MemoryStateStore {
    async fn get(&self, id: &str) -> Result<Option<Vec<u8>>, Box<dyn std::error::Error + Send + Sync>> {
        let data = self.data.lock().await;
        Ok(data.get(id).cloned())
    }

    async fn put(&self, id: &str, value: Vec<u8>) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut data = self.data.lock().await;
        data.insert(id.to_string(), value);
        Ok(())
    }

    async fn delete(&self, id: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut data = self.data.lock().await;
        data.remove(id);
        Ok(())
    }
}