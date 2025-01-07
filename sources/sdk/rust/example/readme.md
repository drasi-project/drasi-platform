# Source Implementation example

To implement a Drasi source, you need a Reactivator and a Proxy.  The Reactivator is the component that listens to the change feed of the source data store, transforms them into a graph structure and pushes them to the continuous query.  The Proxy is the component that captures the initial state of the data store when a new continuous query is bootstrapped, by querying the data store and transforming the data into a graph structure.

## About the example

This example demonstrates a source that contains Vehicles, Locations and connections between those Vehicles and Locations.  The Proxy, will bootstrap with two Locations, represented as nodes in the queryable graph.  The Reactivator, will generate a new Vehicle as a node in the graph every 5 seconds and connect it to one of the original locations by creating a relation in the graph between the two.

### The Proxy

When the proxy app starts, we use construct a SourceProxy and give it a function that takes a BootstrapRequest and returns a new BootstrapStream implementation. Every time a new query is bootstrapped that depends on this source, this function will be called.  It must returns an implementation of `BootstrapStream`, which is basically just an iterator over the bootstrap data.  In this case, we have simply hard coded two locations as the data to be returned with any request.

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

#### Building the Proxy

The proxy needs to be packaged as a container image.  Go to the `proxy` directory and use the make command. This will build the container image and tag it with `my-proxy`.

```shell
make docker-build
```

If you are using kind for testing, you can also use the make command to load the image to your kind cluster.

```shell
make kind-load
```


### The Reactivator

When the reactivator app starts, we use construct a Reactivator and give it an implementation of `ChangeStream` and a deprovision handler. The deprovision handler is called when the source is deleted and gives you a chance to perform housekeeping. The `ChangeStream` implementation returns an infinite async stream where each yield is the next change to be processed. Optionally, the `StateStore` can be used if you need to persist the value of a cursor in the source data store.

In this example, we generate a new Vehicle every 5 seconds, along with a relation that connects that Vehicle to `Location-A`.

```rust
#[tokio::main]
async fn main() {
    let mut reactivator = ReactivatorBuilder::new()
        .with_stream_producer(my_stream)
        .with_deprovision_handler(deprovision)
        .build()
        .await;

    reactivator.start().await;
}

/*
 * A simple implementation of a ChangeStream that publishes a vehicle node and a relation between that vehicle and Location-A every 5 seconds.
 *
 * The cursor value is stored in the state store, so we can pick up where we left off if the reactivator restarts.
 * Location-A is the location that the vehicle will be connected to, the path through the graph will be (Vehicle)-[:LOCATED_AT]->(Location-A).
 *
 */
async fn my_stream(state_store: Arc<dyn StateStore + Send + Sync>) -> Result<ChangeStream, ReactivatorError> {
    
    // Get the cursor value from the state store
    let mut cursor = match state_store.get("cursor").await.unwrap() {
        Some(cursor) => u64::from_be_bytes(cursor.try_into().unwrap()),
        None => 0,
    };    
    
    let result = stream! {
        
        // The ID of the location that we will create a relation that connects the new vehicle and this location
        let start_location_id = "Location-A";        

        loop {
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            let time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() * 1000;            

            // Generate a new vehicle
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

            // Generate a relation between the vehicle and the location
            cursor += 1;
            let vehicle_location_relation = SourceElement::Relation {
                id: format!("vehicle-loc-{}", cursor),
                start_id: vehicle_id,
                end_id: start_location_id.to_string(),
                labels: vec!["LOCATED_AT".to_string()],
                properties: Map::new(),
            };

            yield SourceChange::new(ChangeOp::Create, vehicle_location_relation, time, cursor, None);

            // Update the cursor value in the state store, so we can pick up where we left off if the reactivator restarts
            state_store.put("cursor", cursor.to_be_bytes().to_vec()).await.unwrap();
        }
        
    };

    Ok(Box::pin(result))
}

async fn deprovision(state_store: Arc<dyn StateStore + Send + Sync>) {
    _ = state_store.delete("cursor").await;
    log::info!("Deprovisioned");
}
```

#### Building the Reactivator

The reactivator needs to be packaged as a container image.  Go to the `reactivator` directory and use the make command. This will build the container image and tag it with `my-reactivator`.

```shell
make docker-build
```

If you are using kind for testing, you can also use the make command to load the image to your kind cluster.

```shell
make kind-load
```

### The SourceProvider

The source needs to be registered within Drasi. This is done by creating a `SourceProvider` definition in YAML.  This definition describes the container images for the Reactivator and Proxy components as well as the schema of any configuration properties you might have.

```yaml
apiVersion: v1
kind: SourceProvider
name: MySource
spec:
  services:
    proxy:
      image: my-proxy
      externalImage: true
      dapr:
        app-port: "80"
    reactivator: 
      image: my-reactivator
      externalImage: true
      deprovisionHandler: true
      dapr:
        app-port: "80"
  config_schema:
    type: object
    properties:
      connectionString:  # sample config property
        type: string
```

This can be applied to your Drasi instance using the CLI.

```shell
drasi apply -f source-provider.yaml
```

### Testing with a query

Once the `SourceProvider` has been applied, we can create a source with it.

```yaml
apiVersion: v1
kind: Source
name: test-source
spec:
  kind: MySource
  properties:
    connectionString: "my-connection-string"
```

```shell
drasi apply -f source.yaml
```

Well use this simple query to test our source.

```cypher
MATCH 
    (v:Vehicle)-[:LOCATED_AT]->(l:Location)
RETURN
    v.name as vehicleName,
    l.longitude as longitude,
    l.latitude as latitude
```

Create the query using the CLI.

```shell
drasi apply -f query.yaml
```

Now we can see the query result set get updated in real time using the `drasi watch` command. We should see a new row appear every 5 seconds.

```shell
drasi watch query1
```