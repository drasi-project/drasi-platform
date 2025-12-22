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

use async_trait::async_trait;
use axum::{response::IntoResponse, Json};
use std::{sync::Arc, time::Duration};
use tokio::sync::RwLock;

use dapr::{
    actor,
    server::{
        actor::{
            context_client::{ActorContextClient, ActorStateOperation},
            Actor, ActorError,
        },
        utils::DaprJson,
    },
};

use crate::{
    api::ViewSpec,
    models::{ChangeStreamConfig, ViewError},
    view_store::ViewStore,
    view_worker::{ShutdownReason, ViewWorker, WorkerState},
};

#[actor]
pub struct ViewActor {
    query_id: Arc<str>,
    store: Arc<dyn ViewStore>,
    dapr_client: ActorContextClient,
    stream_config: Arc<ChangeStreamConfig>,
    config: OptionalValue<ViewSpec>,
    worker: OptionalValue<Arc<ViewWorker>>,
}

#[async_trait]
impl Actor for ViewActor {
    #[tracing::instrument(skip_all, fields(query_id=self.query_id.as_ref()), err)]
    async fn on_activate(&self) -> Result<(), ActorError> {
        log::info!("View activated {}", &self.query_id);
        if self.read_config().await? {
            self.init_worker().await?;
        }

        Ok(())
    }

    #[tracing::instrument(skip_all, fields(query_id=self.query_id.as_ref()), err)]
    async fn on_deactivate(&self) -> Result<(), ActorError> {
        log::info!("View deactivated {}", &self.query_id);
        if let Some(w) = self.worker.take().await {
            w.shutdown().await;
        }

        Ok(())
    }

    async fn on_reminder(&self, _reminder_name: &str, _data: Vec<u8>) -> Result<(), ActorError> {
        log::info!("View reminder {}", &self.query_id);

        //perform housing keeping based on worker state
        if let Some(worker) = self.worker.get().await {
            match worker.state() {
                WorkerState::Running => {
                    log::info!("View worker running {}", &self.query_id);
                    Ok(())
                }
                WorkerState::Shutdown(reason) => {
                    log::info!("View worker shutdown {}", &self.query_id);
                    match reason {
                        ShutdownReason::Error => {
                            log::info!("View worker error {}", &self.query_id);
                            log::info!("Restarting worker");
                            self.init_worker().await?;
                            Ok(())
                        }
                        ShutdownReason::Deactivated => {
                            log::info!("View worker deactivated {}", &self.query_id);
                            Ok(())
                        }
                    }
                }
            }
        } else {
            log::info!("View worker not running {}", &self.query_id);
            Ok(())
        }
    }

    async fn on_timer(&self, _timer_name: &str, _data: Vec<u8>) -> Result<(), ActorError> {
        Ok(())
    }
}

impl ViewActor {
    pub fn new(
        query_id: Arc<str>,
        store: Arc<dyn ViewStore>,
        dapr_client: ActorContextClient,
        stream_config: Arc<ChangeStreamConfig>,
    ) -> Self {
        Self {
            query_id,
            store,
            dapr_client,
            stream_config,
            config: OptionalValue::new(),
            worker: OptionalValue::new(),
        }
    }

    pub async fn configure(&self, DaprJson(spec): DaprJson<ViewSpec>) -> impl IntoResponse {
        log::info!("{} configure", &self.query_id);
        if let Err(err) = self.write_config(spec).await {
            log::error!("Error writing config: {err}");
            return (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Error writing config",
            )
                .into_response();
        };

        if let Err(err) = self.register_reminder().await {
            log::error!("Error registering reminder: {err}");
            return (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Error registering reminder",
            )
                .into_response();
        }

        if let Err(err) = self.init_worker().await {
            log::error!("Error initializing worker: {err}");
            return (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Error initializing worker",
            )
                .into_response();
        }

        Json(()).into_response()
    }

