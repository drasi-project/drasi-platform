use std::sync::Arc;

use super::{
    QueryContainerDomainService, ResourceDomainService, StandardResourceDomainServiceImpl,
    StandardSpecValidator,
};
use crate::{
    domain::models::{DomainError, QuerySpec, QueryStatus},
    persistence::QueryRepository,
};
use async_trait::async_trait;
use dapr::client::TonicClient;

pub type QueryDomainService = dyn ResourceDomainService<QuerySpec, QueryStatus>;
pub type QueryDomainServiceImpl = StandardResourceDomainServiceImpl<
    QuerySpec,
    QueryStatus,
    resource_provider_api::models::QuerySpec,
    resource_provider_api::models::QueryStatus,
>;

impl QueryDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Box<QueryRepository>,
        container_service: Arc<QueryContainerDomainService>,
    ) -> Self {
        QueryDomainServiceImpl {
            dapr_client,
            repo,
            actor_type: |spec| format!("{}.ContinuousQuery", spec.container),
            ready_check: |status| status.status == "RUNNING",
            validators: vec![Box::new(QuerySpecValidator {
                query_container_service: container_service,
            })],
            _tspec: std::marker::PhantomData,
            _tstatus: std::marker::PhantomData,
            _tapi_spec: std::marker::PhantomData,
            _tapi_status: std::marker::PhantomData,
        }
    }
}

struct QuerySpecValidator {
    query_container_service: Arc<QueryContainerDomainService>,
}

#[async_trait]
impl StandardSpecValidator<QuerySpec> for QuerySpecValidator {
    async fn validate(&self, spec: &QuerySpec) -> Result<(), DomainError> {
        let qc = match self.query_container_service.get(&spec.container).await {
            Ok(qc) => qc,
            Err(e) => match e {
                DomainError::NotFound => {
                    return Err(DomainError::Invalid {
                        message: format!("Query container {} does not exist", spec.container),
                    })
                }
                _ => return Err(e),
            },
        };

        match qc.status {
            Some(status) => match status.available {
                true => Ok(()),
                false => Err(DomainError::QueryContainerOffline),
            },
            None => Err(DomainError::QueryContainerOffline),
        }
    }
}
