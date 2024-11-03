using System.Text.Json.Serialization;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models;
using Microsoft.Extensions.Logging;

var builder = new ReactionBuilder<MyQueryConfig>();
builder.UseChangeEventHandler<MyChangeHandler>();
builder.UseControlEventHandler<MyControlSignalHandler>();
builder.UseYamlQueryConfig();

var reaction = builder.Build();

var myConnectionString = reaction.Configuration["MyConnectionString"];
Console.WriteLine("MyConnectionString: " + myConnectionString);

await reaction.StartAsync();

class MyQueryConfig
{
    [JsonPropertyName("greeting")]
    public string? Greeting { get; set; }
}

class MyChangeHandler : IChangeEventHandler<MyQueryConfig>
{   
    private readonly ILogger<MyChangeHandler> _logger;

    public MyChangeHandler(ILogger<MyChangeHandler> logger)
    {
        _logger = logger;
    }

    public async Task HandleChange(ChangeEvent evt, MyQueryConfig? queryConfig)
    {
        _logger.LogInformation($"Received change event from query {evt.QueryId} sequence {evt.Sequence}. Query greeting is {queryConfig?.Greeting}");
        _logger.LogInformation($"Full event: {evt.ToJson()}");
    }
}

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