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

use std::{sync::Arc, time::Duration};

use crate::{
    api::{QueryRequest, QuerySpec, QueryStatus},
    index_factory::IndexFactory,
    models::{ChangeStreamConfig, QueryError, QueryLifecycle, QueryState},
    query_worker::QueryWorker,
    result_publisher::ResultPublisher,
    source_client::SourceClient,
};
use async_trait::async_trait;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Json};
use dapr::client::TonicClient;
use dapr::server::{
    actor::{
        context_client::{ActorContextClient, ActorStateOperation},
        Actor, ActorError,
    },
    utils::DaprJson,
};
use dapr_macros::actor;
use drasi_core::middleware::MiddlewareTypeRegistry;
use gethostname::gethostname;
use tokio::sync::RwLock;
use tokio::task::{self, JoinHandle};

#[actor]
pub struct QueryActor {
    query_id: Arc<str>,
    query_container_id: Arc<str>,
    lifecycle: Arc<QueryLifecycle>,
    config: OptionalValue<QuerySpec>,
    actor_client: ActorContextClient,
    dapr_client: dapr::Client<TonicClient>,
    source_client: Arc<SourceClient>,
    stream_config: Arc<ChangeStreamConfig>,
    publisher: Arc<ResultPublisher>,
    index_factory: Arc<IndexFactory>,
    middleware_registry: Arc<MiddlewareTypeRegistry>,
    worker: OptionalValue<Arc<QueryWorker>>,
    status_watcher: OptionalValue<Arc<JoinHandle<()>>>,
}

#[async_trait]
impl Actor for QueryActor {
    #[tracing::instrument(skip_all, fields(query_id=self.query_id.as_ref()), err)]
    async fn on_activate(&self) -> Result<(), ActorError> {
        log::info!("Query activated {}", self.query_id);
        self.read_state().await?;
        log::info!(
            "Query {} state: {:?}",
            self.query_id,
            self.lifecycle.get_state()
        );

        let mut on_change = self.lifecycle.on_change();
        let mut actor_client = self.actor_client.clone();
        let qid = self.query_id.clone();
        let status_watcher = task::spawn(async move {
            loop {
                match on_change.changed().await {
                    Ok(_) => {
                        let state = on_change.borrow().clone();
                        let res = actor_client
                            .execute_actor_state_transaction(vec![ActorStateOperation::Upsert {
                                key: "status".to_string(),
                                value: Some(match serde_json::to_vec(&state) {
                                    Ok(s) => s,
                                    Err(e) => {
                                        log::error!(
                                            "Query {} Error serializing status: {}",
                                            qid,
                                            e
                                        );
                                        continue;
                                    }
                                }),
                            }])
                            .await;
                        match res {
                            Ok(_) => log::info!("Query {} Status updated to {}", qid, state),
                            Err(e) => log::error!("Query {} Error updating status: {}", qid, e),
                        }
                    }
                    Err(e) => {
                        log::info!("status watcher closed - {}", e);
                        break;
                    }
                }
            }
        });

        self.status_watcher.set(Arc::new(status_watcher)).await;

        match self.lifecycle.get_state() {
            QueryState::Configured | QueryState::Running => {
                if let Err(err) = self.init_worker().await {
                    log::error!(
                        "Query {} failed to initialize worker - {}",
                        self.query_id,
                        err
                    );
                }
            }
            QueryState::Bootstrapping => {
                //todo: purge index
                if let Err(err) = self.init_worker().await {
                    log::error!(
                        "Query {} failed to initialize worker - {}",
                        self.query_id,
                        err
                    );
                }
            }
            QueryState::TerminalError(err) => {
                log::warn!(
                    "Query {} in terminal state on activation - {}",
                    self.query_id,
                    err
                );
                _ = self.unregister_reminder().await;
            }
            _ => {}
        }

        Ok(())
    }

    #[tracing::instrument(skip_all, fields(query_id=self.query_id.as_ref()), err)]
    async fn on_deactivate(&self) -> Result<(), ActorError> {
        log::info!("Query deactivated {}", self.query_id);

        let transient = self.config.get().await.map_or(false, |c| c.transient.is_some_and(|f| f));
        if let Some(w) = self.worker.take().await {
            if transient {
                w.delete();
                w.shutdown();
                self.worker.clear().await;
                _ = self.unregister_reminder().await;
                self.config.clear().await;
                self.lifecycle.change_state(QueryState::Deleted);
                _ = self.persist_config().await;
            } else {
                w.shutdown_async().await;
            }            
        }

        if let Some(w) = self.status_watcher.take().await {
            w.abort();
        }

        Ok(())
    }

