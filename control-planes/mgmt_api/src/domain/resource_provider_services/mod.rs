use std::fmt::Debug;

use crate::persistence::ResourceSpecRepository;
use async_trait::async_trait;
use dapr::client::TonicClient;
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;

use super::models::{DomainError, ResourceProvider};

mod reaction_provider_service;
mod source_provider_service;

pub use reaction_provider_service::ReactionProviderDomainService;
pub use reaction_provider_service::ReactionProviderDomainServiceImpl;
pub use source_provider_service::SourceProviderDomainService;
pub use source_provider_service::SourceProviderDomainServiceImpl;

fn add_kind_field_to_schema(schema: Value) -> Result<Value, DomainError> {
    let kind_property = serde_json::json!({
        "type": "string"
    });
    let mut schema = schema.as_object().unwrap().clone();
    schema.insert("kind".to_string(), kind_property);
    Ok(Value::Object(schema))
}

#[async_trait]
pub trait SchemaValidator {
    async fn validate_schema(&self, _schema: &Value) -> Result<(), super::models::DomainError>;
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
    validators: Vec<Box<dyn SchemaValidator + Send + Sync>>,
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
