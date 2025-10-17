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

use actix_web::web::Bytes;
use actix_web::{web, HttpResponse, Responder};
use async_stream::stream;
use futures_util::StreamExt;
use std::time::Duration;
use utoipa;

use super::models::{ContinuousQueryDto, QuerySpecDto, ReadyWaitParams, ResultEventDto};
use crate::domain::{debug_service::DebugService, resource_services::QueryDomainService};

#[utoipa::path(
    put,
    path = "/v1/continuousQueries/{id}",
    tag = "Continuous Queries",
    params(
        ("id" = String, Path, description = "Query ID")
    ),
    request_body = QuerySpecDto,
    responses(
        (status = 200, description = "Query created or updated", body = ContinuousQueryDto),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn upsert(
    service: web::Data<QueryDomainService>,
    id: web::Path<String>,
    spec: web::Json<QuerySpecDto>,
) -> impl Responder {
    log::debug!("put_resource: {:?}", id);
    let data = spec.into_inner();

    match service.set(&id.into_inner(), data.into()).await {
        Ok(res) => HttpResponse::Ok().json(ContinuousQueryDto::from(res)),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/continuousQueries/{id}",
    tag = "Continuous Queries",
    params(
        ("id" = String, Path, description = "Query ID")
    ),
    responses(
        (status = 200, description = "Query found", body = ContinuousQueryDto),
        (status = 404, description = "Query not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn get(service: web::Data<QueryDomainService>, id: web::Path<String>) -> impl Responder {
    log::debug!("get_resource: {:?}", id);

    match service.get(&id.into_inner()).await {
        Ok(res) => HttpResponse::Ok().json(ContinuousQueryDto::from(res)),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    delete,
    path = "/v1/continuousQueries/{id}",
    tag = "Continuous Queries",
    params(
        ("id" = String, Path, description = "Query ID")
    ),
    responses(
        (status = 204, description = "Query deleted"),
        (status = 404, description = "Query not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn delete(
    service: web::Data<QueryDomainService>,
    id: web::Path<String>,
) -> impl Responder {
    log::debug!("delete_resource: {:?}", id);

    match service.delete(&id.into_inner()).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/continuousQueries",
    tag = "Continuous Queries",
    responses(
        (status = 200, description = "List of queries", body = Vec<ContinuousQueryDto>),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn list(service: web::Data<QueryDomainService>) -> impl Responder {
    log::debug!("list_resources");

    match service.list().await {
        Ok(res) => {
            let result = res
                .into_iter()
                .map(ContinuousQueryDto::from)
                .collect::<Vec<_>>();
            HttpResponse::Ok().json(result)
        }
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/continuousQueries/{id}/ready-wait",
    tag = "Continuous Queries",
    operation_id = "ready_wait_query",
    params(
        ("id" = String, Path, description = "Query ID"),
        ("timeout" = Option<u64>, Query, description = "Timeout in seconds (default: 60, max: 300). This endpoint blocks until the resource is ready or the timeout is reached. Clients should configure their HTTP client timeout to be slightly higher than this value.")
    ),
    responses(
        (status = 200, description = "Query is ready. Returns immediately when the resource status is 'Ready'."),
        (status = 503, description = "Query not ready within timeout. The resource did not become ready within the specified timeout period."),
        (status = 400, description = "Invalid timeout value (must be <= 300 seconds)"),
        (status = 404, description = "Query not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn ready_wait(
    service: web::Data<QueryDomainService>,
    id: web::Path<String>,
    params: web::Query<ReadyWaitParams>,
) -> impl Responder {
    log::debug!("readywait_resource: {:?}", id);

    if params.timeout > 300 {
        return HttpResponse::BadRequest().body("timeout must be less than 5 minutes");
    }

    match service
        .wait_for_ready(&id.into_inner(), Duration::from_secs(params.timeout))
        .await
    {
        Ok(res) => match res {
            true => HttpResponse::Ok().finish(),
            false => HttpResponse::ServiceUnavailable().finish(),
        },
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/continuousQueries/{id}/watch",
    tag = "Continuous Queries",
    params(
        ("id" = String, Path, description = "Query ID")
    ),
    responses(
        (status = 200, description = "Stream of query results as newline-delimited JSON (NDJSON). Each line contains a ResultEventDto object.", body = [ResultEventDto], content_type = "application/x-ndjson"),
        (status = 404, description = "Query not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn watch(service: web::Data<DebugService>, id: web::Path<String>) -> impl Responder {
    match service.watch_query(&id).await {
        Ok(res) => {
            let stream = stream! {
                tokio::pin!(res);

                while let Some(item) = res.next().await {
                    let dto: ResultEventDto = item.into();
                    match serde_json::to_string(&dto) {
                        Ok(json) => {
                            yield Ok::<_, actix_web::Error>(Bytes::from(format!("{}\n", json)))
                        },
                        Err(e) => {
                            log::error!("Failed to serialize ResultEventDto: {}", e);
                            break;
                        }
                    };
                }
            };

            HttpResponse::Ok()
                .content_type("application/x-ndjson")
                .streaming(stream)
        }
        Err(e) => e.into(),
    }
}

pub fn configure_routes() -> actix_web::Scope {
    web::scope("/v1/continuousQueries")
        .route("/{id}", web::put().to(upsert))
        .route("/{id}", web::get().to(get))
        .route("/{id}", web::delete().to(delete))
        .route("", web::get().to(list))
        .route("/{id}/ready-wait", web::get().to(ready_wait))
        .route("/{id}/watch", web::get().to(watch))
}
