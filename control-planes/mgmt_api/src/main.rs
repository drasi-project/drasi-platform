use actix_web::{middleware, web, App, HttpServer};
use domain::resource_provider_services::{
    ReactionProviderDomainService, ReactionProviderDomainServiceImpl, SourceProviderDomainService,
    SourceProviderDomainServiceImpl,
};
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
    println!("version: {}", VERSION);
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let dapr_port: u16 = std::env::var("DAPR_GRPC_PORT").unwrap().parse().unwrap();
    let dapr_addr = format!("https://127.0.0.1:{}", dapr_port);

    let mongo_uri = std::env::var("MONGO_URI").unwrap_or("mongodb://rg-mongo:27017".to_string());
    let mongo_db = std::env::var("MONGO_DB").unwrap_or("api".to_string());
    let redis_url = std::env::var("REDIS_URL").unwrap_or("redis://rg-redis:6379".to_string());

    // Introduce delay so that dapr grpc port is assigned before app tries to connect
    std::thread::sleep(std::time::Duration::new(5, 0));

    let dapr_client = dapr::Client::<dapr::client::TonicClient>::connect(dapr_addr)
        .await
        .unwrap();
    let mongo_client = mongodb::Client::with_uri_str(&mongo_uri).await.unwrap();

    log::info!("starting HTTP server at http://localhost:8080");
    //wait for the schema to be populated before starting the server

    HttpServer::new(move || {
        //todo: investigate IoC container
        let db = mongo_client.database(&mongo_db);
        let source_repo = SourceRepositoryImpl::new(db.clone());
        let source_domain_svc =
            SourceDomainServiceImpl::new(dapr_client.clone(), Box::new(source_repo));

        let source_domain_svc_arc: web::Data<SourceDomainService> =
            web::Data::from(Arc::new(source_domain_svc) as Arc<SourceDomainService>);

        let qc_repo = QueryContainerRepositoryImpl::new(db.clone());
        let qc_domain_svc = Arc::new(QueryContainerDomainServiceImpl::new(
            dapr_client.clone(),
            Box::new(qc_repo),
        ));
        let qc_domain_svc_arc: web::Data<QueryContainerDomainService> =
            web::Data::from(qc_domain_svc.clone() as Arc<QueryContainerDomainService>);

        let reaction_repo = ReactionRepositoryImpl::new(db.clone());
        let reaction_domain_svc =
            ReactionDomainServiceImpl::new(dapr_client.clone(), Box::new(reaction_repo));
        let reaction_domain_svc_arc: web::Data<ReactionDomainService> =
            web::Data::from(Arc::new(reaction_domain_svc) as Arc<ReactionDomainService>);

        let query_repo = QueryRepositoryImpl::new(db.clone());
        let query_domain_svc = QueryDomainServiceImpl::new(
            dapr_client.clone(),
            Box::new(query_repo),
            qc_domain_svc.clone(),
        );
        let query_domain_svc_arc: web::Data<QueryDomainService> =
            web::Data::from(Arc::new(query_domain_svc) as Arc<QueryDomainService>);
        let source_provider_repo = SourceProviderRepositoryImpl::new(db.clone());
        let source_provider_domain_svc = SourceProviderDomainServiceImpl::new(
            dapr_client.clone(),
            Box::new(source_provider_repo),
        );

        let source_provider_domain_svc_arc: web::Data<SourceProviderDomainService> =
            web::Data::from(
                Arc::new(source_provider_domain_svc) as Arc<SourceProviderDomainService>
            );

        let reaction_provider_repo = ReactionProviderRepositoryImpl::new(db.clone());
        let reaction_provider_domain_svc = ReactionProviderDomainServiceImpl::new(
            dapr_client.clone(),
            Box::new(reaction_provider_repo),
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

        let debug_service = DebugService::new(dapr_client.clone(), Arc::new(result_service));

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
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
