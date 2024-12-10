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

use opentelemetry::{trace::TraceError, KeyValue};
use opentelemetry_otlp::WithExportConfig;
use opentelemetry_sdk::Resource;
use tracing_subscriber::{layer::SubscriberExt, Registry};

pub fn init_tracer(service_name: String) -> Result<(), TraceError> {
    let otel_endpoint =
        env::var("OTEL_ENDPOINT").unwrap_or("http://otel-collector:4317".to_string());

    let tracer = opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(
            opentelemetry_otlp::new_exporter()
                .tonic()
                .with_endpoint(otel_endpoint),
        )
        .with_trace_config(
            opentelemetry::sdk::trace::config().with_resource(Resource::new(vec![KeyValue::new(
                opentelemetry_semantic_conventions::resource::SERVICE_NAME,
                service_name,
            )])),
        )
        .install_batch(opentelemetry_sdk::runtime::Tokio);

    match tracer {
        Ok(tracer) => {
            let telemetry = tracing_opentelemetry::layer()
                .with_tracer(tracer)
                .with_exception_fields(true)
                .with_location(true);
            let subscriber = Registry::default().with(telemetry);
            tracing::subscriber::set_global_default(subscriber)
                .expect("setting tracing default failed");
            Ok(())
        }
        Err(err) => Err(err),
    }
}
