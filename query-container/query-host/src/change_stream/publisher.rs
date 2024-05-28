use std::time::SystemTime;

use redis::{aio::MultiplexedConnection, AsyncCommands};

#[derive(Debug)]
pub enum PublishError {
    ConnectionError(String),
    Other(String),
}

pub struct Publisher {
    topic: String,
    connection: MultiplexedConnection,
}

impl Publisher {
    pub async fn connect(url: &str, topic: String) -> Result<Self, PublishError> {
        let client = match redis::Client::open(url) {
            Ok(client) => client,
            Err(e) => {
                return Err(PublishError::ConnectionError(format!(
                    "Error connecting to redis: {}",
                    e
                )))
            }
        };

        let connection = match client.get_multiplexed_async_connection().await {
            Ok(connection) => connection,
            Err(e) => {
                return Err(PublishError::ConnectionError(format!(
                    "Error connecting to redis: {}",
                    e
                )))
            }
        };

        Ok(Self { topic, connection })
    }

    pub async fn publish(
        &self,
        data: String,
        trace_state: Option<String>,
        trace_parent: Option<String>,
    ) -> Result<(), PublishError> {
        let mut connection = self.connection.clone();
        let mut items = Vec::with_capacity(4);
        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_millis()
            .to_string();
        items.push(("data", data));
        items.push(("enqueue_time", now));
        if let Some(trace_state) = trace_state {
            items.push(("tracestate", trace_state));
        }
        if let Some(trace_parent) = trace_parent {
            items.push(("traceparent", trace_parent));
        }

        let _: redis::Value = match connection.xadd(&self.topic, "*", &items).await {
            Ok(ret) => {
                log::debug!("Publish result: {:?}", ret);
                ret
            }
            Err(e) => {
                return Err(PublishError::Other(format!(
                    "Error publishing to topic: {}",
                    e
                )))
            }
        };

        Ok(())
    }
}
