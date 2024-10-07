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

namespace Proxy.Services 
{
    using System.Text.Json;
    using System.Text.Json.Nodes;
    using System.Threading.Tasks;
    using Microsoft.Xrm.Sdk;
    using Proxy.Models;

    class JsonEventMapper : IEventMapper
    {   public Task<VertexState> MapEventAsync(IChangedItem rawEvent)
        {
            var data = new VertexState();
            
            switch (rawEvent.Type)
            {
                case ChangeType.NewOrUpdated:
                    var upsert = (NewOrUpdatedItem)rawEvent;
                    data.Id = upsert.NewOrUpdatedEntity.Id.ToString();
                    data.Labels = [upsert.NewOrUpdatedEntity.LogicalName];

                    var props = new JsonObject();
                    foreach (var attribute in upsert.NewOrUpdatedEntity.Attributes)
                    {
                        var val = JsonSerializer.SerializeToNode(attribute.Value);                        
                        props.Add(attribute.Key, val);
                    }
                    data.Properties = props;
                    break;
                case ChangeType.RemoveOrDeleted:
                    var delete = (RemovedOrDeletedItem)rawEvent;
                    data.Id = delete.RemovedItem.Id.ToString();
                    data.Labels = [delete.RemovedItem.LogicalName];
                    break;
            }

            return Task.FromResult(data);
        }
    }
}