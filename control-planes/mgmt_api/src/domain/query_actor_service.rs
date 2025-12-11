use dapr::client::TonicClient;
use resource_provider_api::models::QueryStatus;

use super::models::{DomainError, QuerySpec};

pub struct QueryActorService {
    dapr_client: dapr::Client<TonicClient>,
}

impl QueryActorService {
    pub fn new(dapr_client: dapr::Client<TonicClient>) -> Self {
        Self { dapr_client }
    }

    pub async fn configure(&self, id: &str, spec: QuerySpec) -> Result<(), DomainError> {
        let mut mut_dapr = self.dapr_client.clone();

        let request = resource_provider_api::models::ResourceRequest::<
            resource_provider_api::models::QuerySpec,
        > {
            id: id.to_string(),
            spec: spec.clone().into(),
        };

        let _: () = match mut_dapr
            .invoke_actor(
                format!("{}.ContinuousQuery", &spec.container),
                id.to_string(),
                "configure",
                request,
                None,
            )
            .await
        {
            Err(e) => {
                log::error!("Error configuring query: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            Ok(r) => r,
        };

        Ok(())
    }

    pub async fn deprovision(&self, id: &str, container: &str) -> Result<(), DomainError> {
        let mut mut_dapr = self.dapr_client.clone();
        log::info!("Deprovisioning query: {}", id);

        let _: () = match mut_dapr
            .invoke_actor::<String, &str, (), ()>(
                format!("{container}.ContinuousQuery"),
                id.to_string(),
                "deprovision",
                (),
                None,
            )
            .await
        {
            Err(e) => {
                log::error!("Error deprovisioning query: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            Ok(_) => log::info!("Deprovisioned query: {}", id),
        };

        Ok(())
    }

    pub async fn wait_for_ready_or_error(
        &self,
        id: &str,
        container: &str,
    ) -> Result<(), DomainError> {
        let mut mut_dapr = self.dapr_client.clone();

        loop {
            match mut_dapr
                .invoke_actor::<String, &str, (), QueryStatus>(
                    format!("{container}.ContinuousQuery"),
                    id.to_string(),
                    "getStatus",
                    (),
                    None,
                )
                .await
            {
                Err(e) => {
                    log::error!("Error getting query status: {}", e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
                Ok(qs) => match qs.status.as_str() {
                    "Running" => break,
                    "TransientError" => {
                        return Err(DomainError::Invalid {
                            message: format!(
                                "Query failed to start - {}",
                                qs.error_message.unwrap_or_default()
                            ),
                        });
                    }
                    "TerminalError" => {
                        return Err(DomainError::Invalid {
                            message: format!(
                                "Query failed to start - {}",
                                qs.error_message.unwrap_or_default()
                            ),
                        });
                    }
                    "Deleted" => {
                        return Err(DomainError::Invalid {
                            message: "Query deleted".to_string(),
                        });
                    }
                    _ => {
                        log::info!("Query status: {:?}", qs);
                    }
                },
            };
            tokio::time::sleep(std::time::Duration::from_millis(200)).await;
        }

        Ok(())
    }
}
