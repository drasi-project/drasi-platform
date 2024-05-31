using Azure.Messaging.EventHubs.Consumer;
using Proxy.Models;

namespace Proxy.Services
{
    interface IEventMapper
    {
        Task<VertexState> MapEventAsync(PartitionEvent rawEvent);
    }
}
