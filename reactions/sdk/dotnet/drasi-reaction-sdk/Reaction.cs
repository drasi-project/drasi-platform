using Drasi.Reaction.SDK.Models;
using Drasi.Reaction.SDK.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace Drasi.Reaction.SDK;

public class Reaction<TQueryConfig> : IHost
    where TQueryConfig : class
{
    private readonly WebApplication _app;
    private readonly Dictionary<string, TQueryConfig?> _queriesConfig;

    public IServiceProvider Services => _app.Services;

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
        await _app.RunAsync("http://0.0.0.0:80");
    }

    public async Task StopAsync(CancellationToken cancellationToken = default)
    {
        await _app.StopAsync(cancellationToken);
    }

    public void Dispose()
    {
        
    }

    private async Task ProcessEvent(HttpContext context, IChangeEventHandler changeHandler, IControlEventHandler controlEventHandler)
    {
        var data = await JsonDocument.ParseAsync(context.Request.Body);
        var evt = data.RootElement;
        switch (evt.GetProperty("kind").GetString())
        {
            case "change":
                var changeEvt = evt.Deserialize<ChangeEvent>();
                var queryCfg = _queriesConfig.GetValueOrDefault(changeEvt.QueryId, null);
                changeHandler.HandleChange<TQueryConfig>(changeEvt, queryCfg);
                break;
            case "control":
                var controlEvt = evt.Deserialize<ControlEvent>();
                var queryCfg2 = _queriesConfig.GetValueOrDefault(controlEvt.QueryId, null);
                controlEventHandler.HandleControlSignal<TQueryConfig>(controlEvt, queryCfg2);
                break;
            default:
                break;
        }

        context.Response.StatusCode = 200;
    }
}

