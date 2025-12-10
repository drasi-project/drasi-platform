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
    api::{QueryRequest, QueryRuntime, QuerySpec, QueryStatus},
    index_factory::{IndexFactory, StorageSpec },
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
use drasi_lib::{DrasiLib, StorageBackendConfig, StorageBackendSpec, DispatchMode, Query, QueryLanguage};
use drasi_source_platform::PlatformSource;
use drasi_reaction_platform::PlatformReactionBuilder;
use drasi_bootstrap_platform::PlatformBootstrapProvider;
use gethostname::gethostname;
use tokio::sync::RwLock;
use tokio::task::{self, JoinHandle};

/// Enum to hold either QueryWorker or DrasiLib runtime
#[derive(Clone)]
enum QueryRuntimeInstance {
    Worker(Arc<QueryWorker>),
    DrasiLib(Arc<DrasiLib>),
}

#[actor]
pub struct QueryActor {
    query_id: Arc<str>,
    query_container_id: Arc<str>,
    lifecycle: Arc<QueryLifecycle>,
    config: OptionalValue<QuerySpec>,
    actor_client: ActorContextClient,
    dapr_client: dapr::Client<TonicClient>,

    // Worker runtime dependencies (optional - only needed for Worker runtime)
    source_client: Option<Arc<SourceClient>>,
    stream_config: Option<Arc<ChangeStreamConfig>>,
    publisher: Option<Arc<ResultPublisher>>,
    index_factory: Option<Arc<IndexFactory>>,
    middleware_registry: Option<Arc<MiddlewareTypeRegistry>>,

