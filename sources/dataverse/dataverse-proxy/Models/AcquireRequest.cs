using System.Text.Json.Serialization;

namespace Proxy.Models
{
    public class AcquireRequest
    {
        [JsonPropertyName("queryId")]
        public string QueryId { get; set; }

        [JsonPropertyName("queryNodeId")]
        public string QueryNodeId { get; set; }

        [JsonPropertyName("nodeLabels")]
        public string[] NodeLabels { get; set; }

        [JsonPropertyName("relLabels")]
        public string[] RelLabels { get; set; }
    }
}
