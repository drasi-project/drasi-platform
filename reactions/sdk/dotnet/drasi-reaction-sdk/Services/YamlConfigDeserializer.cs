using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YamlDotNet.Serialization;
using YamlDotNet.Core.Events;
using System.IO;
using System.Text.Json;

namespace Drasi.Reaction.SDK.Services
{
    public class YamlConfigDeserializer : IConfigDeserializer
    {
        private readonly IDeserializer _yamlDeserializer;
        private readonly ISerializer _yamlJsonSerializer;

        public YamlConfigDeserializer()
        {
            _yamlDeserializer = new DeserializerBuilder()
                .WithNodeTypeResolver(new InferTypeFromValue())
                .Build();

            _yamlJsonSerializer = new SerializerBuilder()
                .JsonCompatible()
                .Build();
        }

        public T? Deserialize<T>(string data) where T : class
        {
            var yamlObject = _yamlDeserializer.Deserialize(data);
            var specJson = _yamlJsonSerializer.Serialize(yamlObject);
            var result = JsonSerializer.Deserialize<T>(specJson);

            return result;
        }
    }

    internal class InferTypeFromValue : INodeTypeResolver
    {
        public bool Resolve(NodeEvent nodeEvent, ref Type currentType)
        {
            var scalar = nodeEvent as Scalar;
            if (scalar != null)
            {
                int value;
                if (int.TryParse(scalar.Value, out value))
                {
                    currentType = typeof(int);
                    return true;
                }
            }
            return false;
        }
    }
}
