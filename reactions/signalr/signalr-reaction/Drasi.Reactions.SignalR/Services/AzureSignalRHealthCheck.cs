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

using Microsoft.Azure.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace Drasi.Reactions.SignalR.Services;

public class AzureSignalRHealthCheck : IHealthCheck
{
    private readonly IServiceProvider _serviceProvider;
    private readonly HttpClient _httpClient;

    public AzureSignalRHealthCheck(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10)
        };
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Try to get Azure SignalR service options
            var options = _serviceProvider.GetService<IOptions<ServiceOptions>>();

            if (options?.Value == null)
            {
                return HealthCheckResult.Unhealthy(
                    "Azure SignalR Service options not configured");
            }

            var connectionString = options.Value.ConnectionString;
            if (string.IsNullOrEmpty(connectionString))
            {
                return HealthCheckResult.Unhealthy(
                    "Azure SignalR Service connection string is not set");
            }

            // Parse the connection string to extract the endpoint
            if (!TryParseEndpoint(connectionString, out var endpoint))
            {
                return HealthCheckResult.Unhealthy(
                    "Failed to parse Azure SignalR Service endpoint from connection string");
            }

            // Try to reach the Azure SignalR Service health endpoint
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(10));

            var healthUrl = $"{endpoint}/api/health";
            var response = await _httpClient.GetAsync(healthUrl, cts.Token);

            if (response.IsSuccessStatusCode)
            {
                return HealthCheckResult.Healthy(
                    $"Successfully connected to Azure SignalR Service at {endpoint}");
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                     response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                return HealthCheckResult.Unhealthy(
                    $"Authentication failed for Azure SignalR Service: {response.StatusCode}. " +
                    "Check connection string and access key configuration.");
            }
            else
            {
                return HealthCheckResult.Degraded(
                    $"Azure SignalR Service responded with status code: {response.StatusCode}. " +
                    "Service may still be functional.");
            }
        }
        catch (TaskCanceledException)
        {
            return HealthCheckResult.Unhealthy(
                "Timeout connecting to Azure SignalR Service");
        }
        catch (HttpRequestException ex)
        {
            return HealthCheckResult.Unhealthy(
                "Cannot reach Azure SignalR Service",
                ex);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(
                "Unexpected error checking Azure SignalR Service connectivity",
                ex);
        }
    }

    private static bool TryParseEndpoint(string connectionString, out string endpoint)
    {
        endpoint = string.Empty;

        try
        {
            // Azure SignalR connection string format:
            // Endpoint=https://<name>.service.signalr.net;AccessKey=<key>;Version=1.0;
            var parts = connectionString.Split(';');
            foreach (var part in parts)
            {
                if (part.StartsWith("Endpoint=", StringComparison.OrdinalIgnoreCase))
                {
                    endpoint = part.Substring("Endpoint=".Length);
                    return !string.IsNullOrEmpty(endpoint);
                }
            }
            return false;
        }
        catch
        {
            return false;
        }
    }
}
