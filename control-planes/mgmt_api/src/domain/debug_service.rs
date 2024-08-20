use std::{sync::Arc, time::Duration};

use async_stream::stream;
use dapr::client::TonicClient;
use futures_util::{Stream, StreamExt};
use resource_provider_api::models::QueryStatus;
use serde_json::{Map, Value};

use crate::domain::{
    mappings::ToQueryPartitions,
    result_service::api::{ControlSignal, ResultEvent},
};

use super::{
    models::{DomainError, QuerySpec},
    result_service::ResultService,
};

pub struct DebugService {
    dapr_client: dapr::Client<TonicClient>,
    result_service: Arc<ResultService>,
}

impl DebugService {
    pub fn new(dapr_client: dapr::Client<TonicClient>, result_service: Arc<ResultService>) -> Self {
        Self {
            dapr_client,
            result_service,
        }
    }

    pub async fn debug(
        &self,
        spec: QuerySpec,
    ) -> Result<impl Stream<Item = Map<String, Value>>, DomainError> {
        //TODO: put a native debug method on the query actor inside query host, this is currently just a hack
        let temp_id = format!("debug-{}", uuid::Uuid::new_v4());
        log::info!("debugging query: {}", temp_id);
        let mut mut_dapr = self.dapr_client.clone();

        let request = resource_provider_api::models::ResourceRequest::<
            resource_provider_api::models::QuerySpec,
        > {
            id: temp_id.clone(),
            spec: spec.clone().into_single_partition(),
        };

        let _: () = match mut_dapr
            .invoke_actor(
                format!("{}.ContinuousQuery", spec.container),
                temp_id.clone(),
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
            Ok(r) => r,
        };

        loop {
            tokio::time::sleep(std::time::Duration::from_millis(100)).await;

            match mut_dapr
                .invoke_actor::<String, &str, (), QueryStatus>(
                    format!("{}.ContinuousQuery", spec.container),
                    temp_id.clone(),
                    "getStatus",
                    (),
                    None,
                )
                .await
            {
                Err(e) => {
                    log::error!("Error configuring resource: {}", e);
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
                        })
                    }
                    "TerminalError" => {
                        return Err(DomainError::Invalid {
                            message: format!(
                                "Query failed to start - {}",
                                qs.error_message.unwrap_or_default()
                            ),
                        })
                    }
                    "Deleted" => {
                        return Err(DomainError::Invalid {
                            message: "Query was deleted before it could start".to_string(),
                        })
                    }
                    _ => continue,
                },
            };
        }

        let result_service = self.result_service.clone();

        let result_stream = match result_service.stream(&temp_id, "debug").await {
            Ok(rs) => rs,
            Err(err) => {
                _ = mut_dapr
                    .invoke_actor::<String, &str, (), ()>(
                        format!("{}.ContinuousQuery", spec.container),
                        temp_id.clone(),
                        "deprovision",
                        (),
                        None,
                    )
                    .await;
                return Err(err);
            }
        };

        let debug_stream = stream! {
            let timeout_at = tokio::time::Instant::now() + Duration::from_secs(5);
            tokio::pin!(result_stream);
            loop {
              let next = tokio::time::timeout_at(timeout_at, result_stream.next()).await;
              match next {
                  Ok(Some(item)) => {
                      match item {
                          ResultEvent::Change(change) => {
                              for res in change.added_results {
                                  yield res;
                              }
                              for res in change.updated_results {
                                  if let Some(res) = res.after {
                                      yield res;
                                  }
                              }
                          },
                          ResultEvent::Control(control) => {
                                  match control.control_signal {
                                      ControlSignal::BootstrapCompleted => break,
                                      ControlSignal::Stopped => break,
                                      ControlSignal::QueryDeleted => break,
                                      _ => continue,
                                  }
                          }
                      }
                  },
                  Ok(None) => {
                      log::info!("debug Stream ended");
                      break;
                  },
                  Err(_) => {
                      log::info!("debug Stream timed out");
                      break;
                  },
              }
          }
          log::info!("cleaning up");
          if let Err(err) = mut_dapr.invoke_actor::<String, &str, (), ()>(format!("{}.ContinuousQuery", spec.container), temp_id.clone(), "deprovision", (), None).await {
              log::error!("Error deprovisioning resource: {}", err);
          }
        };
        Ok(debug_stream)
    }
}
