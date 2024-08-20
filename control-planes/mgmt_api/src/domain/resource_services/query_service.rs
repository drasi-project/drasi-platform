use std::collections::BTreeMap;
use std::sync::Arc;
use std::time::Duration;

use super::{QueryContainerDomainService, ResourceDomainService, SpecValidator};
use crate::domain::models::Resource;
use crate::ResourceSpecRepository;
use crate::{
    domain::{
        mappings::ToQueryPartitions,
        models::{DomainError, QuerySpec, QueryStatus},
    },
    persistence::QueryRepository,
};
use async_trait::async_trait;
use dapr::client::TonicClient;
use tokio::task;

pub type QueryDomainService = dyn ResourceDomainService<QuerySpec, QueryStatus>;

pub struct QueryDomainServiceImpl {
    dapr_client: dapr::Client<TonicClient>,
    repo: Box<dyn ResourceSpecRepository<QuerySpec> + Send + Sync>,
    actor_type: fn(&QuerySpec) -> String,
    validators: Vec<Box<dyn SpecValidator<QuerySpec> + Send + Sync>>,
}

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
            validators: vec![Box::new(QuerySpecValidator {
                query_container_service: container_service,
            })],
        }
    }

    async fn collect_partition_statuses(
        &self,
        query_id: &str,
        query_spec: &QuerySpec,
    ) -> Result<Vec<resource_provider_api::models::QueryStatus>, DomainError> {
        let partition_ids = query_spec.to_query_partition_ids(query_id);

        let handles: BTreeMap<_, _> = partition_ids
            .into_iter()
            .map(|query_id| {
                let mut dapr = self.dapr_client.clone();
                let actor_type = (self.actor_type)(&query_spec);

                (
                    query_id.clone(),
                    task::spawn(async move {
                        let status: resource_provider_api::models::QueryStatus = match dapr
                            .invoke_actor(
                                actor_type.clone(),
                                query_id.clone(),
                                "getStatus",
                                (),
                                None,
                            )
                            .await
                        {
                            Ok(r) => r,
                            Err(e) => {
                                log::error!(
                                    "Error getting status for query partition {query_id}: {}",
                                    e
                                );
                                return Err(DomainError::Internal { inner: Box::new(e) });
                            }
                        };

                        Ok((query_id, status))
                    }),
                )
            })
            .collect();

        let mut partitions = Vec::new();

        for (query_id, handle) in handles {
            match handle.await {
                Ok(r) => match r {
                    Ok((query_id, status)) => {
                        log::info!("Got status for query partition {}", query_id);
                        partitions.push(status);
                    }
                    Err(e) => {
                        log::error!("Task failed for query partition {query_id}: {}", e);
                        return Err(DomainError::Internal { inner: Box::new(e) });
                    }
                },
                Err(e) => {
                    log::error!("Task failed for query partition {query_id}: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            }
        }

        Ok(partitions)
    }
}

#[async_trait]
impl ResourceDomainService<QuerySpec, QueryStatus> for QueryDomainServiceImpl {
    async fn set(
        &self,
        id: &str,
        query_spec: QuerySpec,
    ) -> Result<Resource<QuerySpec, QueryStatus>, DomainError> {
        for validator in &self.validators {
            validator.validate(&query_spec, &None).await?;
        }

        self.repo.set(id, &query_spec).await?;

        let partition_specs = query_spec.to_query_partitions(id);

        let handles: BTreeMap<_, _> = partition_specs
            .into_iter()
            .map(|(query_id, partition_spec)| {
                let mut dapr = self.dapr_client.clone();
                let actor_type = (self.actor_type)(&query_spec);

                let request = resource_provider_api::models::ResourceRequest::<
                    resource_provider_api::models::QuerySpec,
                > {
                    id: query_id.clone(),
                    spec: partition_spec,
                };

                (
                    query_id.clone(),
                    task::spawn(async move {
                        let _: () = match dapr
                            .invoke_actor(actor_type, query_id.clone(), "configure", request, None)
                            .await
                        {
                            Err(e) => {
                                log::error!("Error configuring query partition {query_id}: {}", e);
                                return Err(DomainError::Internal { inner: Box::new(e) });
                            }
                            Ok(r) => r,
                        };

                        Ok(())
                    }),
                )
            })
            .collect();

        for (query_id, handle) in handles {
            match handle.await {
                Ok(r) => match r {
                    Ok(_) => log::info!("Configured query partition {}", query_id),
                    Err(e) => {
                        log::error!("Task failed for query partition {query_id}: {}", e);
                        return Err(DomainError::Internal { inner: Box::new(e) });
                    }
                },
                Err(e) => {
                    log::error!("Task failed for query partition {query_id}: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            }
        }

        Ok(Resource {
            id: id.to_string(),
            spec: query_spec,
            status: None,
        })
    }

    async fn delete(&self, id: &str) -> Result<(), DomainError> {
        log::info!("Deleting query: {}", id);
        let spec = self.repo.get(id).await?;
        let partition_ids = spec.to_query_partition_ids(id);

        let handles: BTreeMap<_, _> = partition_ids
            .into_iter()
            .map(|query_id| {
                let mut dapr = self.dapr_client.clone();
                let actor_type = (self.actor_type)(&spec);

                (
                    query_id.clone(),
                    task::spawn(async move {
                        let _: () = match dapr
                            .invoke_actor(
                                actor_type.clone(),
                                query_id.clone(),
                                "deprovision",
                                (),
                                None,
                            )
                            .await
                        {
                            Err(e) => {
                                log::error!(
                                    "Error deprovisioning query partition {query_id}: {}",
                                    e
                                );
                                return Err(DomainError::Internal { inner: Box::new(e) });
                            }
                            Ok(r) => r,
                        };

                        Ok(())
                    }),
                )
            })
            .collect();

        for (query_id, handle) in handles {
            match handle.await {
                Ok(r) => match r {
                    Ok(_) => log::info!("Deprovisioned query partition {}", query_id),
                    Err(e) => {
                        log::error!("Task failed for query partition {query_id}: {}", e);
                        return Err(DomainError::Internal { inner: Box::new(e) });
                    }
                },
                Err(e) => {
                    log::error!("Task failed for query partition {query_id}: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            }
        }

        self.repo.delete(id).await?;
        Ok(())
    }

    async fn get(&self, id: &str) -> Result<Resource<QuerySpec, QueryStatus>, DomainError> {
        log::info!("Getting query: {}", id);
        let query_spec = self.repo.get(id).await?;
        let statuses = self.collect_partition_statuses(id, &query_spec).await?;
        let status_ref: &[resource_provider_api::models::QueryStatus] = &statuses;

        Ok(Resource {
            id: id.to_string(),
            spec: query_spec,
            status: Some(status_ref.into()),
        })
    }

    async fn list(&self) -> Result<Vec<Resource<QuerySpec, QueryStatus>>, DomainError> {
        log::info!("Listing queries");
        let mut result = Vec::new();
        let queries = self.repo.list().await;
        for (id, query_spec) in &queries {
            let statuses = self.collect_partition_statuses(id, &query_spec).await?;
            let status_ref: &[resource_provider_api::models::QueryStatus] = &statuses;

            result.push(Resource {
                id: id.to_string(),
                spec: query_spec.clone(),
                status: Some(status_ref.into()),
            });
        }

        Ok(result)
    }

    async fn wait_for_ready(&self, id: &str, time_out: Duration) -> Result<bool, DomainError> {
        //todo: temp solution, will reimplement with events
        let interval = Duration::from_secs(1);
        let query_spec = self.repo.get(id).await?;
        let partition_ids = query_spec.to_query_partition_ids(id);

        let handles: BTreeMap<_, _> = partition_ids
            .into_iter()
            .map(|query_id| {
                let mut dapr = self.dapr_client.clone();
                let actor_type = (self.actor_type)(&query_spec);

                (
                    query_id.clone(),
                    task::spawn(async move {
                        let start = std::time::Instant::now();
                        while start.elapsed() < time_out {
                            let status: resource_provider_api::models::QueryStatus = match dapr
                                .invoke_actor(
                                    actor_type.clone(),
                                    query_id.clone(),
                                    "getStatus",
                                    (),
                                    None,
                                )
                                .await
                            {
                                Ok(r) => r,
                                Err(e) => {
                                    log::error!(
                                        "Error getting status for query partition {query_id}: {}",
                                        e
                                    );
                                    return Err(DomainError::Internal { inner: Box::new(e) });
                                }
                            };

                            if status.status == "RUNNING" {
                                return Ok(true);
                            }

                            tokio::time::sleep(interval).await;
                        }
                        Ok(false)
                    }),
                )
            })
            .collect();

        for (query_id, handle) in handles {
            match handle.await {
                Ok(r) => match r {
                    Ok(ready) => {
                        if !ready {
                            return Ok(false);
                        }
                    }
                    Err(e) => {
                        log::error!("Task failed for query partition {query_id}: {}", e);
                        return Err(DomainError::Internal { inner: Box::new(e) });
                    }
                },
                Err(e) => {
                    log::error!("Task failed for query partition {query_id}: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            }
        }
        Ok(true)
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
