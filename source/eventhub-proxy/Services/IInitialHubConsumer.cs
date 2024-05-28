using Proxy.Models;

namespace Proxy.Services;

public interface IInititalHubConsumer
{
    IAsyncEnumerable<VertexState> GetBootstrapData(string eventHubName, CancellationToken stoppingToken);
}