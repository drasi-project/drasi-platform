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

use drasi_comms_abstractions::comms::{Headers, Payload};
use futures::Stream;
use reqwest::header::{HeaderValue, InvalidHeaderName, InvalidHeaderValue};
use reqwest_streams::{error::StreamBodyError, JsonStreamResponse};
use serde_json::Value;

#[derive(Debug, Clone)]
pub struct HttpStreamingInvoker {
    client: reqwest::Client,
}

impl HttpStreamingInvoker {
    pub fn new() -> Self {
        HttpStreamingInvoker {
            client: reqwest::Client::new(),
        }
    }
}

impl Default for HttpStreamingInvoker {
    fn default() -> Self {
        Self::new()
    }
}

pub enum StreamType {
    JsonNewLine,
    JsonArray,
}

pub enum Verb {
    Get,
    Post,
}

impl HttpStreamingInvoker {
    pub async fn invoke(
        &self,
        data: Payload,
        app_id: &str,
        verb: Verb,
        path: &str,
        stream_type: StreamType,
        headers: Option<Headers>,
    ) -> Result<impl Stream<Item = Result<Value, StreamBodyError>> + Send, InvokeError> {
        let uri = format!("http://{app_id}/{path}");

        let request_headers = {
            let mut request_headers = reqwest::header::HeaderMap::new();
            if let Some(headers) = headers {
                for (key, value) in headers.headers.iter() {
                    request_headers.insert(
                        key.parse::<reqwest::header::HeaderName>()?,
                        HeaderValue::from_str(value)?,
                    );
                }
            }

            if !request_headers.contains_key("Content-Type") {
                match data {
                    Payload::Json(_) => {
                        request_headers
                            .insert("Content-Type", HeaderValue::from_str("application/json")?);
                    }
                    Payload::Bytes(_) => {
                        request_headers.insert(
                            "Content-Type",
                            HeaderValue::from_str("application/octet-stream")?,
                        );
                    }
                    _ => {}
                }
            }

            request_headers
        };

        let builder = match verb {
            Verb::Get => self.client.get(uri).headers(request_headers),
            Verb::Post => self.client.post(uri).headers(request_headers),
        };

        let builder = match data {
            Payload::Json(data) => builder.json(&data),
            Payload::Bytes(data) => builder.body(data),
            _ => builder,
        };

        let resp = builder.send().await?;

        if !resp.status().is_success() {
            return Err(InvokeError::new(format!(
                "Error invoking: {} - {}",
                resp.status(),
                resp.text().await.unwrap_or_default()
            )));
        }

        let stream = match stream_type {
            StreamType::JsonArray => resp.json_array_stream::<Value>(usize::MAX),
            StreamType::JsonNewLine => resp.json_nl_stream::<Value>(usize::MAX),
        };

        Ok(stream)
    }
}

#[derive(Debug)]
pub struct InvokeError {
    message: String,
}

impl InvokeError {
    pub fn new(message: String) -> Self {
        InvokeError { message }
    }
}

impl std::error::Error for InvokeError {}

impl std::fmt::Display for InvokeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl From<reqwest::Error> for InvokeError {
    fn from(err: reqwest::Error) -> Self {
        InvokeError::new(format!("Error invoking HTTP request: {err}"))
    }
}

impl From<InvalidHeaderName> for InvokeError {
    fn from(err: InvalidHeaderName) -> Self {
        InvokeError::new(format!("Error parsing header name: {err}"))
    }
}

impl From<InvalidHeaderValue> for InvokeError {
    fn from(err: InvalidHeaderValue) -> Self {
        InvokeError::new(format!("Error parsing header value: {err}"))
    }
}
