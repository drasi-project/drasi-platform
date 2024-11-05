using Drasi.Reaction.SDK.Models;
using Drasi.Reaction.SDK.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Drasi.Reaction.SDK;

public class Reaction<TQueryConfig> : IHost
    where TQueryConfig : class
{
    private readonly WebApplication _app;
    private readonly Dictionary<string, TQueryConfig?> _queriesConfig;

    public IServiceProvider Services => _app.Services;
    public IConfiguration Configuration => _app.Configuration;

    public ILogger<Reaction<TQueryConfig>> Logger => _app.Services.GetRequiredService<ILogger<Reaction<TQueryConfig>>>();

    internal Reaction(IQueryConfigService queryConfigService, WebApplication app)
    {
        _app = app;        
        _queriesConfig = [];
        var pubsubName = Environment.GetEnvironmentVariable("PubsubName") ?? "drasi-pubsub";

        var handler = app.MapPost("event", this.ProcessEvent);

        foreach (var name in queryConfigService.GetQueryNames())
        {
            var config = queryConfigService.GetQueryConfig<TQueryConfig>(name);
            _queriesConfig.Add(name, config);
            handler.WithTopic(pubsubName, name + "-results");
        };
    }
    
    public async Task StartAsync(CancellationToken cancellationToken = default)
    {   
        Logger.LogInformation("Starting reaction");
        await _app.RunAsync($"http://127.0.0.1:{Configuration["APP_PORT"] ?? "80"}");
    }

    public async Task StopAsync(CancellationToken cancellationToken = default)
    {
        Logger.LogInformation("Stopping reaction");
        await _app.StopAsync(cancellationToken);
    }

    public void Dispose()
    {
        
    }

    private async Task ProcessEvent(HttpContext context, IChangeEventHandler<TQueryConfig> changeHandler, IControlEventHandler<TQueryConfig> controlEventHandler)
    {
        var data = await JsonDocument.ParseAsync(context.Request.Body);
        var evt = data.RootElement;
        switch (evt.GetProperty("kind").GetString())
        {
            case "change":
                var changeEvt = evt.Deserialize<ChangeEvent>(ModelOptions.JsonOptions);
                var queryCfg = _queriesConfig.GetValueOrDefault(changeEvt.QueryId, null);
                await changeHandler.HandleChange(changeEvt, queryCfg);
                break;
            case "control":
                var controlEvt = evt.Deserialize<ControlEvent>(ModelOptions.JsonOptions);
                var queryCfg2 = _queriesConfig.GetValueOrDefault(controlEvt.QueryId, null);
                await controlEventHandler.HandleControlSignal(controlEvt, queryCfg2);
                break;
            default:
                break;
        }

        context.Response.StatusCode = 200;
    }
}

