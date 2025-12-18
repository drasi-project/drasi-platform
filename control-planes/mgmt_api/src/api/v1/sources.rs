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

use actix_web::{web, HttpResponse, Responder};
use std::time::Duration;
use utoipa;

use super::constants::MAX_READY_WAIT_TIMEOUT_SECS;
use super::models::{ReadyWaitParams, SourceDto, SourceSpecDto};
use crate::domain::resource_services::SourceDomainService;

#[utoipa::path(
    put,
    path = "/v1/sources/{id}",
    tag = "Sources",
    operation_id = "upsert_source",
    params(
        ("id" = String, Path, description = "Source ID")
    ),
    request_body = SourceSpecDto,
    responses(
        (status = 200, description = "Source created or updated", body = SourceDto),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn upsert(
    service: web::Data<SourceDomainService>,
    id: web::Path<String>,
    spec: web::Json<SourceSpecDto>,
) -> impl Responder {
    log::debug!("put_resource: {:?}", id);
    let data = spec.into_inner();

    match service.set(&id.into_inner(), data.into()).await {
        Ok(res) => HttpResponse::Ok().json(SourceDto::from(res)),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/sources/{id}",
    tag = "Sources",
    operation_id = "get_source",
    params(
        ("id" = String, Path, description = "Source ID")
    ),
    responses(
        (status = 200, description = "Source found", body = SourceDto),
        (status = 404, description = "Source not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn get(service: web::Data<SourceDomainService>, id: web::Path<String>) -> impl Responder {
    log::debug!("get_resource: {:?}", id);

    match service.get(&id.into_inner()).await {
        Ok(res) => HttpResponse::Ok().json(SourceDto::from(res)),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    delete,
    path = "/v1/sources/{id}",
    tag = "Sources",
    operation_id = "delete_source",
    params(
        ("id" = String, Path, description = "Source ID")
    ),
    responses(
        (status = 204, description = "Source deleted"),
        (status = 404, description = "Source not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn delete(
    service: web::Data<SourceDomainService>,
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
    path = "/v1/sources",
    tag = "Sources",
    operation_id = "list_sources",
    responses(
        (status = 200, description = "List of sources", body = Vec<SourceDto>),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn list(service: web::Data<SourceDomainService>) -> impl Responder {
    log::debug!("list_resources");

    match service.list().await {
        Ok(res) => {
            let result = res.into_iter().map(SourceDto::from).collect::<Vec<_>>();
            HttpResponse::Ok().json(result)
        }
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/sources/{id}/ready-wait",
    tag = "Sources",
    operation_id = "ready_wait_source",
    params(
        ("id" = String, Path, description = "Source ID"),
        ("timeout" = Option<u64>, Query, description = "Timeout in seconds (default: 60, max: 300). This endpoint blocks until the resource is ready or the timeout is reached. Clients should configure their HTTP client timeout to be slightly higher than this value.")
    ),
    responses(
        (status = 200, description = "Source is ready. Returns immediately when the resource status is 'Ready'."),
        (status = 503, description = "Source not ready within timeout. The resource did not become ready within the specified timeout period."),
        (status = 400, description = "Invalid timeout value (must be <= 300 seconds)"),
        (status = 404, description = "Source not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn ready_wait(
    service: web::Data<SourceDomainService>,
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

pub fn configure_routes() -> actix_web::Scope {
    web::scope("/v1/sources")
        .route("/{id}", web::put().to(upsert))
        .route("/{id}", web::get().to(get))
        .route("/{id}", web::delete().to(delete))
        .route("", web::get().to(list))
        .route("/{id}/ready-wait", web::get().to(ready_wait))
}
