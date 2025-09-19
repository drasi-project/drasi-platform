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

use actix_web::{web, HttpResponse, Responder};
use utoipa;

use super::models::{ProviderSpecDto, SourceProviderDto};
use crate::domain::resource_provider_services::SourceProviderDomainService;

#[utoipa::path(
    put,
    path = "/v1/sourceProviders/{id}",
    tag = "Source Providers",
    params(
        ("id" = String, Path, description = "Source Provider ID")
    ),
    request_body = ProviderSpecDto,
    responses(
        (status = 200, description = "Source Provider created or updated", body = SourceProviderDto),
        (status = 400, description = "Bad request"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn upsert(
    service: web::Data<SourceProviderDomainService>,
    id: web::Path<String>,
    spec: web::Json<ProviderSpecDto>,
) -> impl Responder {
    log::debug!("put_provider_resource: {:?}", id);
    let data = spec.into_inner();

    let provider_id = id.into_inner();
    match service.set(&provider_id, data.into()).await {
        Ok(spec) => {
            let provider = crate::domain::models::ResourceProvider {
                id: provider_id,
                spec,
            };
            HttpResponse::Ok().json(SourceProviderDto::from(provider))
        }
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/sourceProviders/{id}",
    tag = "Source Providers",
    params(
        ("id" = String, Path, description = "Source Provider ID")
    ),
    responses(
        (status = 200, description = "Source Provider found", body = SourceProviderDto),
        (status = 404, description = "Source Provider not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn get(
    service: web::Data<SourceProviderDomainService>,
    id: web::Path<String>,
) -> impl Responder {
    log::debug!("get_provider_resource: {:?}", id);

    match service.get(&id.into_inner()).await {
        Ok(res) => HttpResponse::Ok().json(SourceProviderDto::from(res)),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    delete,
    path = "/v1/sourceProviders/{id}",
    tag = "Source Providers",
    params(
        ("id" = String, Path, description = "Source Provider ID")
    ),
    responses(
        (status = 204, description = "Source Provider deleted"),
        (status = 404, description = "Source Provider not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn delete(
    service: web::Data<SourceProviderDomainService>,
    id: web::Path<String>,
) -> impl Responder {
    log::debug!("deregister_provider_resource: {:?}", id);

    match service.delete(&id.into_inner()).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => e.into(),
    }
}

#[utoipa::path(
    get,
    path = "/v1/sourceProviders",
    tag = "Source Providers",
    responses(
        (status = 200, description = "List of Source Providers", body = Vec<SourceProviderDto>),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn list(service: web::Data<SourceProviderDomainService>) -> impl Responder {
    log::debug!("list_provider_resources");

    match service.list().await {
        Ok(res) => HttpResponse::Ok().json(
            res.into_iter()
                .map(SourceProviderDto::from)
                .collect::<Vec<_>>(),
        ),
        Err(e) => e.into(),
    }
}

pub fn configure_routes() -> actix_web::Scope {
    web::scope("/v1/sourceProviders")
        .route("/{id}", web::put().to(upsert))
        .route("/{id}", web::get().to(get))
        .route("/{id}", web::delete().to(delete))
        .route("", web::get().to(list))
}
