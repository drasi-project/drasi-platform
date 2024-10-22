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

pub mod mappings;
pub mod models;

macro_rules! v1_crud_api {
  ($domain_service:ty, $spec_dto:ty, $status_dto:ty $(, $additional_route:expr ),* ) => {

    use std::time::Duration;
    use actix_web::{web::{self}, HttpResponse, put, get, delete};
    use super::models::{ResourceDto, ReadyWaitParams};

    pub fn configure(cfg: &mut web::ServiceConfig) {
      cfg
        .service(put_resource)
        .service(get_resource)
        .service(delete_resource)
        .service(list_resources)
        .service(readywait_resource)
        $(
          .service($additional_route)
        ),*
        ;

    }

    #[get("/{id}")]
    async fn get_resource(svc: web::Data<$domain_service>, id: web::Path<String>) -> HttpResponse {
      log::debug!("get_resource: {:?}", id);

      match svc.get(&id.into_inner()).await {
        Ok(res) => HttpResponse::Ok().json(ResourceDto::<$spec_dto, $status_dto>::from(res)),
        Err(e) => e.into()
      }
    }

    #[get("/{id}/ready-wait")]
    async fn readywait_resource(svc: web::Data<$domain_service>, id: web::Path<String>, params: web::Query<ReadyWaitParams>) -> HttpResponse {
      log::debug!("readywait_resource: {:?}", id);

      if params.timeout > 300 {
        return HttpResponse::BadRequest().body("timeout must be less than 5 minutes");
      }

      match svc.wait_for_ready(&id.into_inner(), Duration::from_secs(params.timeout)).await {
        Ok(res) => match res {
          true => HttpResponse::Ok().finish(),
          false => HttpResponse::ServiceUnavailable().finish()
        },
        Err(e) => e.into()
      }
    }


    #[put("/{id}")]
    async fn put_resource(svc: web::Data<$domain_service>, id: web::Path<String>, body: web::Json<$spec_dto>) -> HttpResponse {
      log::debug!("put_resource: {:?}", id);
      let data = body.into_inner();

      match svc.set(&id.into_inner(), data.into()).await {
        Ok(res) => HttpResponse::Ok().json(ResourceDto::<$spec_dto, $status_dto>::from(res)),
        Err(e) => e.into()
      }
    }




    #[delete("/{id}")]
    async fn delete_resource(svc: web::Data<$domain_service>, id: web::Path<String>) -> HttpResponse {
      log::debug!("delete_resource: {:?}", id);

      match svc.delete(&id.into_inner()).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => e.into()
      }
    }

    #[get("")]
    async fn list_resources(svc: web::Data<$domain_service>) -> HttpResponse {
      log::debug!("list_resources");

      log::info!("list_resources");
      match svc.list().await {
        Ok(res) => {
          let result = res.into_iter().map(|r| ResourceDto::<$spec_dto, $status_dto>::from(r)).collect::<Vec<_>>();
          log::info!("list_resources: {:?}", result);
          HttpResponse::Ok().json(result)
        },
        Err(e) => e.into()
      }
    }

  }
}

macro_rules! v1_crud_api_provider {
  ($domain_service:ty, $spec_dto:ty $(, $additional_route:expr ),* ) => {

    use actix_web::{web::{self}, HttpResponse, put, get, delete};
    use super::models::ResourceProviderDto;

    pub fn configure(cfg: &mut web::ServiceConfig) {
      cfg
        .service(put_resource)
        .service(get_resource)
        .service(delete_resource)
        .service(list_resources)
        $(
          .service($additional_route)
        ),*
        ;

    }

    #[put("/{id}")]
    async fn put_resource(svc: web::Data<$domain_service>, id: web::Path<String>, body: web::Json<$spec_dto>) -> HttpResponse {
      log::debug!("put_provider_resource: {:?}", id);
      let data = body.into_inner();

      match svc.set(&id.into_inner(), data.into()).await {
        Ok(res) => HttpResponse::Ok().json(res),
        Err(e) => e.into()
      }
    }

    #[delete("/{id}")]
    async fn delete_resource(svc: web::Data<$domain_service>, id: web::Path<String>) -> HttpResponse {
      log::debug!("deregister_provider_resource: {:?}", id);

      match svc.delete(&id.into_inner()).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => e.into()
      }
    }

    #[get("")]
    async fn list_resources(svc: web::Data<$domain_service>) -> HttpResponse {
      log::debug!("list_resources");

      match svc.list().await {
        Ok(res) => {
          let result = res.into_iter().map(|r| ResourceProviderDto::<$spec_dto>::from(r)).collect::<Vec<_>>();
          HttpResponse::Ok().json(result)
        },
        Err(e) => e.into()
      }
    }

    #[get("/{id}")]
    async fn get_resource(svc: web::Data<$domain_service>, id: web::Path<String>) -> HttpResponse {
      log::debug!("get_resource: {:?}", id);

      match svc.get(&id.into_inner()).await {
        Ok(res) => HttpResponse::Ok().json(res),
        Err(e) => e.into()
      }
    }

  }
}

