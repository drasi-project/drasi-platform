using Proxy.Models;

namespace Proxy.Services;

public interface IInititalDataFetcher
{
    IAsyncEnumerable<VertexState> GetBootstrapData(string entityName, CancellationToken stoppingToken);
}