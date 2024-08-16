using System;
using System.Text.Json;

namespace DebugReaction.Services
{
    public interface IResultViewClient
    {
        IAsyncEnumerable<JsonDocument> GetCurrentResult(string queryContainerId, string queryId, CancellationToken cancellationToken = default);
    }
}
