use mongodb::{bson::Document, Database};

use crate::domain::models::QuerySpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type QueryRepository = dyn ResourceSpecRepository<QuerySpec> + Send + Sync;

pub type QueryRepositoryImpl = ResourceSpecRepositoryImpl<QuerySpec>;

impl QueryRepositoryImpl {
    pub fn new(db: Database) -> Self {
        QueryRepositoryImpl {
            collection: db.collection::<Document>("queries"),
            _t: std::marker::PhantomData,
        }
    }
}
