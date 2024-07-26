using System;
using System.Text.Json;

namespace debug_reaction.Services
{
    public interface IResultViewClient
    {
        IAsyncEnumerable<JsonDocument> GetCurrentResult(string queryContainerId, string queryId, CancellationToken cancellationToken = default);
    }
}
