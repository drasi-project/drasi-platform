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

use std::{env, sync::Arc, time::Duration};

use drasi_core::middleware::MiddlewareTypeRegistry;
use opentelemetry::{metrics, sdk::Resource, trace::TraceError, KeyValue};
use opentelemetry_otlp::{ExportConfig, WithExportConfig};

use dapr::server::actor::runtime::ActorTypeRegistration;

use models::ChangeStreamConfig;
use opentelemetry_sdk::metrics::MeterProvider;
use query_actor::QueryActor;
use result_publisher::ResultPublisher;
use source_client::SourceClient;
use tokio::{select, signal::unix::SignalKind};
use tracing_subscriber::{
    filter::{self, LevelFilter},
    prelude::__tracing_subscriber_SubscriberExt,
    Layer, Registry,
};

use crate::index_factory::IndexFactory;

mod api;
mod change_stream;
mod future_consumer;
mod index_factory;
mod models;
mod query_actor;
mod query_worker;
mod result_publisher;
mod source_client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    log::info!("Starting query host");

    _ = init_tracer();
    let meter_provider = init_metrics()?;

    // Introduce delay so that dapr grpc port is assigned before app tries to connect
    std::thread::sleep(std::time::Duration::new(3, 0));

    let mut dapr_server = dapr::server::DaprHttpServer::new().await;

    let query_container_id = match env::var_os("QUERY_NODE_ID") {
        Some(val) => val.into_string().unwrap(),
        None => panic!("QUERY_NODE_ID must be set"),
    };

    let dapr_host = "127.0.0.1";

    let dapr_http_port = match env::var_os("DAPR_HTTP_PORT") {
        Some(val) => val.into_string().unwrap().parse::<u16>().unwrap(),
        None => 3500,
    };

    let pubsub = match env::var_os("PUBSUB") {
        Some(val) => val.into_string().unwrap(),
        None => "drasi-pubsub".to_string(),
    };

    let stream_config = Arc::new(ChangeStreamConfig {
        redis_url: match env::var_os("REDIS_BROKER") {
            Some(val) => val.into_string().unwrap(),
            None => "redis://drasi-redis:6379".to_string(),
        },
        buffer_size: 20,
        fetch_batch_size: 5,
    });

    let index_factory = Arc::new(IndexFactory::new());

    let actor_name = format!("{}.ContinuousQuery", query_container_id);
    let source_client = Arc::new(SourceClient::new(reqwest::Client::new()));
    let publisher = Arc::new(ResultPublisher::new(
        dapr_host.into(),
        dapr_http_port,
        pubsub,
    ));

    let addr = "https://127.0.0.1".to_string();
    let dapr_client = dapr::Client::<dapr::client::TonicClient>::connect(addr)
        .await
        .expect("Unable to connect to Dapr");

    let mut middleware_registry = MiddlewareTypeRegistry::new();
    middleware_registry.register(Arc::new(drasi_middleware::map::MapFactory::new()));
    middleware_registry.register(Arc::new(drasi_middleware::unwind::UnwindFactory::new()));
    middleware_registry.register(Arc::new(
        drasi_middleware::relabel::RelabelMiddlewareFactory::new(),
    ));
    middleware_registry.register(Arc::new(drasi_middleware::decoder::DecoderFactory::new()));
    middleware_registry.register(Arc::new(
        drasi_middleware::parse_json::ParseJsonFactory::new(),
    ));
    middleware_registry.register(Arc::new(
        drasi_middleware::promote::PromoteMiddlewareFactory::new(),
    ));
    middleware_registry.register(Arc::new(drasi_middleware::jq::JQFactory::new()));
    let middleware_registry = Arc::new(middleware_registry);

    dapr_server
        .register_actor(
            ActorTypeRegistration::new::<QueryActor>(
                actor_name.as_str(),
                Box::new(move |_actor_type, id, actor_client| {
                    Arc::new(QueryActor::new(
                        id,
                        &query_container_id,
                        actor_client,
                        dapr_client.clone(),
                        Some(source_client.clone()),
                        Some(stream_config.clone()),
                        Some(publisher.clone()),
                        Some(index_factory.clone()),
                        Some(middleware_registry.clone()),
                    ))
                }),
            )
            .register_method("configure", QueryActor::configure)
            .register_method("getStatus", QueryActor::get_status)
            .register_method("deprovision", QueryActor::deprovision)
            .register_method("reconcile", QueryActor::reconcile),
        )
        .await;

    let mut sigterm = tokio::signal::unix::signal(SignalKind::terminate()).unwrap();
    let mut sigint = tokio::signal::unix::signal(SignalKind::interrupt()).unwrap();

    dapr_server = dapr_server.with_graceful_shutdown(async move {
        select! {
            _ = sigterm.recv() => {
                log::info!("Received SIGTERM");
            }
            _ = sigint.recv() => {
                log::info!("Received SIGINT");
            }
        }
    });

    match dapr_server.start(Some(3000)).await {
        Ok(_) => log::info!("Dapr server exited"),
        Err(e) => log::error!("Dapr server exited with error {:?}", e),
    };

    drop(dapr_server);
    opentelemetry::global::shutdown_tracer_provider();
    meter_provider.shutdown()?;
    tokio::task::yield_now().await; //allow remaining tasks to complete

    Ok(())
}

fn init_tracer() -> Result<(), TraceError> {
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
                "query-host",
            )])),
        )
        .install_batch(opentelemetry_sdk::runtime::Tokio);

    match tracer {
        Ok(tracer) => {
            let filter = filter::Targets::new()
                .with_target("query_host", tracing::Level::DEBUG)
                .with_target("drasi_query_core", tracing::Level::DEBUG)
                .with_target("drasi_query_index", tracing::Level::DEBUG)
                .with_default(LevelFilter::WARN);

            let telemetry = tracing_opentelemetry::layer()
                .with_tracer(tracer)
                .with_exception_fields(true)
                .with_location(true)
                .with_filter(filter);
            let subscriber = Registry::default().with(telemetry);
            tracing::subscriber::set_global_default(subscriber)
                .expect("setting tracing default failed");
            Ok(())
        }
        Err(err) => Err(err),
    }
}

fn init_metrics() -> metrics::Result<MeterProvider> {
    let otel_endpoint =
        env::var("OTEL_ENDPOINT").unwrap_or("http://otel-collector:4317".to_string());

    let export_config = ExportConfig {
        endpoint: otel_endpoint,
        ..ExportConfig::default()
    };
    opentelemetry_otlp::new_pipeline()
        .metrics(opentelemetry_sdk::runtime::Tokio)
        .with_exporter(
            opentelemetry_otlp::new_exporter()
                .tonic()
                .with_export_config(export_config),
        )
        .with_resource(Resource::new(vec![KeyValue::new(
            opentelemetry_semantic_conventions::resource::SERVICE_NAME,
            "query-host",
        )]))
        .with_period(Duration::from_secs(30))
        .build()
}