    async fn on_reminder(&self, _reminder_name: &str, _data: Vec<u8>) -> Result<(), ActorError> {
        log::info!("Query reminder {}", self.query_id);
        if let QueryState::TransientError(err) = self.lifecycle.get_state() {
            log::info!(
                "Query {} in transient error state on reminder - {}",
                self.query_id,
                err
            );
            self.init_worker().await?;
        }
        Ok(())
    }

    async fn on_timer(&self, _timer_name: &str, _data: Vec<u8>) -> Result<(), ActorError> {
        Ok(())
    }
}

#[allow(clippy::too_many_arguments)]
impl QueryActor {
    pub fn new(
        query_id: &str,
        query_container_id: &str,
        actor_client: ActorContextClient,
        dapr_client: dapr::Client<TonicClient>,
        source_client: Arc<SourceClient>,
        stream_config: Arc<ChangeStreamConfig>,
        publisher: Arc<ResultPublisher>,
        index_factory: Arc<IndexFactory>,
        middleware_registry: Arc<MiddlewareTypeRegistry>,
    ) -> Self {
        Self {
            query_id: query_id.into(),
            query_container_id: query_container_id.into(),
            lifecycle: Arc::new(QueryLifecycle::new(QueryState::New)),
            config: OptionalValue::new(),
            actor_client,
            dapr_client,
            source_client,
            stream_config,
            publisher,
            index_factory,
            middleware_registry,
            worker: OptionalValue::new(),
            status_watcher: OptionalValue::new(),
        }
    }

    pub async fn configure(&self, DaprJson(spec): DaprJson<QueryRequest>) -> impl IntoResponse {
        log::info!("Query configure - {}", self.query_id);
        let config = self.config.get().await;

        if config.is_some() {
            log::error!("Query {} already configured", self.query_id);
            return (StatusCode::CONFLICT, "Query already configured").into_response();
        }

        //todo: validation
        self.config.set(spec.spec).await;

        self.lifecycle.change_state(QueryState::Configured);
        match self.persist_config().await {
            Ok(_) => {}
            Err(e) => {
                log::error!("Query {} Error persisting state: {}", self.query_id, e);
                return (StatusCode::INTERNAL_SERVER_ERROR, "Error persisting state")
                    .into_response();
            }
        };

        match self.register_reminder().await {
            Ok(_) => {}
            Err(e) => {
                log::error!("Query {} Error registering reminder: {}", self.query_id, e);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error registering reminder",
                )
                    .into_response();
            }
        };

