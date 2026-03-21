using System;
using System.Text.Json;
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reaction.SDK.Services
{
    public class ManagementClient : IManagementClient
    {
        private readonly string _managementApiBaseUrl;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ManagementClient> _logger;

        public const string DrasiManagementApiBaseUrlConfigKey = "DrasiManagementApiBaseUrl";
        public const string DefaultDrasiManagementApiBaseUrl = "http://drasi-api:8080";

        public const int DefaultApiTimeoutSeconds = 120;
        public const int ClientSideExtraTimeoutSeconds = 3;

        public ManagementClient(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<ManagementClient> logger)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _managementApiBaseUrl = configuration?[DrasiManagementApiBaseUrlConfigKey] ?? DefaultDrasiManagementApiBaseUrl;
        }

        public async Task<string> GetQueryContainerId(string queryId)
        {
            using (var httpClient = _httpClientFactory.CreateClient())
            {
                httpClient.BaseAddress = new Uri(_managementApiBaseUrl);
                var resp = await httpClient.GetAsync($"/v1/continuousQueries/{queryId}");
                resp.EnsureSuccessStatusCode();
                var body = await resp.Content.ReadFromJsonAsync<JsonDocument>() ?? throw new Exception("Failed to parse response body");
                var spec = body.RootElement.GetProperty("spec");
                return spec.GetProperty("container").GetString() ?? throw new Exception("Failed to parse response body");
            }
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
                    using var response = await httpClient.GetAsync(requestUri, cancellationToken);

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
                catch (OperationCanceledException)
                {
                    _logger.LogWarning("Operation to wait for query {QueryId} readiness was canceled.", queryId);
                    return false;
                }
                catch (HttpRequestException ex)
                {
                    _logger.LogError(ex, "HTTP request failed while waiting for query {QueryId} readiness at {RequestUri}.", queryId, requestUri);
                    return false;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An unexpected error occurred while waiting for query {QueryId} to be ready.", queryId);
                    throw;
                }
            }
        }
    }
}
