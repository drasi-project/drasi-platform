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
use drasi_comms_abstractions::comms::{Headers, Invoker, Payload, Publisher};
use serde_json::Value;
pub struct DaprHttpPublisher {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    pubsub: String,
    topic: String,
}

#[async_trait]
impl Publisher for DaprHttpPublisher {
    fn new(dapr_host: String, dapr_port: u16, pubsub: String, topic: String) -> Self {
        DaprHttpPublisher {
            client: reqwest::Client::new(),
            dapr_host,
            dapr_port,
            pubsub,
            topic,
        }
    }

    async fn publish(
        &self,
        data: Value,
        headers: Headers,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut request = self
            .client
            .post(format!(
                "http://{}:{}/v1.0/publish/{}/{}",
                self.dapr_host, self.dapr_port, self.pubsub, self.topic
            ))
            .json(&data);

        for (key, value) in headers.headers.iter() {
            request = request.header(key, value);
        }

        let response = request.send().await;

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    Ok(())
                } else {
                    let error_message = format!(
                        "Dapr publish request failed with status: {} and body: {}",
                        resp.status(),
                        resp.text().await.unwrap_or_default()
                    );
                    Err(Box::from(error_message))
                }
            }
            Err(e) => Err(Box::new(e)),
        }
    }
}

#[derive(Debug, Clone)]
pub struct DaprHttpInvoker {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
}

impl DaprHttpInvoker {
    pub fn new(dapr_host: String, dapr_port: u16) -> Self {
        DaprHttpInvoker {
            client: reqwest::Client::new(),
            dapr_host,
            dapr_port,
        }
    }
}

#[async_trait]
impl Invoker for DaprHttpInvoker {
    async fn invoke(
        &self,
        data: Payload,
        app_id: &str,
        method: &str,
        headers: Option<Headers>,
    ) -> Result<bytes::Bytes, Box<dyn std::error::Error>> {
        let url = format!(
            "http://{}:{}/v1.0/invoke/{}/method/{}",
            self.dapr_host, self.dapr_port, app_id, method
        );

        let request_headers = {
            let mut request_headers = reqwest::header::HeaderMap::new();
            if let Some(headers) = headers {
                for (key, value) in headers.headers.iter() {
                    request_headers
                        .insert(key.parse::<reqwest::header::HeaderName>()?, value.parse()?);
                }
            }

            if !request_headers.contains_key("Content-Type") {
                match data {
                    Payload::Json(_) => {
                        request_headers.insert("Content-Type", "application/json".parse()?);
                    }
                    Payload::Bytes(_) => {
                        request_headers.insert("Content-Type", "application/octet-stream".parse()?);
                    }
                    _ => {}
                }
            }

            request_headers
        };

        let request = self.client.post(url).headers(request_headers);

        let request = match data {
            Payload::Json(data) => request.json(&data),
            Payload::Bytes(data) => request.body(data),
            _ => request,
        };

        let response = request.send().await;

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    Ok(resp.bytes().await?)
                } else {
                    let error_message = format!(
                        "Service invocation request failed with status: {} and body: {}",
                        resp.status(),
                        resp.text().await.unwrap_or_default()
                    );
                    Err(Box::from(error_message))
                }
            }
            Err(e) => Err(Box::new(e)),
        }
    }
}
