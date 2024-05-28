using Dapr;
using Dapr.Actors.Client;
using Dapr.Client;
using debug_reactor.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "rg-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");


// Add services to the container.
builder.Services.AddDaprClient();
builder.Services.AddActors(x => { });
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<IStatisticsService, StatisticsService>();
builder.Services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IActorProxyFactory>(), sp.GetRequiredService<DaprClient>(), configDirectory, queryContainerId));
builder.Services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();

app.UseRouting();
app.UseCloudEvents();

//app.MapBlazorHub();
//app.MapFallbackToPage("/_Host");

app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    endpoints.MapBlazorHub();
    endpoints.MapFallbackToPage("/_Host");
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var qpath in Directory.GetFiles(configDirectory))
    {
        var queryId = Path.GetFileName(qpath);
        ep.WithTopic(pubsubName, queryId + "-results");
    }        
});

// todo: host dapr endpoints on own port, add security
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
        var debugService = context.RequestServices.GetRequiredService<IQueryDebugService>();
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        Console.WriteLine("Got event: " + data.RootElement.GetRawText());

        var evt = data.RootElement;
        var queryId = evt.GetProperty("queryId").GetString();
        if (!File.Exists(Path.Combine(configDirectory, queryId)))
        {
            Console.WriteLine("Skipping " + queryId);
            context.Response.StatusCode = 200;
            return;
        }
        
        switch (evt.GetProperty("kind").GetString()) 
        {
            case "control":
                Console.WriteLine("Processing signal " + queryId);
                debugService.ProcessControlSignal(evt);
                break;
            case "change":
                Console.WriteLine("Processing change " + queryId);
                debugService.ProcessRawChange(evt);
                break;
        }        

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}