pub mod source_handlers {
    use crate::{
        api::v1::models::{SourceSpecDto, SourceStatusDto},
        domain::resource_services::SourceDomainService,
    };
    v1_crud_api!(SourceDomainService, SourceSpecDto, SourceStatusDto);
}

pub mod query_container_handlers {
    use crate::{
        api::v1::models::{QueryContainerSpecDto, QueryContainerStatusDto},
        domain::resource_services::QueryContainerDomainService,
    };
    v1_crud_api!(
        QueryContainerDomainService,
        QueryContainerSpecDto,
        QueryContainerStatusDto
    );
}

pub mod reaction_handlers {
    use crate::{
        api::v1::models::{ReactionSpecDto, ReactionStatusDto},
        domain::resource_services::ReactionDomainService,
    };
    v1_crud_api!(ReactionDomainService, ReactionSpecDto, ReactionStatusDto);
}

pub mod source_provider_handlers {
    use crate::{
        api::v1::models::ProviderSpecDto,
        domain::resource_provider_services::SourceProviderDomainService,
    };
    v1_crud_api_provider!(SourceProviderDomainService, ProviderSpecDto);
}

pub mod reaction_provider_handlers {
    use crate::{
        api::v1::models::ProviderSpecDto,
        domain::resource_provider_services::ReactionProviderDomainService,
    };
    v1_crud_api_provider!(ReactionProviderDomainService, ProviderSpecDto);
}

pub mod query_handlers {
    use actix_web::web::Bytes;
    use async_stream::stream;
    use futures_util::StreamExt;

    use crate::{
        api::v1::models::{QuerySpecDto, QueryStatusDto},
        domain::{debug_service::DebugService, resource_services::QueryDomainService},
    };

    #[get("/{id}/watch")]
    async fn watch(svc: web::Data<DebugService>, id: web::Path<String>) -> HttpResponse {
        match svc.watch_query(&id).await {
            Ok(res) => {
                let stream = stream! {
                  tokio::pin!(res);

                  yield Ok(Bytes::from_static(b"["));
                  let mut is_first = true;

                  while let Some(item) = res.next().await {
                    match serde_json::to_vec(&item) {
                      Ok(bytes) => {
                        if is_first {
                          is_first = false;
                        } else {
                          yield Ok(Bytes::from_static(b","));
                        }
                        yield Ok(Bytes::from(bytes))
                      },
                      Err(e) => yield Err(e)
                    };
                  }

                  yield Ok(Bytes::from_static(b"]"));
                };

                HttpResponse::Ok().streaming(stream)
            }
            Err(e) => e.into(),
        }
    }

    v1_crud_api!(QueryDomainService, QuerySpecDto, QueryStatusDto, watch);
}

pub mod debug_handlers {
    use std::time::Duration;

    use actix_web::{
        get,
        web::{self},
        HttpRequest, Responder,
    };
    use actix_ws::{CloseCode, CloseReason, Message};

    use futures_util::StreamExt;
    use tokio::{pin, select, sync::oneshot};

    use crate::{
        api::v1::models::{ControlMessage, QuerySpecDto},
        domain::debug_service::DebugService,
    };
    pub fn configure(cfg: &mut web::ServiceConfig) {
        cfg.service(debug);
    }

