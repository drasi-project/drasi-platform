use std::{sync::Arc, time::{SystemTime, UNIX_EPOCH}};

use drasi_source_sdk::{stream, ChangeOp, ChangeStream, DebugPublisher, MemoryStateStore, ReactivatorBuilder, ReactivatorError, SourceChange, SourceElement, StateStore};
use futures::TryStreamExt;
use k8s_openapi::{api::{apps::v1::{DaemonSet, Deployment, ReplicaSet, StatefulSet}, batch::v1::Job, core::v1::{Node, PersistentVolume, PersistentVolumeClaim, Pod, Service, ServiceAccount, Volume}, discovery::v1::Endpoint, networking::v1::Ingress}, Metadata, NamespaceResourceScope};
use kube::{
    api::{Api, ResourceExt},
    runtime::{watcher, WatchStreamExt},
    Client, Config, Resource,
};
use serde_json::{Map, Value};
use tokio::{sync::mpsc::{UnboundedReceiver, UnboundedSender}, task::JoinHandle};


#[tokio::main]
async fn main() {

    let kube_config = Config::infer().await.unwrap();
    let kube_client = Client::try_from(kube_config.clone()).unwrap();


    let (tx, rx) = tokio::sync::mpsc::unbounded_channel::<SourceChange>();

    _ = spawn_monitor_task::<Ingress>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<ServiceAccount>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<Node>(tx.clone(), kube_client.clone());    
    _ = spawn_monitor_task::<Service>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<Deployment>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<ReplicaSet>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<Pod>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<StatefulSet>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<DaemonSet>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<Job>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<PersistentVolume>(tx.clone(), kube_client.clone());
    _ = spawn_monitor_task::<PersistentVolumeClaim>(tx.clone(), kube_client.clone());

    let reactivator = ReactivatorBuilder::new()
        .with_stream_producer(&my_stream)
        .with_state(rx)
        .with_publisher(DebugPublisher::new())
        .with_state_store(MemoryStateStore::new())
        .with_deprovision_handler(deprovision)
        .build()
        .await;

    reactivator.start().await;
}


async fn my_stream(mut rx: UnboundedReceiver<SourceChange>, _state_store: Arc<dyn StateStore + Send + Sync>) -> Result<ChangeStream, ReactivatorError> {

    let result = stream! {
        while let Some(change) = rx.recv().await {
            yield change;
        }
    };

    Ok(Box::pin(result))
}

async fn deprovision(_state_store: Arc<dyn StateStore + Send + Sync>) {
    log::info!("Deprovisioned");
}


fn spawn_monitor_task<K>(
    tx: UnboundedSender<SourceChange>,
    kube_client: kube::Client,
) -> JoinHandle<()> 
where  
    <K as Resource>::DynamicType: Default,
    K: Resource + Metadata + std::clone::Clone + std::marker::Send + for<'de> serde::Deserialize<'de> + std::fmt::Debug + serde::Serialize + 'static
{
    tokio::spawn(async move {
        //println!("Starting monitor task for {}", K::KIND);
        loop {
            let api = Api::<K>::all(kube_client.clone());
            let cfg = watcher::Config::default();
            
            let watch = watcher(api, cfg)
                .touched_objects()
                .default_backoff()
                .try_for_each(|p| {

                    if p.uid().is_none() {
                        return futures::future::ok(());
                    }

                    let id = p.uid().unwrap().to_string();
                    let op = match p.meta().deletion_timestamp {
                        Some(_) => ChangeOp::Delete,
                        None => ChangeOp::Update,
                    };

                    let owners = p.owner_references().iter().map(|r| {
                        SourceElement::Relation { 
                            id: format!("{}-{}", r.uid, id),
                            labels: vec!["OWNS".to_string()], 
                            properties: Map::new(), 
                            start_id: r.uid.clone(), 
                            end_id: id.clone()
                        }
                    }).collect::<Vec<SourceElement>>();

                    let properties = match serde_json::to_value(p) {
                        Ok(Value::Object(map)) => map,
                        _ => return futures::future::ok(()),
                    };
                    
                    let label = match properties.get("kind") {
                        Some(Value::String(kind)) => kind.clone(),
                        _ => return futures::future::ok(()),
                    };

                    let node = SourceElement::Node {
                        id: id.clone(),
                        labels: vec![label.clone()],
                        properties,
                    };                    

                    let time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() * 1000;
                    match tx.send(SourceChange::new(op, node, time, 0, None)) {
                        Ok(_) => log::info!("sent node change for {} {}", label, id),
                        Err(e) => log::error!("failed to send node change for {} {}: {}", label, id, e),
                    }
                    for owner in owners {
                        match tx.send(SourceChange::new(op, owner, time, 0, None)) {
                            Ok(_) => log::info!("sent relation change for {} {}", label, id),
                            Err(e) => log::error!("failed to send relation change for {} {}: {}", label, id, e),
                        }
                    }
                    futures::future::ok(())
                })
                .await;

            match watch {
                Ok(_) => log::info!("watcher task finished"),
                Err(e) => log::error!("watcher task failed: {}", e),
            };
        }
    })
}