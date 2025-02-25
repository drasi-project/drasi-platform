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

public class ReactivatorBuilder
{
    private readonly WebApplicationBuilder _webappBuilder;

    public IServiceCollection Services => _webappBuilder.Services;

    public IConfiguration Configuration => _webappBuilder.Configuration;

    public ReactivatorBuilder()
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

        _webappBuilder.Services.AddSingleton<IChangePublisher, DaprChangePublisher>();
        _webappBuilder.Services.AddSingleton<IStateStore, DaprStateStore>();
    }

    public ReactivatorBuilder UseChangeMonitor<T>() where T : class, IChangeMonitor
    {
        _webappBuilder.Services.AddSingleton<IChangeMonitor, T>();
        return this;
    }

    public ReactivatorBuilder UseChangePublisher<T>() where T : class, IChangePublisher
    {
        _webappBuilder.Services.AddSingleton<IChangePublisher, T>();
        return this;
    }

    public ReactivatorBuilder UseStateStore<T>() where T : class, IStateStore
    {
        _webappBuilder.Services.AddSingleton<IStateStore, T>();
        return this;
    }

    public ReactivatorBuilder UseDeprovisionHandler<T>() where T : class, IDeprovisionHandler
    {
        _webappBuilder.Services.AddSingleton<IDeprovisionHandler, T>();
        return this;
    }

    public ReactivatorBuilder Configure(Action<IConfigurationManager> configure)
    {
        configure(_webappBuilder.Configuration);
        return this;
    }

    public ReactivatorBuilder ConfigureServices(Action<IServiceCollection> configureServices)
    {
        configureServices(_webappBuilder.Services);
        return this;
    }

    public Reactivator Build()
    {
        var hasHandler = _webappBuilder.Services.Any(x => x.ServiceType == typeof(IChangeMonitor));
        if (!hasHandler)
        {
            throw new InvalidOperationException("No change monitor registered");
        }

        var app = _webappBuilder.Build();
        app.UseRouting();

        return new Reactivator(app);
    }

    static ReactivatorBuilder()
    {
        AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
        {
            if (args.ExceptionObject is OperationCanceledException)
            {
                return;
            }

            var message = args.ExceptionObject is Exception exception ? exception.Message : "Unknown error occurred";
            Console.WriteLine(args.ExceptionObject);

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
