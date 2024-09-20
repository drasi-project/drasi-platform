use std::collections::{BTreeMap, HashMap};

use serde::{Deserialize, Serialize};

use super::ConfigValueDto;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum StorageSpecDto {
    #[serde(rename_all = "camelCase")]
    Memory { enable_archive: bool },
    #[serde(rename_all = "camelCase")]
    Redis {
        connection_string: ConfigValueDto,
        cache_size: Option<u32>,
    },
    #[serde(rename_all = "camelCase")]
    RocksDb {
        #[serde(default)]
        enable_archive: bool,

        storage_class: Option<String>,

        #[serde(default)]
        direct_io: bool,
    },
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryContainerSpecDto {
    pub query_host_count: u16,
    pub results: HashMap<String, ConfigValueDto>,
    pub storage: HashMap<String, StorageSpecDto>,
    pub default_store: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QueryContainerStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}
