using Azure.Messaging.EventHubs.Consumer;
using Microsoft.Extensions.ObjectPool;

namespace Reactivator.Services
{
    class HubConsumer(IChangePublisher changePublisher, ICheckpointStore checkpointStore, IEventMapper eventMapper, string connectionString, string consumerGroup, string entityName) : BackgroundService
    {
        private readonly IChangePublisher _changePublisher = changePublisher;
        private readonly ICheckpointStore _checkpointStore = checkpointStore;
        private readonly IEventMapper _eventMapper = eventMapper;

        private readonly string _consumerGroup = consumerGroup;

        private readonly string _connectionString = connectionString;

        private readonly string _entityName = entityName;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventHubConsumerClient(_consumerGroup, _connectionString, _entityName);
            var partitions = await consumer.GetPartitionIdsAsync(stoppingToken);
            Console.WriteLine($"Found {partitions.Length} partitions for entity {_entityName}");
            var tasks = new List<Task>();

            foreach (var partition in partitions)
            {
                tasks.Add(ConsumePartition(consumer, partition, stoppingToken));
            }            
            
            await Task.WhenAll(tasks);
        }

        private async Task ConsumePartition(EventHubConsumerClient consumer, string partition, CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var lastOffset = EventPosition.Latest;
                    var lastSequenceNumber = await _checkpointStore.GetSequenceNumber(_entityName, partition);
                    if (lastSequenceNumber.HasValue) {
                        Console.WriteLine($"Resuming from sequence number {lastSequenceNumber.Value}");
                        lastOffset = EventPosition.FromSequenceNumber(lastSequenceNumber.Value, false);
                    }
                    
                    await foreach (var partitionEvent in consumer.ReadEventsFromPartitionAsync(partition, lastOffset, stoppingToken))
                    {
                        var sequenceNumber = partitionEvent.Data.SequenceNumber;
                        var change = await _eventMapper.MapEventAsync(partitionEvent);
                        await _changePublisher.Publish([change]);
                        await _checkpointStore.SetSequenceNumber(_entityName, partition, sequenceNumber);
                        Console.WriteLine($"Published change for partition {_entityName} - {partition} at sequence number {sequenceNumber}");
                    }
                }
                catch (TaskCanceledException)
                {
                    Console.WriteLine($"Shutting down partition consumer: {_entityName} - {partition}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error consuming partition {_entityName} - {partition}: {ex.Message} {ex.InnerException?.Message}");
                    await Task.Delay(5000, stoppingToken);
                }
            }
            
        }
    }
}