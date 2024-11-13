# Reaction SDK for Drasi

This library provides the building blocks and infrastructure to implement a [Drasi](https://drasi.io/) Reaction in .NET

## Getting started

### Install the package

```
dotnet add package Drasi.Reaction.SDK
```

### Basic example

The following example simply breaks down and logs the various parts of the incoming change event from a [Continuous Query](https://drasi.io/concepts/continuous-queries/).

```csharp
var builder = new ReactionBuilder();

builder.UseChangeEventHandler(async (evt, queryConfig) =>
{
    Console.WriteLine($"Received change event from query {evt.QueryId} sequence {evt.Sequence}");
    
    foreach (var item in evt.AddedResults)
        Console.WriteLine($"Added result: {item}");

    foreach (var item in evt.UpdatedResults)
        Console.WriteLine($"Updated result, before {item.Before}, after {item.After}");

    foreach (var item in evt.DeletedResults)
        Console.WriteLine($"Deleted result: {item}");

});

var reaction = builder.Build();
await reaction.StartAsync();
```

### A more advanced example

The following example illustrates 
 - Retrieving a configuration value from the Reaction manifest
 - Defining a custom per query configuration object
 - Parsing the per query configuration object from Yaml
 - Process change events from the query
 - Process control events (start, stop, etc.) from the query


```csharp
var reaction = new ReactionBuilder<MyQueryConfig>()
    .UseChangeEventHandler<MyChangeHandler>()               // Use your custom change handler
    .UseControlEventHandler<MyControlSignalHandler>()       // Use your custom control signal handler
    .UseYamlQueryConfig()                                   // Parse the per query configuration from Yaml
    .ConfigureServices((services) =>                        // Register your own services
    {
        services.AddSingleton<MyService>();
    })
    .Build();

// Start the reaction
await reaction.StartAsync();

// Define a custom per query configuration object
class MyQueryConfig
{
    [JsonPropertyName("greeting")]
    public string? Greeting { get; set; }
}

// Your own internal service
class MyService
{
    private readonly string _connectionString;

    public MyService(IConfiguration configuration)
    {
        // Retrieve the connection string from the Reaction configuration
        _connectionString = configuration["MyConnectionString"];
    }

    public void DoSomething()
    {
        Console.WriteLine("Doing something");
    }
}

// Define a custom change handler, that uses your service
class MyChangeHandler : IChangeEventHandler<MyQueryConfig>
{   
    private readonly MyService _service;
    private readonly ILogger<MyChangeHandler> _logger;

    public MyChangeHandler(MyService service, ILogger<MyChangeHandler> logger)
    {
        _service = service;
        _logger = logger;
    }

    public async Task HandleChange(ChangeEvent evt, MyQueryConfig? queryConfig)
    {
        _logger.LogInformation($"Received change event from query {evt.QueryId} sequence {evt.Sequence}. Query greeting is {queryConfig?.Greeting}");
        _logger.LogInformation($"Full event: {evt.ToJson()}");
        _service.DoSomething();
    }
}

// Define a custom control signal handler
class MyControlSignalHandler : IControlEventHandler<MyQueryConfig>
{
    private readonly ILogger<MyControlSignalHandler> _logger;

    public MyControlSignalHandler(ILogger<MyControlSignalHandler> logger)
    {
        _logger = logger;
    }

    public async Task HandleControlSignal(ControlEvent evt, MyQueryConfig? queryConfig)
    {
        _logger.LogWarning($"Received control signal: {evt.ControlSignal?.Kind} for query {evt.QueryId}. Query greeting is {queryConfig?.Greeting}");
    }
}
```
