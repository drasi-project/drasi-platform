use async_trait::async_trait;
use dapr::client::TonicClient;
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;
use std::{fmt::Debug, time::Duration};

use crate::{
    domain::models::{DomainError, Resource},
    ResourceSpecRepository,
};

use super::ResourceDomainService;

mod reaction_service;
mod source_service;

pub use reaction_service::ReactionDomainService;
pub use reaction_service::ReactionDomainServiceImpl;
pub use source_service::SourceDomainService;
pub use source_service::SourceDomainServiceImpl;

#[async_trait]
pub trait ExtensibleSpecValidator<TSpec> {
    async fn validate(&self, _spec: &TSpec, _schema: &Option<Value>) -> Result<(), DomainError> {
        Ok(())
    }
}

pub struct ExtensibleResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
where
    TSpec: Serialize + DeserializeOwned + Debug + Clone + Into<TApiSpec> + Send + Sync,
    TStatus: Send + Sync,
    TApiSpec: Serialize + Send + Sync,
    TApiStatus: DeserializeOwned + Send + Sync,
{
    dapr_client: dapr::Client<TonicClient>,
    repo: Box<dyn ResourceSpecRepository<TSpec> + Send + Sync>,
    actor_type: fn(&TSpec) -> String,
    ready_check: fn(&TStatus) -> bool,
    validators: Vec<Box<dyn ExtensibleSpecValidator<TSpec> + Send + Sync>>,
    retrieve_current_kind: fn(&TSpec) -> Option<String>,
    populate_default_values: fn(&TSpec, Value) -> Result<TSpec, DomainError>,
    _tspec: std::marker::PhantomData<TSpec>,
    _tstatus: std::marker::PhantomData<TStatus>,
    _tapi_spec: std::marker::PhantomData<TApiSpec>,
    _tapi_status: std::marker::PhantomData<TApiStatus>,
}

#[async_trait]
impl<TSpec, TStatus, TApiSpec, TApiStatus> ResourceDomainService<TSpec, TStatus>
    for ExtensibleResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
where
    TSpec: Serialize + DeserializeOwned + Debug + Clone + Into<TApiSpec> + Send + Sync,
    TStatus: Send + Sync,
    TApiSpec: Serialize + Send + Sync,
    TApiStatus: DeserializeOwned + Into<TStatus> + Send + Sync,
{
    async fn set(&self, id: &str, source: TSpec) -> Result<Resource<TSpec, TStatus>, DomainError> {
        log::debug!("Setting resource: {}", id);
        let current_kind = (self.retrieve_current_kind)(&source);
        let schema = match current_kind {
            Some(kind) => match self.repo.get_definition_schema(kind.as_str()).await {
                Ok(s) => match s {
                    Some(s) => Some(s),
                    None => {
                        log::error!("Error getting schema for resource: {}", kind);
                        return Err(DomainError::Invalid {
                            message: (format!("Schema not initialized for kind: {}", kind)),
                        });
                    }
                },
                Err(e) => {
                    log::error!("Error getting schema for resource: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            },
            None => None,
        };

        let mut source = source.clone();
        if let Some(schema) = schema.clone() {
            source = match (self.populate_default_values)(&source, schema) {
                Ok(s) => s,
                Err(e) => {
                    log::error!("Error populating default values for resource: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            };
        }

        for validator in &self.validators {
            validator.validate(&source, &schema).await?;
        }

        log::info!("Validated resource: {}", id);

        let mut mut_dapr = self.dapr_client.clone();

        self.repo.set(id, &source).await?;

        let request = resource_provider_api::models::ResourceRequest::<TApiSpec> {
            id: id.to_string(),
            spec: source.clone().into(),
        };

        let _: () = match mut_dapr
            .invoke_actor(
                (self.actor_type)(&source),
                id.to_string(),
                "configure",
                request,
                None,
            )
            .await
        {
            Err(e) => {
                log::error!("Error configuring resource: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            r => r.unwrap(),
        };

        Ok(Resource {
            id: id.to_string(),
            spec: source,
            status: None,
        })
    }

    async fn delete(&self, id: &str) -> Result<(), DomainError> {
        log::debug!("Deleting resource: {}", id);
        let spec = self.repo.get(id).await?;
        let mut mut_dapr = self.dapr_client.clone();
        let _: () = match mut_dapr
            .invoke_actor(
                (self.actor_type)(&spec),
                id.to_string(),
                "deprovision",
                (),
                None,
            )
            .await
        {
            Err(e) => {
                log::error!("Error deprovisioning resource: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            r => r.unwrap(),
        };

        self.repo.delete(id).await?;
        Ok(())
    }

    async fn get(&self, id: &str) -> Result<Resource<TSpec, TStatus>, DomainError> {
        log::debug!("Getting resource: {}", id);
        let spec = self.repo.get(id).await?;
        let actor_type = (self.actor_type)(&spec);

        Ok(Resource {
            id: id.to_string(),
            spec,
            status: {
                let mut mut_dapr = self.dapr_client.clone();
                let status: Option<TApiStatus> = match mut_dapr
                    .invoke_actor(actor_type, id.to_string(), "getStatus", (), None)
                    .await
                {
                    Ok(r) => Some(r),
                    Err(e) => {
                        log::error!("Error getting status for resource: {} - {:?}", id, e);
                        None
                    }
                };

                status.map(|s| s.into())
            },
        })
    }

    async fn list(&self) -> Result<Vec<Resource<TSpec, TStatus>>, DomainError> {
        log::debug!("Listing resources");
        let mut result = Vec::new();
        let mut mut_dapr = self.dapr_client.clone();
        let items = self.repo.list().await;
        for item in &items {
            result.push(Resource {
                id: item.0.clone(),
                spec: item.1.clone(),
                status: {
                    let status: Option<TApiStatus> = match mut_dapr
                        .invoke_actor(
                            (self.actor_type)(&item.1),
                            item.0.to_string(),
                            "getStatus",
                            (),
                            None,
                        )
                        .await
                    {
                        Ok(r) => Some(r),
                        Err(e) => {
                            log::error!("Error getting status for resource: {} - {:?}", item.0, e);
                            None
                        }
                    };

                    status.map(|s| s.into())
                },
            });
        }

        Ok(result)
    }

    async fn wait_for_ready(&self, id: &str, time_out: Duration) -> Result<bool, DomainError> {
        //todo: temp solution, will reimplement with events
        let interval = Duration::from_secs(1);

        let spec = self.repo.get(id).await?;
        let actor_type = (self.actor_type)(&spec);

        let mut mut_dapr = self.dapr_client.clone();
        let start = std::time::Instant::now();

        while start.elapsed() < time_out {
            let status: TApiStatus = match mut_dapr
                .invoke_actor(actor_type.clone(), id.to_string(), "getStatus", (), None)
                .await
            {
                Ok(r) => r,
                Err(e) => {
                    log::error!("Error getting status for resource: {} - {:?}", id, e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            };

            if (self.ready_check)(&status.into()) {
                return Ok(true);
            }

            tokio::time::sleep(interval).await;
        }

        Ok(false)
    }
}
