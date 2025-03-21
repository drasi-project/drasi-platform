use std::{
    env,
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

use drasi_source_sdk::{
    stream, ChangeOp, ChangeStream, ReactivatorBuilder, ReactivatorError, SourceChange,
    SourceElement, StateStore,
};
use futures::TryStreamExt;
use k8s_openapi::{
    api::{
        apps::v1::{DaemonSet, Deployment, ReplicaSet, StatefulSet},
        batch::v1::Job,
        core::v1::{Node, PersistentVolume, PersistentVolumeClaim, Pod, Service, ServiceAccount},
        networking::v1::Ingress,
    },
    Metadata, Resource,
};
use kube::{
    api::{Api, ResourceExt, WatchParams},
    config::{KubeConfigOptions, Kubeconfig},
    runtime::WatchStreamExt,
    Client, Config,
};
use serde_json::{Map, Value};
use tokio::{pin, sync::mpsc::Sender, task::JoinHandle};

#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    let reactivator = ReactivatorBuilder::new()
        .with_stream_producer(my_stream)
        .with_deprovision_handler(deprovision)
        .without_context()
        .build()
        .await;

    reactivator.start().await;
}

async fn my_stream(
    _context: (),
    state_store: Arc<dyn StateStore + Send + Sync>,
) -> Result<ChangeStream, ReactivatorError> {
    let kube_config = {
        match env::var("kubeConfig") {
            Ok(config) => {
                let kc = Kubeconfig::from_yaml(&config).unwrap();
                Config::from_custom_kubeconfig(kc, &KubeConfigOptions::default())
                    .await
                    .unwrap()
            }
            Err(_) => Config::infer().await.unwrap(),
        }
    };
    let kube_client = Client::try_from(kube_config.clone()).unwrap();

    let (tx, mut rx) = tokio::sync::mpsc::channel::<SourceChange>(1);

    _ = spawn_monitor_task::<Pod>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<Deployment>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<Ingress>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<ServiceAccount>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<Node>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<Service>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<ReplicaSet>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<StatefulSet>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<DaemonSet>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<Job>(tx.clone(), kube_client.clone(), state_store.clone());
    _ = spawn_monitor_task::<PersistentVolume>(
        tx.clone(),
        kube_client.clone(),
        state_store.clone(),
    );
    _ = spawn_monitor_task::<PersistentVolumeClaim>(
        tx.clone(),
        kube_client.clone(),
        state_store.clone(),
    );

    let result = stream! {
        while let Some(change) = rx.recv().await {
            yield change;
        }
    };

    Ok(Box::pin(result))
}

async fn deprovision(state_store: Arc<dyn StateStore + Send + Sync>) {
    log::info!("Deprovisioning source");

    _ = state_store.delete(Pod::KIND).await;
    _ = state_store.delete(Deployment::KIND).await;
    _ = state_store.delete(ReplicaSet::KIND).await;
    _ = state_store.delete(StatefulSet::KIND).await;
    _ = state_store.delete(DaemonSet::KIND).await;
    _ = state_store.delete(Job::KIND).await;
    _ = state_store.delete(Service::KIND).await;
    _ = state_store.delete(ServiceAccount::KIND).await;
    _ = state_store.delete(Node::KIND).await;
    _ = state_store.delete(Ingress::KIND).await;
    _ = state_store.delete(PersistentVolume::KIND).await;
    _ = state_store.delete(PersistentVolumeClaim::KIND).await;
}

