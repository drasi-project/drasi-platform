using System;
using System.Text.Json;
using System.Net.Http.Json;

namespace Drasi.Reaction.SDK.Services
{
    public class ManagementClient : IManagementClient
    {
        private readonly string _managementApiUrl = "http://drasi-api:8080";
        private readonly HttpClient _httpClient;

        public ManagementClient()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(_managementApiUrl)
            };
        }

        public async Task<string> GetQueryContainerId(string queryId)
        {
            var resp = await _httpClient.GetAsync($"/v1/continuousQueries/{queryId}");
            resp.EnsureSuccessStatusCode();
            var body = await resp.Content.ReadFromJsonAsync<JsonDocument>() ?? throw new Exception("Failed to parse response body");
            var spec = body.RootElement.GetProperty("spec");
            return spec.GetProperty("container").GetString() ?? throw new Exception("Failed to parse response body");
        }
    }
}
