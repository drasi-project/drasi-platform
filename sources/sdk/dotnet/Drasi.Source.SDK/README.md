# Source SDK for Drasi

This library provides the building blocks and infrastructure to implement a [Drasi](https://drasi.io/) Source in .NET

## Getting started

### Install the package

```
dotnet add package Drasi.Source.SDK
```

### Reactivator Example

To build a reactivator, you need to implement `IChangeMonitor` which returns an `IAsyncEnumerable<SourceChange>` that yields changes when they occur in the data source. The following example will generate changes every 5 seconds.

```c#
var reactivator = new ReactivatorBuilder()
    .UseChangeMonitor<ChangeMonitor>()
    .Build();

await reactivator.StartAsync();


class ChangeMonitor : IChangeMonitor
{
    public async IAsyncEnumerable<SourceChange> Monitor([EnumeratorCancellation] CancellationToken cancellationToken = default)
    {        
        var counter = 0;
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

            await Task.Delay(5000, cancellationToken);
        }
    }
}
```

### Proxy Example

To implement a proxy, you need to implement an `IBootstrapHandler`, which will be invoked when a new query bootstraps.  The request will hold the element labels the query is interested in and an `IAsyncEnumerable<SourceElement>` must be returned.

```c#
var proxy = new SourceProxyBuilder()
    .UseBootstrapHandler<BootstrapHandler>()
    .Build();

await proxy.StartAsync();

class BootstrapHandler : IBootstrapHandler
{
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

### Reading configuration

To access the configuration properties of the source, simply add an `IConfiguration` parameter to the constructor of your BootstrapHandler or ChangeMonitor.

```c#
public BootstrapHandler(IConfiguration configuration)
{
    Console.WriteLine($"Connection string: {configuration["connectionString"]}");
}
```

This will read the `connectionString` configuration property of this source.

```yaml
apiVersion: v1
kind: Source
name: test-source
spec:
  kind: MySource
  properties:
    connectionString: "my-connection-string"
```