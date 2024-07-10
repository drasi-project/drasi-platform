using Dapr;
using Dapr.Actors;
using Dapr.Actors.Client;
using Dapr.Client;
using System;
using System.Runtime.CompilerServices;
using System.Text.Json;

namespace result_reactor.Services
{
    public class ResultViewClient : IResultViewClient
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        

        public ResultViewClient()
        {
            _httpClient = new HttpClient();
            _jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async IAsyncEnumerable<JsonDocument> GetCurrentResult(string queryContainerId, string queryId, [EnumeratorCancellation]CancellationToken cancellationToken = default)
        {
            Stream? stream = null;
            try
            {
                stream = await _httpClient.GetStreamAsync($"http://{queryContainerId}-view-svc/{queryId}", cancellationToken);                
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Error getting current result: " + ex.Message);
                yield break;
            }

            if (stream == null)
            {
                yield break;
            }
            

            await foreach (var item in JsonSerializer.DeserializeAsyncEnumerable<JsonDocument>(stream, _jsonSerializerOptions, cancellationToken))
            {
                if (item != null)
                {
                    yield return item;
                }
            }
        }
        public async IAsyncEnumerable<JsonDocument> GetCurrentResultAtTimeStamp(string queryContainerId, string queryId, string ts, [EnumeratorCancellation]CancellationToken cancellationToken = default)
        {
            Stream? stream = null;
            try
            {
                stream = await _httpClient.GetStreamAsync($"http://{queryContainerId}-view-svc/{queryId}/{ts}", cancellationToken);                
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Error getting current result: " + ex.Message);
                yield break;
            }

            if (stream == null)
            {
                yield break;
            }
            

            await foreach (var item in JsonSerializer.DeserializeAsyncEnumerable<JsonDocument>(stream, _jsonSerializerOptions, cancellationToken))
            {
                if (item != null)
                {
                    yield return item;
                }
            }
        }
    }
}
