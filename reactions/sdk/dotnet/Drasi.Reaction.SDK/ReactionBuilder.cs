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

        public ReactionBuilder<TQueryConfig> UseChangeEventHandler<TChangeEventHandler>() where TChangeEventHandler : class, IChangeEventHandler<TQueryConfig>
        {
            _webappBuilder.Services.AddScoped<IChangeEventHandler<TQueryConfig>, TChangeEventHandler>();
            return this;
        }

        public ReactionBuilder<TQueryConfig> UseChangeEventHandler(Func<ChangeEvent, TQueryConfig?, Task> handler)
        {
            _webappBuilder.Services.AddScoped<IChangeEventHandler<TQueryConfig>>((sp) => new InlineChangeEventHandler<TQueryConfig>(handler));
            return this;
        }

        public ReactionBuilder<TQueryConfig> UseControlEventHandler<TControlEventHandler>() where TControlEventHandler : class, IControlEventHandler<TQueryConfig>
        {
            _webappBuilder.Services.AddScoped<IControlEventHandler<TQueryConfig>, TControlEventHandler>();
            return this;
        }

        public ReactionBuilder<TQueryConfig> UseJsonQueryConfig()
        {
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, JsonConfigDeserializer>();
            return this;
        }
        
        public ReactionBuilder<TQueryConfig> UseYamlQueryConfig()
        {
            _webappBuilder.Services.AddSingleton<IConfigDeserializer, YamlConfigDeserializer>();
            return this;
        }

        public ReactionBuilder<TQueryConfig> ConfigureServices(Action<IServiceCollection> configureServices)
        {
            configureServices(_webappBuilder.Services);
            return this;
        }

        public ReactionBuilder<TQueryConfig> Configure(Action<IConfigurationManager> configure)
        {
            configure(_webappBuilder.Configuration);
            return this;
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

        static ReactionBuilder() 
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
            {
                var message = args.ExceptionObject is Exception exception ? exception.Message : "Unknown error occurred";

                try
                {
                    File.WriteAllText("/dev/termination-log", message);
                }
                catch (Exception logException)
                {
                    Console.Error.WriteLine($"Failed to write to /dev/termination-log: {logException}");
                }
            };
        }

    }

}
