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

use dapr::client::TonicClient;
use drasi_functions_cypher::CypherFunctionSet;
use drasi_functions_gql::GQLFunctionSet;
use drasi_query_ast::api::QueryParser;
use drasi_query_ast::ast::Query;
use drasi_query_cypher::CypherParser;
use drasi_query_gql::GQLParser;
use futures::StreamExt;
use std::{
    error::Error,
    pin::pin,
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

use drasi_core::{
    evaluation::functions::FunctionRegistry,
    interface::{ElementIndex, ResultIndex, ResultSequence},
    middleware::MiddlewareTypeRegistry,
    models,
    query::{ContinuousQuery, QueryBuilder},
};
use opentelemetry::{propagation::TextMapPropagator, KeyValue};
use opentelemetry_sdk::propagation::TraceContextPropagator;
use serde_json::{Map, Number, Value};
use tokio::{
    select,
    sync::{
        mpsc::{self},
        oneshot, watch, Mutex,
    },
    task::JoinHandle,
    time::Instant,
};
use tracing::{
    dispatcher,
    // info_span,
    instrument,
    Dispatch,
    Instrument,
};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::{
    api::{self, ChangeEvent, ControlSignal, QueryLanguage, ResultEvent},
    change_stream::{
        self, redis_change_stream::RedisChangeStream, Message, SequentialChangeStream,
    },
    future_consumer::FutureConsumer,
    index_factory::IndexFactory,
    models::{BootstrapError, ChangeStreamConfig, QueryError, QueryLifecycle, QueryState},
    result_publisher::ResultPublisher,
    source_client::SourceClient,
};

enum Command {
    Shutdown,
    Delete,
    Pause,
}

/// A background worker that runs a single query
/// Starts by bootstrapping the query from the sources and then enters a loop of consuming change events from the query container stream
pub struct QueryWorker {
    handle: JoinHandle<()>,
    commander: mpsc::UnboundedSender<Command>,
    is_shutdown: Mutex<Option<oneshot::Receiver<()>>>,
}

#[allow(clippy::too_many_arguments)]
impl QueryWorker {
    pub fn start(
        query_container_id: Arc<str>,
        query_id: Arc<str>,
        config: api::QuerySpec,
        lifecycle: Arc<QueryLifecycle>,
        source_client: Arc<SourceClient>,
        stream_config: Arc<ChangeStreamConfig>,
        publisher: Arc<ResultPublisher>,
        index_factory: Arc<IndexFactory>,
        middleware_registry: Arc<MiddlewareTypeRegistry>,
        dapr_client: dapr::Client<TonicClient>,
    ) -> Self {
        let (command_tx, mut command_rx) = mpsc::unbounded_channel();
        let (is_shutdown_tx, is_shutdown_rx) = oneshot::channel::<()>();

        let query_id2 = query_id.clone();

        let inner_handle = tokio::spawn(async move {
            log::info!("Query {query_id} worker starting");

            let topic = format!("{query_container_id}-publish");

            let view_spec = config.view.clone();
            let query_language = config.query_language.clone();
            let config: models::QueryConfig = config.into();
            let mut modified_config = config.clone();

            let (parser, function_registry): (Arc<dyn QueryParser>, Arc<FunctionRegistry>) =
                match query_language {
                    Some(QueryLanguage::GQL) => {
                        let function_registry =
                            Arc::new(FunctionRegistry::new()).with_gql_function_set();
                        let parser = Arc::new(GQLParser::new(function_registry.clone()))
                            as Arc<dyn QueryParser>;
                        (parser, function_registry)
                    }
                    Some(QueryLanguage::Cypher) | None => {
                        let function_registry =
                            Arc::new(FunctionRegistry::new()).with_cypher_function_set();
                        let parser = Arc::new(CypherParser::new(function_registry.clone()))
                            as Arc<dyn QueryParser>;
                        (parser, function_registry)
                    }
                };

            let mut builder =
                QueryBuilder::new(&config.query, parser).with_function_registry(function_registry);

            builder = builder.with_joins(config.sources.joins.clone());

            let index_set = match index_factory
                .build(&modified_config.storage_profile, &query_id)
                .await
            {
                Ok(ei) => ei,
                Err(err) => {
                    log::error!("Error initializing index: {err}");
                    lifecycle.change_state(QueryState::TransientError(err.to_string()));
                    return;
                }
            };

            let element_index = index_set.element_index;
            let archive_index = index_set.archive_index;
            let result_index = index_set.result_index;
            let future_queue = index_set.future_queue;

            builder = builder.with_element_index(element_index.clone());
            builder = builder.with_archive_index(archive_index.clone());
            builder = builder.with_result_index(result_index.clone());
            builder = builder.with_future_queue(future_queue.clone());

            builder = builder.with_middleware_registry(middleware_registry);
            for mw in modified_config.sources.middleware.clone() {
                builder = builder.with_source_middleware(Arc::new(mw));
            }

            for subscription in &modified_config.sources.subscriptions {
                let pipeline: Vec<String> = subscription
                    .pipeline
                    .iter()
                    .map(|s| s.to_string())
                    .collect();
                builder = builder.with_source_pipeline(subscription.id.to_string(), &pipeline);
            }

            let continuous_query = match builder.try_build().await {
                Ok(cq) => cq,
                Err(err) => {
                    log::error!("Error building query: {err}");
                    lifecycle.change_state(QueryState::TerminalError(err.to_string()));
                    return;
                }
            };

            let start_timestamp = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis();

            fill_default_source_labels(&mut modified_config, &continuous_query.get_query());

            let source_publisher = change_stream::publisher::Publisher::connect(
                &stream_config.redis_url,
                topic.clone(),
            )
            .await
            .expect("Failed to connect to source publisher"); //todo: better error handling

            let future_consumer =
                FutureConsumer::new(Arc::new(source_publisher), query_id.to_string());

            continuous_query
                .set_future_consumer(Arc::new(future_consumer))
                .await;

            if let Err(err) = configure_result_view(
                dapr_client.clone(),
                query_container_id.as_ref(),
                query_id.as_ref(),
                &view_spec,
            )
            .await
            {
                log::error!("Error configuring result view: {err}");
                lifecycle.change_state(QueryState::TransientError(err.to_string()));
                return;
            }

            if lifecycle.get_state() == QueryState::Running
                && index_factory.is_volatile(&modified_config.storage_profile)
            {
                log::info!("Query {query_id} is volatile, re-bootstrapping");
                lifecycle.change_state(QueryState::Configured);
            }

            let mut sequence_manager = match SequenceManager::new(result_index.clone()).await {
                Ok(sm) => sm,
                Err(err) => {
                    log::error!("Error initializing sequence manager: {err}");
                    lifecycle.change_state(QueryState::TransientError(err.to_string()));
                    return;
                }
            };

            let init_seq = sequence_manager.get().await;
            log::info!(
                "Query {query_id} starting at sequence {}",
                init_seq.sequence
            );

            match lifecycle.get_state() {
                QueryState::Configured | QueryState::Bootstrapping => {
                    lifecycle.change_state(QueryState::Bootstrapping);

                    _ = element_index.clear().await;
                    _ = result_index.clear().await;
                    _ = archive_index.clear().await;

                    if let Err(err) = bootstrap(
                        &query_container_id,
                        &query_id,
                        &modified_config,
                        &continuous_query,
                        &source_client,
                        &mut sequence_manager,
                        &publisher,
                        element_index.clone(),
                        result_index.clone(),
                    )
                    .await
                    {
                        log::error!("Error bootstrapping query: {err}");
                        lifecycle.change_state(QueryState::TerminalError(err.to_string()));
                        return;
                    }
                }
                QueryState::TerminalError(_) => todo!(),
                _ => {}
            }
            lifecycle.change_state(QueryState::Running);

            let change_stream = match RedisChangeStream::new(
                &stream_config.redis_url,
                &topic,
                &query_id,
                stream_config.buffer_size,
                stream_config.fetch_batch_size,
                start_timestamp,
            )
            .await
            {
                Ok(cs) => cs,
                Err(err) => {
                    log::error!("Error creating change stream: {err}");
                    lifecycle.change_state(QueryState::TransientError(err.to_string()));
                    return;
                }
            };

            let trace_propogator = TraceContextPropagator::new();
            let meter = opentelemetry::global::meter("query-host");
            let change_counter = meter
                .u64_counter("drasi.query-host.change_count")
                .with_description("Number of changes processed")
                .init();

            let msg_latency = meter
                .f64_histogram("drasi.query-host.msg_latency")
                .with_description("Latency of messge processing")
                .with_unit(opentelemetry::metrics::Unit::new("ns"))
                .init();

            let metric_attributes = [KeyValue::new("query_id", query_id.to_string())];

            match publisher
                .publish(
                    &query_id,
                    ResultEvent::from_control_signal(
                        query_id.as_ref(),
                        sequence_manager.increment("control"),
                        SystemTime::now()
                            .duration_since(UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_millis() as u64,
                        ControlSignal::Running,
                    ),
                )
                .await
            {
                Ok(_) => log::debug!("Published Running signal"),
                Err(err) => {
                    log::error!("Error publishing Running signal: {err}");
                }
            };

            loop {
                select! {
                    cmd = command_rx.recv() => {
                            match cmd {
                                Some(Command::Shutdown) => {
                                    log::info!("Query {query_id} worker shutting down");
                                    break;
                                },
                                Some(Command::Delete) => {
                                    _ = element_index.clear().await;
                                    _ = result_index.clear().await;
                                    _ = archive_index.clear().await;
                                    _ = change_stream.unsubscribe().await;
                                    // Iterate over the subscriptions and unsubscribe from each one
                                    for subscription in &modified_config.sources.subscriptions {
                                        match source_client.unsubscribe(query_container_id.to_string(), query_id.to_string(), subscription.id.to_string()).await {
                                            Ok(_) => {},
                                            Err(err) => log::error!("Error unsubscribing from source {}: {err}", subscription.id),
                                        };
                                    }
                                    match publisher.publish(
                                        &query_id,
                                        ResultEvent::from_control_signal(
                                            query_id.as_ref(),
                                            sequence_manager.increment("control"),
                                            SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis() as u64,
                                            ControlSignal::QueryDeleted)
                                    ).await {
                                        Ok(_) => log::info!("Published delete signal"),
                                        Err(err) => {
                                            log::error!("Error publishing delete signal: {err}");
                                        },
                                    };
                                    _ = deprovision_result_view(dapr_client.clone(), query_container_id.as_ref(), query_id.as_ref(), &view_spec).await;
                                    break;
                                },
                                Some(Command::Pause) => {
                                    todo!();
                                },
                                None => {
                                    log::error!("Command channel closed unexpectedly");
                                    lifecycle.change_state(QueryState::TerminalError("Command channel closed unexpectedly".to_string()));
                                    break;
                                },
                            }
                    },
                    msg = change_stream.recv::<ChangeEvent>() => {

                        match msg {
                            Err(err) => {
                                log::error!("Error polling stream consumer: {err}");
                                lifecycle.change_state(QueryState::TransientError(err.to_string()));
                                break;
                            },
                            Ok(msg) => {

                                match msg {
                                    None => continue,
                                    Some(evt) => {
                                        let msg_process_start = Instant::now();
                                        // Time when the event was dequeued
                                        let dequeue_time = SystemTime::now()
                                                            .duration_since(UNIX_EPOCH)
                                                            .unwrap_or_default()
                                                            .as_nanos() as u64;
                                        let enqueue_time = evt.enqueue_time;  // Defined by the publish api
                                        if !evt.data.has_query(query_id.as_ref()) {
                                            log::info!("skipping message for another query");
                                            if let Err(err) = change_stream.ack(&evt.id).await {
                                                log::error!("Error acknowledging message: {err}");
                                            }
                                            continue;
                                        }

                                        let parent_context = trace_propogator.extract(&evt);
                                        let span = tracing::span!(tracing::Level::INFO, "process_message");
                                        span.set_parent(parent_context);
                                        span.set_attribute("query_id", query_id.clone());

                                        let evt_id = &evt.id.clone();
                                        let process_future = process_change(&query_id, &continuous_query, &mut sequence_manager, &publisher, evt, enqueue_time, dequeue_time)
                                            .instrument(span);

                                        match process_future.await {
                                            Ok(_) => {},
                                            Err(err) => {
                                                lifecycle.change_state(QueryState::TransientError(err.to_string()));
                                                tracing::error!("Error processing change: {err}");
                                                break;
                                            },
                                        }

                                        if let Err(err) = change_stream.ack(evt_id).await {
                                            log::error!("Error acknowledging message: {err}");
                                            tracing::error!("Error acknowledging message: {err}");
                                        }

                                        msg_latency.record(msg_process_start.elapsed().as_nanos() as f64, &metric_attributes);
                                        change_counter.add(1, &metric_attributes);
                                    }
                                }
                            }
                        }
                    }
                };
            }

            continuous_query.terminate_future_consumer().await;
            drop(continuous_query);

            match publisher
                .publish(
                    &query_id,
                    ResultEvent::from_control_signal(
                        query_id.as_ref(),
                        sequence_manager.increment("control"),
                        SystemTime::now()
                            .duration_since(UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_millis() as u64,
                        ControlSignal::Stopped,
                    ),
                )
                .await
            {
                Ok(_) => log::debug!("Published Stopped signal"),
                Err(err) => {
                    log::error!("Error publishing Stopped signal: {err}");
                }
            };
        });

        let handle = tokio::spawn(async move {
            match inner_handle.await {
                Ok(_r) => log::info!("Query {query_id2} worker finished"),
                Err(e) => log::error!("View {query_id2} worker exited with error {e:?}"),
            };
            _ = is_shutdown_tx.send(());
        });

        Self {
            handle,
            commander: command_tx,
            is_shutdown: Mutex::new(Some(is_shutdown_rx)),
        }
    }

    pub fn delete(&self) {
        match self.commander.send(Command::Delete) {
            Ok(_) => log::info!("Delete command sent"),
            Err(err) => log::error!("Error sending delete command: {err}"),
        }
    }

    pub fn pause(&self) {
        match self.commander.send(Command::Pause) {
            Ok(_) => log::info!("Pause command sent"),
            Err(err) => log::error!("Error sending Pause command: {err}"),
        }
    }

    pub fn shutdown(&self) {
        if self.handle.is_finished() {
            log::info!("Query worker already finished");
            return;
        }

        match self.commander.send(Command::Shutdown) {
            Ok(_) => log::info!("Shutdown command sent"),
            Err(err) => log::error!("Error sending shutdown command: {err}"),
        }
    }

    pub async fn shutdown_async(&self) {
        self.shutdown();
        if let Some(rx) = self.is_shutdown.lock().await.take() {
            _ = rx.await;
        }
    }

    pub fn is_finished(&self) -> bool {
        self.handle.is_finished()
    }
}

async fn process_change(
    query_id: &str,
    continuous_query: &ContinuousQuery,
    seq_manager: &mut SequenceManager,
    publisher: &ResultPublisher,
    evt: Message<ChangeEvent>,
    enqueue_time: Option<u64>,
    dequeue_time: u64,
) -> Result<(), Box<dyn std::error::Error>> {
    log::info!("Query {query_id} received message: {evt:?}");
    let timestamp = evt.data.get_timestamp();
    let mut metadata = evt.data.get_metadata();
    let source_change_id = evt.id.clone();
    let source_change: models::SourceChange = match evt.data.try_into() {
        Ok(sc) => sc,
        Err(err) => {
            log::error!("Error converting event to source change: {err}");
            return Err(Box::new(err));
        }
    };

    let process_start_time = SystemTime::now();
    let changes = match continuous_query.process_source_change(source_change).await {
        Ok(c) => c,
        Err(err) => {
            log::error!("Error processing source change: {err}");
            return Err(Box::new(err));
        }
    };
    let process_end_time = SystemTime::now();

    if !changes.is_empty() {
        if let Some(tracking) = metadata
            .entry("tracking".to_string())
            .or_insert(Value::Object(Map::new()))
            .as_object_mut()
        {
            let query_start_time = Number::from(
                process_start_time
                    .duration_since(UNIX_EPOCH)
                    .unwrap_or_default()
                    .as_nanos() as u64,
            );
            let query_end_time = Number::from(
                process_end_time
                    .duration_since(UNIX_EPOCH)
                    .unwrap_or_default()
                    .as_nanos() as u64,
            );

            let mut qt = Map::new();
            qt.insert(
                "dequeue_ns".to_string(),
                Value::Number(Number::from(dequeue_time)),
            );

            if let Some(enqueue_ns) = enqueue_time {
                qt.insert(
                    "enqueue_ns".to_string(),
                    Value::Number(Number::from(enqueue_ns)),
                );
            } else {
                qt.insert("enqueue_ns".to_string(), Value::Null);
            }
            qt.insert("queryStart_ns".to_string(), Value::Number(query_start_time));
            qt.insert("queryEnd_ns".to_string(), Value::Number(query_end_time));

            tracking.insert("query".to_string(), Value::Object(qt));
        }

        let seq = seq_manager.increment(&source_change_id);
        let output =
            ResultEvent::from_query_results(query_id, changes, seq, timestamp, Some(metadata));

        match publisher.publish(query_id, output).await {
            Ok(_) => log::info!("Published result"),
            Err(err) => {
                log::error!("Error publishing result: {err}");
                return Err(err);
            }
        };
    }

    Ok(())
}

#[allow(clippy::too_many_arguments)]
#[instrument(skip_all, fields(query_id = query_id), err)]
async fn bootstrap(
    query_container_id: &str,
    query_id: &str,
    config: &models::QueryConfig,
    query: &ContinuousQuery,
    source_client: &SourceClient,
    seq_manager: &mut SequenceManager,
    publisher: &ResultPublisher,
    element_index: Arc<dyn ElementIndex>,
    result_index: Arc<dyn ResultIndex>,
) -> Result<(), BootstrapError> {
    // let process_span = info_span!("process_bootstrap", query_id = query_id);

    match publisher
        .publish(
            query_id,
            ResultEvent::from_control_signal(
                query_id,
                seq_manager.increment("control"),
                SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap_or_default()
                    .as_millis() as u64,
                ControlSignal::BootstrapStarted,
            ),
        )
        .await
    {
        Ok(_) => log::info!("Published start signal"),
        Err(err) => {
            log::error!("Error publishing start signal: {err}");
            return Err(BootstrapError::publish_error(err));
        }
    };

    _ = element_index.clear().await;
    _ = result_index.clear().await;

    for source in &config.sources.subscriptions {
        let mut initial_data = match source_client
            .subscribe(
                query_container_id.to_string(),
                query_id.to_string(),
                source.clone(),
            )
            .await
        {
            Ok(r) => r,
            Err(e) => {
                log::error!("Error subscribing to source: {} {e}", source.id);
                return Err(e);
            }
        };

        let mut initial_data = pin!(initial_data);

        // let publish_span = info_span!("publish_bootstrap_data", query_id = query_id);
        while let Some(change) = initial_data.next().await {
            match change {
                Ok(change) => {
                    let timestamp = change.get_transaction_time();
                    let element_id = change.get_reference().element_id.to_string();
                    let change_results = match query.process_source_change(change).await {
                        Ok(r) => r,
                        Err(e) => {
                            log::error!("Error processing source change: {e}");
                            return Err(BootstrapError::process_failed(
                                source.id.to_string(),
                                element_id,
                                Box::new(e),
                            ));
                        }
                    };

                    let seq = seq_manager.increment("bootstrap");
                    let output = dispatcher::with_default(
                        &tracing::Dispatch::none(), // Disable tracing for this scope
                        || {
                            ResultEvent::from_query_results(
                                query_id,
                                change_results,
                                seq,
                                timestamp,
                                None,
                            )
                        },
                    );

                    let result = {
                        let _guard = tracing::dispatcher::set_default(&Dispatch::none());
                        publisher.publish(query_id, output).await
                    };

                    match result {
                        Ok(_) => log::info!("Published result"),
                        Err(err) => {
                            log::error!("Error publishing result: {err}");
                            return Err(BootstrapError::publish_error(err));
                        }
                    };
                }
                Err(err) => {
                    log::error!("Error fetching initial data: {err}");
                    return Err(err);
                }
            }
        }
    }

    match publisher
        .publish(
            query_id,
            ResultEvent::from_control_signal(
                query_id,
                seq_manager.increment("control"),
                SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap_or_default()
                    .as_millis() as u64,
                ControlSignal::BootstrapCompleted,
            ),
        )
        .await
    {
        Ok(_) => log::info!("Published complete signal"),
        Err(err) => {
            log::error!("Error publishing complete signal: {err}");
            return Err(BootstrapError::publish_error(err));
        }
    };

    Ok(())
}

fn fill_default_source_labels(spec: &mut models::QueryConfig, ast: &Query) {
    for source in &mut spec.sources.subscriptions {
        if source.nodes.is_empty() && source.relations.is_empty() {
            for ph in &ast.parts {
                for mc in &ph.match_clauses {
                    merge_query_source_labels(&mut source.nodes, mc.start.labels.clone());
                    for leg in &mc.path {
                        merge_query_source_labels(&mut source.relations, leg.0.labels.clone());
                        merge_query_source_labels(&mut source.nodes, leg.1.labels.clone());
                    }
                }
            }
        }
    }
}

fn merge_query_source_labels(spec: &mut Vec<models::QuerySourceElement>, labels: Vec<Arc<str>>) {
    for label in labels {
        if !spec.iter().any(|s| s.source_label == *label) {
            spec.push(models::QuerySourceElement {
                source_label: label.to_string(),
            });
        }
    }
}

async fn configure_result_view(
    dapr_client: dapr::Client<TonicClient>,
    query_container: &str,
    query_id: &str,
    view_spec: &api::ViewSpec,
) -> Result<(), QueryError> {
    if !view_spec.enabled {
        return Ok(());
    }

    let mut mut_dapr = dapr_client.clone();

    let _: () = match mut_dapr
        .invoke_actor(
            format!("{query_container}.View"),
            query_id.to_string(),
            "configure",
            view_spec,
            None,
        )
        .await
    {
        Err(e) => {
            log::error!("Error configuring result view: {e}");
            return Err(QueryError::Other(e.to_string()));
        }
        r => r.expect("invoke_actor should return Ok after Err check"),
    };

    Ok(())
}

async fn deprovision_result_view(
    dapr_client: dapr::Client<TonicClient>,
    query_container: &str,
    query_id: &str,
    view_spec: &api::ViewSpec,
) -> Result<(), QueryError> {
    if !view_spec.enabled {
        return Ok(());
    }

    let mut mut_dapr = dapr_client.clone();

    let _: () = match mut_dapr
        .invoke_actor(
            format!("{query_container}.View"),
            query_id.to_string(),
            "deprovision",
            (),
            None,
        )
        .await
    {
        Err(e) => {
            log::error!("Error deprovisioning result view: {e}");
            return Err(QueryError::Other(e.to_string()));
        }
        r => r.expect("invoke_actor should return Ok after Err check"),
    };

    Ok(())
}

/// Track the current sequence number for a query
struct SequenceManager {
    value: ResultSequence,
    tx: watch::Sender<ResultSequence>,
}

impl SequenceManager {
    pub async fn new(store: Arc<dyn ResultIndex>) -> Result<Self, Box<dyn Error>> {
        let (tx, mut rx) = watch::channel(ResultSequence::default());
        let current = store.get_sequence().await?;

        let store = store.clone();

        tokio::spawn(async move {
            loop {
                let chg = rx.changed().await;
                // only store the latest value, ignore intermediate changes
                let latest = rx.borrow().clone();

                if let Err(err) = store
                    .apply_sequence(latest.sequence, &latest.source_change_id)
                    .await
                {
                    log::error!("Error applying sequence: {err}");
                }

                if chg.is_err() {
                    log::info!("Sequence counter channel closed");
                    break;
                }
            }
        });
        Ok(Self { value: current, tx })
    }

    pub async fn get(&self) -> &ResultSequence {
        &self.value
    }

    pub fn increment(&mut self, source_change_id: &str) -> u64 {
        self.value.sequence += 1;
        self.value.source_change_id = Arc::from(source_change_id);
        _ = self.tx.send_replace(self.value.clone());
        self.value.sequence
    }
}
