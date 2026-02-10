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
using YamlDotNet.Core;
using YamlDotNet.Serialization.NamingConventions;

namespace Drasi.Reaction.SDK.Services
{
    public class YamlConfigDeserializer : IConfigDeserializer
    {
        private readonly IDeserializer _yamlDeserializer;

        public YamlConfigDeserializer()
        {
            _yamlDeserializer = new DeserializerBuilder()
                .WithNodeTypeResolver(new ImprovedTypeResolver())
                .WithNamingConvention(CamelCaseNamingConvention.Instance)
                .Build();
        }

        public T? Deserialize<T>(string data) where T : class
        {
            return _yamlDeserializer.Deserialize<T>(data);
        }
    }

    internal class ImprovedTypeResolver : INodeTypeResolver
    {
        public bool Resolve(NodeEvent? nodeEvent, ref Type currentType)
        {
            var scalar = nodeEvent as Scalar;
            if (scalar != null && scalar.Style == ScalarStyle.Plain)
            {
                if (int.TryParse(scalar.Value, out _))
                {
                    currentType = typeof(int);
                    return true;
                }
                if (double.TryParse(scalar.Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out _))
                {
                    currentType = typeof(double);
                    return true;
                }
                if (bool.TryParse(scalar.Value, out _))
                {
                    currentType = typeof(bool);
                    return true;
                }
                if (DateTime.TryParse(scalar.Value, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out _))
                {
                    currentType = typeof(DateTime);
                    return true;
                }
            }
            return false;
        }
    }
}
