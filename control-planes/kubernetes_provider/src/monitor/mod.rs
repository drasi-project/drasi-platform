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

use std::time::Duration;

use dapr::client::TonicClient;
use futures::TryStreamExt;
use k8s_openapi::api::apps::v1::Deployment;
use kube::{
    api::{Api, ResourceExt},
    runtime::{watcher, WatchStreamExt},
};

use tokio::{
    sync::mpsc::{UnboundedReceiver, UnboundedSender},
    task::JoinHandle,
};

pub fn start_monitor(kube_client: kube::Client, dapr_client: dapr::Client<TonicClient>) {
    let (tx, rx) = tokio::sync::mpsc::unbounded_channel::<(String, String)>();

    _ = spawn_handler_task(rx, dapr_client);
    _ = spawn_montitor_task(tx, kube_client);
}

fn spawn_handler_task(
    mut rx: UnboundedReceiver<(String, String)>,
    mut dapr_client: dapr::Client<TonicClient>,
) -> JoinHandle<()> {
    tokio::spawn(async move {
        while let Some(evt) = rx.recv().await {
            let _: () = match dapr_client
                .invoke_actor(evt.0, evt.1, "reconcile", (), None)
                .await
            {
                Ok(r) => r,
                Err(e) => {
                    log::error!("error invoking actor: {}", e);
                }
            };
        }
    })
}

fn spawn_montitor_task(
    tx: UnboundedSender<(String, String)>,
    kube_client: kube::Client,
) -> JoinHandle<()> {
    tokio::spawn(async move {
        loop {
            // give actor server a chance to start first
            tokio::time::sleep(Duration::from_secs(5)).await;
            log::info!("starting watcher task");
            let api = Api::<Deployment>::default_namespaced(kube_client.clone());
            let cfg = watcher::Config::default()
                .labels("drasi/type in (source, querycontainer,reaction)");
            let watch = watcher(api, cfg)
                .touched_objects()
                .try_for_each(|p| {
                    let resource_id = p.labels().get("drasi/resource").unwrap();
                    let resource_type = p.labels().get("drasi/type").unwrap();

                    let actor_type = match resource_type.as_str() {
                        "source" => "SourceResource",
                        "querycontainer" => "QueryContainerResource",
                        "reaction" => "ReactionResource",
                        _ => "",
                    };

                    _ = tx.send((actor_type.to_string(), resource_id.to_string()));

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
