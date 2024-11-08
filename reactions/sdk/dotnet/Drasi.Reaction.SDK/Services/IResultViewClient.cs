using System;
using Drasi.Reaction.SDK.Models.ViewService;

namespace Drasi.Reaction.SDK.Services;

public interface IResultViewClient
{
    IAsyncEnumerable<ViewItem> GetCurrentResult(string queryContainerId, string queryId, CancellationToken cancellationToken = default);
}