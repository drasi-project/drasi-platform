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
    using System.Text.Json.Nodes;
    using System.Threading.Tasks;
    using Azure.Messaging.EventHubs.Consumer;
    using Drasi.Source.SDK.Models;

    class JsonEventMapper() : IEventMapper
    {
        // The reactivator start time is the time when the reactivator starts processing the event.
        public Task<SourceChange> MapEventAsync(PartitionEvent rawEvent, long reactivatorStart_ns)
            
        {
            var elementId = rawEvent.Data.MessageId ?? $"{rawEvent.Partition.EventHubName}-{rawEvent.Partition.PartitionId}-{rawEvent.Data.SequenceNumber}";
            var data = new SourceElement(elementId, [rawEvent.Partition.EventHubName], JsonNode.Parse(rawEvent.Data.EventBody)?.AsObject());

            return Task.FromResult(new SourceChange(ChangeOp.INSERT, data, rawEvent.Data.EnqueuedTime.ToUnixTimeMilliseconds(), reactivatorStart_ns, rawEvent.Data.SequenceNumber, rawEvent.Partition.PartitionId));
        }
    }
}