using Dapr.Actors.Client;
using Dapr.Client;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using Drasi.Reactions.Debug.Server.Services;


var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");


builder.Services.AddDaprClient();
builder.Services.AddActors(x => { });
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IActorProxyFactory>(), sp.GetRequiredService<DaprClient>(), configDirectory, queryContainerId));
builder.Services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()   // Allow any origin (change this in production to a specific origin)
                  .AllowAnyMethod()   // Allow any HTTP method (GET, POST, etc.)
                  .AllowAnyHeader();  // Allow any header
        });
});


var app = builder.Build();
app.UseCors("AllowAll");
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseWebSockets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Urls.Add("http://0.0.0.0:80"); 
app.Urls.Add("http://0.0.0.0:5195"); 
// app.UseEndpoints(endpoints =>
// {
//     endpoints.MapSubscribeHandler();
//     var ep = endpoints.MapPost("event", ProcessEvent);

//     foreach (var qpath in Directory.GetFiles(configDirectory))
//     {
//         var queryId = Path.GetFileName(qpath);
//         ep.WithTopic(pubsubName, queryId + "-results");
//     }        
// });

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

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

static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();
}