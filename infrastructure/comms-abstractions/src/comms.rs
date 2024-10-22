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
