// Copyright 2025 The Drasi Authors.
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

use super::constants::MAX_READY_WAIT_TIMEOUT_SECS;
use super::models::{ContinuousQueryDto, QuerySpecDto, ReadyWaitParams, ResultEventDto};
use crate::domain::{debug_service::DebugService, resource_services::QueryDomainService};

#[utoipa::path(
    put,
    path = "/v1/continuousQueries/{id}",
    tag = "Continuous Queries",
    operation_id = "create_continuous_query",
    params(
        ("id" = String, Path, description = "Query ID")
    ),
    request_body = QuerySpecDto,
    responses(
        (status = 200, description = "Query created", body = ContinuousQueryDto),
        (status = 400, description = "Bad request"),
        (status = 409, description = "Query already exists. Continuous queries are immutable and cannot be updated."),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn create(
    service: web::Data<QueryDomainService>,
    id: web::Path<String>,
    spec: web::Json<QuerySpecDto>,
) -> impl Responder {
    log::debug!("create_query: {:?}", id);
    let query_id = id.into_inner();

    // Check if query already exists - queries are immutable
    match service.get(&query_id).await {
        Ok(_) => {
            // Query exists - reject the update
            return HttpResponse::Conflict().body(
                "Continuous queries are immutable and cannot be updated. \
                 Delete the existing query first if you need to change it.",
            );
        }
        Err(crate::domain::models::DomainError::NotFound) => {
            // Query doesn't exist - proceed with creation
        }
        Err(e) => {
            // Other error - return it
            return e.into();
        }
    }

    // Create the query
    let data = spec.into_inner();
    match service.set(&query_id, data.into()).await {
        Ok(res) => HttpResponse::Ok().json(ContinuousQueryDto::from(res)),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/continuousQueries/{id}",
    tag = "Continuous Queries",
    operation_id = "get_continuous_query",
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
    operation_id = "delete_continuous_query",
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
    operation_id = "list_continuous_queries",
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

    if params.timeout > MAX_READY_WAIT_TIMEOUT_SECS {
        return HttpResponse::BadRequest().body(format!(
            "timeout must be less than {} seconds",
            MAX_READY_WAIT_TIMEOUT_SECS
        ));
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
    operation_id = "watch_continuous_query",
    params(
        ("id" = String, Path, description = "Query ID")
    ),
    responses(
        (status = 200, description = "Stream of query results as a JSON array. Each element is a ResultEventDto object.", body = [ResultEventDto]),
        (status = 404, description = "Query not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn watch(service: web::Data<DebugService>, id: web::Path<String>) -> impl Responder {
    match service.watch_query(&id).await {
        Ok(res) => {
            let stream = stream! {
                tokio::pin!(res);

                // Open JSON array
                yield Ok::<_, actix_web::Error>(Bytes::from_static(b"["));
                let mut is_first = true;

                while let Some(item) = res.next().await {
                    let dto: ResultEventDto = item.into();
                    match serde_json::to_vec(&dto) {
                        Ok(bytes) => {
                            if is_first {
                                is_first = false;
                            } else {
                                yield Ok::<_, actix_web::Error>(Bytes::from_static(b","));
                            }
                            yield Ok::<_, actix_web::Error>(Bytes::from(bytes))
                        },
                        Err(e) => {
                            log::error!("Failed to serialize ResultEventDto: {}", e);
                            break;
                        }
                    };
                }

                // Close JSON array
                yield Ok::<_, actix_web::Error>(Bytes::from_static(b"]"));
            };

            HttpResponse::Ok().streaming(stream)
        }
        Err(e) => e.into(),
    }
}

pub fn configure_routes() -> actix_web::Scope {
    web::scope("/v1/continuousQueries")
        .route("/{id}", web::put().to(create))
        .route("/{id}", web::get().to(get))
        .route("/{id}", web::delete().to(delete))
        .route("", web::get().to(list))
        .route("/{id}/ready-wait", web::get().to(ready_wait))
        .route("/{id}/watch", web::get().to(watch))
}
