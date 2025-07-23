use std::{sync::Arc, time::{SystemTime, UNIX_EPOCH}};

use drasi_source_sdk::{stream, ChangeOp, ChangeStream, DebugPublisher, MemoryStateStore, ReactivatorBuilder, ReactivatorError, SourceChange, SourceElement, StateStore};
use serde_json::{Map, Value};


#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    let reactivator = ReactivatorBuilder::new()
        .with_stream_producer(my_stream)        
        .with_deprovision_handler(deprovision)
        .without_context()
        .build()
        .await;

    reactivator.start().await;
}

async fn my_stream(_context: (), state_store: Arc<dyn StateStore + Send + Sync>) -> Result<ChangeStream, ReactivatorError> {
    
    let mut cursor = match state_store.get("cursor").await.unwrap() {
        Some(cursor) => u64::from_be_bytes(cursor.try_into().unwrap()),
        None => 0,
    };    
    
    let result = stream! {
        let start_location_id = "Location-A";        

        loop {
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            let time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();

            cursor += 1;
            let vehicle_id = format!("vehicle-{}", cursor);
            let vehicle_node = SourceElement::Node {
                id: vehicle_id.clone(),
                labels: vec!["Vehicle".to_string()],
                properties: vec![
                    ("name".to_string(), Value::String(format!("Vehicle {}", cursor))),
                ].into_iter().collect(),
            };

            yield SourceChange::new(ChangeOp::Create, vehicle_node, time, time, cursor, None);

            cursor += 1;
            let vehicle_location_relation = SourceElement::Relation {
                id: format!("vehicle-loc-{}", cursor),
                start_id: vehicle_id,
                end_id: start_location_id.to_string(),
                labels: vec!["LOCATED_AT".to_string()],
                properties: Map::new(),
            };

            yield SourceChange::new(ChangeOp::Create, vehicle_location_relation, time, time, cursor, None);

            state_store.put("cursor", cursor.to_be_bytes().to_vec()).await.unwrap();
        }
        
    };

    Ok(Box::pin(result))
}

async fn deprovision(state_store: Arc<dyn StateStore + Send + Sync>) {
    _ = state_store.delete("cursor").await;
    log::info!("Deprovisioned");
}