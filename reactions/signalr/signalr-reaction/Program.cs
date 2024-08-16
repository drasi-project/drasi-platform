using Dapr.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using SignalrReaction.Services;
using Microsoft.Azure.WebJobs.Extensions.Http;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var azConnStr = configuration.GetValue<string>("AzureSignalRConnectionString");
var pubsubName = configuration.GetValue<string>("PubsubName", "rg-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");

var signalRBuilder = builder.Services
    .AddSignalR()
    .AddNewtonsoftJsonProtocol();

if (!String.IsNullOrEmpty(azConnStr))
{
    signalRBuilder.AddAzureSignalR(o =>
    {
        o.ConnectionString = azConnStr;
        o.ServerStickyMode = ServerStickyMode.Required;
    });
}
else
{
    Console.WriteLine("Running in stand-alone mode. Please specify an Azure SignalR Service to scale.");
}

builder.Services.AddDaprClient();
builder.Services.AddActors(x => { });
builder.Services.AddControllers();
builder.Services.AddTransient(sp => new QueryHub(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IChangeFormatter>(), queryContainerId));
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<IChangeFormatter, ChangeFormatter>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowCredentials();
            policy.SetIsOriginAllowed(s => true);
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseCloudEvents();
app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    endpoints.MapHub<QueryHub>("/hub"); 
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var qpath in Directory.GetFiles(configDirectory))
    {
        var queryId = Path.GetFileName(qpath);
        ep.WithTopic(pubsubName, queryId + "-results");
    }
});

// TODO: Put SignalR hub and event route on separate ports, add auth to signalr
app.Urls.Add("http://0.0.0.0:80");  //dapr
app.Urls.Add("http://0.0.0.0:8080"); //app
app.Run();


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
        var hubContext = context.RequestServices.GetRequiredService<IHubContext<QueryHub>>();
        var changeFormatter = context.RequestServices.GetRequiredService<IChangeFormatter>();
        var data = await context.Request.ReadAsStringAsync();
        Console.WriteLine("Got events: " + data);
        var evt = JsonConvert.DeserializeObject<JObject>(data);
        
        var kind = evt.Value<string>("kind");        
        var queryId = evt.Value<string>("queryId");
        var sequence = evt.Value<ulong>("sequence");
        var timestamp = evt.Value<ulong>("sourceTimeMs");
        
        var results = new List<JObject>();

        if (kind == "change")
        {
            results.AddRange(changeFormatter.FormatDelete(queryId, sequence, timestamp, evt["deletedResults"].AsEnumerable()));
            results.AddRange(changeFormatter.FormatAdd(queryId, sequence, timestamp, evt["addedResults"].AsEnumerable()));
            results.AddRange(changeFormatter.FormatUpdate(queryId, sequence, timestamp, evt["updatedResults"].AsEnumerable()));
        }

        if (kind == "control")
        {
            results.Add(changeFormatter.FormatControlSignal(queryId, sequence, timestamp, evt["controlSignal"]));
        }

        foreach (var result in results)
        {   
            await hubContext.Clients.Group("_noGroupSubscription_").SendAsync(queryId, result);
            await hubContext.Clients.Group(queryId).SendAsync(queryId, result);
        }

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error sending update: {ex.Message}");
        throw;
    }
}