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

using Dapr;
using Dapr.Actors;
using Dapr.Actors.Client;
using Dapr.Client;

using System.Net.WebSockets;
using Drasi.Reactions.Debug.Server.Models;
using System.Collections.Concurrent;
using Drasi.Reaction.SDK.Models.QueryOutput;
using System.Text.Json;
using System.Text;

namespace Drasi.Reactions.Debug.Server.Services
{
    public class QueryDebugService : BackgroundService, IQueryDebugService
    {
        private readonly IResultViewClient _queryApi;
        private readonly IActorProxyFactory _actorProxyFactory;
        private readonly DaprClient _daprClient;


        private readonly ConcurrentDictionary<string, QueryResult> _results = new();        

        private readonly LinkedList<JsonElement> _rawEvents = new();
        private readonly string _queryDir;
        private readonly string _queryContainerId;

        

        private readonly WebSocketService _webSocketService;
        // public event EventRecievedHandler? OnEventRecieved;

        public QueryDebugService(IResultViewClient queryApi, IActorProxyFactory actorProxyFactory, DaprClient daprClient, WebSocketService webSocketService, string queryDir, string queryContainerId)
        {
            _daprClient = daprClient;
            _queryApi = queryApi;
            _queryDir = queryDir;
            _queryContainerId = queryContainerId;
            _webSocketService = webSocketService;
            _actorProxyFactory = actorProxyFactory;
        }

        public IEnumerable<string> ActiveQueries => _results.Keys;

        public async Task<LinkedList<JsonElement>> GetRawEvents()
        {
            return _rawEvents;
        }

        public async Task ProcessRawEvent(JsonElement change)
        {
            lock (_rawEvents)
            {
                _rawEvents.AddFirst(change);
                while (_rawEvents.Count > 100)
                    _rawEvents.RemoveLast();
            }
            await _webSocketService.BroadcastToStream("stream",_rawEvents);
        }

        public async Task<Dictionary<string, object>> GetDebugInfo(string queryId)
        {
            try
            {
                var actor = _actorProxyFactory.Create(new ActorId(queryId), $"{this._queryContainerId}.ContinuousQuery");
                return await actor.InvokeMethodAsync<Dictionary<string, object>>("getStatus");
            }
            catch (Exception ex)
            {
                return new Dictionary<string, object>
                {
                    { "error", ex.Message }
                };
            }
        }

        public async Task<QueryResult> ReinitializeQuery(string queryId)
        {
            _results.TryRemove(queryId, out _);
            return _results.GetOrAdd(queryId, await InitResult(queryId));
        }

        public async Task<QueryResult> GetQueryResult(string queryId)
        {
            return _results.GetOrAdd(queryId, await InitResult(queryId));
        }

        public async Task ProcessRawChange(string queryId, JsonElement change)
        {
            // OnEventRecieved?.Invoke(new RawEvent(change));

            if (!_results.ContainsKey(queryId))
                return;

            var queryResult = _results[queryId];
            foreach (var item in change.GetProperty("deletedResults").EnumerateArray())
                queryResult.Delete(item);
            foreach (var item in change.GetProperty("addedResults").EnumerateArray())
                queryResult.Add(item);
            foreach (var item in change.GetProperty("updatedResults").EnumerateArray())
            {
                JsonElement groupingKeys;
                item.TryGetProperty("grouping_keys", out groupingKeys);
                queryResult.Update(item.GetProperty("before"), item.GetProperty("after"), groupingKeys);
            }

            await _webSocketService.BroadcastToQueryId(queryId, queryResult);
        }

        public async Task ProcessControlSignal(string queryId, JsonElement change)
        {

            // OnEventRecieved?.Invoke(new RawEvent(change));

            if (!_results.ContainsKey(queryId))
                return;


            var queryResult = _results[queryId];

            switch (change.GetProperty("kind").GetString())
            {
                case "deleted":
                    queryResult.Clear();
                    break;
                case "bootstrapStarted":
                    queryResult.Clear();
                    break;
            }         

            await _webSocketService.BroadcastToQueryId(queryId, queryResult);   
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _daprClient.WaitForSidecarAsync(stoppingToken);

            Parallel.ForEach(Directory.GetFiles(_queryDir), async qpath =>
            {
                var queryId = Path.GetFileName(qpath);
                if (_results.ContainsKey(queryId))
                    return;
                try
                {
                    _results.TryAdd(queryId, await InitResult(queryId));
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            });
            
        }

        private async Task<QueryResult> InitResult(string queryId)
        {
            Console.WriteLine("init:" + queryId);
            var result = new QueryResult() { QueryContainerId = this._queryContainerId };
            try
            {
                await foreach (var item in _queryApi.GetCurrentResult(this._queryContainerId, queryId))
                {
                    var element = item.RootElement;
                    if (element.TryGetProperty("data", out var data))
                    {
                        result.Add(data);
                    }
                }
            }
            catch (Exception ex)
            {
                result.Errors.Add("Error fetching initial data: " + ex.Message);
                Console.WriteLine(ex);
            }

            return result;
        }
    }


}