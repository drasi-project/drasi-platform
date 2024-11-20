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

using System.Text.Json;
using System.Runtime.CompilerServices;
using Drasi.Reaction.SDK.Models.ViewService;

namespace Drasi.Reaction.SDK.Services;

public class ResultViewClient : IResultViewClient
{
    private readonly HttpClient _httpClient;
    private readonly IManagementClient _managementClient;

    public ResultViewClient(IManagementClient managementClient)
    {
        _managementClient = managementClient;
        _httpClient = new HttpClient();
    }

    public async IAsyncEnumerable<ViewItem> GetCurrentResult(string queryContainerId, string queryId, [EnumeratorCancellation]CancellationToken cancellationToken = default)
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
        

        await foreach (var item in JsonSerializer.DeserializeAsyncEnumerable<ViewItem>(stream, ModelOptions.JsonOptions, cancellationToken))
        {
            if (item != null)
            {
                yield return item;
            }
        }
    }

    public async IAsyncEnumerable<ViewItem> GetCurrentResult(string queryId, [EnumeratorCancellation]CancellationToken cancellationToken = default)
    {
        var queryContainerId = await _managementClient.GetQueryContainerId(queryId);
        await foreach (var item in GetCurrentResult(queryContainerId, queryId, cancellationToken))
        {
            yield return item;
        }
    }
}
