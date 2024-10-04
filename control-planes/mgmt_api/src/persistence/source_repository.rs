use mongodb::{bson::Document, Database};

use crate::domain::models::SourceSpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type SourceRepository = dyn ResourceSpecRepository<SourceSpec> + Send + Sync;

pub type SourceRepositoryImpl = ResourceSpecRepositoryImpl<SourceSpec>;

impl SourceRepositoryImpl {
    pub fn new(db: Database) -> Self {
        SourceRepositoryImpl {
            collection: db.collection::<Document>("sources"),
            _t: std::marker::PhantomData,
        }
    }
}
