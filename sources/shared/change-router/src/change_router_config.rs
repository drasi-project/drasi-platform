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

use std::env;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct ChangeRouterConfig {
    pub source_id: String,
    pub subscriber_store: String,
    pub pubsub_name: String,
    pub otel_endpoint: String,
    pub dapr_port: String,
    pub app_port: String,
}

impl ChangeRouterConfig {
    pub fn from_env() -> ChangeRouterConfig {
        let source_id = env::var("SOURCE_ID").expect("SOURCE_ID must be set");
        let subscriber_store =
            env::var("SUBSCRIBER_STORE").unwrap_or_else(|_| "drasi-state".to_string()); //drasi-state?
        let pubsub_name = env::var("PUBSUB_NAME").unwrap_or_else(|_| "drasi-pubsub".to_string()); //drasi-pubsub?

        let otel_endpoint =
            env::var("OTEL_ENDPOINT").unwrap_or_else(|_| "http://otel-collector:4318".to_string());

        let dapr_port = std::env::var("DAPR_HTTP_PORT").unwrap_or_else(|_| "3000".to_string());

        let app_port = std::env::var("APP_PORT").unwrap_or_else(|_| "3000".to_string());
        Self {
            source_id,
            subscriber_store,
            pubsub_name,
            otel_endpoint,
            dapr_port,
            app_port,
        }
    }
}
