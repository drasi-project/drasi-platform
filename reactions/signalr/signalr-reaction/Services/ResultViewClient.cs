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

﻿using Dapr.Actors;
using Dapr;
using Dapr.Actors.Client;
using Dapr.Client;
using Newtonsoft.Json.Linq;
using System.Text.Json;
using System.Runtime.CompilerServices;

namespace SignalrReaction.Services
{
    public class ResultViewClient : IResultViewClient
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        

        public ResultViewClient()
        {
            _httpClient = new HttpClient();
            _jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async IAsyncEnumerable<JsonDocument> GetCurrentResult(string queryContainerId, string queryId, [EnumeratorCancellation]CancellationToken cancellationToken = default)
        {
            Stream? stream = null;
            try
            {
                stream = await _httpClient.GetStreamAsync($"http://{queryContainerId}-view-svc/{queryId}", cancellationToken);                
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Error getting current result: " + ex.Message);
                yield break;
            }

            if (stream == null)
            {
                yield break;
            }
            

            await foreach (var item in JsonSerializer.DeserializeAsyncEnumerable<JsonDocument>(stream, _jsonSerializerOptions, cancellationToken))
            {
                if (item != null)
                {
                    yield return item;
                }
            }
        }

    }
}
