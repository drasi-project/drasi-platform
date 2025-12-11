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
    collections::HashMap,
    hash::{Hash, Hasher},
    sync::{Arc, Mutex},
    time::{Duration, SystemTime},
};

use async_stream::stream;
use async_trait::async_trait;
use futures::StreamExt;
use mongodb::{
    bson::{doc, Uuid},
    options, IndexModel,
};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use siphasher::sip128::Hasher128;
use tokio::sync::RwLock;

use crate::{
    api::{ResultChangeEvent, RetentionPolicy, ViewElement},
    models::ViewError,
    view_store::{ViewStore, ViewStream},
};

const MAX_TIMESTAMP: i64 = 253402300799999;

pub struct MongoViewStore {
    database: mongodb::Database,
    retention_policy: RwLock<HashMap<String, RetentionPolicy>>,
    gc_task: Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl MongoViewStore {
    pub async fn connect(
        mongo_uri: &str,
        db_name: &str,
    ) -> Result<Arc<Self>, mongodb::error::Error> {
        let client = mongodb::Client::with_uri_str(mongo_uri).await?;
        let database = client.database(db_name);

        let result = Arc::new(MongoViewStore {
            database,
            retention_policy: RwLock::new(HashMap::new()),
            gc_task: Mutex::new(None),
        });

        let gc_store = result.clone();
        let gc_task = tokio::spawn(async move {
            loop {
                tokio::time::sleep(Duration::from_secs(60)).await;
                collect_garbage(gc_store.clone()).await;
            }
        });

        result
            .gc_task
            .lock()
            .expect("gc_task lock poisoned")
            .replace(gc_task);
        Ok(result)
    }
}

impl Drop for MongoViewStore {
    fn drop(&mut self) {
        let mut gc_task = self.gc_task.lock().expect("gc_task lock poisoned");
        if let Some(task) = gc_task.take() {
            task.abort();
        }
    }
}

#[async_trait]
impl ViewStore for MongoViewStore {
    async fn init_view(&self, query_id: &str, policy: RetentionPolicy) -> Result<(), ViewError> {
        self.set_retention_policy(query_id, policy).await?;

        let collection = self.database.collection::<ViewItem>(query_id);

        let index1 = IndexModel::builder()
            .keys(doc! {
                "validFrom": 1,
                "validTo": 1
            })
            .build();

        let index2 = IndexModel::builder()
            .keys(doc! {
                "hash": 1,
                "validTo": 1
            })
            .build();

        match collection.create_indexes(vec![index1, index2], None).await {
            Ok(r) => {
                log::debug!("created indexes: {:?}", r.index_names);
                Ok(())
            }
            Err(e) => Err(ViewError::StoreError(Box::new(e))),
        }
    }

    async fn set_retention_policy(
        &self,
        query_id: &str,
        policy: RetentionPolicy,
    ) -> Result<(), ViewError> {
        let mut retention_policy = self.retention_policy.write().await;
        retention_policy.insert(query_id.to_string(), policy);
        Ok(())
    }

    async fn delete_view(&self, query_id: &str) -> Result<(), ViewError> {
        let mut retention_policy = self.retention_policy.write().await;
        retention_policy.remove(query_id);
        drop(retention_policy);

        let collection = self.database.collection::<ViewDocument>(query_id);

        match collection
            .drop(options::DropCollectionOptions::builder().build())
            .await
        {
            Ok(r) => log::debug!("clear: {r:?}"),
            Err(e) => return Err(ViewError::StoreError(Box::new(e))),
        };
        Ok(())
    }

