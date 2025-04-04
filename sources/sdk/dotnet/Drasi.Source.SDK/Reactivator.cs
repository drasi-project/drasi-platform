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

using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Drasi.Source.SDK;

public class Reactivator : IHost
{
    private static ActivitySource _traceSource = new("Drasi.Reactivator");
    private readonly WebApplication _app;

    public IServiceProvider Services => _app.Services;
    public IConfiguration Configuration => _app.Configuration;

    public ILogger<Reactivator> Logger => _app.Services.GetRequiredService<ILogger<Reactivator>>();

    internal Reactivator(WebApplication app)
    {
        _app = app;
        var deprovisionHandler = _app.Services.GetService<IDeprovisionHandler>();
        if (deprovisionHandler != null)
        {
            app.MapPost("deprovision", async context =>
            {
                await deprovisionHandler.Deprovision(_app.Services.GetRequiredService<IStateStore>());
                context.Response.StatusCode = 200;
            });
        }
    }

    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        Logger.LogInformation("Starting reactivator");

        var cts = new CancellationTokenSource();
        _ = _app.WaitForShutdownAsync(cancellationToken).ContinueWith(t => cts.Cancel(), cancellationToken);
        _ = _app.RunAsync($"http://0.0.0.0:{Configuration["APP_PORT"] ?? "80"}");
        var changeMonitor = _app.Services.GetRequiredService<IChangeMonitor>();
        var publisher = _app.Services.GetRequiredService<IChangePublisher>();

        try
        {
            await foreach (var change in changeMonitor.Monitor(cts.Token))
            {
                using var activity = _traceSource.StartActivity("PublishChange");
                var reactivator_end_time = (DateTimeOffset.UtcNow.Ticks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                change.SetReactivatorEndNs(reactivator_end_time);
                await publisher.Publish(change);
            }
        }
        catch (OperationCanceledException)
        {
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken = default)
    {
        Logger.LogInformation("Stopping reactivator");
        await _app.StopAsync(cancellationToken);
    }

    public void Dispose()
    {

    }


    public static void TerminateWithError(string message)
    {
        Console.WriteLine(message);
        try
        {
            File.WriteAllText("/dev/termination-log", message);
        }
        finally
        {
            Environment.Exit(1);
        }
    }

    public static string SourceId()
    {
        return Environment.GetEnvironmentVariable("SOURCE_ID");
    }
}