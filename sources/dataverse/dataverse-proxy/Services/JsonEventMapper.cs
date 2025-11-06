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

namespace DataverseProxy.Services
{
    using System.Text.Json;
    using System.Text.Json.Nodes;
    using System.Threading.Tasks;
    using Microsoft.Xrm.Sdk;
    using Drasi.Source.SDK.Models;

    class JsonEventMapper() : IEventMapper
    {
        public Task<SourceElement> MapEventAsync(IChangedItem rawEvent)
        {
            SourceElement data;

            switch (rawEvent.Type)
            {
                case ChangeType.NewOrUpdated:
                    var upsert = (NewOrUpdatedItem)rawEvent;
                    var id = upsert.NewOrUpdatedEntity.Id.ToString();
                    var labels = new HashSet<string> { upsert.NewOrUpdatedEntity.LogicalName };

                    var props = new JsonObject();
                    foreach (var attribute in upsert.NewOrUpdatedEntity.Attributes)
                    {
                        JsonNode? val;

                        // Special handling for Money (currency) objects - extract just the decimal value
                        if (attribute.Value is Money money)
                        {
                            val = JsonValue.Create(money.Value);
                            Console.WriteLine($"Attribute: {attribute.Key}, Money value extracted: {money.Value}");
                        }
                        else
                        {
                            val = JsonSerializer.SerializeToNode(attribute.Value);
                            Console.WriteLine($"Attribute: {attribute.Key}, Value: {val?.ToJsonString()}");

                            // Debug: Print lookup object details
                            if (attribute.Value is EntityReference lookup)
                            {
                                Console.WriteLine($"  Lookup detected - Id: {lookup.Id}, LogicalName: {lookup.LogicalName}, Name: {lookup.Name}");
                                if (lookup.KeyAttributes?.Count > 0)
                                {
                                    Console.WriteLine($"  KeyAttributes:");
                                    foreach (var kvp in lookup.KeyAttributes)
                                    {
                                        Console.WriteLine($"    {kvp.Key}: {kvp.Value}");
                                    }
                                }
                            }
                        }

                        props.Add(attribute.Key, val);
                    }

                    data = new SourceElement(id, labels, props);
                    break;

                case ChangeType.RemoveOrDeleted:
                    var delete = (RemovedOrDeletedItem)rawEvent;
                    var deletedId = delete.RemovedItem.Id.ToString();
                    var deletedLabels = new HashSet<string> { delete.RemovedItem.LogicalName };

                    data = new SourceElement(deletedId, deletedLabels, null);
                    break;

                default:
                    throw new ArgumentException($"Unknown change type: {rawEvent.Type}");
            }

            return Task.FromResult(data);
        }
    }
}
