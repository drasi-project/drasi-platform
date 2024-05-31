namespace Reactivator.Services 
{
    using System.Text.Json;
    using System.Text.Json.Nodes;
    using System.Threading.Tasks;
    using Microsoft.Xrm.Sdk;
    using Reactivator.Models;

    class JsonEventMapper(string sourceId) : IEventMapper
    {
        private readonly string _sourceId = sourceId;

        public Task<ChangeNotification> MapEventAsync(IChangedItem rawEvent)
        {
            var result = new ChangeNotification();
            var data = new VertexState();
            
            switch (rawEvent.Type)
            {
                case ChangeType.NewOrUpdated:
                    var upsert = (NewOrUpdatedItem)rawEvent;
                    data.Id = upsert.NewOrUpdatedEntity.Id.ToString();
                    data.Label = upsert.NewOrUpdatedEntity.LogicalName;
                    data.Labels = [upsert.NewOrUpdatedEntity.LogicalName];

                    var props = new JsonObject();
                    foreach (var attribute in upsert.NewOrUpdatedEntity.Attributes)
                    {
                        var val = JsonSerializer.SerializeToNode(attribute.Value);                        
                        props.Add(attribute.Key, val);
                    }
                    data.Properties = props;

                    if (upsert.NewOrUpdatedEntity.Attributes.ContainsKey("modifiedon"))
                    {
                        var dt = upsert.NewOrUpdatedEntity.Attributes["modifiedon"];
                        if (dt is DateTime time)
                        {
                            result.TimestampMilliseconds = (long)(time.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalMilliseconds;
                        }
                        else if (dt is DateTimeOffset offset)
                        {
                            result.TimestampMilliseconds = offset.ToUnixTimeMilliseconds();
                        }
                    }
                    else
                    {
                        result.TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                    }

                    result.Op = "u";
                    result.Payload = new ChangePayload()
                    {
                        After = data,
                        Source = new ChangeSource()
                        {
                            Db = _sourceId,
                            Table = "node",
                            TimestampMilliseconds = result.TimestampMilliseconds
                        }
                    };
                    break;
                case ChangeType.RemoveOrDeleted:
                    var delete = (RemovedOrDeletedItem)rawEvent;
                    data.Id = delete.RemovedItem.Id.ToString();
                    data.Label = delete.RemovedItem.LogicalName;
                    data.Labels = [delete.RemovedItem.LogicalName];

                    if (delete.RemovedItem.KeyAttributes.ContainsKey("deletetime"))
                    {
                        var dt = delete.RemovedItem.KeyAttributes["deletetime"];
                        if (dt is DateTime time)
                        {
                            result.TimestampMilliseconds = (long)(time.ToUniversalTime() - new DateTime(1970, 1, 1)).TotalMilliseconds;
                        }
                        else if (dt is DateTimeOffset offset)
                        {
                            result.TimestampMilliseconds = offset.ToUnixTimeMilliseconds();
                        }
                    }
                    else
                    {
                        result.TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                    }

                    result.Op = "d";
                    result.Payload = new ChangePayload()
                    {
                        Before = data,
                        Source = new ChangeSource()
                        {
                            Db = _sourceId,
                            Table = "node",
                            TimestampMilliseconds = result.TimestampMilliseconds
                        }
                    };
                    break;
            }

            return Task.FromResult(result);
        }
    }
}