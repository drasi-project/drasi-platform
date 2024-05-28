using System.Text.Json;
using ahd.Graphite;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "rg-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var graphiteHost = configuration.GetValue<string>("GraphiteHost");
var metricPrefix = configuration.GetValue<string>("MetricPrefix") ?? "reactive_graph";

var client = new GraphiteClient(graphiteHost);

builder.Services.AddDaprClient();

var app = builder.Build();

app.UseRouting();
app.UseCloudEvents();

app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var qpath in Directory.GetFiles(configDirectory))
    {
        var queryId = Path.GetFileName(qpath);
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
            var dataPoints = GetDataPoints(evt);
            await client.SendAsync(dataPoints);
        }

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}

ICollection<Datapoint> GetDataPoints(JsonElement evt)
{
    var dataPoints = new List<Datapoint>();

    var queryId = evt.GetProperty("queryId").GetString();    

    var tracking = evt
        .GetProperty("metadata")
        .GetProperty("tracking");

    var enqeueTime = tracking
        .GetProperty("query")
        .GetProperty("enqueued_ms")
        .GetInt64();

    var queryStart = tracking
        .GetProperty("query")
        .GetProperty("queryStart_ms")
        .GetInt64();

    var queryEnd = tracking
        .GetProperty("query")
        .GetProperty("queryEnd_ms")
        .GetInt64();

    var changeDispatcherStart = tracking
        .GetProperty("source")
        .GetProperty("changeDispatcherStart_ms")
        .GetInt64();

    var changeDispatcherEnd = tracking
        .GetProperty("source")
        .GetProperty("changeDispatcherEnd_ms")
        .GetInt64();

    var changeServiceStart = tracking
        .GetProperty("source")
        .GetProperty("changeSvcStart_ms")
        .GetInt64();

    var changeServiceEnd = tracking
        .GetProperty("source")
        .GetProperty("changeSvcEnd_ms")
        .GetInt64();

    var container = tracking
        .GetProperty("query")
        .GetProperty("container")
        .GetString();

    var hostName = tracking
        .GetProperty("query")
        .GetProperty("hostName")
        .GetString();

    var indexType = tracking
        .GetProperty("query")
        .GetProperty("indexType")
        .GetString();

    var time = DateTimeOffset.FromUnixTimeMilliseconds(queryEnd).DateTime;

    dataPoints.Add(new Datapoint($"{metricPrefix}.queryHost.{container}.{hostName}.{indexType}", queryEnd - queryStart, time));
    dataPoints.Add(new Datapoint($"{metricPrefix}.enqueueTime.{container}.{hostName}.{indexType}", queryStart - enqeueTime, time));
    dataPoints.Add(new Datapoint($"{metricPrefix}.changeService.{container}.{hostName}.{indexType}", changeServiceEnd - changeServiceStart, time));
    dataPoints.Add(new Datapoint($"{metricPrefix}.changeDispatcher.{container}.{hostName}.{indexType}", changeDispatcherEnd - changeDispatcherStart, time));

    return dataPoints;
}