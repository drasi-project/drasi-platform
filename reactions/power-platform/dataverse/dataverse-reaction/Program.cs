using System.Text.Json;
using YamlDotNet.Serialization;
using YamlDotNet.Core.Events;
using DataverseReaction.Models;
using Microsoft.PowerPlatform.Dataverse.Client;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var endpoint = configuration["endpoint"];
var clientId = configuration["clientId"];
var secret = configuration["secret"];


var yamlDeserializer = new DeserializerBuilder()
    .WithNodeTypeResolver(new InferTypeFromValue())
    .Build();

var yamlJsonSerializer = new SerializerBuilder()
    .JsonCompatible()
    .Build();

var queries = new Dictionary<string, ReactionSpec>();

foreach (var qpath in Directory.GetFiles(configDirectory))
{
    var queryId = Path.GetFileName(qpath);
    var yamlObject = yamlDeserializer.Deserialize(File.ReadAllText(qpath));
    var specJson = yamlJsonSerializer.Serialize(yamlObject);
    var spec = JsonSerializer.Deserialize<ReactionSpec>(specJson);
    queries.Add(queryId, spec);
}

var uri = new Uri(endpoint);
var serviceClient = new ServiceClient(uri, clientId, secret, false);
var actionExecutor = new DataverseReaction.ActionExecutor(serviceClient);

builder.Services.AddDaprClient();

var app = builder.Build();

app.UseRouting();
app.UseCloudEvents();

app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var queryId in queries.Keys)
    {
        ep.WithTopic(pubsubName, queryId + "-results");
    }
});

app.Run("http://0.0.0.0:80");

static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();
}

async Task ProcessEvent(HttpContext context)
{
    try
    {
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        Console.WriteLine("Got event: " + data.RootElement.GetRawText());

        var evt = data.RootElement;
        if (evt.GetProperty("kind").GetString() == "change")
        {
            var queryId = evt.GetProperty("queryId").GetString(); 
            if (!queries.ContainsKey(queryId))
            {
                Console.WriteLine($"No query found for queryId: {queryId}");
                context.Response.StatusCode = 200;
                return;
            }

            var reactionSpec = queries[queryId];
            var changes = evt.Deserialize<QueryChangeResult>();
            await actionExecutor.ExecuteActions(reactionSpec, changes);            
        }

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}



public class InferTypeFromValue : INodeTypeResolver
{
    public bool Resolve(NodeEvent nodeEvent, ref Type currentType)
    {
        var scalar = nodeEvent as Scalar;
        if (scalar != null)
        {
            int value;
            if (int.TryParse(scalar.Value, out value))
            {
                currentType = typeof(int);
                return true;
            }
        }
        return false;
    }
}


