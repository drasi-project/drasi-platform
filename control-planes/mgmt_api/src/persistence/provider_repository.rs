use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};
use crate::domain::models::ProviderSpec;
use mongodb::{bson::Document, Database};

pub type ProviderRepository = dyn ResourceSpecRepository<ProviderSpec> + Send + Sync;
pub type ProviderRepositoryImpl = ResourceSpecRepositoryImpl<ProviderSpec>;

impl ProviderRepositoryImpl {
    pub fn new(db: Database, collection_name: &str) -> Self {
        ProviderRepositoryImpl {
            collection: db.collection::<Document>(collection_name),
            _t: std::marker::PhantomData,
        }
    }
}
