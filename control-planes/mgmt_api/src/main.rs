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

use actix_web::{middleware, web, App, HttpServer};
use domain::{
    query_actor_service::QueryActorService,
    resource_provider_services::{
        ReactionProviderDomainService, ReactionProviderDomainServiceImpl,
        SourceProviderDomainService, SourceProviderDomainServiceImpl,
    },
};
use drasi_comms_dapr::comms::DaprHttpInvoker;
use std::sync::Arc;

use crate::{
    domain::{
        debug_service::DebugService, models::ChangeStreamConfig, resource_services::*,
        result_service::ResultService,
    },
    persistence::*,
};

mod api;
mod change_stream;
mod domain;
mod persistence;

const VERSION: i32 = 11;

#[actix_web::main]
async fn main() -> Result<(), std::io::Error> {
    log::info!("version: {}", VERSION);
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let mongo_uri = std::env::var("MONGO_URI").unwrap_or("mongodb://drasi-mongo:27017".to_string());

    let mongo_db = std::env::var("MONGO_DB").unwrap_or("api".to_string());
    let redis_url = std::env::var("REDIS_URL").unwrap_or("redis://drasi-redis:6379".to_string());
    let dapr_http_port = std::env::var("DAPR_HTTP_PORT")
        .unwrap_or_else(|_| "3500".to_string())
        .parse::<u16>()
        .unwrap();

    // Introduce delay so that dapr grpc port is assigned before app tries to connect
    std::thread::sleep(std::time::Duration::new(5, 0));

    let addr = "https://127.0.0.1".to_string();
    let dapr_client = dapr::Client::<dapr::client::TonicClient>::connect(addr)
        .await
        .expect("Unable to connect to Dapr");
    let mongo_client = mongodb::Client::with_uri_str(&mongo_uri).await.unwrap();

    log::info!("starting HTTP server at http://localhost:8080");
    //wait for the schema to be populated before starting the server

    HttpServer::new(move || {
        //todo: investigate IoC container
        let db = mongo_client.database(&mongo_db);
        let invoker = Arc::new(DaprHttpInvoker::new(
            "127.0.0.1".to_string(),
            dapr_http_port,
        ));

        let source_provider_repo =
            Arc::new(ProviderRepositoryImpl::new(db.clone(), "source_schemas"));
        let reaction_provider_repo =
            Arc::new(ProviderRepositoryImpl::new(db.clone(), "reaction_schemas"));

        let source_repo = SourceRepositoryImpl::new(db.clone());
        let source_domain_svc = SourceDomainServiceImpl::new(
            dapr_client.clone(),
            Box::new(source_repo),
            source_provider_repo.clone(),
            invoker.clone(),
        );

        let source_domain_svc_arc: web::Data<SourceDomainService> =
            web::Data::from(Arc::new(source_domain_svc) as Arc<SourceDomainService>);

        let qc_repo = Arc::new(QueryContainerRepositoryImpl::new(db.clone()));
        let qc_domain_svc = Arc::new(QueryContainerDomainServiceImpl::new(
            dapr_client.clone(),
            qc_repo.clone(),
        ));
        let qc_domain_svc_arc: web::Data<QueryContainerDomainService> =
            web::Data::from(qc_domain_svc.clone() as Arc<QueryContainerDomainService>);

        let reaction_repo = ReactionRepositoryImpl::new(db.clone());
        let reaction_domain_svc = ReactionDomainServiceImpl::new(
            dapr_client.clone(),
            Box::new(reaction_repo),
            reaction_provider_repo.clone(),
            invoker.clone(),
        );
        let reaction_domain_svc_arc: web::Data<ReactionDomainService> =
            web::Data::from(Arc::new(reaction_domain_svc) as Arc<ReactionDomainService>);

        let query_repo = Arc::new(QueryRepositoryImpl::new(db.clone()));
        let query_domain_svc = QueryDomainServiceImpl::new(
            dapr_client.clone(),
            query_repo.clone(),
            qc_domain_svc.clone(),
        );
        let query_domain_svc_arc: web::Data<QueryDomainService> =
            web::Data::from(Arc::new(query_domain_svc) as Arc<QueryDomainService>);

        let source_provider_domain_svc =
            SourceProviderDomainServiceImpl::new(dapr_client.clone(), source_provider_repo.clone());

        let source_provider_domain_svc_arc: web::Data<SourceProviderDomainService> =
            web::Data::from(
                Arc::new(source_provider_domain_svc) as Arc<SourceProviderDomainService>
            );

        let reaction_provider_domain_svc = ReactionProviderDomainServiceImpl::new(
            dapr_client.clone(),
            reaction_provider_repo.clone(),
        );
        let reaction_provider_domain_svc_arc: web::Data<ReactionProviderDomainService> =
            web::Data::from(
                Arc::new(reaction_provider_domain_svc) as Arc<ReactionProviderDomainService>
            );

        let result_service = ResultService::new(ChangeStreamConfig {
            redis_url: redis_url.clone(),
            buffer_size: 100,
            fetch_batch_size: 10,
        });

        let query_actor_service = Arc::new(QueryActorService::new(dapr_client.clone()));

        let debug_service = DebugService::new(
            query_actor_service.clone(),
            Arc::new(result_service),
            query_repo.clone(),
        );

        App::new()
            .wrap(middleware::Logger::default())
            .app_data(source_domain_svc_arc)
            .app_data(qc_domain_svc_arc)
            .app_data(reaction_domain_svc_arc)
            .app_data(query_domain_svc_arc)
            .app_data(source_provider_domain_svc_arc)
            .app_data(reaction_provider_domain_svc_arc)
            .app_data(web::Data::new(debug_service))
            .service(web::scope("/v1/sources").configure(api::v1::source_handlers::configure))
            .service(
                web::scope("/v1/queryContainers")
                    .configure(api::v1::query_container_handlers::configure),
            )
            .service(web::scope("/v1/reactions").configure(api::v1::reaction_handlers::configure))
            .service(
                web::scope("/v1/continuousQueries").configure(api::v1::query_handlers::configure),
            )
            .service(
                web::scope("/v1/sourceProviders")
                    .configure(api::v1::source_provider_handlers::configure),
            )
            .service(
                web::scope("/v1/reactionProviders")
                    .configure(api::v1::reaction_provider_handlers::configure),
            )
            .service(web::scope("/v1/debug").configure(api::v1::debug_handlers::configure))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
