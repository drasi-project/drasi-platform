use mongodb::{bson::Document, Database};

use crate::domain::models::ReactionProviderSpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type ReactionProviderRepository =
    dyn ResourceSpecRepository<ReactionProviderSpec> + Send + Sync;
pub type ReactionRepository = dyn ResourceSpecRepository<ReactionProviderSpec> + Send + Sync;

pub type ReactionProviderRepositoryImpl = ResourceSpecRepositoryImpl<ReactionProviderSpec>;

impl ReactionProviderRepositoryImpl {
    pub fn new(db: Database) -> Self {
        ReactionProviderRepositoryImpl {
            collection: db.collection::<Document>("reaction_schemas"),
            schema_collection: Some(db.collection::<Document>("reaction_schemas")),
            _t: std::marker::PhantomData,
        }
    }
}
