use std::env;

use drasi_source_sdk::{
    stream, BootstrapError, BootstrapRequest, BootstrapStream, SourceElement, SourceProxyBuilder,
};
use k8s_openapi::{
    api::{
        apps::v1::{DaemonSet, Deployment, ReplicaSet, StatefulSet},
        batch::v1::Job,
        core::v1::{Node, PersistentVolume, PersistentVolumeClaim, Pod, Service, ServiceAccount},
        networking::v1::Ingress,
    },
    Metadata,
};
use kube::{
    api::ListParams,
    config::{KubeConfigOptions, Kubeconfig},
    Api, Client, Config, ResourceExt,
};
use serde_json::{Map, Value};
use tokio::sync::mpsc::UnboundedSender;

#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
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

    let proxy = SourceProxyBuilder::new()
        .with_stream_producer(my_stream)
        .with_context(kube_client)
        .build();

    proxy.start().await;
}

async fn my_stream(
    kube_client: Client,
    req: BootstrapRequest,
) -> Result<BootstrapStream, BootstrapError> {
    let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<SourceElement>();

    check_resources::<Pod>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<Deployment>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<ReplicaSet>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<StatefulSet>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<DaemonSet>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<Job>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<Service>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<ServiceAccount>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<Node>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<Ingress>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<PersistentVolume>(kube_client.clone(), &req, tx.clone()).await?;
    check_resources::<PersistentVolumeClaim>(kube_client.clone(), &req, tx.clone()).await?;

    let result = stream! {
        while let Some(element) = rx.recv().await {
            yield Ok(element);
        }
    };

    Ok(Box::pin(result))
}

async fn check_resources<K>(
    kube_client: Client,
    req: &BootstrapRequest,
    tx: UnboundedSender<SourceElement>,
) -> Result<(), BootstrapError>
where
    <K as kube::Resource>::DynamicType: Default,
    K: kube::Resource
        + Metadata
        + std::clone::Clone
        + Send
        + Sync
        + for<'de> serde::Deserialize<'de>
        + std::fmt::Debug
        + serde::Serialize
        + 'static,
{
    if req.node_labels.contains(&K::KIND.to_string()) {
        if let Err(e) = tokio::spawn(stream_resources::<K>(kube_client.clone(), tx.clone())).await {
            log::error!("Error streaming {}: {}", K::KIND, e);
            return Err(BootstrapError::InternalError(e.to_string()));
        };
    }
    Ok(())
}

async fn stream_resources<K>(
    kube_client: Client,
    tx: UnboundedSender<SourceElement>,
) -> Result<(), BootstrapError>
where
    <K as kube::Resource>::DynamicType: Default,
    K: kube::Resource
        + Metadata
        + std::clone::Clone
        + Send
        + Sync
        + for<'de> serde::Deserialize<'de>
        + std::fmt::Debug
        + serde::Serialize
        + 'static,
{
    let page_size = 50;
    let api = Api::<K>::all(kube_client.clone());

    let mut items = match api.list(&ListParams::default().limit(page_size)).await {
        Ok(items) => items,
        Err(e) => return Err(BootstrapError::InternalError(e.to_string())),
    };

    loop {
        for p in items.items {
            let id = match p.uid() {
                Some(id) => id,
                None => continue,
            };

            for r in p.owner_references() {
                _ = tx.send(SourceElement::Relation {
                    id: format!("{}-{}", r.uid, id),
                    labels: vec!["OWNS".to_string()],
                    properties: Map::new(),
                    start_id: r.uid.clone(),
                    end_id: id.clone(),
                });
            }

            let properties = match serde_json::to_value(p) {
                Ok(Value::Object(map)) => map,
                _ => continue,
            };

            let label = match properties.get("kind") {
                Some(Value::String(kind)) => kind.clone(),
                _ => {
                    return Err(BootstrapError::InternalError(
                        "Invalid 'kind' from Kubernetes response".to_string(),
                    ))
                }
            };

            _ = tx.send(SourceElement::Node {
                id: id.clone(),
                labels: vec![label.clone()],
                properties,
            });
        }

        match items.metadata.continue_ {
            Some(ct) => {
                items = match api
                    .list(&ListParams::default().continue_token(&ct).limit(page_size))
                    .await
                {
                    Ok(items) => items,
                    Err(e) => return Err(BootstrapError::InternalError(e.to_string())),
                };
            }
            None => break,
        }
    }

    Ok(())
}
