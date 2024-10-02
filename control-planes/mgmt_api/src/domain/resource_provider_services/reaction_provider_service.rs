use std::sync::Arc;

use super::{ResourceProviderDomainService, ResourceProviderDomainServiceImpl};
use crate::{domain::models::ReactionProviderMarker, ProviderRepository};
use dapr::client::TonicClient;

pub type ReactionProviderDomainService = dyn ResourceProviderDomainService<ReactionProviderMarker>;
pub type ReactionProviderDomainServiceImpl =
    ResourceProviderDomainServiceImpl<ReactionProviderMarker>;

impl ReactionProviderDomainServiceImpl {
    pub fn new(dapr_client: dapr::Client<TonicClient>, repo: Arc<ProviderRepository>) -> Self {
        ReactionProviderDomainServiceImpl {
            dapr_client,
            repo,
            validators: vec![],
            _marker: std::marker::PhantomData,
        }
    }
}
