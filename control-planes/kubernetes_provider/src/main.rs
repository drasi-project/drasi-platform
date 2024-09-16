use std::sync::Arc;

use dapr::server::actor::runtime::ActorTypeRegistration;
use kube::{Client, Config};
use once_cell::sync::Lazy;

use crate::{
    actors::{
        querycontainer_actor::QueryContainerActor, reaction_actor::ReactionActor,
        source_actor::SourceActor,
    },
    models::RuntimeConfig,
};

pub mod actors;
pub mod controller;
pub mod models;
pub mod monitor;
pub mod spec_builder;

const VERSION: i32 = 16;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Kubernetes Provider version {}", VERSION);

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Introduce delay so that dapr grpc port is assigned before app tries to connect
    std::thread::sleep(std::time::Duration::new(3, 0));

    let mut dapr_server = dapr::server::DaprHttpServer::new().await;
    static RUNTIME_CONFIG: Lazy<RuntimeConfig> = Lazy::new(|| RuntimeConfig::default());

    let kube_config = Config::infer().await?;

    let cpus = std::thread::available_parallelism().unwrap();
    log::info!("available cpus: {}", cpus);

    //test kubernetes connection
    let kube_client = Client::try_from(kube_config.clone())?;
    let kube_ver = kube_client.apiserver_version().await?;
    log::info!("kubernetes version: {:?}", kube_ver);

    // let dapr_port: u16 = std::env::var("DAPR_GRPC_PORT").unwrap().parse().unwrap();
    // let dapr_addr = format!("https://127.0.0.1:{}", dapr_port);
    // Introduce delay so that dapr grpc port is assigned before app tries to connect
    std::thread::sleep(std::time::Duration::new(3, 0));

    let addr = "https://127.0.0.1".to_string();
    let mut dapr_client = dapr::Client::<dapr::client::TonicClient>::connect(addr)
        .await
        .expect("Unable to connect to Dapr");

    monitor::start_monitor(kube_client, dapr_client);

    let source_kube_config = kube_config.clone();
    dapr_server
        .register_actor(
            ActorTypeRegistration::new::<SourceActor>(
                "SourceResource",
                Box::new(move |actor_type, id, dapr_client| {
                    Arc::new(SourceActor::new(
                        actor_type,
                        id,
                        RUNTIME_CONFIG.clone(),
                        dapr_client,
                        source_kube_config.clone(),
                    ))
                }),
            )
            .register_method("configure", SourceActor::configure)
            .register_method("getStatus", SourceActor::get_status)
            .register_method("deprovision", SourceActor::deprovision)
            .register_method("reconcile", SourceActor::reconcile),
        )
        .await;

    let qc_kube_config = kube_config.clone();
    dapr_server
        .register_actor(
            ActorTypeRegistration::new::<QueryContainerActor>(
                "QueryContainerResource",
                Box::new(move |actor_type, id, dapr_client| {
                    Arc::new(QueryContainerActor::new(
                        actor_type,
                        id,
                        RUNTIME_CONFIG.clone(),
                        dapr_client,
                        qc_kube_config.clone(),
                    ))
                }),
            )
            .register_method("configure", QueryContainerActor::configure)
            .register_method("getStatus", QueryContainerActor::get_status)
            .register_method("deprovision", QueryContainerActor::deprovision)
            .register_method("reconcile", QueryContainerActor::reconcile),
        )
        .await;

    let reaction_kube_config = kube_config.clone();
    dapr_server
        .register_actor(
            ActorTypeRegistration::new::<ReactionActor>(
                "ReactionResource",
                Box::new(move |actor_type, id, dapr_client| {
                    Arc::new(ReactionActor::new(
                        actor_type,
                        id,
                        RUNTIME_CONFIG.clone(),
                        dapr_client,
                        reaction_kube_config.clone(),
                    ))
                }),
            )
            .register_method("configure", ReactionActor::configure)
            .register_method("getStatus", ReactionActor::get_status)
            .register_method("deprovision", ReactionActor::deprovision)
            .register_method("reconcile", ReactionActor::reconcile),
        )
        .await;

    dapr_server.start(None).await?;

    Ok(())
}
