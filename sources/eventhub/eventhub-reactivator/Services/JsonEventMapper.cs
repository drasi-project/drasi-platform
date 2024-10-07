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