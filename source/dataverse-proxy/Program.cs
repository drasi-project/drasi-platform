using Dapr.Client;
using Microsoft.PowerPlatform.Dataverse.Client;
using Proxy.Services;

Console.WriteLine("Starting up");

var config = new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();

var ev = Environment.GetEnvironmentVariables();

var sourceId = config["SOURCE_ID"];
var stateStoreName = config["StateStore"] ?? "rg-state";
var pubSubName = config["PubSub"] ?? "rg-pubsub";
var endpoint = config["endpoint"];
var clientId = config["clientId"];
var secret = config["secret"];
var entityList = config["entities"]?.Split(",");
var interval = config["interval"] ?? "60";

var intervalSeconds = int.Parse(interval);

Console.WriteLine($"Source ID: {sourceId}");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprClient();
builder.Services.AddSingleton<IEventMapper, JsonEventMapper>();
builder.Services.AddControllers();

var uri = new Uri(endpoint);
builder.Services.AddSingleton<IOrganizationServiceAsync>(sp => new ServiceClient(uri, clientId, secret, false));
builder.Services.AddSingleton<IInititalDataFetcher, InititalDataFetcher>();


var app = builder.Build();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});


app.Run("http://0.0.0.0:80");