    // The actual runtime instance (Worker or ServerCore)
    runtime: OptionalValue<QueryRuntimeInstance>,
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
                if let Err(err) = self.init().await {
                    log::error!(
                        "Query {} failed to initialize runtime - {}",
                        self.query_id,
                        err
                    );
                }
            }
            QueryState::Bootstrapping => {
                //todo: purge index
                if let Err(err) = self.init().await {
                    log::error!(
                        "Query {} failed to initialize runtime - {}",
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

        let transient = self
            .config
            .get()
            .await
            .map_or(false, |c| c.transient.is_some_and(|f| f));

        if let Some(runtime_instance) = self.runtime.take().await {
            match runtime_instance {
                QueryRuntimeInstance::Worker(w) => {
                    if transient {
                        w.delete();
                        w.shutdown();
                        self.runtime.clear().await;
                        _ = self.unregister_reminder().await;
                        self.config.clear().await;
                        self.lifecycle.change_state(QueryState::Deleted);
                        _ = self.persist_config().await;
                    } else {
                        w.shutdown_async().await;
                    }
                }
                QueryRuntimeInstance::DrasiLib(core) => {
                    // For DrasiLib, we need to stop it gracefully
                    if transient {
                        if let Err(e) = core.stop().await {
                            log::error!("Error stopping DrasiLib: {}", e);
                        }
                        self.runtime.clear().await;
                        _ = self.unregister_reminder().await;
                        self.config.clear().await;
                        self.lifecycle.change_state(QueryState::Deleted);
                        _ = self.persist_config().await;
                    } else {
                        if let Err(e) = core.stop().await {
                            log::error!("Error stopping DrasiLib: {}", e);
                        }
                    }
                }
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
            self.init().await?;
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
        source_client: Option<Arc<SourceClient>>,
        stream_config: Option<Arc<ChangeStreamConfig>>,
        publisher: Option<Arc<ResultPublisher>>,
        index_factory: Option<Arc<IndexFactory>>,
        middleware_registry: Option<Arc<MiddlewareTypeRegistry>>,
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
            runtime: OptionalValue::new(),
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

        match self.init().await {
            Ok(_) => {}
            Err(e) => {
                log::error!("Query {} Error initializing runtime: {}", self.query_id, e);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error initializing runtime",
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
        if let Some(runtime_instance) = &self.runtime.get().await {
            match runtime_instance {
                QueryRuntimeInstance::Worker(w) => {
                    w.delete();
                    w.shutdown();
                    self.runtime.clear().await;
                }
                QueryRuntimeInstance::DrasiLib(core) => {
                    if let Err(e) = core.stop().await {
                        log::error!("Error stopping DrasiLib during deprovision: {}", e);
                    }
                    self.runtime.clear().await;
                }
            }
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

    /// Route to appropriate runtime initialization based on configuration
    async fn init(&self) -> Result<(), ActorError> {
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

        match config.query_runtime {
            Some(QueryRuntime::Worker) => {
                log::info!(
                    "Query {} initializing with Worker runtime",
                    self.query_id
                );
                self.init_worker().await
            },
            Some(QueryRuntime::ServerCore) => {
                log::info!(
                    "Query {} initializing with DrasiLib runtime",
                    self.query_id
                );
                self.init_drasi_lib().await
            },
            None => {
                log::info!(
                    "Query {} initializing with default (Worker) runtime",
                    self.query_id
                );
                self.init_worker().await
            }
        }
    }

    async fn init_worker(&self) -> Result<(), ActorError> {
        if let Some(runtime_instance) = &self.runtime.get().await {
            match runtime_instance {
                QueryRuntimeInstance::Worker(w) if !w.is_finished() => {
                    log::error!("Query {} worker already running", self.query_id);
                    return Err(ActorError::MethodError(Box::new(QueryError::Other(
                        "Query worker already running".into(),
                    ))));
                }
                _ => {}
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

        // Ensure we have all required dependencies for Worker runtime
        let source_client = self.source_client.clone().ok_or_else(|| {
            ActorError::MethodError(Box::new(QueryError::Other(
                "Source client not available for Worker runtime".into(),
            )))
        })?;
        let stream_config = self.stream_config.clone().ok_or_else(|| {
            ActorError::MethodError(Box::new(QueryError::Other(
                "Stream config not available for Worker runtime".into(),
            )))
        })?;
        let publisher = self.publisher.clone().ok_or_else(|| {
            ActorError::MethodError(Box::new(QueryError::Other(
                "Publisher not available for Worker runtime".into(),
            )))
        })?;
        let index_factory = self.index_factory.clone().ok_or_else(|| {
            ActorError::MethodError(Box::new(QueryError::Other(
                "Index factory not available for Worker runtime".into(),
            )))
        })?;
        let middleware_registry = self.middleware_registry.clone().ok_or_else(|| {
            ActorError::MethodError(Box::new(QueryError::Other(
                "Middleware registry not available for Worker runtime".into(),
            )))
        })?;

        let worker = QueryWorker::start(
            self.query_container_id.clone(),
            self.query_id.clone(),
            config,
            self.lifecycle.clone(),
            source_client,
            stream_config,
            publisher,
            index_factory,
            middleware_registry,
            self.dapr_client.clone(),
        );
        self.runtime
            .set(QueryRuntimeInstance::Worker(Arc::new(worker)))
            .await;

        log::info!("Query {} worker started", self.query_id);

        Ok(())
    }

    async fn init_drasi_lib(&self) -> Result<(), ActorError> {
        if let Some(runtime_instance) = &self.runtime.get().await {
            match runtime_instance {
                QueryRuntimeInstance::DrasiLib(core) if core.is_running().await => {
                    log::error!("Query {} DrasiLib already running", self.query_id);
                    return Err(ActorError::MethodError(Box::new(QueryError::Other(
                        "Query DrasiLib already running".into(),
                    ))));
                }
                _ => {}
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

        // Convert the configured (or default) platform storage spec to drasi_lib
        // storage backend config
        let index_factory = self.index_factory.clone().ok_or_else(|| {
            ActorError::MethodError(Box::new(QueryError::Other(
                "Index factory not available for DrasiLib runtime".into(),
            )))
        })?;

        let storage_backend = match index_factory
            .get_storage_spec(&config.storage_profile.clone())
            .await
        {
            Ok(spec) => match spec {
                StorageSpec::Memory { enable_archive } => StorageBackendConfig {
                    id: config
                        .storage_profile
                        .clone()
                        .unwrap_or_else(|| index_factory.default_store.clone()),
                    spec: StorageBackendSpec::Memory { enable_archive },
                },
                StorageSpec::Redis {
                    connection_string,
                    cache_size,
                } => StorageBackendConfig {
                    id: config
                        .storage_profile
                        .clone()
                        .unwrap_or_else(|| index_factory.default_store.clone()),
                    spec: StorageBackendSpec::Redis {
                        connection_string,
                        cache_size,
                    },
                },
                StorageSpec::RocksDb {
                    enable_archive,
                    direct_io,
                } => StorageBackendConfig {
                    id: config
                        .storage_profile
                        .clone()
                        .unwrap_or_else(|| index_factory.default_store.clone()),
                    spec: StorageBackendSpec::RocksDb {
                        path: "/data".to_string(),
                        enable_archive,
                        direct_io,
                    },
                },
            },
            Err(err) => {
                log::error!("Error initializing index: {}", err);
                self.lifecycle
                    .change_state(QueryState::TransientError(err.to_string()));
                return Err(ActorError::MethodError(Box::new(QueryError::Other(
                    "Error initializing index".into(),
                ))));
            }
        };

        // Initialize builder with server ID and storage backend
        let mut builder = DrasiLib::builder()
            .with_id(self.query_container_id.to_string())
            .add_storage_backend(storage_backend);

        // Add Platform Sources for each Source Subscription
        for source in &config.sources.subscriptions {
            // Create platform bootstrap provider
            let bootstrap_provider = PlatformBootstrapProvider::builder()
                .with_query_api_url(format!("http://{}-query-api:80", source.id))
                .with_timeout_seconds(30)
                .build()
                .map_err(|e| {
                    log::error!("Error creating bootstrap provider: {}", e);
                    ActorError::MethodError(Box::new(QueryError::Other(
                        "Error creating bootstrap provider".into(),
                    )))
                })?;

            // Create platform source with bootstrap provider
            let platform_source = PlatformSource::builder(&source.id)
                .with_redis_url("redis://drasi-redis:6379")
                .with_stream_key(format!("{}-change", source.id))
                .with_consumer_group(self.query_container_id.to_string())
                .with_consumer_name(self.query_id.to_string())
                .with_batch_size(10)
                .with_block_ms(5000)
                .with_dispatch_mode(DispatchMode::Channel)
                .with_dispatch_buffer_capacity(20000)
                .with_bootstrap_provider(bootstrap_provider)
                .with_auto_start(true)
                .build()
                .map_err(|e| {
                    log::error!("Error creating platform source: {}", e);
                    ActorError::MethodError(Box::new(QueryError::Other(
                        "Error creating platform source".into(),
                    )))
                })?;

            builder = builder.with_source(platform_source);
        }

        // Build the Query configuration using the Query builder
        let query_language = match config.query_language {
            Some(crate::api::QueryLanguage::Cypher) => QueryLanguage::Cypher,
            Some(crate::api::QueryLanguage::GQL) => QueryLanguage::GQL,
            None => QueryLanguage::Cypher,
        };

        let mut query_builder = match query_language {
            QueryLanguage::Cypher => Query::cypher(&*self.query_id),
            QueryLanguage::GQL => Query::gql(&*self.query_id),
        };

        query_builder = query_builder
            .query(&config.query)
            .with_dispatch_mode(DispatchMode::Channel)
            .with_dispatch_buffer_capacity(10000)
            .with_priority_queue_capacity(100000)
            .with_bootstrap_buffer_size(1000)
            .enable_bootstrap(true)
            .auto_start(true);

        // Add source subscriptions with pipelines
        for sub in &config.sources.subscriptions {
            query_builder =
                query_builder.from_source_with_pipeline(sub.id.clone(), sub.pipeline.clone());
        }

        // Add middleware configurations
        for m in &config.sources.middleware {
            query_builder = query_builder.with_middleware(drasi_core::models::SourceMiddlewareConfig {
                kind: Arc::from(m.kind.as_str()),
                name: Arc::from(m.name.as_str()),
                config: m.config.clone(),
            });
        }

        builder = builder.with_query(query_builder.build());

        // Add the Platform Reaction
        let platform_reaction = PlatformReactionBuilder::new(&*self.query_id)
            .with_queries(vec![self.query_id.to_string()])
            .with_redis_url("redis://drasi-redis:6379")
            .with_pubsub_name("drasi-pubsub")
            .with_source_name("drasi-core")
            .with_max_stream_length(10000)
            .with_emit_control_events(true)
            .with_batch_enabled(false)
            .with_batch_max_size(10)
            .with_batch_max_wait_ms(1000)
            .with_auto_start(true)
            .build()
            .map_err(|e| {
                log::error!("Error creating platform reaction: {}", e);
                ActorError::MethodError(Box::new(QueryError::Other(
                    "Error creating platform reaction".into(),
                )))
            })?;

        builder = builder.with_reaction(platform_reaction);

        // Build and initialize (build() returns already-initialized instance)
        let core = builder.build().await.map_err(|e| {
            log::error!("Query {} Error building core: {}", self.query_id, e);
            ActorError::MethodError(Box::new(QueryError::Other("Error building core".into())))
        })?;

        // Start the server
        core.start().await.map_err(|e| {
            log::error!("Query {} Error starting core: {}", self.query_id, e);
            ActorError::MethodError(Box::new(QueryError::Other("Error starting core".into())))
        })?;

        self.runtime
            .set(QueryRuntimeInstance::DrasiLib(Arc::new(core)))
            .await;

        self.lifecycle.change_state(QueryState::Running);

        log::info!("Query {} DrasiLib started", self.query_id);

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
