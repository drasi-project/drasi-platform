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

using Microsoft.Extensions.Configuration;
using System;

namespace Drasi.Reaction.SDK.Services
{
    internal class QueryConfigService(IConfigDeserializer configDeserializer, IConfiguration appConfig) : IQueryConfigService
    {
        private readonly string _configDirectory = appConfig["QueryConfigPath"] ?? "/etc/queries";
        private readonly IConfigDeserializer _configDeserializer = configDeserializer;

        public List<string> GetQueryNames()
        {
            return Directory.GetFiles(_configDirectory)
                .Select(x => Path.GetFileName(x))
                .ToList();
        }

        public T? GetQueryConfig<T>(string queryName) where T : class
        {
            var data = File.ReadAllText($"{_configDirectory}/{queryName}");
            return _configDeserializer.Deserialize<T>(data);
        }
    }
}