fn spawn_monitor_task<K>(
    tx: Sender<SourceChange>,
    kube_client: kube::Client,
    state_store: Arc<dyn StateStore + Send + Sync>,
) -> JoinHandle<()>
where
    <K as kube::Resource>::DynamicType: Default,
    K: kube::Resource
        + Metadata
        + std::clone::Clone
        + std::marker::Send
        + for<'de> serde::Deserialize<'de>
        + std::fmt::Debug
        + serde::Serialize
        + 'static,
{
    tokio::spawn(async move {
        let err_backoff_secs = 30;
        let mut cursor = match state_store.get(K::KIND).await {
            Ok(Some(data)) => match String::from_utf8(data) {
                Ok(s) => s,
                Err(e) => {
                    log::error!("failed to parse cursor for {}: {}", K::KIND, e);
                    "0".to_string()
                }
            },
            Ok(None) => "0".to_string(),
            Err(err) => {
                log::error!("failed to get cursor for {}: {}", K::KIND, err);
                "0".to_string()
            }
        };

        loop {
            let api = Api::<K>::all(kube_client.clone());
            let wp = WatchParams::default();

            log::info!("starting watch for {} at {}", K::KIND, cursor);

            let stream = match api.watch(&wp, &cursor).await {
                Ok(w) => w,
                Err(e) => {
                    log::error!("failed to start watch for {}: {}", K::KIND, e);
                    tokio::time::sleep(tokio::time::Duration::from_secs(err_backoff_secs)).await;
                    continue;
                }
            };

            let stream = stream.default_backoff();
            pin!(stream);

            loop {
                let (op, p) = match stream.try_next().await {
                    Ok(o) => match o {
                        Some(wevt) => match wevt {
                            kube::api::WatchEvent::Added(o) => (ChangeOp::Create, o),
                            kube::api::WatchEvent::Modified(o) => (ChangeOp::Update, o),
                            kube::api::WatchEvent::Deleted(o) => (ChangeOp::Delete, o),
                            kube::api::WatchEvent::Bookmark(bookmark) => {
                                log::info!(
                                    "received bookmark {} for {}",
                                    bookmark.metadata.resource_version,
                                    K::KIND
                                );
                                cursor = bookmark.metadata.resource_version.clone();
                                if let Err(err) = state_store
                                    .put(K::KIND, cursor.to_string().as_bytes().to_vec())
                                    .await
                                {
                                    log::error!("failed to store cursor for {}: {}", K::KIND, err);
                                }
                                continue;
                            }
                            kube::api::WatchEvent::Error(error_response) => {
                                match error_response.code {
                                    410 => {
                                        log::warn!("resource version expired, resetting cursor");
                                        cursor = "0".to_string();
                                        break;
                                    }
                                    _ => {
                                        log::error!(
                                            "received error response for {}: {:?}",
                                            K::KIND,
                                            error_response
                                        );
                                        tokio::time::sleep(tokio::time::Duration::from_secs(
                                            err_backoff_secs,
                                        ))
                                        .await;
                                        break;
                                    }
                                }
                            }
                        },
                        None => {
                            log::info!("watch stream ended");
                            break;
                        }
                    },
                    Err(e) => {
                        log::error!("watch stream error: {}", e);
                        tokio::time::sleep(tokio::time::Duration::from_secs(err_backoff_secs))
                            .await;
                        break;
                    }
                };

                let reactivator_start_ns = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .expect("Time went backwards")
                    .as_nanos();

                if let Some(rver) = p.resource_version() {
                    log::info!("received watch event for {} {:?} {}", K::KIND, op, rver);
                    cursor = rver.clone();
                }

                let id = match p.uid() {
                    Some(uid) => uid,
                    None => continue,
                };

                let owners = p
                    .owner_references()
                    .iter()
                    .map(|r| SourceElement::Relation {
                        id: format!("{}-{}", r.uid, id),
                        labels: vec!["OWNS".to_string()],
                        properties: Map::new(),
                        start_id: r.uid.clone(),
                        end_id: id.clone(),
                    })
                    .collect::<Vec<SourceElement>>();

                let properties = match serde_json::to_value(p) {
                    Ok(Value::Object(map)) => map,
                    _ => continue,
                };

                let label = match properties.get("kind") {
                    Some(Value::String(kind)) => kind.clone(),
                    _ => continue,
                };

                let node = SourceElement::Node {
                    id: id.clone(),
                    labels: vec![label.clone()],
                    properties,
                };

                // Since we do not have a timestamp for the source change, we will use the reactivator start time
                // as the timestamp for the source change
                match tx.send(SourceChange::new(op, node,reactivator_start_ns,  reactivator_start_ns,0, None)).await {
                    Ok(_) => log::info!("sent node change for {} {}", label, id),
                    Err(e) => log::error!("failed to send node change for {} {}: {}", label, id, e),
                }
                for owner in owners {
                    match tx.send(SourceChange::new(op, owner,reactivator_start_ns, reactivator_start_ns, 0, None)).await {
                        Ok(_) => log::info!("sent relation change for {} {}", label, id),
                        Err(e) => log::error!(
                            "failed to send relation change for {} {}: {}",
                            label,
                            id,
                            e
                        ),
                    }
                }
            }
        }
    })
}
