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

use std::sync::Arc;

use opentelemetry::{propagation::TextMapPropagator, KeyValue};
use opentelemetry_sdk::propagation::TraceContextPropagator;
use tokio::{
    select,
    sync::{mpsc, oneshot, watch, Mutex},
    task::JoinHandle,
    time::Instant,
};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::{
    api::{ControlSignal, ResultEvent, ViewSpec},
    change_stream::{redis_change_stream::RedisChangeStream, SequentialChangeStream},
    models::ChangeStreamConfig,
    view_store::ViewStore,
};

enum Command {
    Shutdown,
    Reconfigure(ViewSpec),
}

#[derive(Clone, Copy, Debug)]
pub enum WorkerState {
    Running,
    Shutdown(ShutdownReason),
}

#[derive(Clone, Copy, Debug)]
pub enum ShutdownReason {
    Deactivated,
    Error,
}

pub struct ViewWorker {
    handle: JoinHandle<()>,
    commander: mpsc::UnboundedSender<Command>,
    is_complete: Mutex<Option<oneshot::Receiver<()>>>,
    state: watch::Receiver<WorkerState>,
}

impl ViewWorker {
    pub fn start(
        query_id: Arc<str>,
        config: ViewSpec,
        stream_config: Arc<ChangeStreamConfig>,
        store: Arc<dyn ViewStore>,
    ) -> Self {
        let (command_tx, mut command_rx) = mpsc::unbounded_channel();
        let (is_complete_tx, is_complete_rx) = oneshot::channel::<()>();
        let (state_tx, state_rx) = watch::channel(WorkerState::Running);

        let query_id2 = query_id.clone();

        let inner_handle = tokio::spawn(async move {
            log::info!("View {query_id} worker starting");

            if let Err(err) = store.init_view(&query_id, config.retention_policy).await {
                log::error!("Error initializing view: {err}");
                return ShutdownReason::Error;
            }

            let topic = format!("{query_id}-results");

            let change_stream = match RedisChangeStream::new(
                &stream_config.redis_url,
                &topic,
                "view-svc",
                "view-svc",
                stream_config.buffer_size,
                stream_config.fetch_batch_size,
            )
            .await
            {
                Ok(cs) => cs,
                Err(err) => {
                    log::error!("Error creating change stream: {err}");
                    return ShutdownReason::Error;
                }
            };

            let trace_propogator = TraceContextPropagator::new();
            let meter = opentelemetry::global::meter("view-svc");

            let msg_latency = meter
                .f64_histogram("drasi.view-svc.msg_latency")
                .with_description("Latency of messge processing")
                .with_unit(opentelemetry::metrics::Unit::new("ns"))
                .init();

            let metric_attributes = [KeyValue::new("query_id", query_id.to_string())];

            loop {
                select! {
                    cmd = command_rx.recv() => {
                            match cmd {
                                Some(Command::Shutdown) => {
                                    log::info!("View {query_id} worker shutting down");
                                    return ShutdownReason::Deactivated;
                                },
                                Some(Command::Reconfigure(new_config)) => {
                                    log::info!("View {query_id} worker reconfigure");
                                    if let Err(err) = store.set_retention_policy(&query_id, new_config.retention_policy).await {
                                        log::error!("Error setting retention policy: {err}");
                                    }
                                },
                                None => {
                                    log::error!("Command channel closed unexpectedly");
                                    return ShutdownReason::Error;
                                },
                            }
                    },
                    msg = change_stream.recv::<ResultEvent>() => {
                        match msg {
                            Err(err) => {
                                log::error!("Error polling stream consumer: {err}");
                                break;
                            },
                            Ok(msg) => {
                                match msg {
                                    None => continue,
                                    Some(evt) => {
                                        let evt_id = evt.id.clone();
                                        let msg_process_start = Instant::now();
                                        let parent_context = trace_propogator.extract(&evt);
                                        let span = tracing::span!(tracing::Level::INFO, "process_message");
                                        span.set_parent(parent_context);
                                        span.set_attribute("query_id", query_id.clone());

                                        match evt.data {
                                            ResultEvent::Change(change_evt) => {
                                                if let Err(err) = store.record_change(&query_id, change_evt).await {
                                                    log::error!("Error recording change: {err}");
                                                    return ShutdownReason::Error;
                                                }
                                            },
                                            ResultEvent::Control(control_evt) => {
                                                log::info!("Control event for {query_id}: {control_evt:?}");
                                                match control_evt.control_signal {
                                                    ControlSignal::BootstrapStarted => {
                                                        if let Err(err) = store.delete_view(&query_id).await {
                                                            log::error!("Error deleting view {query_id}: {err}");
                                                            return ShutdownReason::Error;
                                                        }
                                                    },
                                                    ControlSignal::QueryDeleted => {
                                                        log::info!("Query {query_id} deleted");
                                                        match store.delete_view(&query_id).await {
                                                            Ok(_) => log::info!("View {query_id} deleted"),
                                                            Err(err) => {
                                                                log::error!("Error deleting view {query_id}: {err}");
                                                                return ShutdownReason::Error;
                                                            },
                                                        }
                                                    },
                                                    _ => {
                                                        _ = store.set_state(&query_id, control_evt.sequence, control_evt.source_time_ms, &control_evt.control_signal.to_string()).await;
                                                    },
                                                }
                                            },
                                        };

                                        if let Err(err) = change_stream.ack(&evt_id).await {
                                            log::error!("Error acknowledging message: {err}");
                                        }

                                        msg_latency.record(msg_process_start.elapsed().as_nanos() as f64, &metric_attributes);
                                    }
                                }
                            }
                        }
                    }
                };
            }
            ShutdownReason::Deactivated
        });

        let handle = tokio::spawn(async move {
            let reason = match inner_handle.await {
                Ok(r) => r,
                Err(err) => {
                    log::error!("Error in worker: {err}");
                    ShutdownReason::Error
                }
            };
            log::info!("View {query_id2} worker finished");
            let _ = state_tx.send(WorkerState::Shutdown(reason));
            _ = is_complete_tx.send(());
        });

        Self {
            handle,
            commander: command_tx,
            is_complete: Mutex::new(Some(is_complete_rx)),
            state: state_rx,
        }
    }

    pub fn reconfigure(&self, config: ViewSpec) {
        match self.commander.send(Command::Reconfigure(config)) {
            Ok(_) => log::info!("Reconfigure command sent"),
            Err(err) => log::error!("Error sending Reconfigure command: {err}"),
        }
    }

    pub async fn shutdown(&self) {
        if self.handle.is_finished() {
            return;
        }

        match self.commander.send(Command::Shutdown) {
            Ok(_) => log::info!("Shutdown command sent"),
            Err(err) => log::error!("Error sending shutdown command: {err}"),
        }

        if let Some(rx) = self.is_complete.lock().await.take() {
            _ = rx.await;
        }
    }

    pub fn is_finished(&self) -> bool {
        self.handle.is_finished()
    }

    pub fn state(&self) -> WorkerState {
        *self.state.borrow()
    }
}
