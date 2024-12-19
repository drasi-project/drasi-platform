# Source Implementation example

To implement a Drasi source, you need a Reactivator and a Proxy.  The Reactivator is the component that listens to the change feed of the source data store, transforms them into a graph structure and pushes them to the continuous query.  The Proxy is the component that captures the initial state of the data store when a new continuous query is bootstrapped, by querying the data store and transforming the data into a graph structure.

## About the example

This example demonstrates a source that contains Vehicles, Locations and connections between those Vehicles and Locations.  The Proxy, will bootstrap with two Locations, represented as nodes in the queryable graph.  The Reactivator, will generate a new Vehicle as a node in the graph every 5 seconds and connect it to one of the original locations by creating a relation in the graph between the two.

### The Proxy

When the proxy app starts, we use construct a SourceProxy and give it a function that takes a BootstrapRequest and returns a new BootstrapStream implementation. Every time a new query is bootstrapped that depends on this source, this function will be called.  It must returns an implementation of `BootstrapStream`, which is basically just an iterator over the bootstrap data.  In this case, we have simply hard coded two locations as the data to be returned with any request.

```java
public class App {
    public static void main(String[] args) {

        //Create a new SourceProxy, supply a function that takes a BootstrapRequest and returns a new BootstrapStream implementation.
        var proxy = SourceProxy.builder()
                .withStreamFunction(request -> new MyBootstrapStream(request))
                .build();

        //Start the proxy
        proxy.start();
    }
}

/**
 * A simple implementation of a BootstrapStream that returns two location nodes.
 *
 */
class MyBootstrapStream implements BootstrapStream {

    private final BootstrapRequest request;
    private final Iterator<SourceElement> elements;

    public MyBootstrapStream(BootstrapRequest request) {
        this.request = request;

        ObjectMapper mapper = new ObjectMapper();

        elements = List.of(
            new SourceElement("Location-A", mapper.valueToTree(Map.of(
                    "longitude", 50.0,
                    "latitude", 60.0
                    )), Set.of("Location")),
            new SourceElement("Location-B", mapper.valueToTree(Map.of(
                    "longitude", 51.0,
                    "latitude", 65.0
            )), Set.of("Location"))
        ).iterator();
    }

    @Override
    public SourceElement next() {
        if (elements.hasNext()) {
            return elements.next();
        }

        return null;
    }

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

When the reactivator app starts, we use construct a Reactivator and give it an implementation of `ChangeMonitor` and a deprovision handler. The deprovision handler is called when the source is deleted and gives you a chance to perform housekeeping. The `ChangeMonitor` implementation contains a `run` method that provides access to a `ChangePublisher` and a `StateStore`.  This run method should implement a loop that continually watches for changes in the data store and then maps them onto a graph structure and publishes them via the `ChangePublisher`. Optionally, the `StateStore` can be used if you need to persist the value of a cursor in the source data store.

In this example, we generate a new Vehicle every 5 seconds, along with a relation that connects that Vehicle to `Location-A`.

```java
public class App {
    public static void main(String[] args) {

        // Create a new Reactivator, supply a ChangeMonitor implementation and a DeprovisionHandler implementation.
        var reactivator = Reactivator.builder()
                .withChangeMonitor(new MyChangeMonitor())
                .withDeprovisionHandler((statestore) -> statestore.delete("cursor"))
                .build();

        // Start the reactivator
        reactivator.start();
    }
}

/**
 * A simple implementation of a ChangeMonitor that publishes a vehicle node and a relation between that vehicle and Location-A every 5 seconds.
 *
 * The cursor value is stored in the state store, so we can pick up where we left off if the reactivator restarts.
 * Location-A is the location that the vehicle will be connected to, the path through the graph will be (Vehicle)-[:LOCATED_AT]->(Location-A).
 *
 */
class MyChangeMonitor implements ChangeMonitor {

    private volatile boolean shouldStop = false;
    private final ObjectMapper mapper = new ObjectMapper();
    private static Logger log = LoggerFactory.getLogger(MyChangeMonitor.class);

    @Override
    public void run(ChangePublisher publisher, StateStore stateStore) throws Exception {

        // Get the cursor value from the state store
        var cursorStart = stateStore.get("cursor");
        var cursor = switch (cursorStart) {
            case null -> 0;
            default -> {
                if (cursorStart.length == 4) {
                    yield ByteBuffer.wrap(cursorStart).getInt();
                } else {
                    yield 0;
                }
            }
        };

        log.info("Starting from cursor: {}", cursor);

        // The ID of the location that we will create a relation that connects the new vehicle and this location
        var startingVehicleLocationId = "Location-A";

        while (!shouldStop) {
            Thread.sleep(5000);

            // Generate a new vehicle
            var vehicleId = UUID.randomUUID().toString();
            var vehicleInsert = generateVehicleInsert(vehicleId, cursor);
            cursor++;

            // Generate a relation between the vehicle and the location
            var vehicleLocationInsert = generateVehicleLocation(vehicleId, startingVehicleLocationId, cursor);
            cursor++;

            // Publish the changes
            publisher.Publish(vehicleInsert);
            publisher.Publish(vehicleLocationInsert);

            // Update the cursor value in the state store, so we can pick up where we left off if the reactivator restarts
            stateStore.put("cursor", ByteBuffer.allocate(4).putInt(cursor).array());

            log.info("Published vehicle and location relation for vehicle: {}", vehicleId);
        }
    }

    private SourceInsert generateVehicleInsert(String vehicleId, int cursor) {
        var changeTime = System.currentTimeMillis();
        var vehicleProperties = mapper.createObjectNode();
        vehicleProperties.put("name", "Vehicle " + cursor);

        var vehicleInsert = new SourceInsert(vehicleId, changeTime, vehicleProperties, null, List.of("Vehicle"), changeTime, cursor);

        return vehicleInsert;
    }

    private SourceInsert generateVehicleLocation(String vehicleId, String locationId, int cursor) {
        var changeTime = System.currentTimeMillis();
        var relationId = UUID.randomUUID().toString();

        var vehicleLocationInsert = new SourceInsert(relationId, changeTime, null, null, List.of("LOCATED_AT"), changeTime, cursor, vehicleId, locationId);

        return vehicleLocationInsert;
    }

    @Override
    public void close() throws Exception {
        shouldStop = true;
    }
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