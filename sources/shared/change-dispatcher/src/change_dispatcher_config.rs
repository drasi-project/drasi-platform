use std::env;

#[derive(Debug, Clone, Default)]
pub struct ChangeDispatcherConfig {
    pub source_id: String,
    pub subscriber_store: String,
    pub pubsub_name: String,
    pub dapr_http_port: String,
    pub app_port: String,
}

impl ChangeDispatcherConfig {
    pub fn new() -> Self {
        let source_id = env::var("SOURCE_ID").unwrap_or_else(|_| "source_id".to_string());
        let subscriber_store =
            env::var("SUBSCRIBER_STORE").unwrap_or_else(|_| "subscriber_store".to_string());
        let pubsub_name = env::var("PUBSUB_NAME").unwrap_or_else(|_| "rg-pubsub".to_string());
        let dapr_http_port = env::var("DAPR_HTTP_PORT").unwrap_or_else(|_| "3500".to_string());
        let app_port = env::var("APP_PORT").unwrap_or_else(|_| "3000".to_string());

        ChangeDispatcherConfig {
            source_id,
            subscriber_store,
            pubsub_name,
            app_port,
            dapr_http_port,
        }
    }
}
