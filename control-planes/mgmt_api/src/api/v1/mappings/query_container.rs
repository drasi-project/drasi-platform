use crate::domain::models::{QueryContainerSpec, QueryContainerStatus, StorageSpec};

use super::{QueryContainerSpecDto, QueryContainerStatusDto, StorageSpecDto};

impl From<QueryContainerStatus> for QueryContainerStatusDto {
    fn from(status: QueryContainerStatus) -> Self {
        QueryContainerStatusDto {
            available: status.available,
        }
    }
}

impl Into<StorageSpec> for StorageSpecDto {
    fn into(self) -> StorageSpec {
        match self {
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
                storage_class: storage_class.into(),
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
                storage_class: storage_class.into(),
                direct_io,
            },
        }
    }
}

impl Into<QueryContainerSpec> for QueryContainerSpecDto {
    fn into(self) -> QueryContainerSpec {
        QueryContainerSpec {
            query_host_count: self.query_host_count,
            storage: self
                .storage
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            results: self
                .results
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            default_store: self.default_store,
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
