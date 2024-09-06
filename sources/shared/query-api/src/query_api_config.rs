use std::env;
#[derive(Debug, Clone, Default)]
pub struct QueryApiConfig {
    pub pubsub_name: String,
    pub app_port: String,
    pub source_id: String,
    pub dapr_port: String,
}

impl QueryApiConfig {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let pubsub_name = env::var("PUBSUB_NAME").unwrap_or_else(|_| "drasi-pubsub".to_string());
        let app_port = env::var("APP_PORT").unwrap_or_else(|_| "4001".to_string());
        let source_id =
            env::var("SOURCE_ID").map_err(|_| "Missing SOURCE_ID environment variable")?;
        let dapr_port = env::var("DAPR_PORT").unwrap_or_else(|_| "3500".to_string());

        Ok(Self {
            pubsub_name,
            app_port,
            source_id,
            dapr_port,
        })
    }
}
