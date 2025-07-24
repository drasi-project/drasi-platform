// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System.Threading.Channels;
using Azure.Identity;
using Azure.Messaging.EventHubs.Consumer;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;

namespace Reactivator.Services
{
    class HubConsumer : BackgroundService
    {
        private readonly Channel<SourceChange> _channel;
        private readonly IStateStore _checkpointStore;
        private readonly IEventMapper _eventMapper;

        private readonly IConfiguration _configuration;

        private readonly EventHubConsumerClient _client;

        private readonly string _entityName;

        private readonly ILogger _logger;

        public HubConsumer(Channel<SourceChange> channel, IStateStore stateStore, IEventMapper eventMapper, IConfiguration configuration, ILogger logger, string entityName)
        {
            _channel = channel;
            _checkpointStore = stateStore;
            _eventMapper = eventMapper;
            _configuration = configuration;
            _entityName = entityName;
            _logger = logger;
            _client = BuildClient(entityName, configuration, logger);
        }

        internal static EventHubConsumerClient BuildClient(string eventHub, IConfiguration configuration, ILogger logger)
        {
            var consumerGroup = configuration.GetValue<string>("consumerGroup") ?? EventHubConsumerClient.DefaultConsumerGroupName;
            switch (configuration.GetIdentityType())
            {
                case IdentityType.MicrosoftEntraWorkloadID:
                    logger.LogInformation("Using Microsoft Entra Workload ID");
                    var fqn = configuration.GetValue<string>("host");
                    return new EventHubConsumerClient(consumerGroup, fqn, eventHub, new DefaultAzureCredential()); 
                default:
                    logger.LogInformation("Using Connection String");
                    return new EventHubConsumerClient(consumerGroup, configuration.GetValue<string>("connectionString"), eventHub);
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var partitions = await _client.GetPartitionIdsAsync(stoppingToken);
            _logger.LogInformation($"Found {partitions.Length} partitions for entity {_entityName}");
            var tasks = new List<Task>();

            foreach (var partition in partitions)
            {
                tasks.Add(ConsumePartition(_client, partition, stoppingToken));
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
                    
                    var lastSequenceNumber = await _checkpointStore.Get($"{_entityName}-{partition}");
                    if (lastSequenceNumber != null) {
                        _logger.LogInformation($"Resuming from sequence number {BitConverter.ToInt64(lastSequenceNumber)}");
                        lastOffset = EventPosition.FromSequenceNumber(BitConverter.ToInt64(lastSequenceNumber), false);
                    }
                    
                    await foreach (var partitionEvent in consumer.ReadEventsFromPartitionAsync(partition, lastOffset, stoppingToken))
                    {
                        long reactivatorStartNs = (DateTimeOffset.UtcNow.Ticks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                        var sequenceNumber = partitionEvent.Data.SequenceNumber;
                        var change = await _eventMapper.MapEventAsync(partitionEvent, reactivatorStartNs);
                        await _channel.Writer.WriteAsync(change, stoppingToken);
                        await _checkpointStore.Put($"{_entityName}-{partition}", BitConverter.GetBytes(sequenceNumber));
                        _logger.LogInformation($"Published change for partition {_entityName} - {partition} at sequence number {sequenceNumber}");
                    }
                }
                catch (TaskCanceledException)
                {
                    _logger.LogInformation($"Shutting down partition consumer: {_entityName} - {partition}");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error consuming partition {_entityName} - {partition}: {ex.Message} {ex.InnerException?.Message}");
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }
    }
}