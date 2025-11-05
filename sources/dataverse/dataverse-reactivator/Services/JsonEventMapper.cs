// Copyright 2025 The Drasi Authors.
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

namespace DataverseReactivator.Services
{
    using System.Text.Json;
    using System.Text.Json.Nodes;
    using System.Threading.Tasks;
    using Microsoft.Xrm.Sdk;
    using Drasi.Source.SDK.Models;

    class JsonEventMapper() : IEventMapper
    {
        public Task<SourceChange> MapEventAsync(IChangedItem rawEvent, long reactivatorStartNs)
        {
            SourceElement element;
            ChangeOp operation;

            switch (rawEvent.Type)
            {
                case ChangeType.NewOrUpdated:
                    var upsert = (NewOrUpdatedItem)rawEvent;
                    var id = upsert.NewOrUpdatedEntity.Id.ToString();
                    var labels = new HashSet<string> { upsert.NewOrUpdatedEntity.LogicalName };

                    var props = new JsonObject();
                    foreach (var attribute in upsert.NewOrUpdatedEntity.Attributes)
                    {
                        var val = JsonSerializer.SerializeToNode(attribute.Value);
                        props.Add(attribute.Key, val);
                    }

                    element = new SourceElement(id, labels, props);
                    // For Dataverse, we treat both new and updated items as INSERT/UPDATE
                    // The query engine will handle the distinction
                    operation = ChangeOp.INSERT;
                    break;

                case ChangeType.RemoveOrDeleted:
                    var delete = (RemovedOrDeletedItem)rawEvent;
                    var deletedId = delete.RemovedItem.Id.ToString();
                    var deletedLabels = new HashSet<string> { delete.RemovedItem.LogicalName };

                    element = new SourceElement(deletedId, deletedLabels, null);
                    operation = ChangeOp.DELETE;
                    break;

                default:
                    throw new ArgumentException($"Unknown change type: {rawEvent.Type}");
            }

            // Convert current time to nanoseconds for timestamp
            var timestampNs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() * 1000000;

            // Use a simple incrementing LSN - this will be enhanced later with actual Dataverse change tracking
            var lsn = timestampNs;

            return Task.FromResult(new SourceChange(
                operation,
                element,
                timestampNs,
                reactivatorStartNs,
                lsn));
        }
    }
}