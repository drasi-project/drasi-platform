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
