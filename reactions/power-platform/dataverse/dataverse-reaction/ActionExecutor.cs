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

using Google.Protobuf.WellKnownTypes;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.PowerPlatform.Dataverse.Client.Extensions;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using DataverseReaction.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DataverseReaction
{
    internal class ActionExecutor
    {
        private readonly ServiceClient _serviceClient;

        private Dictionary<string, Dictionary<string, AttributeMetadata>> _metadataCache = [];

        public ActionExecutor(ServiceClient serviceClient)
        {
            _serviceClient = serviceClient;
        }

        public async Task ExecuteActions(ReactionSpec spec, QueryChangeResult changeResult)
        {
            var request = new ExecuteTransactionRequest()
            {
                Requests = new OrganizationRequestCollection()
            };

            foreach (var chg in changeResult.AddedResults)
            {
                foreach (var action in spec.Added)
                {
                    ProcessAction(request, chg, action);
                }
            }

            foreach (var chg in changeResult.UpdatedResults)
            {
                foreach (var action in spec.Updated)
                {
                    ProcessAction(request, chg.After, action);
                }
            }

            foreach (var chg in changeResult.DeletedResults)
            {
                foreach (var action in spec.Removed)
                {
                    ProcessAction(request, chg, action);
                }
            }

            await _serviceClient.ExecuteAsync(request);
        }

        private void ProcessAction(ExecuteTransactionRequest request, JsonElement chg, DataverseAction action)
        {
            switch (action)
            {
                case CreateEntityAction createEntityAction:
                    if (createEntityAction.IfNotExists.Count > 0)
                    {
                        var query = new QueryExpression(createEntityAction.EntityName)
                        {
                            TopCount = 1
                        };
                        foreach (var prop in createEntityAction.IfNotExists)
                        {
                            if (prop.Value.ValueKind == JsonValueKind.String && prop.Value.GetString().StartsWith("@"))
                            {
                                try
                                {
                                    var lookupValue = chg.GetProperty(prop.Value.GetString().Substring(1));                                    
                                    query.Criteria.AddCondition(prop.Key, ConditionOperator.Equal, ConvertValue(lookupValue, createEntityAction.EntityName, prop.Key, true));
                                }
                                catch (KeyNotFoundException)
                                {
                                    Console.WriteLine($"Error: Could not find property {prop.Value.GetString().Substring(1)} in change result");
                                }
                            }
                            else
                            {
                                query.Criteria.AddCondition(prop.Key, ConditionOperator.Equal, ConvertValue(prop.Value, createEntityAction.EntityName, prop.Key, true));
                            }
                        }

                        var result = _serviceClient.RetrieveMultiple(query);
                        if (result.Entities.Count > 0)
                        {
                            return;
                        }
                    }
                    
                    var entity = new Entity(createEntityAction.EntityName);
                    foreach (var prop in createEntityAction.Properties)
                    {

                        if (prop.Value.ValueKind == JsonValueKind.String && prop.Value.GetString().StartsWith("@"))
                        {
                            try
                            {
                                var lookupValue = chg.GetProperty(prop.Value.GetString().Substring(1));
                                entity.Attributes.Add(prop.Key, ConvertValue(lookupValue, createEntityAction.EntityName, prop.Key));
                            }
                            catch (KeyNotFoundException)
                            {
                                Console.WriteLine($"Error: Could not find property {prop.Value.GetString().Substring(1)} in change result");
                            }
                        }
                        else
                        {
                            entity.Attributes.Add(prop.Key, ConvertValue(prop.Value, createEntityAction.EntityName, prop.Key));
                        }
                    }

                    request.Requests.Add(new CreateRequest() { Target = entity });
                    break;

                case UpdateEntityAction updateEntityAction:

                    var updateEntity = new Entity(updateEntityAction.EntityName);

                    if (updateEntityAction.EntityId.StartsWith("@"))
                    {
                        try
                        {
                            var lookupValue = chg.GetProperty(updateEntityAction.EntityId.Substring(1));
                            updateEntity.Id = lookupValue.GetGuid();
                        }
                        catch (KeyNotFoundException)
                        {
                            Console.WriteLine($"Error: Could not find property {updateEntityAction.EntityId.Substring(1)} in change result");
                            return;
                        }
                    }
                    else
                    {
                        updateEntity.Id = new Guid(updateEntityAction.EntityId);
                    }


                    foreach (var prop in updateEntityAction.Properties)
                    {
                        if (prop.Value.ValueKind == JsonValueKind.String && prop.Value.GetString().StartsWith("@"))
                        {
                            try
                            {
                                var lookupValue = chg.GetProperty(prop.Value.GetString().Substring(1));
                                updateEntity.Attributes.Add(prop.Key, ConvertValue(lookupValue, updateEntityAction.EntityName, prop.Key));
                            }
                            catch (KeyNotFoundException)
                            {
                                Console.WriteLine($"Error: Could not find property {prop.Value.GetString().Substring(1)} in change result");
                            }
                        }
                        else
                        {
                            updateEntity.Attributes.Add(prop.Key, ConvertValue(prop.Value, updateEntityAction.EntityName, prop.Key));
                        }
                    }

                    request.Requests.Add(new UpdateRequest() { Target = updateEntity });
                    break;

                case DeleteEntityAction deleteEntityAction:
                    var deleteEntity = new EntityReference(deleteEntityAction.EntityName);

                    if (deleteEntityAction.EntityId.StartsWith("@"))
                    {
                        try
                        {
                            var lookupValue = chg.GetProperty(deleteEntityAction.EntityId.Substring(1));
                            deleteEntity.Id = lookupValue.GetGuid();
                        }
                        catch (KeyNotFoundException)
                        {
                            Console.WriteLine($"Error: Could not find property {deleteEntityAction.EntityId.Substring(1)} in change result");
                            return;
                        }
                    }
                    else
                    {
                        deleteEntity.Id = new Guid(deleteEntityAction.EntityId);
                    }

                    request.Requests.Add(new DeleteRequest() { Target = deleteEntity });
                    break;
            }
        }

        private object? ConvertValue(JsonElement value, string entityName, string attributeName, bool forQuery = false)
        {
            if (value.ValueKind == JsonValueKind.Null)
            {
                return null;
            }
            
            lock (_metadataCache)
            {
                if (!_metadataCache.ContainsKey(entityName))
                {
                    var metadata = _serviceClient.GetAllAttributesForEntity(entityName);
                    _metadataCache.Add(entityName, metadata.ToDictionary(m => m.LogicalName));
                }
            }
            try
            {
                var attributeMetadata = _metadataCache[entityName][attributeName];


                switch (attributeMetadata.AttributeType)
                {
                    case AttributeTypeCode.String:
                        return value.GetString();
                    case AttributeTypeCode.Integer:
                        return value.GetInt32();
                    case AttributeTypeCode.DateTime:
                        return value.GetDateTime();
                    case AttributeTypeCode.Boolean:
                        return value.GetBoolean();
                    case AttributeTypeCode.Decimal:
                        return value.GetDecimal();
                    case AttributeTypeCode.Double:
                        return value.GetDouble();
                    case AttributeTypeCode.Money:
                        return value.GetDecimal();
                    case AttributeTypeCode.Lookup:
                        var targetEntityName = ((LookupAttributeMetadata)attributeMetadata).Targets.FirstOrDefault();
                        if (String.IsNullOrEmpty(targetEntityName))
                            return null;
                        if (forQuery)
                            return value.GetGuid();
                        return new EntityReference(targetEntityName, value.GetGuid());
                    case AttributeTypeCode.Picklist:
                        if (forQuery)
                            return value.GetInt32();
                        return new OptionSetValue(value.GetInt32());
                    case AttributeTypeCode.State:
                        if (forQuery)
                            return value.GetInt32();
                        return new OptionSetValue(value.GetInt32());
                    case AttributeTypeCode.Status:
                        if (forQuery)
                            return value.GetInt32();
                        return new OptionSetValue(value.GetInt32());
                    case AttributeTypeCode.Uniqueidentifier:
                        return value.GetGuid();
                    case AttributeTypeCode.Memo:
                        return value.GetString();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error converting value for {entityName}.{attributeName}: {ex.Message}");
                return null;
            }

            return null;
        }
    }
}
