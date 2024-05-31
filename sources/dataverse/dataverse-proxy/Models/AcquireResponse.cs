using System.Text.Json.Serialization;

namespace Proxy.Models
{
    public class AcquireResponse
    {
        [JsonPropertyName("nodes")]
        public List<VertexState> Nodes { get; set; } = [];

        [JsonPropertyName("rels")]
        public List<EdgeState> Rels { get; set; } = [];
    }
}
