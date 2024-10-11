use async_trait::async_trait;
use serde_json::Value;
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Headers {
    pub headers: HashMap<String, String>,
}

impl Headers {
    pub fn new(headers: HashMap<String, String>) -> Self {
        Headers { headers }
    }

    pub fn add_header(&mut self, key: &str, value: &str) {
        self.headers.insert(key.to_string(), value.to_string());
    }
}

pub enum Payload {
    None,
    Json(Value),
    Bytes(bytes::Bytes),
}

#[async_trait]
pub trait Invoker: Send + Sync {
    async fn invoke(
        &self,
        data: Payload,
        app_id: &str,
        method: &str,
        headers: Option<Headers>,
    ) -> Result<bytes::Bytes, Box<dyn std::error::Error>>;
}

#[async_trait]
pub trait Publisher: Send + Sync {
    fn new(dapr_host: String, dapr_port: u16, pubsub: String, topic: String) -> Self;
    async fn publish(
        &self,
        data: Value,
        headers: Headers,
    ) -> Result<(), Box<dyn std::error::Error>>;
}
