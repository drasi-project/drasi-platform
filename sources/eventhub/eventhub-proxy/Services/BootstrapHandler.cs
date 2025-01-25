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
using Azure.Identity;
using Azure.Messaging.EventHubs.Consumer;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;

namespace Proxy.Services
{
    class BootstrapHandler(IEventMapper eventMapper, IConfiguration configuration, ILogger<BootstrapHandler> logger): IBootstrapHandler
    {
        public async IAsyncEnumerable<SourceElement> Bootstrap(BootstrapRequest request, [EnumeratorCancellation]CancellationToken cancellationToken = default)
        {
            var windowSize = configuration.GetValue<long>("bootstrapWindow");
            var consumerGroup = configuration.GetValue<string>("consumerGroup") ?? EventHubConsumerClient.DefaultConsumerGroupName;

            if (windowSize <= 0) 
            {
                yield break;
            }

            foreach (var label in request.NodeLabels)
            {
                var consumer = BuildClient(label, consumerGroup);
                var partitions = await consumer.GetPartitionIdsAsync(cancellationToken);

                foreach (var partition in partitions)
                {
                    await foreach (var change in GetPartitionData(consumer, partition, windowSize, cancellationToken))
                    {
                        yield return change;
                    }
                }
            }
        }

        private EventHubConsumerClient BuildClient(string eventHub, string consumerGroup)
        {
            switch (configuration.GetIdentityType())
            {
                case IdentityType.MicrosoftEntraWorkloadID:
                    logger.LogInformation("Using Microsoft Entra Workload ID");
                    var fqn = configuration.GetValue<string>("fullyQualifiedNamespace");
                    return new EventHubConsumerClient(consumerGroup, fqn, eventHub, new DefaultAzureCredential()); 
                default:
                    logger.LogInformation("Using Connection String");
                    return new EventHubConsumerClient(consumerGroup, configuration.GetValue<string>("connectionString"), eventHub);
            }
        }

        async IAsyncEnumerable<SourceElement> GetPartitionData(EventHubConsumerClient consumer, string partition, long windowSize, [EnumeratorCancellation] CancellationToken stoppingToken)
        {
            var startTime = DateTimeOffset.UtcNow.AddMinutes(-windowSize);
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

                var change = await eventMapper.MapEventAsync(partitionEvent);
                yield return change;

                if (partitionEvent.Data.SequenceNumber == partitionInfo.LastEnqueuedSequenceNumber)
                    break;                
            }
        }       
    }
}