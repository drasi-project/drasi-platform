using System;
using System.Text.Json;

namespace Drasi.Reaction.SDK.Services
{
    public class JsonConfigDeserializer : IConfigDeserializer
    {
        public JsonConfigDeserializer()
        {
        }

        public T? Deserialize<T>(string data) where T : class
        {
            var jsonDoc = JsonDocument.Parse(data);
            var result = jsonDoc.Deserialize<T>();

            return result;
        }
    }
}
