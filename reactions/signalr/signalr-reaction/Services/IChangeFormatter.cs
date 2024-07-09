using System.Text.Json;
using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;

namespace signalr_reactor.Services
{
    public interface IChangeFormatter
    {
        IEnumerable<JObject> FormatAdd(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input);
        IEnumerable<JObject> FormatDelete(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input);
        IEnumerable<JObject> FormatUpdate(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input);

        JObject FormatReloadRow(string queryId, JsonDocument input);

        JObject FormatControlSignal(string queryId, ulong sequence, ulong timestamp, JToken input);
    }
}