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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataverseReaction.Models
{
    [JsonPolymorphic(TypeDiscriminatorPropertyName = "kind")]
    [JsonDerivedType(typeof(CreateEntityAction), "createEntity")]
    [JsonDerivedType(typeof(UpdateEntityAction), "updateEntity")]
    [JsonDerivedType(typeof(DeleteEntityAction), "deleteEntity")]
    partial class DataverseAction
    {
    }

    class CreateEntityAction : DataverseAction
    {
        [JsonPropertyName("entityName")]
        public string EntityName { get; set; }

        [JsonExtensionData]
        public Dictionary<string, JsonElement>? Properties { get; set; } = [];

        [JsonPropertyName("ifNotExists")]
        public Dictionary<string, JsonElement>? IfNotExists { get; set; } = [];
    }

    class UpdateEntityAction : DataverseAction
    {
        [JsonPropertyName("entityName")]
        public string EntityName { get; set; }

        [JsonPropertyName("entityId")]
        public string EntityId { get; set; }

        [JsonExtensionData]
        public Dictionary<string, JsonElement>? Properties { get; set; } = [];
    }

    class DeleteEntityAction : DataverseAction
    {
        [JsonPropertyName("entityName")]
        public string EntityName { get; set; }

        [JsonPropertyName("entityId")]
        public string EntityId { get; set; }
    }

    class ReactionSpec
    {
        [JsonPropertyName("added")]
        public List<DataverseAction> Added { get; set; } = [];

        [JsonPropertyName("updated")]
        public List<DataverseAction> Updated { get; set; } = [];

        [JsonPropertyName("deleted")]
        public List<DataverseAction> Removed { get; set; } = [];


    }
}
