using Azure.Messaging.EventHubs.Consumer;
using Reactivator.Models;

namespace Reactivator.Services
{
    interface IEventMapper
    {
        Task<ChangeNotification> MapEventAsync(PartitionEvent rawEvent);
    }
}
