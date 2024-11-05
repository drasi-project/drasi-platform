using System.Text.Json.Serialization;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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