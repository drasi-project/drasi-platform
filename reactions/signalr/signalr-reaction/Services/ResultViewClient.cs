using Dapr.Actors;
using Dapr;
using Dapr.Actors.Client;
using Dapr.Client;
using Newtonsoft.Json.Linq;
using System.Text.Json;
using System.Runtime.CompilerServices;

namespace signalr_reaction.Services
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

    }
}
