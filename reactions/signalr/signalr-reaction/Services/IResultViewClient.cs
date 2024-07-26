using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace signalr_reaction.Services
{
    public interface IResultViewClient
    {
        IAsyncEnumerable<JsonDocument> GetCurrentResult(string queryContainerId, string queryId, CancellationToken cancellationToken = default);
    }
}