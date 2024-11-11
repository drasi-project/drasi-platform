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

use async_trait::async_trait;
use dapr::client::TonicClient;
use serde::{de::DeserializeOwned, Serialize};
use std::{fmt::Debug, sync::Arc, time::Duration};

use crate::{
    domain::models::{DomainError, Resource},
    ResourceSpecRepository,
};

use super::ResourceDomainService;

mod query_container_service;
mod query_service;

pub use query_container_service::QueryContainerDomainService;
pub use query_container_service::QueryContainerDomainServiceImpl;
pub use query_service::QueryDomainService;
pub use query_service::QueryDomainServiceImpl;

#[async_trait]
pub trait StandardSpecValidator<TSpec> {
    async fn validate(&self, _spec: &TSpec) -> Result<(), DomainError> {
        Ok(())
    }
}

pub struct StandardResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
where
    TSpec: Serialize + DeserializeOwned + Debug + Clone + Into<TApiSpec> + Send + Sync,
    TStatus: Send + Sync,
    TApiSpec: Serialize + Send + Sync,
    TApiStatus: DeserializeOwned + Send + Sync,
{
    dapr_client: dapr::Client<TonicClient>,
    repo: Arc<dyn ResourceSpecRepository<TSpec> + Send + Sync>,
    actor_type: fn(&TSpec) -> String,
    ready_check: fn(&TStatus) -> bool,
    validators: Vec<Box<dyn StandardSpecValidator<TSpec> + Send + Sync>>,
    _tspec: std::marker::PhantomData<TSpec>,
    _tstatus: std::marker::PhantomData<TStatus>,
    _tapi_spec: std::marker::PhantomData<TApiSpec>,
    _tapi_status: std::marker::PhantomData<TApiStatus>,
}

#[async_trait]
impl<TSpec, TStatus, TApiSpec, TApiStatus> ResourceDomainService<TSpec, TStatus>
    for StandardResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
where
    TSpec: Serialize + DeserializeOwned + Debug + Clone + Into<TApiSpec> + Send + Sync,
    TStatus: Send + Sync,
    TApiSpec: Serialize + Send + Sync,
    TApiStatus: DeserializeOwned + Into<TStatus> + Send + Sync,
{
    async fn set(
        &self,
        id: &str,
        resource: TSpec,
    ) -> Result<Resource<TSpec, TStatus>, DomainError> {
        log::info!("Setting resource: {}", id);

        for validator in &self.validators {
            validator.validate(&resource).await?;
        }

        log::info!("Validated resource: {}", id);

        let mut mut_dapr = self.dapr_client.clone();

        self.repo.set(id, &resource).await?;

        let request = resource_provider_api::models::ResourceRequest::<TApiSpec> {
            id: id.to_string(),
            spec: resource.clone().into(),
        };

        let _: () = match mut_dapr
            .invoke_actor(
                (self.actor_type)(&resource),
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
            spec: resource,
            status: None,
        })
    }

    async fn delete(&self, id: &str) -> Result<(), DomainError> {
        log::info!("Deleting resource: {}", id);
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
        log::info!("Getting resource: {}", id);
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
