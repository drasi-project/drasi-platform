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

use axum::async_trait;
use opentelemetry::trace::{SpanContext, TraceContextExt, TraceFlags};
use tracing::Span;
use tracing_opentelemetry::OpenTelemetrySpanExt;

use super::Publisher;
use crate::models::SourceChange;

pub struct DaprPublisher {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    pubsub: String,
    source_id: String,
}

impl DaprPublisher {
    pub fn new() -> Self {
        DaprPublisher {
            client: reqwest::Client::new(),
            dapr_host: "127.0.0.1".to_string(),
            dapr_port: env::var("DAPR_HTTP_PORT")
                .unwrap_or("3500".to_string())
                .parse::<u16>()
                .unwrap(),
            pubsub: env::var("PUBSUB").unwrap_or("drasi-pubsub".to_string()),
            source_id: env::var("SOURCE_ID").expect("Source ID not specified"),
        }
    }
}

#[async_trait]
impl Publisher for DaprPublisher {
    async fn publish(
        &self,
        change: SourceChange,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let topic = format!("{}-change", self.source_id);

        let mut request = self
            .client
            .post(format!(
                "http://{}:{}/v1.0/publish/{}/{}",
                self.dapr_host, self.dapr_port, self.pubsub, topic
            ))
            .json(&vec![change]);

        let ctx = Span::current().context();
        let span = ctx.span();
        let span_context = span.span_context();
        request = request.header("traceparent", create_traceparent_header(span_context));
        request = request.header("tracestate", span_context.trace_state().header());

        let response = request.send().await;

        match response {
            Ok(r) => {
                match r.error_for_status() {
                    Ok(_) => Ok(()),
                    Err(e) => return Err(Box::new(e)),
                }
            },
            Err(e) => Err(Box::new(e)),
        }
    }
}

fn create_traceparent_header(span_context: &SpanContext) -> String {
    format!(
        "{:02x}-{:032x}-{:016x}-{:02x}",
        0,
        span_context.trace_id(),
        span_context.span_id(),
        span_context.trace_flags() & TraceFlags::SAMPLED
    )
}
