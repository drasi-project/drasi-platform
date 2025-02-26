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

using Dapr.Client;
using Drasi.Source.SDK.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Text;

namespace Drasi.Source.SDK
{
    public class DaprChangePublisher : IChangePublisher
    {
        private readonly string _pubsubName;
        private readonly string _sourceId;
        private readonly DaprClient _daprClient;

        public DaprChangePublisher(DaprClient daprClient, IConfiguration configuration)
        {
            _pubsubName = configuration["PUBSUB"] ?? "drasi-pubsub";;
            _sourceId = configuration["SOURCE_ID"] ?? throw new ArgumentNullException("SOURCE_ID");
            _daprClient = daprClient;
        }

        public async Task Publish(SourceChange change)
        {
            var evt = Encoding.UTF8.GetBytes($"[{change.ToJson()}]");
            await _daprClient.PublishByteEventAsync(_pubsubName, $"{_sourceId}-change", evt);
        }
    }
}