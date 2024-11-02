using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Drasi.Reaction.SDK.Services;

namespace Drasi.Reaction.SDK
{
    public class ReactionBuilder
    {
        private readonly WebApplicationBuilder _webappBuilder;

        public IServiceCollection Services => _webappBuilder.Services;

        public ReactionBuilder()
        {
            _webappBuilder = WebApplication.CreateBuilder();
            _webappBuilder.Services.AddDaprClient();
            _webappBuilder.Services.AddControllers();
            _webappBuilder.Services.AddSingleton<IQueryConfigService, QueryConfigService>();
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, NullConfigDeserializer>();
            _webappBuilder.Services.AddSingleton<IControlEventHandler, DefaultControlEventHandler>();
        }

        public void UseChangeEventHandler<TChangeEventHandler>() where TChangeEventHandler : class, IChangeEventHandler
        {
            _webappBuilder.Services.AddSingleton<IChangeEventHandler, TChangeEventHandler>();
        }

        public void UseControlEventHandler<TControlEventHandler>() where TControlEventHandler : class, IControlEventHandler
        {
            _webappBuilder.Services.AddSingleton<IControlEventHandler, TControlEventHandler>();
        }

        public void UseJsonQueryConfig()
        {
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, JsonConfigDeserializer>();
        }

        public void UseYamlQueryConfig()
        {
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, YamlConfigDeserializer>();
        }

        public Reaction<TQueryConfig> Build<TQueryConfig>() where TQueryConfig : class
        {
            var hasChangeHandler = _webappBuilder.Services.Any(x => x.ServiceType == typeof(IChangeEventHandler));
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
