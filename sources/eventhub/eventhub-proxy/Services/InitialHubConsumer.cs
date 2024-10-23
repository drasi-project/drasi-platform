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

using System.Runtime.CompilerServices;
using Azure.Messaging.EventHubs.Consumer;
using Proxy.Models;

namespace Proxy.Services
{
    class InititalHubConsumer(IEventMapper eventMapper, string connectionString, string consumerGroup, long windowSize): IInititalHubConsumer
    {
        private readonly IEventMapper _eventMapper = eventMapper;

        private readonly string _consumerGroup = consumerGroup;

        private readonly string _connectionString = connectionString;

        private readonly long _windowSize = windowSize;


        public async IAsyncEnumerable<VertexState> GetBootstrapData(string eventHubName, [EnumeratorCancellation] CancellationToken stoppingToken)
        {
            if (_windowSize <= 0) 
            {
                yield break;
            }
                
            var consumer = new EventHubConsumerClient(_consumerGroup, _connectionString, eventHubName); 
            var partitions = await consumer.GetPartitionIdsAsync(stoppingToken);
            foreach (var partition in partitions)  //todo: parallelize
            {
                await foreach (var change in GetPartitionData(consumer, partition, stoppingToken))
                {
                    yield return change;
                }
            }
        }

        async IAsyncEnumerable<VertexState> GetPartitionData(EventHubConsumerClient consumer, string partition, [EnumeratorCancellation] CancellationToken stoppingToken)
        {
            var startTime = DateTimeOffset.UtcNow.AddMinutes(-_windowSize);
            var start = EventPosition.FromEnqueuedTime(startTime);
            var partitionInfo = await consumer.GetPartitionPropertiesAsync(partition, stoppingToken);
            
            if (partitionInfo.IsEmpty)
                yield break;

            if (partitionInfo.LastEnqueuedTime <= startTime)
                yield break;

            
            await foreach (var partitionEvent in consumer.ReadEventsFromPartitionAsync(partition, start, stoppingToken))
            {
                if (partitionEvent.Data.SequenceNumber > partitionInfo.LastEnqueuedSequenceNumber)
                    break;

                var change = await _eventMapper.MapEventAsync(partitionEvent);
                yield return change;

                if (partitionEvent.Data.SequenceNumber == partitionInfo.LastEnqueuedSequenceNumber)
                    break;                
            }
        }       
    }
}