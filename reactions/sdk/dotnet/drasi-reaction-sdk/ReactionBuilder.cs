using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Drasi.Reaction.SDK.Models;

namespace Drasi.Reaction.SDK
{
    public class ReactionBuilder : ReactionBuilder<object>
    {
    }

    public class ReactionBuilder<TQueryConfig> where TQueryConfig : class
    {
        private readonly WebApplicationBuilder _webappBuilder;

        public IServiceCollection Services => _webappBuilder.Services;

        public IConfiguration Configuration => _webappBuilder.Configuration;

        public ReactionBuilder()
        {
            _webappBuilder = WebApplication.CreateBuilder();
            _webappBuilder.Services.AddDaprClient();
            _webappBuilder.Services.AddControllers();
            _webappBuilder.Services.AddSingleton<IQueryConfigService, QueryConfigService>();
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, NullConfigDeserializer>();
            _webappBuilder.Services.AddScoped<IControlEventHandler<TQueryConfig>, DefaultControlEventHandler<TQueryConfig>>();
            _webappBuilder.Configuration.AddEnvironmentVariables();
            _webappBuilder.Logging.AddConsole();
        }

        public void UseChangeEventHandler<TChangeEventHandler>() where TChangeEventHandler : class, IChangeEventHandler<TQueryConfig>
        {
            _webappBuilder.Services.AddScoped<IChangeEventHandler<TQueryConfig>, TChangeEventHandler>();
        }

        public void UseChangeEventHandler(Func<ChangeEvent, TQueryConfig?, Task> handler)
        {
            _webappBuilder.Services.AddScoped<IChangeEventHandler<TQueryConfig>>((sp) => new InlineChangeEventHandler<TQueryConfig>(handler));
        }

        public void UseControlEventHandler<TControlEventHandler>() where TControlEventHandler : class, IControlEventHandler<TQueryConfig>
        {
            _webappBuilder.Services.AddScoped<IControlEventHandler<TQueryConfig>, TControlEventHandler>();
        }

        public void UseJsonQueryConfig()
        {
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, JsonConfigDeserializer>();
        }

        public void UseYamlQueryConfig()
        {
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, YamlConfigDeserializer>();
        }

        public Reaction<TQueryConfig> Build()
        {
            var hasChangeHandler = _webappBuilder.Services.Any(x => x.ServiceType == typeof(IChangeEventHandler<TQueryConfig>));
            if (!hasChangeHandler)
            {
                throw new InvalidOperationException("No change event handler registered");
            }

            var app = _webappBuilder.Build();
            app.UseRouting();
            app.UseCloudEvents();
            app.MapSubscribeHandler();
            
            var queryConfigSvc = app.Services.GetRequiredService<IQueryConfigService>();

            return new Reaction<TQueryConfig>(queryConfigSvc, app);
        }

    }
}
