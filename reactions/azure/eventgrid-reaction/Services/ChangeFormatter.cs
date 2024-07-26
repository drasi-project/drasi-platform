
using eventgrid_reaction.Models;
using System.Text.Json;

namespace eventgrid_reaction.Services
{
    public class ChangeFormatter : IChangeFormatter
    {
        public IEnumerable<ChangeNotification> FormatAdd(string queryId, JsonElement.ArrayEnumerator input)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in input)
            {
                var outputItem = new ChangeNotification
                {
                    Op = "i",
                    TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Schema = "",
                    Payload = new ChangePayload()
                    {
                        Source = new ChangeSource()
                        {
                            Db = "ReactiveGraph",
                            Table = queryId
                        },
                        Before = null,
                        After = inputItem
                    }
                };

                result.Add(outputItem);
            }

            return result;
        }

        public IEnumerable<ChangeNotification> FormatUpdate(string queryId, JsonElement.ArrayEnumerator input)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in input)
            {
                var outputItem = new ChangeNotification
                {
                    Op = "u",
                    TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Schema = "",
                    Payload = new ChangePayload()
                    {
                        Source = new ChangeSource()
                        {
                            Db = "ReactiveGraph",
                            Table = queryId
                        },
                        Before = inputItem.GetProperty("before"),
                        After = inputItem.GetProperty("after")
                    }
                };

                result.Add(outputItem);
            }

            return result;
        }

        public IEnumerable<ChangeNotification> FormatDelete(string queryId, JsonElement.ArrayEnumerator input)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in input)
            {
                var outputItem = new ChangeNotification
                {
                    Op = "d",
                    TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Schema = "",
                    Payload = new ChangePayload()
                    {
                        Source = new ChangeSource()
                        {
                            Db = "ReactiveGraph",
                            Table = queryId
                        },
                        Before = inputItem,
                        After = null
                    }
                };

                result.Add(outputItem);
            }

            return result;
        }

    }
}
