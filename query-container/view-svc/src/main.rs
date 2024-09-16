use std::{env, sync::Arc, time::Duration};

use opentelemetry::{metrics, sdk::Resource, trace::TraceError, KeyValue};
use opentelemetry_otlp::{ExportConfig, WithExportConfig};

use dapr::server::actor::runtime::ActorTypeRegistration;

use models::ChangeStreamConfig;
use opentelemetry_sdk::metrics::MeterProvider;
use tokio::{select, signal::unix::SignalKind};
use tracing_subscriber::{
    filter::{self, LevelFilter},
    prelude::__tracing_subscriber_SubscriberExt,
    Layer, Registry,
};

use crate::view_actor::ViewActor;

mod api;
mod change_stream;
mod models;
mod mongo_view_store;
mod view_actor;
mod view_store;
mod view_store_factory;
mod view_worker;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    log::info!("Starting Drasi View Service");

    _ = init_tracer();
    let meter_provider = init_metrics()?;

    let mut dapr_server = dapr::server::DaprHttpServer::new().await;

    let query_container_id = match env::var_os("QUERY_NODE_ID") {
        Some(val) => val.into_string().unwrap(),
        None => panic!("QUERY_NODE_ID must be set"),
    };

    let stream_config = Arc::new(ChangeStreamConfig {
        redis_url: match env::var_os("REDIS_BROKER") {
            Some(val) => val.into_string().unwrap(),
            None => "redis://drasi-redis:6379".to_string(),
        },
        buffer_size: 20,
        fetch_batch_size: 5,
    });

    let actor_name = format!("{}.View", query_container_id);

    let view_store = view_store_factory::from_env().await?;

    tokio::spawn(api::start_view_service(view_store.clone(), 80));

    dapr_server
        .register_actor(
            ActorTypeRegistration::new::<ViewActor>(
                actor_name.as_str(),
                Box::new(move |_actor_type, id, dapr_client| {
                    Arc::new(ViewActor::new(
                        id.into(),
                        view_store.clone(),
                        dapr_client,
                        stream_config.clone(),
                    ))
                }),
            )
            .register_method("configure", ViewActor::configure)
            .register_method("deprovision", ViewActor::deprovision),
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

    match dapr_server.start(Some(8080)).await {
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
                "view-svc",
            )])),
        )
        .install_batch(opentelemetry_sdk::runtime::Tokio);

    match tracer {
        Ok(tracer) => {
            let filter = filter::Targets::new()
                .with_target("view-svc", tracing::Level::DEBUG)
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
            "view-svc",
        )]))
        .with_period(Duration::from_secs(30))
        .build()
}
