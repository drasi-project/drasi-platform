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
using System.Threading.Tasks;

namespace Reactivator.Services;
public class DaprDeltaTokenStore(DaprClient daprClient, string storeName) : IDeltaTokenStore
{
    private readonly DaprClient _daprClient = daprClient;
    private readonly string _storeName = storeName;

    public async Task<string?> GetDeltaToken(string entityName)
    {
        var state = await _daprClient.GetStateAsync<string?>(_storeName, $"{entityName}");
        return state;
    }

    public async Task SetDeltaToken(string entityName, string token)
    {
        await _daprClient.SaveStateAsync(_storeName, $"{entityName}", token);
    }
}
