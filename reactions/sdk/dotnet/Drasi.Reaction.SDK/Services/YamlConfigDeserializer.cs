// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
