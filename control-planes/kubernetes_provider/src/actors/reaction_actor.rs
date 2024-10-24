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

use crate::{
    controller::reconciler::ReconcileStatus, models::RuntimeConfig,
    spec_builder::reaction::ReactionSpecBuilder,
};
use axum::{response::IntoResponse, Json};
use dapr::server::actor::context_client::ActorContextClient;
use dapr_macros::actor;
use resource_provider_api::models::{ReactionSpec, ReactionStatus};
use std::{collections::BTreeMap, marker};
use tokio::sync::RwLock;

use super::ResourceActor;

#[actor]
pub type ReactionActor = ResourceActor<ReactionSpec, ReactionStatus>;

impl ReactionActor {
    pub fn new(
        actor_type: &str,
        id: &str,
        runtime_config: RuntimeConfig,
        dapr_client: ActorContextClient,
        kube_config: kube::Config,
    ) -> Self {
        ResourceActor {
            actor_type: actor_type.to_string(),
            id: id.to_string(),
            dapr_client,
            resource_type: "reaction".to_string(),
            runtime_config,
            spec_builder: Box::new(ReactionSpecBuilder {}),
            controllers: RwLock::new(BTreeMap::new()),
            kube_config,
            _owns_tstatus: marker::PhantomData,
        }
    }

    pub async fn get_status(&self) -> impl IntoResponse {
        let controllers = self.controllers.read().await;
        let available = controllers
            .iter()
            .all(|c| c.1.status() == ReconcileStatus::Online);

        let mut messages = BTreeMap::new();
        for (name, controller) in controllers.iter() {
            match controller.status() {
                ReconcileStatus::Unknown => messages.insert(name.clone(), "Unknown".to_string()),
                ReconcileStatus::Offline(msg) => messages.insert(name.clone(), msg),
                ReconcileStatus::Online => continue,
            };
        }

        Json(ReactionStatus {
            available,
            messages: Some(messages),
        })
    }
}
