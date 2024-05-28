use std::collections::HashMap;
use std::sync::Arc;

use super::{
    QueryContainerDomainService, ResourceDomainService, ResourceDomainServiceImpl, SpecValidator,
};
use crate::{
    domain::models::{DomainError, QuerySpec, QueryStatus},
    persistence::QueryRepository,
};
use async_trait::async_trait;
use dapr::client::TonicClient;

pub type QueryDomainService = dyn ResourceDomainService<QuerySpec, QueryStatus>;
pub type QueryDomainServiceImpl = ResourceDomainServiceImpl<
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
            repo: repo,
            actor_type: |spec| format!("{}.ContinuousQuery", spec.container),
            ready_check: |status| status.status == "RUNNING",
            validators: vec![Box::new(QuerySpecValidator {
                query_container_service: container_service,
            })],
            retrieve_current_kind: |_spec| None,
            populate_default_values: |properties, _| Ok(properties.clone()),
            _TSpec: std::marker::PhantomData,
            _TStatus: std::marker::PhantomData,
            _TApiSpec: std::marker::PhantomData,
            _TApiStatus: std::marker::PhantomData,
        }
    }
}

struct QuerySpecValidator {
    query_container_service: Arc<QueryContainerDomainService>,
}

#[async_trait]
impl SpecValidator<QuerySpec> for QuerySpecValidator {
    async fn validate(
        &self,
        spec: &QuerySpec,
        _schema: &Option<serde_json::Value>,
    ) -> Result<(), DomainError> {
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
