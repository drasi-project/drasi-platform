use std::sync::Arc;
use std::{collections::BTreeMap, env};

use drasi_query_core::in_memory_index::in_memory_element_index::InMemoryElementIndex;
use drasi_query_core::in_memory_index::in_memory_future_queue::InMemoryFutureQueue;
use drasi_query_core::in_memory_index::in_memory_result_index::InMemoryResultIndex;
use drasi_query_core::index_cache::cached_element_index::CachedElementIndex;
use drasi_query_core::index_cache::cached_result_index::CachedResultIndex;
use drasi_query_core::interface::{
    ElementArchiveIndex, ElementIndex, FutureQueue, IndexError, ResultIndex,
};
use drasi_query_core::models::QueryJoin;
use drasi_query_core::path_solver::match_path::MatchPath;
use drasi_query_index_garnet::element_index::GarnetElementIndex;
use drasi_query_index_garnet::future_queue::GarnetFutureQueue;
use drasi_query_index_garnet::result_index::GarnetResultIndex;
use drasi_query_index_rocksdb::element_index::{RocksDbElementIndex, RocksIndexOptions};
use drasi_query_index_rocksdb::future_queue::RocksDbFutureQueue;
use drasi_query_index_rocksdb::result_index::RocksDbResultIndex;

enum StorageSpec {
    Memory {
        enable_archive: bool,
    },
    Redis {
        connection_string: String,
        cache_size: Option<usize>,
    },
    RocksDb {
        enable_archive: bool,
        direct_io: bool,
    },
}

pub struct IndexFactory {
    default_store: String,
    storage_specs: BTreeMap<String, StorageSpec>,
}

pub struct IndexSet {
    pub element_index: Arc<dyn ElementIndex>,
    pub archive_index: Arc<dyn ElementArchiveIndex>,
    pub result_index: Arc<dyn ResultIndex>,
    pub future_queue: Arc<dyn FutureQueue>,
}

impl IndexFactory {
    pub fn new() -> Self {
        let mut storage_specs = BTreeMap::new();
        let mut store_index = 0;

        while let Ok(store) = env::var(format!("STORE_{}", store_index)) {
            let store_type = match env::var(format!("STORE_{}_TYPE", store_index)) {
                Ok(store_type) => store_type,
                Err(_) => {
                    log::error!("STORE_{}_TYPE not set", store_index);
                    store_index += 1;
                    continue;
                }
            };

            match store_type.to_lowercase().as_str() {
                "memory" => {
                    let enable_archive =
                        match env::var(format!("STORE_{}_ENABLE_ARCHIVE", store_index)) {
                            Ok(enable_archive) => enable_archive.to_lowercase() == "true",
                            Err(_) => {
                                log::warn!(
                                    "STORE_{}_ENABLE_ARCHIVE not set, using false",
                                    store_index
                                );
                                false
                            }
                        };

                    storage_specs.insert(store, StorageSpec::Memory { enable_archive });
                }
                "redis" => {
                    let connection_string =
                        match env::var(format!("STORE_{}_CONNECTION_STRING", store_index)) {
                            Ok(connection_string) => connection_string,
                            Err(_) => {
                                log::error!("STORE_{}_CONNECTION_STRING not set", store_index);
                                store_index += 1;
                                continue;
                            }
                        };

                    let cache_size = match env::var(format!("STORE_{}_CACHE_SIZE", store_index)) {
                        Ok(cache_size) => {
                            let size = cache_size.parse::<usize>().unwrap_or_default();
                            if size < 1 {
                                None
                            } else {
                                Some(size)
                            }
                        }
                        Err(_) => None,
                    };

                    storage_specs.insert(
                        store,
                        StorageSpec::Redis {
                            connection_string,
                            cache_size,
                        },
                    );
                }
                "rocksdb" => {
                    let enable_archive =
                        match env::var(format!("STORE_{}_ENABLE_ARCHIVE", store_index)) {
                            Ok(enable_archive) => enable_archive.to_lowercase() == "true",
                            Err(_) => {
                                log::warn!(
                                    "STORE_{}_ENABLE_ARCHIVE not set, using false",
                                    store_index
                                );
                                false
                            }
                        };

                    let direct_io = match env::var(format!("STORE_{}_DIRECT_IO", store_index)) {
                        Ok(direct_io) => direct_io.to_lowercase() == "true",
                        Err(_) => {
                            log::warn!("STORE_{}_DIRECT_IO not set, using false", store_index);
                            false
                        }
                    };

                    storage_specs.insert(
                        store,
                        StorageSpec::RocksDb {
                            enable_archive,
                            direct_io,
                        },
                    );
                }
                _ => {
                    log::error!("STORE_{}_TYPE not supported", store_index);
                    store_index += 1;
                    continue;
                }
            }

            store_index += 1;
        }

        if storage_specs.is_empty() {
            log::warn!("No storage specs found, using memory");
            storage_specs.insert(
                "memory".into(),
                StorageSpec::Memory {
                    enable_archive: false,
                },
            );
        }

        let default_store = match env::var("DEFAULT_STORE") {
            Ok(store) => store,
            Err(_) => {
                let def_store = storage_specs.first_entry().unwrap().key().clone();
                log::warn!("DEFAULT_STORE not set, using {}", def_store);
                def_store
            }
        };

        Self {
            default_store,
            storage_specs,
        }
    }

