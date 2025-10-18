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

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.SignalR.Models.Unpacked;
using Drasi.Reactions.SignalR.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SignalR;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddTransient<QueryHub>();
        builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
        builder.Services.AddSingleton<IManagementClient, ManagementClient>();
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

        var azConnStr = Environment.GetEnvironmentVariable("connectionString");
        var signalRBuilder = builder.Services
            .AddSignalR()
            .AddJsonProtocol(cfg => cfg.PayloadSerializerOptions = ModelOptions.JsonOptions);

        if (!string.IsNullOrEmpty(azConnStr))
        {
            signalRBuilder.AddAzureSignalR(o =>
            {
                o.ConnectionString = azConnStr;
                o.ServerStickyMode = ServerStickyMode.Required;
            });
        }

        // Add health checks for Dapr sidecar
        var healthChecksBuilder = builder.Services.AddHealthChecks()
            .AddCheck<DaprHealthCheck>("dapr_sidecar");

        // Add Azure SignalR health check if configured
        if (!string.IsNullOrEmpty(azConnStr))
        {
            healthChecksBuilder.AddCheck<AzureSignalRHealthCheck>("azure_signalr");
        }

        var hub = builder.Build();

        if (!string.IsNullOrEmpty(azConnStr))
        {
            hub.Logger.LogInformation("Azure SignalR Service is enabled.");
        }
        else
        {
            hub.Logger.LogInformation("Azure SignalR Service is not enabled.");
        }

        hub.UseCors();
        hub.UseRouting();
        hub.MapHealthChecks("/health");
        hub.MapHub<QueryHub>("/hub");
        hub.Urls.Add($"http://0.0.0.0:{hub.Configuration.GetValue("HUB_PORT", "8080")}");

        var reaction = new ReactionBuilder()
            .UseChangeEventHandler<ChangeHandler>()
            .UseControlEventHandler<ControlSignalHandler>()
            .ConfigureServices((services) =>
            {
                services.AddSingleton<IChangeFormatter, ChangeFormatter>();
                services.AddTransient(sp => hub.Services.GetRequiredService<IHubContext<QueryHub>>());
            })
            .Build();

        hub.Lifetime.ApplicationStarted.Register(() => StartupTask.SetResult());
        await Task.WhenAny(reaction.StartAsync(ShutdownToken.Token), hub.RunAsync());        
    }

    public static CancellationTokenSource ShutdownToken { get; } = new();

    public static TaskCompletionSource StartupTask { get; } = new();
}