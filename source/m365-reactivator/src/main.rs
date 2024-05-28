use std::sync::Arc;

use api::{BootstrapData, BootstrapElement};
use axum::{Router, Json, extract::State, routing::post};
use document_cache::{DocumentCache, ElementDiff};
use m365_auth::TokenManager;
use models::SourceConfig;
use publisher::Publisher;
use resource_watcher::ResourceWatcher;
use serde_json::Map;

mod resource_watcher;
mod m365_auth;
mod models;
mod drive_change_processor;
mod document_cache;
mod api;
mod publisher;

#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let config = SourceConfig::from_env();
    let token_manager = TokenManager::from_env();
    let doc_cache = Arc::new(DocumentCache::new());
    let publisher = Publisher::new().await;
    
    let watcher = ResourceWatcher::start(&config, doc_cache.clone(), Arc::new(token_manager), Arc::new(publisher));

    let app = Router::new()
        .route("/acquire", post(acquire))
        .with_state(doc_cache);

    axum::Server::bind(&"0.0.0.0:8080".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();


    watcher.join().await;

}

async fn acquire(State(cache): State<Arc<DocumentCache>>) -> Json<BootstrapData> {
    let data = cache.get_current_all().await;
    
    let mut result = BootstrapData {
        nodes: Vec::new(),
        rels: Vec::new(),
    };

    for item in data {
        let element = match item {
            ElementDiff::Added(element) => element,
            _ => continue,
        };

        result.nodes.push(BootstrapElement {
            id: element.id.clone(),
            label: element.label.clone(),
            properties: element.content.as_object().unwrap_or(&Map::new()).clone(),
            start_id: None,
            end_id: None,            
        });

        if let Some(parent) = element.parent {
            result.rels.push(BootstrapElement {
                id: format!("{}-{}", parent, element.id),
                label: "CONTAINS".to_string(),
                properties: Map::new(),
                start_id: Some(parent),
                end_id: Some(element.id),
            });
        }        
    }

    Json(result)
}