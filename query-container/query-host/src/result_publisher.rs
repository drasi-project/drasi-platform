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
        log::info!("Publishing {:#?}", data);

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

        let response = match request.send().await {
            Ok(response) => response,
            Err(e) => return Err(Box::new(e)),
        };

        let status = response.status();
        if !status.is_success() {
            return Err(Box::new(std::io::Error::other(format!(
                "Dapr publish returned HTTP status {status} for query '{query_id}', pub/sub component '{}', and topic '{topic}'",
                self.pubsub
            ))));
        }

        Ok(())
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

#[cfg(test)]
mod tests {
    use axum::{http::StatusCode, Router};
    use tokio::{net::TcpListener, task::JoinHandle};

    use super::*;
    use crate::api::ControlSignal;

    const PUBSUB: &str = "test-pubsub";

    async fn start_server(
        status: StatusCode,
        body: &'static str,
    ) -> (ResultPublisher, JoinHandle<()>) {
        let app = Router::new().fallback(move || async move { (status, body) });
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let address = listener.local_addr().unwrap();
        let server = tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });

        (
            ResultPublisher::new(address.ip().to_string(), address.port(), PUBSUB.to_string()),
            server,
        )
    }

    fn test_event(query_id: &str) -> ResultEvent {
        ResultEvent::from_control_signal(
            query_id,
            7,
            987_654_321,
            ControlSignal::BootstrapCompleted,
        )
    }

    #[tokio::test]
    async fn publish_succeeds_for_no_content_response() {
        let (publisher, server) = start_server(StatusCode::NO_CONTENT, "").await;
        let query_id = "query-204";

        let result = publisher.publish(query_id, test_event(query_id)).await;
        server.abort();

        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn publish_fails_for_internal_server_error_response() {
        let (publisher, server) =
            start_server(StatusCode::INTERNAL_SERVER_ERROR, "sensitive-response-body").await;
        let query_id = "query-500";

        let error = publisher
            .publish(query_id, test_event(query_id))
            .await
            .expect_err("500 response should fail publication");
        server.abort();

        let message = error.to_string();
        assert!(message.contains("500 Internal Server Error"));
        assert!(message.contains(query_id));
        assert!(message.contains(PUBSUB));
        assert!(message.contains("query-500-results"));
        assert!(!message.contains("bootstrapCompleted"));
        assert!(!message.contains("sensitive-response-body"));
    }
}
