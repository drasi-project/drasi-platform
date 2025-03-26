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
    using System.Text.Json.Nodes;
    using System.Threading.Tasks;
    using Microsoft.Xrm.Sdk;
    using Reactivator.Models;

    class JsonEventMapper(string sourceId) : IEventMapper
    {
        private readonly string _sourceId = sourceId;

        public Task<ChangeNotification> MapEventAsync(IChangedItem rawEvent, long reactivatorStartNs)
        {
            var result = new ChangeNotification();
            var data = new VertexState();
            
            switch (rawEvent.Type)
            {
                case ChangeType.NewOrUpdated:
                    var upsert = (NewOrUpdatedItem)rawEvent;
                    data.Id = upsert.NewOrUpdatedEntity.Id.ToString();
                    data.Label = upsert.NewOrUpdatedEntity.LogicalName;
                    data.Labels = [upsert.NewOrUpdatedEntity.LogicalName];

                    var props = new JsonObject();
                    foreach (var attribute in upsert.NewOrUpdatedEntity.Attributes)
                    {
                        var val = JsonSerializer.SerializeToNode(attribute.Value);                        
                        props.Add(attribute.Key, val);
                    }
                    data.Properties = props;

                    if (upsert.NewOrUpdatedEntity.Attributes.ContainsKey("modifiedon"))
                    {
                        var dt = upsert.NewOrUpdatedEntity.Attributes["modifiedon"];
                        if (dt is DateTime time)
                        {
                            result.TimestampNanoseconds = (long)(time.ToUniversalTime().Ticks - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).Ticks) * 100;
                            // result.TimestampMilliseconds = (long)(time.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalMilliseconds;
                        }
                        else if (dt is DateTimeOffset offset)
                        {
                            result.TimestampNanoseconds = (offset.UtcTicks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                        }
                    }
                    else
                    {
                        result.TimestampNanoseconds = (DateTimeOffset.UtcNow.UtcTicks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                    }

                    result.Op = "u";
                    result.Payload = new ChangePayload()
                    {
                        After = data,
                        Source = new ChangeSource()
                        {
                            Db = _sourceId,
                            Table = "node",
                            TimestampNanoseconds = result.TimestampNanoseconds
                        }
                    };
                    break;
                case ChangeType.RemoveOrDeleted:
                    var delete = (RemovedOrDeletedItem)rawEvent;
                    data.Id = delete.RemovedItem.Id.ToString();
                    data.Label = delete.RemovedItem.LogicalName;
                    data.Labels = [delete.RemovedItem.LogicalName];

                    if (delete.RemovedItem.KeyAttributes.ContainsKey("deletetime"))
                    {
                        var dt = delete.RemovedItem.KeyAttributes["deletetime"];
                        if (dt is DateTime time)
                        {
                            result.TimestampNanoseconds = (long)(time.ToUniversalTime().Ticks - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).Ticks) * 100;
                        }
                        else if (dt is DateTimeOffset offset)
                        {
                            result.TimestampNanoseconds = (offset.UtcTicks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                        }
                    }
                    else
                    {
                        result.TimestampNanoseconds = (DateTimeOffset.UtcNow.UtcTicks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                    }

                    result.Op = "d";
                    result.Payload = new ChangePayload()
                    {
                        Before = data,
                        Source = new ChangeSource()
                        {
                            Db = _sourceId,
                            Table = "node",
                            TimestampNanoseconds = result.TimestampNanoseconds
                        }
                    };
                    break;
            }

            result.ReactivatorStartNs = reactivatorStartNs;
            result.ReactivatorEndNs = (DateTimeOffset.UtcNow.Ticks - DateTimeOffset.UnixEpoch.Ticks) * 100;
            return Task.FromResult(result);
        }
    }
}