use std::env;

use axum::async_trait;
use opentelemetry::trace::{SpanContext, TraceContextExt, TraceFlags};
use tracing::Span;
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::models::SourceChange;
use super::Publisher;

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
            dapr_port: env::var("DAPR_HTTP_PORT").unwrap_or("3500".to_string()).parse::<u16>().unwrap(),
            pubsub: env::var("PUBSUB").unwrap_or("drasi-pubsub".to_string()),
            source_id: env::var("SOURCE_ID").expect("Source ID not specified"),
        }
    }
}

#[async_trait]
impl Publisher for DaprPublisher {
    async fn publish(&self, change: SourceChange) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
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