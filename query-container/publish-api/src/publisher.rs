// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use redis::{aio::MultiplexedConnection, AsyncCommands};
use std::time::SystemTime;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum PublishError {
    #[error("Connection error: {0}")]
    ConnectionError(String),
    #[error("{0}")]
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
                    "Error connecting to redis: {e}"
                )))
            }
        };

        let connection = match client.get_multiplexed_async_connection().await {
            Ok(connection) => connection,
            Err(e) => {
                return Err(PublishError::ConnectionError(format!(
                    "Error connecting to redis: {e}"
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
        let now = match SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
            Ok(now) => now.as_nanos().to_string(),
            Err(e) => {
                return Err(PublishError::Other(format!(
                    "Error getting current time: {e}"
                )))
            }
        };
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
                log::debug!("Publish result: {ret:?}");
                ret
            }
            Err(e) => {
                return Err(PublishError::Other(format!(
                    "Error publishing to topic: {e}"
                )))
            }
        };

        Ok(())
    }
}
