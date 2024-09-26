use super::{ResourceDomainService, StandardResourceDomainServiceImpl};
use crate::{
    domain::models::{QueryContainerSpec, QueryContainerStatus},
    persistence::QueryContainerRepository,
};
use dapr::client::TonicClient;

pub type QueryContainerDomainService =
    dyn ResourceDomainService<QueryContainerSpec, QueryContainerStatus> + Send + Sync;
pub type QueryContainerDomainServiceImpl = StandardResourceDomainServiceImpl<
    QueryContainerSpec,
    QueryContainerStatus,
    resource_provider_api::models::QueryContainerSpec,
    resource_provider_api::models::QueryContainerStatus,
>;

impl QueryContainerDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Box<QueryContainerRepository>,
    ) -> Self {
        QueryContainerDomainServiceImpl {
            dapr_client,
            repo,
            actor_type: |_spec| "QueryContainerResource".to_string(),
            ready_check: |status| status.available,
            validators: vec![],
            _tspec: std::marker::PhantomData,
            _tstatus: std::marker::PhantomData,
            _tapi_spec: std::marker::PhantomData,
            _tapi_status: std::marker::PhantomData,
        }
    }
}
