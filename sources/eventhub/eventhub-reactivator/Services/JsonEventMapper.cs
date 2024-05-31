namespace Reactivator.Services 
{
    using System.Text.Json;
    using System.Threading.Tasks;
    using Azure.Messaging.EventHubs.Consumer;
    using Reactivator.Models;

    class JsonEventMapper(string sourceId) : IEventMapper
    {
        private readonly string _sourceId = sourceId;

        public Task<ChangeNotification> MapEventAsync(PartitionEvent rawEvent)
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

            return Task.FromResult(new ChangeNotification()
            {
                Op = "i",
                TimestampMilliseconds = rawEvent.Data.EnqueuedTime.ToUnixTimeMilliseconds(),
                Payload = new ChangePayload()
                {
                    Source = new ChangeSource()
                    {
                        Db = _sourceId,
                        Table = "node",
                        LSN = rawEvent.Data.SequenceNumber,
                        Partition = rawEvent.Partition.PartitionId,
                        TimestampMilliseconds = rawEvent.Data.EnqueuedTime.ToUnixTimeMilliseconds()
                    },
                    After = data
                }
            });
        }
    }
}