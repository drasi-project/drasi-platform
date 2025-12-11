// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::sync::Arc;

use crate::persistence::ResourceSpecRepository;
use async_trait::async_trait;
use dapr::client::TonicClient;
use serde_json::Value;

use super::models::ProviderSpec;
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
    let mut schema = schema
        .as_object()
        .ok_or_else(|| DomainError::InvalidSpec {
            message: "Schema must be a JSON object".to_string(),
        })?
        .clone();
    schema.insert("kind".to_string(), kind_property);
    Ok(Value::Object(schema))
}

#[async_trait]
pub trait SchemaValidator {
    async fn validate_schema(
        &self,
        _schema: &ProviderSpec,
    ) -> Result<(), super::models::DomainError>;
}

#[async_trait]
pub trait ResourceProviderDomainService<TMarker> {
    async fn set(
        &self,
        id: &str,
        registration: ProviderSpec,
    ) -> Result<ProviderSpec, super::models::DomainError>;
    async fn get(
        &self,
        id: &str,
    ) -> Result<ResourceProvider<ProviderSpec>, super::models::DomainError>;
    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError>;
    async fn list(&self)
        -> Result<Vec<ResourceProvider<ProviderSpec>>, super::models::DomainError>;
}

pub struct ResourceProviderDomainServiceImpl<TMarker> {
    dapr_client: dapr::Client<TonicClient>,
    repo: Arc<dyn ResourceSpecRepository<ProviderSpec> + Send + Sync>,
    validators: Vec<Box<dyn SchemaValidator + Send + Sync>>,
    _marker: std::marker::PhantomData<TMarker>,
}

#[async_trait]
impl<TMarker> ResourceProviderDomainService<TMarker> for ResourceProviderDomainServiceImpl<TMarker>
where
    TMarker: Send + Sync,
{
    async fn set(
        &self,
        id: &str,
        registration: ProviderSpec,
    ) -> Result<ProviderSpec, super::models::DomainError> {
        log::debug!("Registering resource: {}", id);

        // let schema = match add_kind_field_to_schema(registration.clone()) {
        //     Ok(s) => s,
        //     Err(e) => {
        //         log::error!("Error adding kind field to schema: {}", e);
        //         return Err(DomainError::Internal { inner: Box::new(e) });
        //     }
        // };

        for validator in &self.validators {
            validator.validate_schema(&registration).await?;
        }
        self.repo.set(id, &registration).await?;
        Ok(registration)
    }

    async fn get(
        &self,
        id: &str,
    ) -> Result<ResourceProvider<ProviderSpec>, super::models::DomainError> {
        log::debug!("Getting resource: {}", id);
        let spec = self.repo.get(id).await?;

        Ok(ResourceProvider {
            id: id.to_string(),
            spec,
        })
    }

    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError> {
        log::debug!("Deregistering resource: {}", id);
        match self.repo.delete(id).await {
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
    ) -> Result<Vec<ResourceProvider<ProviderSpec>>, super::models::DomainError> {
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
