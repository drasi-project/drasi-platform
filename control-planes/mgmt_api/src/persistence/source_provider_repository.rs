use mongodb::{bson::Document, Database};

use crate::domain::models::SourceProviderSpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type SourceProviderRepository = dyn ResourceSpecRepository<SourceProviderSpec> + Send + Sync;

pub type SourceProviderRepositoryImpl = ResourceSpecRepositoryImpl<SourceProviderSpec>;

impl SourceProviderRepositoryImpl {
    pub fn new(db: Database) -> Self {
        SourceProviderRepositoryImpl {
            collection: db.collection::<Document>("source_schemas"),
            schema_collection: Some(db.collection::<Document>("source_schemas")),
            _t: std::marker::PhantomData,
        }
    }
}
