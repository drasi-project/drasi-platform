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

use async_trait::async_trait;
use redis::{
    streams::{StreamId, StreamReadOptions, StreamReadReply},
    AsyncCommands,
};
use serde::Deserialize;
use tokio::sync::{mpsc, Mutex, Notify};

use super::{ChangeStreamError, Message, SequentialChangeStream};

pub struct RedisChangeStream {
    topic: String,
    unack_item: Mutex<Option<StreamId>>,
    buffer_rx: Mutex<mpsc::Receiver<StreamId>>,
    cancel: Arc<tokio::sync::Notify>,
    connection: Mutex<redis::aio::Connection>,
    group_id: String,
}

impl RedisChangeStream {
    pub async fn new(
        url: &str,
        topic: &str,
        group_id: &str,
        buffer_size: usize,
        fetch_batch_size: usize,
        start_timestamp: Option<u128>,
    ) -> Result<Self, ChangeStreamError> {
        let client = redis::Client::open(url)?;
        let mut connection = client.get_async_connection().await?;

        let starting_position = match start_timestamp {
            Some(ts) => format!("{}-0", ts),
            None => "$".to_string(),
        };

        match connection
            .xgroup_create_mkstream::<&str, &str, &str, String>(topic, group_id, &starting_position)
            .await
        {
            Ok(res) => log::info!("Created consumer group: {:?}", res),
            Err(err) => match err.kind() {
                redis::ErrorKind::ExtensionError => log::info!("Consumer group already exists"),
                _ => log::error!("Consumer group create error: {:?} {:?}", err, err.kind()),
            },
        };

        let (tx, rx) = tokio::sync::mpsc::channel(buffer_size);
        let cancel = Arc::new(Notify::new());

        //start a task to fetch data from redis and buffer it
        let mut bg_connection = client.get_async_connection().await?;
        let bg_group_id = group_id.to_string();
        let bg_topic = topic.to_string();
        let bg_cancel = cancel.clone();

        _ = tokio::spawn(async move {
            let pending_opts = StreamReadOptions::default()
                .count(fetch_batch_size)
                .group(&bg_group_id, "qh");

            let read_opts: StreamReadOptions = StreamReadOptions::default()
                .count(fetch_batch_size)
                .block(0)
                .group(&bg_group_id, "qh");

            let topic = [&bg_topic];
            let mut start_id = "0".to_string();
            loop {
                log::info!("Reading pending messages");
                let batch: StreamReadReply = match bg_connection
                    .xread_options(&topic, &[&start_id], &pending_opts)
                    .await
                {
                    Ok(items) => items,
                    Err(err) => {
                        log::error!("Error reading from redis: {:?}", err);
                        continue;
                    }
                };

                match batch.keys.first() {
                    Some(k) => match k.ids.last() {
                        Some(id) => start_id = id.id.clone(),
                        None => {
                            log::info!("All pending messages processed");
                            break;
                        }
                    },
                    None => break,
                }

                if !process_batch(batch, &tx, bg_cancel.clone()).await {
                    return;
                }
            }

            loop {
                tokio::select! {
                    _ = bg_cancel.notified() => {
                        log::info!("RedisChangeStream background task cancelled");
                        break;
                    }
                    batch = bg_connection.xread_options(&topic, &[">"], &read_opts) => {
                        match batch {
                            Ok(items) => {
                                if !process_batch(items, &tx, bg_cancel.clone()).await {
                                    break;
                                }
                            },
                            Err(err) => {
                                log::error!("Error reading from redis: {:?}", err);
                                continue;
                            }
                        }
                    }
                }
            }
        });

        Ok(RedisChangeStream {
            topic: topic.to_string(),
            unack_item: Mutex::new(None),
            buffer_rx: Mutex::new(rx),
            connection: Mutex::new(connection),
            group_id: group_id.to_string(),
            cancel,
        })
    }
}

#[async_trait]
impl SequentialChangeStream for RedisChangeStream {
    async fn recv<T>(&self) -> Result<Option<Message<T>>, ChangeStreamError>
    where
        T: for<'de> Deserialize<'de>,
    {
        let mut unack_item = self.unack_item.lock().await;
        if unack_item.is_none() {
            let mut rx = self.buffer_rx.lock().await;
            let data = rx.recv().await;
            match data {
                Some(data) => {
                    let message = deserialize_message::<T>(&data)?;
                    _ = unack_item.insert(data);
                    Ok(Some(message))
                }
                None => Ok(None),
            }
        } else {
            log::warn!("re-serving unack_item: {:?}", unack_item);
            let message = unack_item.clone().unwrap();
            let message = deserialize_message::<T>(&message)?;
            Ok(Some(message))
        }
    }

