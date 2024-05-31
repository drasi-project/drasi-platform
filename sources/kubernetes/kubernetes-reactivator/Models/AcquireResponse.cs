using System.Text.Json.Serialization;

namespace kubernetes_reactivator.Models
{
    public class AcquireResponse
    {
        [JsonPropertyName("nodes")]
        public List<VertexState> Nodes { get; set; } = new();

        [JsonPropertyName("rels")]
        public List<EdgeState> Rels { get; set; } = new();
    }
}
