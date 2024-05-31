using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace kubernetes_reactivator.Models
{
    public class ChangeNotification
    {
        [JsonPropertyName("op")]
        public string Op { get; set; }

        [JsonPropertyName("ts_ms")]
        public long TimestampMilliseconds { get; set; }


        [JsonPropertyName("payload")]
        public ChangePayload Payload { get; set; }
    }

    public class ChangePayload
    {
        [JsonPropertyName("source")]
        public ChangeSource Source { get; set; }

        [JsonPropertyName("before")]
        public object? Before { get; set; }

        [JsonPropertyName("after")]
        public object? After { get; set; }
    }

    public class VertexState
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("labels")]  // for change events
        public List<string> Labels { get; set; } = new();

        [JsonPropertyName("label")]  // for bootstrap process
        public string Label { get; set; }

        [JsonPropertyName("properties")]
        public object? Properties { get; set; }
    }

    public class EdgeState
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("labels")]  // for change events
        public List<string> Labels { get; set; } = new();

        [JsonPropertyName("label")]  // for bootstrap process
        public string Label { get; set; }

        [JsonPropertyName("properties")]
        public object? Properties { get; set; }

        [JsonPropertyName("startId")]
        public string StartId { get; set; }

        [JsonPropertyName("endId")]
        public string EndId { get; set; }
    }

    public class ChangeSource
    {
        [JsonPropertyName("db")]
        public string Db { get; set; }

        [JsonPropertyName("table")]
        public string Table { get; set; }

        [JsonPropertyName("lsn")]
        public long LSN { get; set; }

        [JsonPropertyName("ts_ms")]
        public long TimestampMilliseconds { get; set; }

        [JsonPropertyName("ts_sec")]
        public long TimestampSeconds { get; set; }
    }
}
