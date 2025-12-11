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

use std::error::Error;

use opentelemetry::trace::{SpanContext, TraceContextExt, TraceFlags};
use tracing::Span;
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::api::ResultEvent;

#[derive(Debug)]
pub struct ResultPublisher {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    pubsub: String,
}

impl ResultPublisher {
    pub fn new(dapr_host: String, dapr_port: u16, pubsub: String) -> ResultPublisher {
        ResultPublisher {
            client: reqwest::Client::new(),
            dapr_host,
            dapr_port,
            pubsub,
        }
    }

    #[tracing::instrument(skip(self, data), err)]
    pub async fn publish(
        &self,
        query_id: &str,
        data: ResultEvent,
    ) -> Result<(), Box<dyn Error + Send>> {
        let topic = format!("{query_id}-results");
        log::info!("Publishing {data:#?}");

        let mut request = self
            .client
            .post(format!(
                "http://{}:{}/v1.0/publish/{}/{}",
                self.dapr_host, self.dapr_port, self.pubsub, topic
            ))
            .json(&data);

        let ctx = Span::current().context();
        let span = ctx.span();
        let span_context = span.span_context();
        request = request.header("traceparent", create_traceparent_header(span_context));
        request = request.header("tracestate", span_context.trace_state().header());

        let response = request.send().await;

        match response {
            Ok(_) => Ok(()),
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
