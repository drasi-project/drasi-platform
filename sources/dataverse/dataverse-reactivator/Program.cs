using Dapr.Client;
using Microsoft.PowerPlatform.Dataverse.Client;
using Reactivator.Services;

Console.WriteLine("Starting up");

var config = new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();

var ev = Environment.GetEnvironmentVariables();

var sourceId = config["SOURCE_ID"];
var stateStoreName = config["StateStore"] ?? "drasi-state";
var pubSubName = config["PubSub"] ?? "drasi-pubsub";
var endpoint = config["endpoint"];
var clientId = config["clientId"];
var secret = config["secret"];
var entityList = config["entities"]?.Split(",");
var interval = config["interval"] ?? "60";

var intervalSeconds = int.Parse(interval);

Console.WriteLine($"Source ID: {sourceId}");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprClient();

builder.Services.AddSingleton<IChangePublisher>(sp => new ChangePublisher(sp.GetRequiredService<DaprClient>(), sourceId, pubSubName));
builder.Services.AddSingleton<IDeltaTokenStore>(sp => new DaprDeltaTokenStore(sp.GetRequiredService<DaprClient>(), stateStoreName));
builder.Services.AddSingleton<IEventMapper>(sp => new JsonEventMapper(sourceId));

var uri = new Uri(endpoint);
builder.Services.AddSingleton<IOrganizationServiceAsync>(sp => new ServiceClient(uri, clientId, secret, false));
builder.Services.AddHostedService<HostedServiceContainer>();

foreach (var entity in entityList)
{
    Console.WriteLine($"Adding consumer for entity {entity}");
    builder.Services.AddSingleton(sp => new SyncWorker(sp.GetRequiredService<IChangePublisher>(), sp.GetRequiredService<IDeltaTokenStore>(), sp.GetRequiredService<IEventMapper>(), sp.GetRequiredService<IOrganizationServiceAsync>(), entity, intervalSeconds));
}

var app = builder.Build();

app.Run("http://0.0.0.0:80");

