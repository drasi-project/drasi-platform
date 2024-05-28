using System.Text.Json.Serialization;

namespace eventgrid_reactor.Models
{
    public class ChangeNotification
    {
        [JsonPropertyName("op")]
        public string Op { get; set; }

        [JsonPropertyName("ts_ms")]
        public long TimestampMilliseconds { get; set; }

        [JsonPropertyName("schema")]
        public string Schema { get; set; }

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

    public class ChangeSource
    {
        [JsonPropertyName("db")]
        public string Db { get; set; }
        [JsonPropertyName("table")]
        public string Table { get; set; }
    }
}
