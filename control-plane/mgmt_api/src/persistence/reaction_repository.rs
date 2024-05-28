use mongodb::{bson::Document, Database};

use crate::domain::models::ReactionSpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type ReactionRepository = dyn ResourceSpecRepository<ReactionSpec> + Send + Sync;

pub type ReactionRepositoryImpl = ResourceSpecRepositoryImpl<ReactionSpec>;

impl ReactionRepositoryImpl {
    pub fn new(db: Database) -> Self {
        ReactionRepositoryImpl {
            collection: db.collection::<Document>("reactions"),
            schema_collection: Some(db.collection::<Document>("reaction_schemas")),
            _t: std::marker::PhantomData,
        }
    }
}