    pub async fn build(
        &self,
        store: &Option<String>,
        query_id: &str,
        match_path: &MatchPath,
        joins: &Vec<Arc<QueryJoin>>,
    ) -> Result<IndexSet, IndexError> {
        let store = match store {
            Some(store) => store,
            None => &self.default_store,
        };

        let spec = match self.storage_specs.get(store) {
            Some(spec) => spec,
            None => return Err(IndexError::UnknownStore(store.to_string())),
        };

        match spec {
            StorageSpec::Memory { enable_archive } => {
                let mut element_index = InMemoryElementIndex::new(match_path, joins);
                if *enable_archive {
                    element_index.enable_archive();
                }
                let element_index = Arc::new(element_index);
                let result_index = InMemoryResultIndex::new();
                let future_queue = InMemoryFutureQueue::new();

                Ok(IndexSet {
                    element_index: element_index.clone(),
                    archive_index: element_index,
                    result_index: Arc::new(result_index),
                    future_queue: Arc::new(future_queue),
                })
            }
            StorageSpec::Redis {
                connection_string,
                cache_size,
            } => {
                let element_index =
                    GarnetElementIndex::connect(query_id, connection_string, match_path, joins)
                        .await?;

                let element_index = Arc::new(element_index);
                let result_index = GarnetResultIndex::connect(query_id, connection_string).await?;
                let result_index = Arc::new(result_index);
                let future_queue = GarnetFutureQueue::connect(query_id, connection_string).await?;
                let future_queue = Arc::new(future_queue);

                match cache_size {
                    Some(cache_size) => {
                        let cached_element_index =
                            match CachedElementIndex::new(element_index.clone(), *cache_size) {
                                Ok(cached_index) => cached_index,
                                Err(err) => {
                                    log::error!("Failed to create cached element index: {}", err);
                                    return Err(IndexError::NotSupported);
                                }
                            };

                        let result_index = match CachedResultIndex::new(result_index, *cache_size) {
                            Ok(cri) => Arc::new(cri),
                            Err(err) => {
                                log::error!("Failed to create cached result index: {}", err);
                                return Err(IndexError::NotSupported);
                            }
                        };
                        Ok(IndexSet {
                            element_index: Arc::new(cached_element_index),
                            archive_index: element_index,
                            result_index,
                            future_queue,
                        })
                    }
                    None => Ok(IndexSet {
                        element_index: element_index.clone(),
                        archive_index: element_index,
                        result_index,
                        future_queue,
                    }),
                }
            }
            StorageSpec::RocksDb {
                enable_archive,
                direct_io,
            } => {
                let options = RocksIndexOptions {
                    archive_enabled: *enable_archive,
                    direct_io: *direct_io,
                };
                let element_index =
                    RocksDbElementIndex::new(query_id, "/data", match_path, joins, options)?;
                let element_index = Arc::new(element_index);

                let result_index = RocksDbResultIndex::new(query_id, "/data")?;
                let result_index = Arc::new(result_index);
                let future_queue = RocksDbFutureQueue::new(query_id, "/data")?;
                let future_queue = Arc::new(future_queue);

                Ok(IndexSet {
                    element_index: element_index.clone(),
                    archive_index: element_index,
                    result_index,
                    future_queue,
                })
            }
        }
    }

    pub fn is_volatile(&self, store: &Option<String>) -> bool {
        let store = match store {
            Some(store) => store,
            None => &self.default_store,
        };

        let spec = match self.storage_specs.get(store) {
            Some(spec) => spec,
            None => return false,
        };

        match spec {
            StorageSpec::Memory { .. } => true,
            StorageSpec::Redis { .. } => false,
            StorageSpec::RocksDb { .. } => false,
        }
    }
}
