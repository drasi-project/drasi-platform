using System;
using System.Text.Json;

namespace result_reactor.Services
{
    public interface IResultViewClient
    {
        IAsyncEnumerable<JsonDocument> GetCurrentResult(string queryContainerId, string queryId, CancellationToken cancellationToken = default);
        IAsyncEnumerable<JsonDocument> GetCurrentResultAtTimeStamp(string queryContainerId, string queryId, string ts, CancellationToken cancellationToken = default);
    }
}
