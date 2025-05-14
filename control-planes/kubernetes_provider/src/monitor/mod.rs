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

use std::{
    collections::{HashMap, HashSet},
    time::Duration,
};

use dapr::client::TonicClient;
use futures::TryStreamExt;
use k8s_openapi::api::core::v1::Pod;
use kube::{
    api::{Api, ResourceExt},
    runtime::{watcher, WatchStreamExt},
};

use tokio::{
    select,
    sync::mpsc::{UnboundedReceiver, UnboundedSender},
    task::JoinHandle,
};

use crate::models::ResourceType;

pub fn start_monitor(kube_client: kube::Client, dapr_client: dapr::Client<TonicClient>) {
    let (tx, rx) = tokio::sync::mpsc::unbounded_channel::<(String, String)>();

    _ = spawn_handler_task(rx, dapr_client);
    _ = spawn_monitor_task(tx, kube_client);
}

fn spawn_handler_task(
    mut rx: UnboundedReceiver<(String, String)>,
    mut dapr_client: dapr::Client<TonicClient>,
) -> JoinHandle<()> {
    tokio::spawn(async move {
        let mut debounce_set: HashSet<(String, String)> = HashSet::new();
        let mut last_debounce = std::time::Instant::now();
        loop {
            if last_debounce.elapsed() > Duration::from_millis(1500) {
                for (actor_type, resource_id) in debounce_set.drain() {
                    let _: () = match dapr_client
                        .invoke_actor(
                            actor_type.clone(),
                            resource_id.clone(),
                            "reconcile",
                            (),
                            None,
                        )
                        .await
                    {
                        Ok(r) => r,
                        Err(e) => log::error!("Failed to invoke actor: {}", e),
                    };
                }
                last_debounce = std::time::Instant::now();
            }

            select! {
                _ = tokio::time::sleep(Duration::from_millis(500)) => continue,
                evt = rx.recv() => {
                    match evt {
                        Some(evt) => {
                            if debounce_set.contains(&(evt.0.clone(), evt.1.clone())) {
                                log::info!("debounce reconcile: {} {}", evt.0, evt.1);
                                continue;
                            }
                            let _: () = match dapr_client
                                .invoke_actor(evt.0.clone(), evt.1.clone(), "reconcile", (), None)
                                .await {
                                    Ok(r) => r,
                                    Err(e) => log::error!("Failed to invoke actor: {}", e),
                                };
                            debounce_set.insert((evt.0, evt.1));
                        }
                        None => {
                            log::info!("channel closed");
                            break;
                        }
                    }
                }
            }
        }
    })
}

fn spawn_monitor_task(
    tx: UnboundedSender<(String, String)>,
    kube_client: kube::Client,
) -> JoinHandle<()> {
    tokio::spawn(async move {
        loop {
            // give actor server a chance to start first
            tokio::time::sleep(Duration::from_secs(5)).await;
            log::info!("starting watcher task");
            let api = Api::<Pod>::default_namespaced(kube_client.clone());
            let cfg = watcher::Config::default().labels(
                format!(
                    "drasi/type in ({},{},{})",
                    ResourceType::Source,
                    ResourceType::QueryContainer,
                    ResourceType::Reaction
                )
                .as_str(),
            );
            let watch = watcher(api, cfg)
                .touched_objects()
                .try_for_each(|p| {
                    let empty_str: String = "".to_string();
                    let resource_id = p.labels().get("drasi/resource").unwrap_or(&empty_str);
                    let resource_type = p.labels().get("drasi/type").unwrap_or(&empty_str);
                    if let Some(resource_type) = ResourceType::parse(resource_type) {
                        let actor_type = match resource_type {
                            ResourceType::Source => "SourceResource",
                            ResourceType::QueryContainer => "QueryContainerResource",
                            ResourceType::Reaction => "ReactionResource",
                        };

                        _ = tx.send((actor_type.to_string(), resource_id.to_string()));
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
