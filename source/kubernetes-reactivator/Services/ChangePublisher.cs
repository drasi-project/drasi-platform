using Dapr.Client;
using kubernetes_reactivator.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kubernetes_reactivator.Services
{
    internal class ChangePublisher : IChangePublisher
    {
        private readonly DaprClient _dapr;
        private readonly string _sourceId;
        private readonly string _pubsubName;

        public ChangePublisher(DaprClient dapr, string sourceId, string pubsubName)
        {
            _dapr = dapr;
            _sourceId = sourceId;
            _pubsubName = pubsubName;
        }    

        public async Task Publish(IEnumerable<ChangeNotification> changes)
        {
            await _dapr.PublishEventAsync(_pubsubName, _sourceId + "-change", changes);
        }
    }
}