    async fn record_change(
        &self,
        query_id: &str,
        change: ResultChangeEvent,
    ) -> Result<(), ViewError> {
        let ret_policy = self.retention_policy.read().await;
        let policy = match ret_policy.get(query_id) {
            Some(p) => *p,
            None => return Err(ViewError::NotFound),
        };
        drop(ret_policy);

        let collection = self.database.collection::<ViewItem>(query_id);

        let ts = change.source_time_ms as i64;

        for del in change.deleted_results {
            let key = hash_values(&del);
            let response = match policy {
                RetentionPolicy::Latest => {
                    collection
                        .find_one_and_delete(
                            doc! {
                                "hash": Uuid::from_bytes(key),
                                "validTo": MAX_TIMESTAMP,
                            },
                            None,
                        )
                        .await
                }
                _ => {
                    collection
                        .find_one_and_update(
                            doc! {
                                "hash": Uuid::from_bytes(key),
                                "validTo": MAX_TIMESTAMP,
                            },
                            doc! {
                                "$set": doc!{
                                    "validTo": ts - 1,
                                }
                            },
                            None,
                        )
                        .await
                }
            };

            match response {
                Ok(r) => log::debug!("remove: {r:?}"),
                Err(e) => return Err(ViewError::StoreError(Box::new(e))),
            };
        }

        for update in change.updated_results {
            if let Some(before) = update.before {
                let before_key = match &update.grouping_keys {
                    Some(bk) => hash_grouping_values(&before, bk),
                    None => hash_values(&before),
                };

                let response = match policy {
                    RetentionPolicy::Latest => {
                        collection
                            .find_one_and_delete(
                                doc! {
                                    "hash": Uuid::from_bytes(before_key),
                                    "validTo": MAX_TIMESTAMP,
                                },
                                None,
                            )
                            .await
                    }
                    _ => {
                        collection
                            .find_one_and_update(
                                doc! {
                                    "hash": Uuid::from_bytes(before_key),
                                    "validTo": MAX_TIMESTAMP,
                                },
                                doc! {
                                    "$set": doc!{
                                        "validTo": ts - 1,
                                    }
                                },
                                None,
                            )
                            .await
                    }
                };

                match response {
                    Ok(r) => log::debug!("update before: {r:?}"),
                    Err(e) => return Err(ViewError::StoreError(Box::new(e))),
                };
            }

            if let Some(after) = update.after {
                let after_key = match &update.grouping_keys {
                    Some(ak) => hash_grouping_values(&after, ak),
                    None => hash_values(&after),
                };

                let response = collection
                    .find_one_and_replace(
                        doc! {
                            "hash": Uuid::from_bytes(after_key),
                            "validTo": MAX_TIMESTAMP,
                        },
                        ViewItem::View(ViewDocument {
                            hash: Uuid::from_bytes(after_key),
                            result: after,
                            valid_from: ts,
                            valid_to: MAX_TIMESTAMP,
                        }),
                        options::FindOneAndReplaceOptions::builder()
                            .upsert(true)
                            .build(),
                    )
                    .await;

                match response {
                    Ok(r) => log::debug!("update after: {r:?}"),
                    Err(e) => return Err(ViewError::StoreError(Box::new(e))),
                };
            }
        }

        for add in change.added_results {
            let key = hash_values(&add);

            let response = collection
                .find_one_and_replace(
                    doc! {
                        "hash": Uuid::from_bytes(key),
                        "validTo": MAX_TIMESTAMP,
                    },
                    ViewItem::View(ViewDocument {
                        hash: Uuid::from_bytes(key),
                        result: add,
                        valid_from: ts,
                        valid_to: MAX_TIMESTAMP,
                    }),
                    options::FindOneAndReplaceOptions::builder()
                        .upsert(true)
                        .build(),
                )
                .await;

            match response {
                Ok(r) => log::debug!("add: {r:?}"),
                Err(e) => return Err(ViewError::StoreError(Box::new(e))),
            };
        }

        let seq_result = collection
            .find_one_and_update(
                doc! {
                    "_id": "$metadata"
                },
                doc! {
                    "$set": doc!{
                        "seq": change.sequence as i64,
                        "ts": ts,
                    }
                },
                options::FindOneAndUpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await;

        if let Err(err) = seq_result {
            return Err(ViewError::StoreError(Box::new(err)));
        }

        Ok(())
    }

    async fn get_view(
        &self,
        query_id: &str,
        timestamp: Option<u64>,
    ) -> Result<ViewStream, ViewError> {
        let ret_policy = self.retention_policy.read().await;
        let policy = match ret_policy.get(query_id) {
            Some(p) => *p,
            None => return Err(ViewError::NotFound),
        };
        drop(ret_policy);

        let collection = self.database.collection::<ViewItem>(query_id);

        let metadata = collection
            .find_one(
                doc! {
                    "_id": "$metadata"
                },
                None,
            )
            .await;

        let metadata = match metadata {
            Ok(Some(ViewItem::Metadata(m))) => m,
            Ok(_) => return Err(ViewError::NotFound),
            Err(err) => return Err(ViewError::StoreError(Box::new(err))),
        };

        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .expect("SystemTime before UNIX EPOCH")
            .as_millis() as u64;
        let timestamp = timestamp.unwrap_or(now) as i64;
        let effective_at = std::cmp::min(metadata.ts, timestamp);

        if let RetentionPolicy::Expire { after_seconds } = policy {
            if ((now - (after_seconds * 1000)) as i64) > timestamp {
                return Err(ViewError::NotFound);
            }
        }

        let data = collection
            .find(
                doc! {
                    "validFrom": { "$lte": effective_at },
                    "validTo": { "$gte": effective_at },
                },
                None,
            )
            .await;

        let mut data = match data {
            Ok(d) => d,
            Err(err) => return Err(ViewError::StoreError(Box::new(err))),
        };

        Ok(stream! {
            yield ViewElement::Header{
                sequence: metadata.seq as u64,
                timestamp: metadata.ts as u64,
                state: metadata.state.clone(),
            };

            while let Some(doc) = data.next().await {
                match doc {
                    Ok(ViewItem::View(v)) => {
                        yield ViewElement::Data(v.result);
                    },
                    Ok(ViewItem::Metadata(_)) => {},
                    Err(err) => {
                        log::error!("error reading from view: {err:?}");
                    }
                }
            }
        }
        .boxed())
    }

    async fn set_state(
        &self,
        query_id: &str,
        sequence: u64,
        ts: u64,
        state: &str,
    ) -> Result<(), ViewError> {
        let collection = self.database.collection::<ViewItem>(query_id);

        let seq_result = collection
            .find_one_and_update(
                doc! {
                    "_id": "$metadata"
                },
                doc! {
                    "$set": doc!{
                        "seq": sequence as i64,
                        "ts": ts as i64,
                        "state": state,
                    }
                },
                options::FindOneAndUpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await;

        if let Err(err) = seq_result {
            return Err(ViewError::StoreError(Box::new(err)));
        }

        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ViewDocument {
    hash: Uuid,
    result: Map<String, Value>,
    valid_from: i64,
    valid_to: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct MetadataDocument {
    seq: i64,
    ts: i64,
    state: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
enum ViewItem {
    View(ViewDocument),
    Metadata(MetadataDocument),
}

fn hash_grouping_values(values: &Map<String, Value>, grouping_keys: &Vec<String>) -> [u8; 16] {
    let mut h = siphasher::sip128::SipHasher::new();

    for key in grouping_keys {
        if let Some(value) = values.get(key.as_str()) {
            key.hash(&mut h);
            hash_value(value, &mut h);
        }
    }
    let res = h.finish128();
    res.as_bytes()
}

fn hash_values(values: &Map<String, Value>) -> [u8; 16] {
    let mut h = siphasher::sip128::SipHasher::new();

    for (key, value) in values {
        key.hash(&mut h);
        hash_value(value, &mut h);
    }
    let res = h.finish128();
    res.as_bytes()
}

fn hash_value(value: &Value, mut hasher: &mut dyn Hasher) {
    match value {
        Value::Null => hasher.write_u8(0),
        Value::Bool(b) => hasher.write_u8(if *b { 1 } else { 2 }),
        Value::Number(n) => {
            if let Some(n) = n.as_i64() {
                hasher.write_i64(n);
            } else if let Some(n) = n.as_u64() {
                hasher.write_u64(n);
            } else if let Some(n) = n.as_f64() {
                hasher.write_u64(n.to_bits());
            }
        }
        Value::String(s) => hasher.write(s.as_bytes()),
        Value::Array(a) => {
            for v in a {
                hash_value(v, &mut hasher);
            }
        }
        Value::Object(o) => {
            let mut keys: Vec<_> = o.keys().collect();
            keys.sort();
            for k in keys {
                hasher.write(k.as_bytes());
                hash_value(&o[k], &mut hasher);
            }
        }
    }
}

async fn collect_garbage(store: Arc<MongoViewStore>) {
    log::info!("collecting garbage");
    let retention_policy = store.retention_policy.read().await;
    let policy_snapshot = retention_policy.clone();
    drop(retention_policy);

    let now = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .expect("SystemTime before UNIX EPOCH")
        .as_millis() as i64;

    for (query_id, policy) in policy_snapshot {
        let epoch = match policy {
            RetentionPolicy::Latest => continue,
            RetentionPolicy::Expire { after_seconds } => now - (after_seconds as i64 * 1000),
            RetentionPolicy::All => continue,
        };

        log::info!("query {query_id} garbage collection: {epoch}");

        let collection = store.database.collection::<ViewItem>(&query_id);

        let del_response = collection
            .delete_many(
                doc! {
                    "validTo": { "$lt": epoch },
                },
                None,
            )
            .await;

        match del_response {
            Ok(r) => log::info!("query {query_id} garbage collection: {r:?}"),
            Err(e) => log::error!("query {query_id} garbage collection error: {e:?}"),
        };
    }
}
