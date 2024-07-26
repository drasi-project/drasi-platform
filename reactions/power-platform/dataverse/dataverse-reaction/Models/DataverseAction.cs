using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace dataverse_reaction.Models
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
