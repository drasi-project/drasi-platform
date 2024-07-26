using eventgrid_reaction.Models;
using Newtonsoft.Json.Linq;
using System.Text.Json;

namespace eventgrid_reaction.Services
{
    public interface IChangeFormatter
    {
        IEnumerable<ChangeNotification> FormatAdd(string queryId, JsonElement.ArrayEnumerator input);
        IEnumerable<ChangeNotification> FormatDelete(string queryId, JsonElement.ArrayEnumerator input);
        IEnumerable<ChangeNotification> FormatUpdate(string queryId, JsonElement.ArrayEnumerator input);
    }
}
