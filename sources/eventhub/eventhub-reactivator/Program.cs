using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Consumer;
using Azure.Messaging.EventHubs.Primitives;
using Dapr.Client;
using Reactivator.Services;

Console.WriteLine("Starting up");

var config = new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();

var ev = Environment.GetEnvironmentVariables();

var sourceId = config["SOURCE_ID"];
var stateStoreName = config["StateStore"] ?? "drasi-state";
var pubSubName = config["PubSub"] ?? "drasi-pubsub";
var entities = config["eventHubs"] ?? "";
var consumerGroup = config["consumerGroup"] ?? EventHubConsumerClient.DefaultConsumerGroupName;
var connectionString = config["connectionString"];

var entityList = entities.Split(',', StringSplitOptions.RemoveEmptyEntries);

Console.WriteLine($"Source ID: {sourceId}");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprClient();

builder.Services.AddSingleton<IChangePublisher>(sp => new ChangePublisher(sp.GetRequiredService<DaprClient>(), sourceId, pubSubName));
builder.Services.AddSingleton<ICheckpointStore>(sp => new DaprCheckpointStore(sp.GetRequiredService<DaprClient>(), stateStoreName));
builder.Services.AddSingleton<IEventMapper>(sp => new JsonEventMapper(sourceId));
builder.Services.AddHostedService<HostedServiceContainer>();

foreach (var entity in entityList)
{
    Console.WriteLine($"Adding consumer for entity {entity}");
    builder.Services.AddSingleton(sp => new HubConsumer(sp.GetRequiredService<IChangePublisher>(), sp.GetRequiredService<ICheckpointStore>(), sp.GetRequiredService<IEventMapper>(), connectionString, consumerGroup, entity));
}

var app = builder.Build();

app.Run("http://0.0.0.0:80");

