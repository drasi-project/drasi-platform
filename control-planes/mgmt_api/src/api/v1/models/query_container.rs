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

use std::collections::{BTreeMap, HashMap};

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::ConfigValueDto;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
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

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QueryContainerSpecDto {
    pub query_host_count: u16,
    pub results: HashMap<String, ConfigValueDto>,
    pub storage: HashMap<String, StorageSpecDto>,
    pub default_store: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
pub struct QueryContainerStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct QueryContainerDto {
    pub id: String,
    pub spec: QueryContainerSpecDto,
    pub status: Option<QueryContainerStatusDto>,
}
