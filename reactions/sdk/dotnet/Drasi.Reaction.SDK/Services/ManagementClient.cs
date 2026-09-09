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
using System.Text.Json;
using System.Net.Http.Json;

namespace Drasi.Reaction.SDK.Services
{
    public class ManagementClient : IManagementClient
    {
        private readonly HttpClient _httpClient;

        public ManagementClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetQueryContainerId(string queryId)
        {
            var resp = await _httpClient.GetAsync($"/v1/continuousQueries/{queryId}");
            resp.EnsureSuccessStatusCode();
            var body = await resp.Content.ReadFromJsonAsync<JsonDocument>() ?? throw new Exception("Failed to parse response body");
            var spec = body.RootElement.GetProperty("spec");
            return spec.GetProperty("container").GetString() ?? throw new Exception("Failed to parse response body");
        }
    }
}
