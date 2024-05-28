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
    consumer_id: String,
}

pub enum InitialCursor {
    Beginning,
    End,
}

impl RedisChangeStream {
    pub async fn new(
        url: &str,
        topic: &str,
        group_id: &str,
        consumer_id: &str,
        buffer_size: usize,
        fetch_batch_size: usize,
        initial_cursor: InitialCursor,
    ) -> Result<Self, ChangeStreamError> {
        let client = redis::Client::open(url)?;
        let mut connection = client.get_async_connection().await?;

        let start_id = match initial_cursor {
            InitialCursor::Beginning => "0",
            InitialCursor::End => "$",
        };

        match connection
            .xgroup_create_mkstream::<&str, &str, &str, String>(topic, group_id, start_id)
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
        let bg_consumer_id = consumer_id.to_string();

        _ = tokio::spawn(async move {
            let pending_opts = StreamReadOptions::default()
                .count(fetch_batch_size)
                .group(&bg_group_id, &bg_consumer_id);

            let read_opts: StreamReadOptions = StreamReadOptions::default()
                .count(fetch_batch_size)
                .block(0)
                .group(&bg_group_id, &bg_consumer_id);

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
            consumer_id: consumer_id.to_string(),
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
            .xgroup_delconsumer(&self.topic, &self.group_id, &self.consumer_id)
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
        _ = self.cancel.notify_one();
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
    let mut evt: cloudevents::Event = match message.map.get("data") {
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
    };

    match evt.take_data() {
        (_, _, Some(data)) => match data {
            cloudevents::Data::Json(data) => match serde_json::from_value(data) {
                Ok(data) => Ok(Message {
                    id: message.id.clone(),
                    data,
                    trace_state: match evt.extension("tracestate") {
                        Some(v) => Some(v.to_string()),
                        None => None,
                    },
                    trace_parent: match evt.extension("traceparent") {
                        Some(v) => Some(v.to_string()),
                        None => None,
                    },
                }),
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
        _ => {
            return Err(ChangeStreamError::MessageError {
                id: message.id.clone(),
                error: "Missing data".to_string(),
            })
        }
    }
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
