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
        let dapr_port = env::var("DAPR_HTTP_PORT").unwrap_or_else(|_| "3500".to_string());

        Ok(Self {
            pubsub_name,
            app_port,
            source_id,
            dapr_port,
        })
    }
}
