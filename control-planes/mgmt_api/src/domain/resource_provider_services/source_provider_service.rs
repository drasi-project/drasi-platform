use std::sync::Arc;

use super::{ResourceProviderDomainService, ResourceProviderDomainServiceImpl};
use crate::{domain::models::SourceProviderMarker, persistence::ProviderRepository};
use dapr::client::TonicClient;
pub type SourceProviderDomainService = dyn ResourceProviderDomainService<SourceProviderMarker>;
pub type SourceProviderDomainServiceImpl = ResourceProviderDomainServiceImpl<SourceProviderMarker>;

impl SourceProviderDomainServiceImpl {
    pub fn new(dapr_client: dapr::Client<TonicClient>, repo: Arc<ProviderRepository>) -> Self {
        SourceProviderDomainServiceImpl {
            dapr_client,
            repo,
            validators: vec![],
            _marker: std::marker::PhantomData,
        }
    }
}
