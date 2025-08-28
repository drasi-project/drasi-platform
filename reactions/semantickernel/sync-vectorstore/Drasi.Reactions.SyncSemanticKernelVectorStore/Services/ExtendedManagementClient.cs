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

using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

public interface IExtendedManagementClient : IManagementClient
{
    Task<bool> WaitForQueryReadyAsync(string queryId, int waitSeconds, CancellationToken cancellationToken);
}

public class ExtendedManagementClient : IExtendedManagementClient
{
    private readonly IManagementClient _managementClient;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ExtendedManagementClient> _logger;
    private readonly string _managementApiBaseUrl;

    public const string DrasiManagementApiBaseUrlConfigKey = "DrasiManagementApiBaseUrl";
    public const string DefaultDrasiManagementApiBaseUrl = "http://drasi-api:8080";

    public const int DefaultApiTimeoutSeconds = 120;
    public const int ClientSideExtraTimeoutSeconds = 3;

    public ExtendedManagementClient(
        IHttpClientFactory httpClientFactory,
        IManagementClient managementClient,
        IConfiguration configuration,
        ILogger<ExtendedManagementClient> logger)
    {
        _managementClient = managementClient ?? throw new ArgumentNullException(nameof(managementClient));
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _managementApiBaseUrl = configuration[DrasiManagementApiBaseUrlConfigKey] ?? DefaultDrasiManagementApiBaseUrl;
    }

    public async Task<bool> WaitForQueryReadyAsync(string queryId, int waitSeconds = DefaultApiTimeoutSeconds, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(queryId))
        {
            _logger.LogError("Query ID cannot be null or whitespace.");
            throw new ArgumentNullException(nameof(queryId));
        }
        
        using (var httpClient = _httpClientFactory.CreateClient())
        {
            httpClient.Timeout = TimeSpan.FromSeconds(waitSeconds + ClientSideExtraTimeoutSeconds);

            var requestUri = $"{_managementApiBaseUrl}/v1/continuousQueries/{queryId}/ready-wait?timeout={waitSeconds}";
            _logger.LogInformation("Waiting for {Timeout} seconds for query {QueryId} to be ready...", waitSeconds, queryId);

            try
            {
                using (var response = await httpClient.GetAsync(requestUri, cancellationToken))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogDebug("Query {QueryId} is ready.", queryId);
                        return true;
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable)
                    {
                        _logger.LogWarning("Query {QueryId} did not become ready within {WaitSeconds}s. Status: {StatusCode}",
                            queryId, waitSeconds, response.StatusCode);
                        return false;
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        _logger.LogError("Query {QueryId} not found while waiting for readiness. Status: {StatusCode}",
                            queryId, response.StatusCode);
                        return false;
                    }
                    else
                    {
                        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                        _logger.LogError("Failed to get readiness status for query {QueryId}. Status: {StatusCode}, Reason: {ReasonPhrase}, Content: {ResponseContent}",
                            queryId, response.StatusCode, response.ReasonPhrase, responseContent);
                        return false;
                    }
                }
            }
            catch (TaskCanceledException)
            {
                _logger.LogWarning("Request to wait for query {QueryId} readiness timed out on the client side after {Timeout}s.", queryId, waitSeconds + ClientSideExtraTimeoutSeconds);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while waiting for query {QueryId} to be ready.", queryId);
                return false;
            }
        }
    }

    // Delegate IManagementClient method to the wrapped instance
    public Task<string> GetQueryContainerId(string queryId)
    {
        return _managementClient.GetQueryContainerId(queryId);
    }
}