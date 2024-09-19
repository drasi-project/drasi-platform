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

    use serde_json::Value;
    #[put("/{id}")]
    async fn put_resource(svc: web::Data<$domain_service>, id: web::Path<String>, body: web::Json<Value>) -> HttpResponse {
      log::debug!("put_provider_resource: {:?}", id);
      let data = body.into_inner();

      match svc.set(&id.into_inner(), data).await {
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
        api::v1::models::SourceProviderSpecDto,
        domain::resource_provider_services::SourceProviderDomainService,
    };
    v1_crud_api_provider!(SourceProviderDomainService, SourceProviderSpecDto);
}

pub mod reaction_provider_handlers {
    use crate::{
        api::v1::models::ReactionProviderSpecDto,
        domain::resource_provider_services::ReactionProviderDomainService,
    };
    v1_crud_api_provider!(ReactionProviderDomainService, ReactionProviderSpecDto);
}

pub mod query_handlers {
    use actix_web::{post, web::Bytes};
    use async_stream::stream;
    use futures_util::StreamExt;

    use crate::{
        api::v1::models::{QuerySpecDto, QueryStatusDto},
        domain::{debug_service::DebugService, resource_services::QueryDomainService},
    };

    #[post("/debug")]
    async fn debug(svc: web::Data<DebugService>, body: web::Json<QuerySpecDto>) -> HttpResponse {
        log::info!("debug query route");
        let query = body.into_inner();

        match svc.debug(query.into()).await {
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

    v1_crud_api!(QueryDomainService, QuerySpecDto, QueryStatusDto, debug);
}