    pub async fn deprovision(&self) -> impl IntoResponse {
        log::info!("{} deprovision", &self.query_id);
        if let Err(err) = self.unregister_reminder().await {
            log::error!("Error unregistering reminder: {err}");
            return (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Error unregistering reminder",
            )
                .into_response();
        }

        if let Some(w) = self.worker.take().await {
            w.shutdown().await;
        }

        if let Err(err) = self.store.delete_view(&self.query_id).await {
            log::error!("Error deleting view: {err}");
            return (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Error deleting view",
            )
                .into_response();
        }

        Json(()).into_response()
    }

    async fn init_worker(&self) -> Result<(), ActorError> {
        let config = match self.config.get().await {
            Some(c) => c,
            None => {
                log::error!("{} not configured", &self.query_id);
                return Err(ActorError::MethodError(Box::new(ViewError::Other(
                    "Missing config".into(),
                ))));
            }
        };

        if let Some(w) = &self.worker.get().await {
            if !w.is_finished() {
                w.reconfigure(config);
                log::info!("{} worker reconfigured", &self.query_id);
                return Ok(());
            }
        }

        let worker = Arc::new(ViewWorker::start(
            self.query_id.clone(),
            config.clone(),
            self.stream_config.clone(),
            self.store.clone(),
        ));

        self.worker.set(worker.clone()).await;

        Ok(())
    }

    async fn read_config(&self) -> Result<bool, ActorError> {
        let mut client = self.dapr_client.clone();
        match client.get_actor_state("config").await {
            Ok(state) => {
                if !state.data.is_empty() {
                    match serde_json::from_slice::<ViewSpec>(&state.data) {
                        Ok(config) => {
                            self.config.set(config).await;
                            Ok(true)
                        }
                        Err(e) => {
                            log::error!("Error deserializing config: {e}");
                            Err(ActorError::SerializationError())
                        }
                    }
                } else {
                    log::info!("No config found");
                    Ok(false)
                }
            }
            Err(e) => {
                log::error!("Error reading config: {e}");
                Err(ActorError::CorruptedState)
            }
        }
    }

    async fn write_config(&self, config: ViewSpec) -> Result<(), ActorError> {
        self.config.set(config.clone()).await;
        let mut ops = Vec::new();

        ops.push(ActorStateOperation::Upsert {
            key: "config".to_string(),
            value: Some(match serde_json::to_vec(&config) {
                Ok(s) => s,
                Err(e) => {
                    log::error!("Error serializing config: {e}");
                    return Err(ActorError::SerializationError());
                }
            }),
        });
        let mut client = self.dapr_client.clone();
        let result = client.execute_actor_state_transaction(ops).await;

        match result {
            Ok(_) => Ok(()),
            Err(e) => {
                log::error!("Error persisting config: {e}");
                Err(ActorError::CorruptedState)
            }
        }
    }

    async fn register_reminder(&self) -> Result<(), ActorError> {
        let mut client = self.dapr_client.clone();
        match client
            .register_actor_reminder(
                "ping",
                Some(Duration::from_secs(10)),
                Some(Duration::from_secs(30)),
                vec![],
                None,
            )
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                log::error!("Error registering reminder: {e}");
                Err(ActorError::MethodError(Box::new(e)))
            }
        }
    }

    async fn unregister_reminder(&self) -> Result<(), ActorError> {
        let mut client = self.dapr_client.clone();
        match client.unregister_actor_reminder("ping").await {
            Ok(_) => Ok(()),
            Err(e) => {
                log::error!("Error unregistering reminder: {e}");
                Err(ActorError::MethodError(Box::new(e)))
            }
        }
    }
}

struct OptionalValue<T>
where
    T: Clone + Send + Sync,
{
    value: Arc<RwLock<Option<T>>>,
}

impl<T> OptionalValue<T>
where
    T: Clone + Send + Sync,
{
    fn new() -> Self {
        Self {
            value: Arc::new(RwLock::new(None)),
        }
    }

    async fn set(&self, value: T) {
        let mut lock = self.value.write().await;
        lock.replace(value);
    }

    async fn get(&self) -> Option<T> {
        let lock = self.value.read().await;
        lock.clone()
    }

    async fn take(&self) -> Option<T> {
        let mut lock = self.value.write().await;
        lock.take()
    }
}