    async fn ack(&self, id: &str) -> Result<(), ChangeStreamError> {
        let mut unack_item = self.unack_item.lock().await;
        match unack_item.as_ref() {
            Some(item) => {
                if item.id == id {
                    let mut connection = self.connection.lock().await;
                    log::debug!(
                        "processing ack : {}, {}, {:?}",
                        &self.topic,
                        &self.group_id,
                        id
                    );
                    let _: i64 = match connection.xack(&self.topic, &self.group_id, &[id]).await {
                        Ok(res) => {
                            log::debug!("ack response: {:?}", res);
                            res
                        }
                        Err(err) => return Err(err.into()),
                    };
                    _ = unack_item.take();
                    Ok(())
                } else {
                    Err(ChangeStreamError::AckOutOfSequence)
                }
            }
            None => Err(ChangeStreamError::AckOutOfSequence),
        }
    }

    async fn unsubscribe(&self) -> Result<(), ChangeStreamError> {
        _ = self.cancel.notify_one();
        let mut connection = self.connection.lock().await;
        let _: i64 = match connection
            .xgroup_delconsumer(&self.topic, &self.group_id, "qh")
            .await
        {
            Ok(res) => {
                log::debug!("unsubscribe response: {:?}", res);
                res
            }
            Err(err) => return Err(err.into()),
        };
        Ok(())
    }
}

impl Drop for RedisChangeStream {
    fn drop(&mut self) {
        self.cancel.notify_one()
    }
}

async fn process_batch(
    batch: StreamReadReply,
    tx: &mpsc::Sender<StreamId>,
    bg_cancel: Arc<Notify>,
) -> bool {
    for k in batch.keys {
        for id in k.ids {
            tokio::select! {
                _ = bg_cancel.notified() => {
                    log::info!("RedisChangeStream background task cancelled");
                    return false;
                }
                tr = tx.send(id.clone()) => {
                    if tr.is_err() {
                        log::error!("Error sending to channel");
                        return false;
                    }
                }
            };
        }
    }
    true
}

fn deserialize_message<T>(message: &StreamId) -> Result<Message<T>, ChangeStreamError>
where
    T: for<'de> Deserialize<'de>,
{
    Ok(Message {
        id: message.id.clone(),
        data: match message.map.get("data") {
            Some(data) => match data {
                redis::Value::Data(data) => match serde_json::from_slice(data) {
                    Ok(data) => data,
                    Err(err) => {
                        return Err(ChangeStreamError::MessageError {
                            id: message.id.clone(),
                            error: format!("Failed to deserialize data: {:?}", err),
                        })
                    }
                },
                _ => {
                    return Err(ChangeStreamError::MessageError {
                        id: message.id.clone(),
                        error: "Invalid data type".to_string(),
                    })
                }
            },
            None => {
                return Err(ChangeStreamError::MessageError {
                    id: message.id.clone(),
                    error: "Missing data".to_string(),
                })
            }
        },
        trace_state: match message.map.get("tracestate") {
            Some(data) => match data {
                redis::Value::Data(data) => match String::from_utf8(data.to_vec()) {
                    Ok(data) => Some(data),
                    Err(err) => {
                        log::error!("Failed to deserialize tracestate: {:?}", err);
                        None
                    }
                },
                _ => {
                    return Err(ChangeStreamError::MessageError {
                        id: message.id.clone(),
                        error: "Invalid tracestate type".to_string(),
                    })
                }
            },
            None => None,
        },
        trace_parent: match message.map.get("traceparent") {
            Some(data) => match data {
                redis::Value::Data(data) => match String::from_utf8(data.to_vec()) {
                    Ok(data) => Some(data),
                    Err(err) => {
                        log::error!("Failed to deserialize traceparent: {:?}", err);
                        None
                    }
                },
                _ => {
                    return Err(ChangeStreamError::MessageError {
                        id: message.id.clone(),
                        error: "Invalid traceparent type".to_string(),
                    })
                }
            },
            None => None,
        },
        enqueue_time: match message.map.get("enqueue_time") {
            Some(data) => match data {
                redis::Value::Data(data) => match String::from_utf8(data.to_vec()) {
                    Ok(data_str) => match data_str.parse::<u64>() {
                        Ok(parsed) => Some(parsed),
                        Err(err) => {
                            return Err(ChangeStreamError::MessageError {
                                id: message.id.clone(),
                                error: "Failed to parse enqueue_time".to_string(),
                            });
                        }
                    },
                    Err(err) => {
                        return Err(ChangeStreamError::MessageError {
                            id: message.id.clone(),
                            error: format!("Failed to deserialize enqueue_time: {:?}", err),
                        });
                    }
                },
                _ => {
                    log::warn!(
                        "Invalid enqueue_time type for message ID {}: {:?}",
                        message.id,
                        data
                    );
                    None
                }
            },
            None => None,
        },
    })
}

impl From<redis::RedisError> for ChangeStreamError {
    fn from(e: redis::RedisError) -> Self {
        match e.kind() {
            redis::ErrorKind::IoError => {
                ChangeStreamError::IOError(e.detail().unwrap_or_default().into())
            }
            _ => ChangeStreamError::Other(e.detail().unwrap_or_default().into()),
        }
    }
}
