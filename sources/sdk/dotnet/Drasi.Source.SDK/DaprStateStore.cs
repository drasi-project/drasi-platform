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
using Dapr.Client;
using Microsoft.Extensions.Configuration;

namespace Drasi.Source.SDK
{
    public class DaprStateStore : IStateStore
    {
        private readonly DaprClient _daprClient;
        private readonly string _storeName;

        public DaprStateStore(DaprClient daprClient, IConfiguration configuration)
        {            
            _daprClient = daprClient;
            _storeName = configuration["STATE_STORE_NAME"] ?? "drasi-state";
        }

        public async Task Delete(string key)
        {
            await _daprClient.DeleteStateAsync(_storeName, key);
        }

        public async Task<byte[]?> Get(string key)
        {
            return await _daprClient.GetStateAsync<byte[]>(_storeName, key);
        }

        public async Task Put(string key, byte[] value)
        {
            await _daprClient.SaveStateAsync(_storeName, key, value);
        }
    }
}