        match self.init_worker().await {
            Ok(_) => {}
            Err(e) => {
                log::error!("Query {} Error initializing worker: {}", self.query_id, e);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error initializing worker",
                )
                    .into_response();
            }
        };

        log::info!("Query {} configured", self.query_id);

        Json(()).into_response()
    }

    pub async fn reconcile(&self) -> impl IntoResponse {
        log::info!("Query reconcile - {}", self.query_id);
        Json(())
    }

    pub async fn get_status(&self) -> Json<QueryStatus> {
        log::info!("Query get status - {}", self.query_id);

        Json(QueryStatus {
            host_name: gethostname().to_str().unwrap_or_default().to_string(),
            status: self.lifecycle.get_state().to_string(),
            container: self.query_container_id.to_string(),
            error_message: self.lifecycle.get_error().unwrap_or_default(),
        })
    }

    pub async fn deprovision(&self) -> impl IntoResponse {
        log::info!("Actor deprovision - {}", self.query_id);
        if let Some(w) = &self.worker.get().await {
            w.delete();
            w.shutdown();
            self.worker.clear().await;
        }
        if let Err(e) = self.unregister_reminder().await {
            log::error!(
                "Query {} Error unregistering reminder: {}",
                self.query_id,
                e
            );
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error unregistering reminder",
            )
                .into_response();
        }

        self.config.clear().await;
        self.lifecycle.change_state(QueryState::Deleted);
        if let Err(e) = self.persist_config().await {
            log::error!("Query {} Error persisting state: {}", self.query_id, e);
            return (StatusCode::INTERNAL_SERVER_ERROR, "Error persisting state").into_response();
        }

        Json(()).into_response()
    }

    async fn init_worker(&self) -> Result<(), ActorError> {
        if let Some(w) = &self.worker.get().await {
            if !w.is_finished() {
                log::error!("Query {} worker already running", self.query_id);
                return Err(ActorError::MethodError(Box::new(QueryError::Other(
                    "Query worker already running".into(),
                ))));
            }
        }

        let config = match self.config.get().await {
            Some(c) => c,
            None => {
                log::error!("Query {} not configured", self.query_id);
                self.lifecycle
                    .change_state(QueryState::TerminalError("Not configured".into()));
                return Err(ActorError::MethodError(Box::new(QueryError::Other(
                    "Missing config".into(),
                ))));
            }
        };

        let worker = QueryWorker::start(
            self.query_container_id.clone(),
            self.query_id.clone(),
            config,
            self.lifecycle.clone(),
            self.source_client.clone(),
            self.stream_config.clone(),
            self.publisher.clone(),
            self.index_factory.clone(),
            self.middleware_registry.clone(),
            self.dapr_client.clone(),
        );
        self.worker.set(Arc::new(worker)).await;

        log::info!("Query {} worker started", self.query_id);

        Ok(())
    }

    async fn register_reminder(&self) -> Result<(), ActorError> {
        let mut client = self.actor_client.clone();
        match client
            .register_actor_reminder(
                "ping",
                Some(Duration::from_secs(10)),
                Some(Duration::from_secs(60)),
                vec![],
                None,
            )
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                log::error!("Error registering reminder: {}", e);
                Err(ActorError::MethodError(Box::new(e)))
            }
        }
    }

    async fn unregister_reminder(&self) -> Result<(), ActorError> {
        let mut client = self.actor_client.clone();
        match client.unregister_actor_reminder("ping").await {
            Ok(_) => Ok(()),
            Err(e) => {
                log::error!("Error unregistering reminder: {}", e);
                Err(ActorError::MethodError(Box::new(e)))
            }
        }
    }

    async fn persist_config(&self) -> Result<(), ActorError> {
        let mut ops = Vec::new();
        let config_value = self.config.get().await;
        ops.push(ActorStateOperation::Upsert {
            key: "config".to_string(),
            value: Some(match serde_json::to_vec(&config_value) {
                Ok(s) => s,
                Err(e) => {
                    log::error!("Error serializing config: {}", e);
                    return Err(ActorError::SerializationError());
                }
            }),
        });
        let mut client = self.actor_client.clone();
        let result = client.execute_actor_state_transaction(ops).await;

        match result {
            Ok(_) => Ok(()),
            Err(e) => {
                log::error!("Error persisting config: {}", e);
                Err(ActorError::CorruptedState)
            }
        }
    }

    async fn read_state(&self) -> Result<(), ActorError> {
        let mut client = self.actor_client.clone();
        match client.get_actor_state("status").await {
            Ok(s) => self.lifecycle.init_state({
                if s.data.is_empty() {
                    QueryState::New
                } else {
                    match serde_json::from_slice(&s.data) {
                        Ok(s) => s,
                        Err(e) => {
                            log::error!("Error deserializing status: {}", e);
                            return Err(ActorError::SerializationError());
                        }
                    }
                }
            }),
            Err(e) => {
                log::error!("Error reading status: {}", e);
                return Err(ActorError::CorruptedState);
            }
        };

        match client.get_actor_state("config").await {
            Ok(s) => {
                if s.data.is_empty() {
                    self.config.clear().await;
                } else {
                    let cfg: Option<QuerySpec> = match serde_json::from_slice(&s.data) {
                        Ok(s) => s,
                        Err(e) => {
                            log::error!("Error deserializing config: {}", e);
                            return Err(ActorError::SerializationError());
                        }
                    };
                    match cfg {
                        Some(c) => self.config.set(c).await,
                        None => self.config.clear().await,
                    };
                }
            }
            Err(e) => {
                log::error!("Error reading config: {}", e);
                return Err(ActorError::CorruptedState);
            }
        };

        Ok(())
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

    async fn clear(&self) {
        let mut lock = self.value.write().await;
        lock.take();
    }

    async fn take(&self) -> Option<T> {
        let mut lock = self.value.write().await;
        lock.take()
    }
}
