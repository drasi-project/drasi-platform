using storage_queue_reactor.Models;
using Newtonsoft.Json.Linq;
using System.Text.Json;

namespace storage_queue_reactor.Services
{
    public interface IChangeFormatter
    {
        IEnumerable<ChangeNotification> FormatAdd(string queryId, JsonElement.ArrayEnumerator input);
        IEnumerable<ChangeNotification> FormatDelete(string queryId, JsonElement.ArrayEnumerator input);
        IEnumerable<ChangeNotification> FormatUpdate(string queryId, JsonElement.ArrayEnumerator input);
    }
}
