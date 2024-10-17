use std::sync::Arc;

use async_stream::stream;
use dapr::client::TonicClient;
use futures_util::{Stream, StreamExt};
use resource_provider_api::models::QueryStatus;
use tokio::{select, sync::oneshot};

use crate::domain::result_service::api::{ControlSignal, ResultEvent};

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
        mut cancellation: oneshot::Receiver<()>,
    ) -> Result<impl Stream<Item = ResultEvent>, DomainError> {
        //TODO: put a native debug method on the query actor inside query host, this is currently just a hack

        let temp_id = format!("debug-{}", uuid::Uuid::new_v4());
        log::info!("debugging query: {}", temp_id);
        let mut mut_dapr = self.dapr_client.clone();

        let request = resource_provider_api::models::ResourceRequest::<
            resource_provider_api::models::QuerySpec,
        > {
            id: temp_id.clone(),
            spec: spec.clone().into(),
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
            tokio::pin!(result_stream);
            loop {
                select! {
                    _ = &mut cancellation => {
                        log::info!("debug Stream cancelled by client");
                        break;
                    },
                    next = result_stream.next() => {
                        match next {
                            Some(item) => {
                                let end_of_stream = match &item {
                                    ResultEvent::Control(ctrl) => {
                                        match ctrl.control_signal {
                                            ControlSignal::Stopped => {
                                                log::info!("debug Stream stopped");
                                                true
                                            },
                                            ControlSignal::QueryDeleted => {
                                                log::info!("debug Stream deleted");
                                                true
                                            },
                                            _ => false,
                                        }
                                    },
                                    _ => false,
                                };

                                yield item;

                                if end_of_stream {
                                    break;
                                }
                            },
                            None => {
                                log::info!("debug Stream ended");
                                break;
                            },

                        }
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
