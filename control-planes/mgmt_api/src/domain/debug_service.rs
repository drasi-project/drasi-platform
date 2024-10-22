use std::sync::Arc;

use async_stream::stream;
use futures::FutureExt;
use futures_util::{Stream, StreamExt};
use tokio::{
    select,
    sync::oneshot::{self},
};

use crate::{
    domain::result_service::api::{ControlSignal, ResultEvent},
    QueryRepository,
};

use super::{
    models::{DomainError, QuerySpec},
    query_actor_service::QueryActorService,
    result_service::ResultService,
};

pub struct DebugService {
    //dapr_client: dapr::Client<TonicClient>,
    result_service: Arc<ResultService>,
    query_repo: Arc<QueryRepository>,
    query_actor_service: Arc<QueryActorService>,
}

impl DebugService {
    pub fn new(
        query_actor_service: Arc<QueryActorService>,
        result_service: Arc<ResultService>,
        query_repo: Arc<QueryRepository>,
    ) -> Self {
        Self {
            query_actor_service,
            result_service,
            query_repo,
        }
    }

    pub async fn debug(
        &self,
        mut spec: QuerySpec,
        mut cancellation: oneshot::Receiver<()>,
    ) -> Result<impl Stream<Item = ResultEvent>, DomainError> {
        let temp_id = format!("debug-{}", uuid::Uuid::new_v4());
        log::info!("debugging query: {}", temp_id);
        spec.transient = Some(true);

        match self
            .query_actor_service
            .configure(&temp_id, spec.clone())
            .await
        {
            Err(e) => {
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            Ok(_) => {}
        }

        let container_id = spec.container.clone();
        let result_service = self.result_service.clone();

        let result_stream = match result_service.stream_from_start(&temp_id, "debug").await {
            Ok(rs) => rs,
            Err(e) => {
                _ = self
                    .query_actor_service
                    .deprovision(&temp_id, &container_id)
                    .await;
                return Err(e);
            }
        };
        let query_actor_service = self.query_actor_service.clone();

        let debug_stream = stream! {
            let ready_wait = query_actor_service.wait_for_ready_or_error(&temp_id, &container_id).fuse();
            tokio::pin!(result_stream);
            tokio::pin!(ready_wait);
            loop {
                select! {
                    _ = &mut cancellation => {
                        log::info!("debug Stream cancelled by client");
                        break;
                    },
                    qe = &mut ready_wait => match qe {
                            Ok(_) => log::info!("debug query running"),
                            Err(e) => {
                                log::error!("debug query error: {:?}", e);
                                break;
                            },
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
          log::info!("removing debug query: {}", temp_id);
          _ = query_actor_service.deprovision(&temp_id, &container_id).await;
        };
        Ok(debug_stream)
    }

    pub async fn watch_query(
        &self,
        query_id: &str,
    ) -> Result<impl Stream<Item = ResultEvent>, DomainError> {
        let consumer_id = format!("debug-{}", uuid::Uuid::new_v4());
        let query = self.query_repo.get(query_id).await?;
        let result_stream = self
            .result_service
            .snapshot_stream_from_now(&query.container, query_id, &consumer_id)
            .await?;
        Ok(result_stream)
    }
}