    #[get("")]
    async fn debug(
        svc: web::Data<DebugService>,
        req: HttpRequest,
        body: web::Payload,
    ) -> actix_web::Result<impl Responder> {
        let (cancel_tx, cancel_rx) = oneshot::channel::<()>();
        let (response, mut session, msg_stream) = actix_ws::handle(&req, body)?;

        actix_web::rt::spawn(async move {
            let mut msg_stream = msg_stream.fuse();

            let query = {
                let mut query = None;
                while let Some(msg) = msg_stream.next().await {
                    match msg {
                        Ok(actix_ws::Message::Text(text)) => {
                            query = match serde_json::from_str::<QuerySpecDto>(&text) {
                                Ok(q) => Some(q),
                                Err(e) => {
                                    log::error!("Error parsing query spec: {}", e);
                                    _ = session
                                        .text(ControlMessage::error(e.to_string()).to_json())
                                        .await
                                        .ok();
                                    _ = session
                                        .close(Some(CloseReason {
                                            code: CloseCode::Invalid,
                                            description: None,
                                        }))
                                        .await
                                        .ok();
                                    return;
                                }
                            };
                            break;
                        }
                        Ok(actix_ws::Message::Ping(bytes)) => {
                            if session.pong(&bytes).await.is_err() {
                                log::info!("Ping failed, closing session");
                                break;
                            }
                        }
                        Ok(actix_ws::Message::Pong(_)) => {}
                        Ok(actix_ws::Message::Close(cr)) => {
                            log::info!("Received close message: {:?}", cr);
                            return;
                        }
                        Err(e) => {
                            log::error!("Error receiving message: {}", e);
                            return;
                        }
                        _ => {}
                    }
                }
                query
            };

            let query = match query {
                Some(q) => q,
                None => {
                    log::error!("No query spec provided");
                    _ = session
                        .close(Some(CloseReason {
                            code: CloseCode::Invalid,
                            description: Some("No query provided".to_string()),
                        }))
                        .await
                        .ok();
                    return;
                }
            };

            let data_stream = match svc.debug(query.into(), cancel_rx).await {
                Ok(res) => res,
                Err(e) => {
                    log::error!("Error debugging query: {}", e);
                    _ = session
                        .text(ControlMessage::error(e.to_string()).to_json())
                        .await
                        .ok();
                    _ = session
                        .close(Some(CloseReason {
                            code: CloseCode::Error,
                            description: None,
                        }))
                        .await
                        .ok();
                    return;
                }
            };

            let data_stream = data_stream.fuse();
            pin!(data_stream);

            loop {
                select! {
                  _ = tokio::time::sleep(Duration::from_secs(10)) => {
                    log::info!("Sending ping");
                    if session.ping(b"").await.is_err() {
                        log::info!("Ping failed, closing session");
                        break;
                    }
                  },
                  msg = msg_stream.next() => {
                    match msg {
                        Some(Ok(msg)) => {
                            match msg {
                                Message::Ping(bytes) => {
                                    if session.pong(&bytes).await.is_err() {
                                        log::info!("Ping failed, closing session");
                                        break;
                                    }
                                },
                                Message::Pong(_) => {},
                                Message::Close(cr) => {
                                    log::info!("Received close message: {:?}", cr);
                                    break;
                                },
                                _ => {
                                    log::info!("Received unexpected message: {:?}", msg);
                                    break;
                                },
                            }
                        }
                        Some(Err(e)) => {
                            log::error!("Error receiving message: {}", e);
                            break;
                        }
                        None => break,
                    }
                },
                evt = data_stream.next() => {
                    match evt {
                        Some(evt) => {
                            let json = match serde_json::to_string(&evt) {
                                Ok(j) => j,
                                Err(e) => {
                                    log::error!("Error serializing message: {}", e);
                                    break;
                                }
                            };
                            match session.text(json).await {
                                Ok(_) => log::debug!("Sent debug message"),
                                Err(e) => {
                                    log::error!("Error sending debug message: {}", e);
                                    break;
                                }
                            }
                        }
                        None => break,
                    }
                }

                }
            }
            log::info!("debug stream ended");

            _ = cancel_tx.send(());
            log::info!("Cancellation signal sent");

            while let Some(_) = data_stream.next().await {
                log::info!("Draining message stream");
            }

            log::info!("Closing session");

            _ = session.close(None).await.ok();

            log::info!("Session closed");
        });

        Ok(response)
    }
}
