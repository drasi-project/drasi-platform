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
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.Extensions.DependencyInjection;
using Drasi.Source.SDK.Models;
using System.Diagnostics;

namespace Drasi.Source.SDK;

public class SourceProxy : IHost
{
    private static ActivitySource _traceSource = new("Drasi.SourceProxy");
    private readonly WebApplication _app;
    public IServiceProvider Services => _app.Services;
    public IConfiguration Configuration => _app.Configuration;

    public ILogger<SourceProxy> Logger => _app.Services.GetRequiredService<ILogger<SourceProxy>>();

    internal SourceProxy(WebApplication app)
    {
        _app = app;

        app.MapPost("acquire-stream", this.Acquire);
        app.MapGet("supports-stream", this.SupportsStream);
        app.MapPost("supports-stream", this.SupportsStream);
    }

    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        Logger.LogInformation("Starting proxy");
        await _app.RunAsync($"http://0.0.0.0:{Configuration["APP_PORT"] ?? "80"}");
    }

    public async Task StopAsync(CancellationToken cancellationToken = default)
    {
        Logger.LogInformation("Stopping proxy");
        await _app.StopAsync(cancellationToken);
    }

    public void Dispose()
    {

    }

    private Task SupportsStream(HttpContext context)
    {
        context.Response.StatusCode = 204;
        return Task.CompletedTask;
    }

    private async Task Acquire(BootstrapRequest request, HttpResponse response, IBootstrapHandler bootstrapHandler)
    {
        using var activity = _traceSource.StartActivity("Acquire");
        await foreach (var element in bootstrapHandler.Bootstrap(request))
        {
            await response.WriteAsync(element.ToJson() + "\n");
            await response.Body.FlushAsync();
        }
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
}
