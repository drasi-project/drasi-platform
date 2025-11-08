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
                        // Serialize all attribute values to JSON
                        var val = JsonSerializer.SerializeToNode(attribute.Value);
                        // Handle multi-select choice: [{"Value":1},{"Value":2}] -> [1,2]
                        if (val is JsonArray array && array.Count > 0 && array[0] is JsonObject firstItem && firstItem.ContainsKey("Value"))
                        {
                            var values = new JsonArray();
                            foreach (var item in array)
                            {
                                if (item is JsonObject itemObj && itemObj.ContainsKey("Value"))
                                {
                                    values.Add(itemObj["Value"]?.DeepClone());
                                }
                            }
                            val = values;
                        }
                        // Handle single value types: {"Value":123} -> 123
                        else if (val is JsonObject jsonObj && jsonObj.ContainsKey("Value") && jsonObj.Count <= 2) // Count <= 2 to allow ExtensionData
                        {
                            val = jsonObj["Value"]?.DeepClone();
                        }

                        props.Add(attribute.Key, val);
                    }

                    element = new SourceElement(id, labels, props);
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

            // Extract LSN from RowVersion (Dataverse's monotonically increasing version)
            long lsn;
            if (rawEvent.Type == ChangeType.NewOrUpdated)
            {
                var upsert = (NewOrUpdatedItem)rawEvent;
                if (!string.IsNullOrEmpty(upsert.NewOrUpdatedEntity.RowVersion))
                {
                    lsn = long.Parse(upsert.NewOrUpdatedEntity.RowVersion);
                }
                else
                {
                    // Fallback to timestamp if RowVersion not available
                    lsn = timestampNs;
                }
            }
            else
            {
                // For deletes, RowVersion format is "number!timestamp" - extract just the number
                var delete = (RemovedOrDeletedItem)rawEvent;
                if (!string.IsNullOrEmpty(delete.RemovedItem.RowVersion))
                {
                    var rowVersion = delete.RemovedItem.RowVersion;
                    var exclamationIndex = rowVersion.IndexOf('!');
                    if (exclamationIndex > 0)
                    {
                        // Format: "2818084!11/05/2025 20:47:30" - extract "2818084"
                        lsn = long.Parse(rowVersion.Substring(0, exclamationIndex));
                    }
                    else
                    {
                        // If no '!' separator, try parsing the whole string
                        lsn = long.Parse(rowVersion);
                    }
                }
                else
                {
                    // Fallback to timestamp
                    lsn = timestampNs;
                }
            }

            return Task.FromResult(new SourceChange(
                operation,
                element,
                timestampNs,
                reactivatorStartNs,
                lsn));
        }
    }
}