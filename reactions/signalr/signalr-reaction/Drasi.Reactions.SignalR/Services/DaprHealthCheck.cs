// Copyright 2025 The Drasi Authors.
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

using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Drasi.Reactions.SignalR.Services;

public class DaprHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;
    private readonly string _daprHttpPort;

    public DaprHealthCheck()
    {
        _httpClient = new HttpClient();
        _daprHttpPort = Environment.GetEnvironmentVariable("DAPR_HTTP_PORT") ?? "3500";
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var daprHealthUrl = $"http://localhost:{_daprHttpPort}/v1.0/healthz";

            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(5));

            var response = await _httpClient.GetAsync(daprHealthUrl, cts.Token);

            if (response.IsSuccessStatusCode)
            {
                return HealthCheckResult.Healthy($"Dapr sidecar is healthy on port {_daprHttpPort}");
            }
            else
            {
                return HealthCheckResult.Unhealthy(
                    $"Dapr sidecar returned status code: {response.StatusCode}");
            }
        }
        catch (TaskCanceledException)
        {
            return HealthCheckResult.Unhealthy("Timeout connecting to Dapr sidecar");
        }
        catch (HttpRequestException ex)
        {
            return HealthCheckResult.Unhealthy(
                "Cannot reach Dapr sidecar - sidecar may not be running",
                ex);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(
                "Unexpected error checking Dapr sidecar connectivity",
                ex);
        }
    }
}