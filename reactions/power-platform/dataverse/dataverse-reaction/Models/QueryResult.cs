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
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace DataverseReaction.Models
{
    [JsonPolymorphic(TypeDiscriminatorPropertyName = "kind")]
    [JsonDerivedType(typeof(QueryChangeResult), "change")]
    [JsonDerivedType(typeof(QueryControlResult), "control")]
    class QueryResult
    {
        [JsonPropertyName("queryId")]
        public string QueryId { get; set; }

        [JsonPropertyName("sequence")]
        public long? Sequence { get; set; }

        [JsonPropertyName("sourceTimeMs")]
        public long? SourceTimeMs { get; set; }
    }

    class QueryChangeResult : QueryResult
    {
        [JsonPropertyName("addedResults")]
        public List<JsonElement> AddedResults { get; set; } = [];

        [JsonPropertyName("updatedResults")]
        public List<UpdatedResult> UpdatedResults { get; set; } = [];

        [JsonPropertyName("deletedResults")]
        public List<JsonElement> DeletedResults { get; set; } = [];
    }

    class QueryControlResult : QueryResult
    {
        [JsonPropertyName("controlSignal")]
        public JsonElement? ControlSignal { get; set; }
    }

    class UpdatedResult
    {
        [JsonPropertyName("before")]
        public JsonElement? Before { get; set; }

        [JsonPropertyName("after")]
        public JsonElement After { get; set; }
    }


}
