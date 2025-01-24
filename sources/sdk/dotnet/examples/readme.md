# Source Implementation example

To implement a Drasi source, you need a Reactivator and a Proxy.  The Reactivator is the component that listens to the change feed of the source data store, transforms them into a graph structure and pushes them to the continuous query.  The Proxy is the component that captures the initial state of the data store when a new continuous query is bootstrapped, by querying the data store and transforming the data into a graph structure.

## About the example

This example demonstrates a source that contains a collection of people and connections between those people through a "knows" relationship.  The Proxy, will bootstrap with two Persons, represented as nodes in the queryable graph, and a "knows" relationship between them.  The Reactivator, will generate a two new Persons in the graph every 5 seconds and connect them by creating a relation in the graph between the two.

### The Proxy

When the proxy app starts, we use construct a SourceProxy and give it an implementation of `IBootstrapHandler`. Every time a new query is bootstrapped that depends on this source, the `Bootstrap` method will be called.  It must return a `IAsyncEnumerable<SourceElement>`.

```c#
var proxy = new SourceProxyBuilder()
    .UseBootstrapHandler<BootstrapHandler>()
    .Build();

await proxy.StartAsync();


class BootstrapHandler : IBootstrapHandler
{
    public BootstrapHandler(IConfiguration configuration)
    {
        Console.WriteLine($"Connection string: {configuration["connectionString"]}");
    }

    public async IAsyncEnumerable<SourceElement> Bootstrap(BootstrapRequest request, [EnumeratorCancellation]CancellationToken cancellationToken = default)
    {
        if (request.NodeLabels.Contains("Person"))
        {
            yield return new SourceElement("person-1", ["Person"], new JsonObject
            {
                { "name", "Alice" },
                { "age", 30 }
            });

            yield return new SourceElement("person-2", ["Person"], new JsonObject
            {
                { "name", "Bob" },
                { "age", 40 }
            });
        }

        if (request.RelationLabels.Contains("Knows")) 
        {
            yield return new SourceElement("1-2", ["Knows"], new JsonObject
            {
                { "since", 2010 }
            }, "person-1", "person-2");
        }
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

When the reactivator app starts, we use construct a Reactivator and give it an implementation of `IChangeMonitor` and a deprovision handler. The deprovision handler is called when the source is deleted and gives you a chance to perform housekeeping. The `IChangeMonitor` implementation returns an infinite async stream where each yield is the next change to be processed. Optionally, the `StateStore` can be used if you need to persist the value of a cursor in the source data store.

In this example, we generate two new persons every 5 seconds and a "knows" relationship between them.

```c#
var reactivator = new ReactivatorBuilder()
    .UseChangeMonitor<ChangeMonitor>()
    .UseDeprovisionHandler<DeprovisionHandler>()
    .Build();

await reactivator.StartAsync();


class ChangeMonitor : IChangeMonitor
{
    private readonly IStateStore stateStore;

    public ChangeMonitor(IStateStore stateStore, IConfiguration configuration)
    {
        this.stateStore = stateStore;
        Console.WriteLine($"Connection string: {configuration["connectionString"]}");
    }

    public async IAsyncEnumerable<SourceChange> Monitor([EnumeratorCancellation] CancellationToken cancellationToken = default)
    {        
        var counter = BitConverter.ToUInt32(await stateStore.Get("cursor") ?? [0, 0, 0, 0]);
        while (!cancellationToken.IsCancellationRequested)
        {
            counter++;
            var person1Id = $"person-{counter}";
            yield return new SourceChange(ChangeOp.INSERT, new SourceElement(person1Id, ["Person"], new JsonObject
            {
                { "name", "Alice" },
                { "age", 30 }
            }), DateTimeOffset.Now.ToUnixTimeMilliseconds(), counter);

            counter++;
            var person2Id = $"person-{counter}";
            yield return new SourceChange(ChangeOp.INSERT, new SourceElement(person2Id, ["Person"], new JsonObject
            {
                { "name", "Bob" },
                { "age", 40 }
            }), DateTimeOffset.Now.ToUnixTimeMilliseconds(), counter);

            counter++;
            yield return new SourceChange(ChangeOp.INSERT, new SourceElement($"rel-{counter}", ["Knows"], null, person1Id, person2Id), DateTimeOffset.Now.ToUnixTimeMilliseconds(), counter);

            await stateStore.Put("cursor", BitConverter.GetBytes(counter));
            await Task.Delay(5000, cancellationToken);
        }
    }
}

class DeprovisionHandler : IDeprovisionHandler
{
    public async Task Deprovision(IStateStore stateStore)
    {
        await stateStore.Delete("cursor");
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
    (p1:Person)-[:Knows]->(p2:Person)
RETURN
    elementId(p1) as id1,
    p1.name as name1,
    p1.age as age1,
    elementId(p2) as id2,
    p2.name as name2,
    p2.age as age2
```

Create the query using the CLI.

```shell
drasi apply -f test-query.yaml
```

Now we can see the query result set get updated in real time using the `drasi watch` command. We should see a new row appear every 5 seconds.

```shell
drasi watch query1
```