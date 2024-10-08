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
        let pubsub_name = env::var("PUBSUB_NAME").unwrap_or_else(|_| "drasi-pubsub".to_string());
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
