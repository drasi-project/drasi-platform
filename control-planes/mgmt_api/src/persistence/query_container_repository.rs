use mongodb::{bson::Document, Database};

use crate::domain::models::QueryContainerSpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type QueryContainerRepository = dyn ResourceSpecRepository<QueryContainerSpec> + Send + Sync;

pub type QueryContainerRepositoryImpl = ResourceSpecRepositoryImpl<QueryContainerSpec>;

impl QueryContainerRepositoryImpl {
    pub fn new(db: Database) -> Self {
        QueryContainerRepositoryImpl {
            collection: db.collection::<Document>("query-containers"),
            _t: std::marker::PhantomData,
        }
    }
}
