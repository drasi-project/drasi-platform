namespace Proxy.Services 
{
    using System.Text.Json;
    using System.Threading.Tasks;
    using Azure.Messaging.EventHubs.Consumer;
    using Proxy.Models;

    class JsonEventMapper(string sourceId) : IEventMapper
    {
        private readonly string _sourceId = sourceId;

        public Task<VertexState> MapEventAsync(PartitionEvent rawEvent)
        {
            var data = new VertexState();
            if (!String.IsNullOrEmpty(rawEvent.Data.MessageId)) 
            {
                data.Id = rawEvent.Data.MessageId;
            }
            else
            {
                data.Id = $"{rawEvent.Partition.EventHubName}-{rawEvent.Partition.PartitionId}-{rawEvent.Data.SequenceNumber}";
            }
            data.Labels = [rawEvent.Partition.EventHubName];
            data.Label = rawEvent.Partition.EventHubName;
            data.Properties = JsonDocument.Parse(rawEvent.Data.EventBody);

            return Task.FromResult(data);
        }
    }
}