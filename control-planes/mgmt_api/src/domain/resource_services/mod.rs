use std::fmt::Debug;
use std::time::Duration;

use crate::domain::models::SourceProviderSpec;
use crate::persistence::ResourceSpecRepository;
use actix_http::Error;
use async_trait::async_trait;
use dapr::client::TonicClient;
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;

use super::models::{DomainError, Resource, ResourceProvider};

mod query_container_service;
mod query_service;
mod reaction_provider_service;
mod reaction_service;
mod source_provider_service;
mod source_service;

pub use query_container_service::QueryContainerDomainService;
pub use query_container_service::QueryContainerDomainServiceImpl;
pub use query_service::QueryDomainService;
pub use query_service::QueryDomainServiceImpl;
pub use reaction_provider_service::ReactionProviderDomainService;
pub use reaction_provider_service::ReactionProviderDomainServiceImpl;
pub use reaction_service::ReactionDomainService;
pub use reaction_service::ReactionDomainServiceImpl;
pub use source_provider_service::SourceProviderDomainService;
pub use source_provider_service::SourceProviderDomainServiceImpl;
pub use source_service::SourceDomainService;
pub use source_service::SourceDomainServiceImpl;

#[async_trait]
pub trait ResourceDomainService<TSpec, TStatus> {
    async fn set(
        &self,
        id: &str,
        source: TSpec,
    ) -> Result<Resource<TSpec, TStatus>, super::models::DomainError>;
    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError>;
    async fn get(&self, id: &str) -> Result<Resource<TSpec, TStatus>, super::models::DomainError>;
    async fn list(&self) -> Result<Vec<Resource<TSpec, TStatus>>, super::models::DomainError>;
    async fn wait_for_ready(
        &self,
        id: &str,
        time_out: Duration,
    ) -> Result<bool, super::models::DomainError>;
}

#[async_trait]
pub trait SpecValidator<TSpec> {
    async fn validate(
        &self,
        _spec: &TSpec,
        _schema: &Option<Value>,
    ) -> Result<(), super::models::DomainError> {
        Ok(())
    }
    async fn validate_schema(&self, _schema: &Value) -> Result<(), super::models::DomainError> {
        Ok(())
    }
}

pub struct ResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
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
    validators: Vec<Box<dyn SpecValidator<TSpec> + Send + Sync>>,
    retrieve_current_kind: fn(&TSpec) -> Option<String>,
    populate_default_values: fn(&TSpec, Value) -> Result<TSpec, DomainError>,
    _TSpec: std::marker::PhantomData<TSpec>,
    _TStatus: std::marker::PhantomData<TStatus>,
    _TApiSpec: std::marker::PhantomData<TApiSpec>,
    _TApiStatus: std::marker::PhantomData<TApiStatus>,
}

#[async_trait]
impl<TSpec, TStatus, TApiSpec, TApiStatus> ResourceDomainService<TSpec, TStatus>
    for ResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
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

    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError> {
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

    async fn get(&self, id: &str) -> Result<Resource<TSpec, TStatus>, super::models::DomainError> {
        log::debug!("Getting resource: {}", id);
        let spec = self.repo.get(id).await?;
        let actor_type = (self.actor_type)(&spec);

        Ok(Resource {
            id: id.to_string(),
            spec: spec,
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

                match status {
                    Some(s) => Some(s.into()),
                    None => None,
                }
            },
        })
    }

    async fn list(&self) -> Result<Vec<Resource<TSpec, TStatus>>, super::models::DomainError> {
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

                    match status {
                        Some(s) => Some(s.into()),
                        None => None,
                    }
                },
            });
        }

        Ok(result)
    }

    async fn wait_for_ready(
        &self,
        id: &str,
        time_out: Duration,
    ) -> Result<bool, super::models::DomainError> {
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

fn add_kind_field_to_schema(schema: Value) -> Result<Value, DomainError> {
    let kind_property = serde_json::json!({
        "type": "string"
    });
    let mut schema = schema.as_object().unwrap().clone();
    schema.insert("kind".to_string(), kind_property);
    Ok(Value::Object(schema))
}

#[async_trait]
pub trait ResourceProviderDomainService<TProviderSpec> {
    async fn set(&self, id: &str, registration: Value)
        -> Result<Value, super::models::DomainError>;
    async fn get(
        &self,
        id: &str,
    ) -> Result<ResourceProvider<TProviderSpec>, super::models::DomainError>;
    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError>;
    async fn list(
        &self,
    ) -> Result<Vec<ResourceProvider<TProviderSpec>>, super::models::DomainError>;
}

pub struct ResourceProviderDomainServiceImpl<TProviderSpec>
where
    TProviderSpec: Serialize + DeserializeOwned + Debug + Clone + Send + Sync,
{
    dapr_client: dapr::Client<TonicClient>,
    repo: Box<dyn ResourceSpecRepository<TProviderSpec> + Send + Sync>,
    validators: Vec<Box<dyn SpecValidator<TProviderSpec> + Send + Sync>>,
    _TProviderSpec: std::marker::PhantomData<TProviderSpec>,
}

#[async_trait]
impl<TProviderSpec> ResourceProviderDomainService<TProviderSpec>
    for ResourceProviderDomainServiceImpl<TProviderSpec>
where
    TProviderSpec: Serialize + DeserializeOwned + Debug + Clone + Send + Sync,
{
    async fn set(
        &self,
        id: &str,
        registration: Value,
    ) -> Result<Value, super::models::DomainError> {
        log::debug!("Registering resource: {}", id);

        let schema = match add_kind_field_to_schema(registration.clone()) {
            Ok(s) => s,
            Err(e) => {
                log::error!("Error adding kind field to schema: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
        };

        for validator in &self.validators {
            validator.validate_schema(&schema).await?;
        }
        self.repo.set_definition_schema(id, &schema).await?;
        Ok(registration)
    }

    async fn get(
        &self,
        id: &str,
    ) -> Result<ResourceProvider<TProviderSpec>, super::models::DomainError> {
        log::debug!("Getting resource: {}", id);
        let spec = self.repo.get(id).await?;

        Ok(ResourceProvider {
            id: id.to_string(),
            spec: spec,
        })
    }

    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError> {
        log::debug!("Deregistering resource: {}", id);
        match self.repo.delete_definition_schema(id).await {
            Ok(_) => {}
            Err(e) => {
                log::error!("Error deregistering resource: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
        }
        Ok(())
    }

    async fn list(
        &self,
    ) -> Result<Vec<ResourceProvider<TProviderSpec>>, super::models::DomainError> {
        log::debug!("Listing resource providers");
        let mut result = Vec::new();
        let items = self.repo.list().await;
        for item in &items {
            result.push(ResourceProvider {
                id: item.0.clone(),
                spec: item.1.clone(),
            });
        }

        Ok(result)
    }
}
