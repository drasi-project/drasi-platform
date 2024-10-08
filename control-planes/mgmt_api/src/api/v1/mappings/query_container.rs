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

use crate::domain::models::{QueryContainerSpec, QueryContainerStatus, StorageSpec};

use super::{QueryContainerSpecDto, QueryContainerStatusDto, StorageSpecDto};

impl From<QueryContainerStatus> for QueryContainerStatusDto {
    fn from(status: QueryContainerStatus) -> Self {
        QueryContainerStatusDto {
            available: status.available,
            messages: status.messages,
        }
    }
}

impl From<StorageSpecDto> for StorageSpec {
    fn from(spec: StorageSpecDto) -> Self {
        match spec {
            StorageSpecDto::Memory { enable_archive } => StorageSpec::Memory { enable_archive },
            StorageSpecDto::Redis {
                connection_string,
                cache_size,
            } => StorageSpec::Redis {
                connection_string: connection_string.into(),
                cache_size,
            },
            StorageSpecDto::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            } => StorageSpec::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            },
        }
    }
}
impl From<StorageSpec> for StorageSpecDto {
    fn from(spec: StorageSpec) -> Self {
        match spec {
            StorageSpec::Memory { enable_archive } => StorageSpecDto::Memory { enable_archive },
            StorageSpec::Redis {
                connection_string,
                cache_size,
            } => StorageSpecDto::Redis {
                connection_string: connection_string.into(),
                cache_size,
            },
            StorageSpec::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            } => StorageSpecDto::RocksDb {
                enable_archive,
                storage_class,
                direct_io,
            },
        }
    }
}

impl From<QueryContainerSpecDto> for QueryContainerSpec {
    fn from(spec: QueryContainerSpecDto) -> Self {
        QueryContainerSpec {
            query_host_count: spec.query_host_count,
            storage: spec
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            results: spec
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: spec.default_store,
        }
    }
}

impl From<QueryContainerSpec> for QueryContainerSpecDto {
    fn from(spec: QueryContainerSpec) -> Self {
        QueryContainerSpecDto {
            query_host_count: spec.query_host_count,
            storage: spec
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            results: spec
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: spec.default_store,
        }
    }
}
