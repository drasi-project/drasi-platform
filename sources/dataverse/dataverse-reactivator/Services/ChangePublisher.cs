using Dapr.Client;
using Reactivator.Models;

namespace Reactivator.Services
{
    internal class ChangePublisher(DaprClient dapr, string sourceId, string pubsubName) : IChangePublisher
    {
        private readonly DaprClient _dapr = dapr;
        private readonly string _sourceId = sourceId;
        private readonly string _pubsubName = pubsubName;

        public async Task Publish(IEnumerable<ChangeNotification> changes)
        {
            await _dapr.PublishEventAsync(_pubsubName, _sourceId + "-change", changes);
        }
    }
}
