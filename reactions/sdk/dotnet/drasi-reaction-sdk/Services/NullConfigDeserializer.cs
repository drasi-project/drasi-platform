using System;
using System.Text.Json;

namespace Drasi.Reaction.SDK.Services
{
    public class NullConfigDeserializer : IConfigDeserializer
    {
        public NullConfigDeserializer()
        {
        }

        public T? Deserialize<T>(string data) where T : class
        {
            return null;
        }
    }
}
