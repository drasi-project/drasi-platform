// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using System;

namespace Drasi.Source.SDK;

public class SourceProxyBuilder
{
    private readonly WebApplicationBuilder _webappBuilder;

        public IServiceCollection Services => _webappBuilder.Services;

        public IConfiguration Configuration => _webappBuilder.Configuration;

        public SourceProxyBuilder()
        {
            _webappBuilder = WebApplication.CreateBuilder();
            _webappBuilder.Services.AddDaprClient();
            _webappBuilder.Services.AddControllers();
            
            _webappBuilder.Configuration.AddEnvironmentVariables();
            _webappBuilder.Logging.AddConsole();

            var otelEndpoint = Environment.GetEnvironmentVariable("OTEL_ENDPOINT") ?? "http://otel-collector:4317";

            _webappBuilder.Services.AddOpenTelemetry()
                .UseOtlpExporter(OpenTelemetry.Exporter.OtlpExportProtocol.Grpc, new Uri(otelEndpoint))
                .WithTracing();
        }

    public SourceProxyBuilder UseBootstrapHandler<THandler>() where THandler : class, IBootstrapHandler
    {
        _webappBuilder.Services.AddScoped<IBootstrapHandler, THandler>();
        return this;
    }

    public SourceProxyBuilder Configure(Action<IConfigurationManager> configure)
    {
        configure(_webappBuilder.Configuration);
        return this;
    }

    public SourceProxy Build()
    {
        var hasHandler = _webappBuilder.Services.Any(x => x.ServiceType == typeof(IBootstrapHandler));
        if (!hasHandler)
        {
            throw new InvalidOperationException("No bootstrap handler registered");
        }

        var app = _webappBuilder.Build();
        app.UseRouting();
        
        return new SourceProxy(app);
    }

    static SourceProxyBuilder()
    {
        AppDomain.CurrentDomain.UnhandledException += (sender, args) =>        
        {
            if (args.ExceptionObject is OperationCanceledException)
            {
                return;
            }
            
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
