# Rust Source SDK for Drasi

This library provides the building blocks and infrastructure to implement a Drasi Source in Rust

## Getting started

### Install the package


```shell
cargo add drasi-source-sdk
```


### Example

#### Proxy

```rust
#[tokio::main]
async fn main() {
    let proxy = SourceProxyBuilder::new()
        .with_stream_producer(my_stream)
        .build();

        proxy.start().await;    
}

async fn my_stream(req: BootstrapRequest) -> Result<BootstrapStream, BootstrapError> {
    let stream = stream! {
        if req.node_labels.contains(&"Location".to_string()) {
            yield SourceElement::Node { 
                id: "Location-A".to_string(), 
                labels: vec!["Location".to_string()], 
                properties: vec![
                    ("longitude".to_string(), Value::Number(Number::from_f64(50.1).unwrap())),
                    ("latitude".to_string(), Value::Number(Number::from_f64(60.7).unwrap())),
                ].into_iter().collect(),
            };    

            yield SourceElement::Node { 
                id: "Location-B".to_string(), 
                labels: vec!["Location".to_string()], 
                properties: vec![
                    ("longitude".to_string(), Value::Number(Number::from_f64(58.9).unwrap())),
                    ("latitude".to_string(), Value::Number(Number::from_f64(72.1).unwrap())),
                ].into_iter().collect(),
            };    
        }
    };

    Ok(Box::pin(stream))
}
```

#### Reactivator

```rust
#[tokio::main]
async fn main() {
    let mut reactivator = ReactivatorBuilder::new()
        .with_stream_producer(my_stream)
        .build()
        .await;

    reactivator.start().await;
}

async fn my_stream(state_store: Arc<dyn StateStore + Send + Sync>) -> Result<ChangeStream, ReactivatorError> {
    
    let mut cursor = match state_store.get("cursor").await.unwrap() {
        Some(cursor) => u64::from_be_bytes(cursor.try_into().unwrap()),
        None => 0,
    };    
    
    let result = stream! {
        let start_location_id = "Location-A";        

        loop {
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            let time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() * 1000;            

            cursor += 1;
            let vehicle_id = format!("vehicle-{}", cursor);
            let vehicle_node = SourceElement::Node {
                id: vehicle_id.clone(),
                labels: vec!["Vehicle".to_string()],
                properties: vec![
                    ("name".to_string(), Value::String(format!("Vehicle {}", cursor))),
                ].into_iter().collect(),
            };

            yield SourceChange::new(ChangeOp::Create, vehicle_node, time, cursor, None);

            cursor += 1;
            let vehicle_location_relation = SourceElement::Relation {
                id: format!("vehicle-loc-{}", cursor),
                start_id: vehicle_id,
                end_id: start_location_id.to_string(),
                labels: vec!["LOCATED_AT".to_string()],
                properties: Map::new(),
            };

            yield SourceChange::new(ChangeOp::Create, vehicle_location_relation, time, cursor, None);

            state_store.put("cursor", cursor.to_be_bytes().to_vec()).await.unwrap();
        }
        
    };

    Ok(Box::pin(result))
}
```
