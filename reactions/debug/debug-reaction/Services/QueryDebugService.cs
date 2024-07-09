using Dapr;
using Dapr.Actors;
using Dapr.Actors.Client;
using Dapr.Client;
using debug_reactor.Models;
using System.Collections.Concurrent;
using System.Text.Json;

namespace debug_reactor.Services
{
    public class QueryDebugService : BackgroundService, IQueryDebugService
    {
        private readonly IResultViewClient _queryApi;
        private readonly IActorProxyFactory _actorProxyFactory;
        private readonly DaprClient _daprClient;

        private readonly ConcurrentDictionary<string, QueryResult> _results = new();        

        private readonly string _queryDir;
        private readonly string _queryContainerId;

        public event EventRecievedHandler? OnEventRecieved;

        public QueryDebugService(IResultViewClient queryApi, IActorProxyFactory actorProxyFactory, DaprClient daprClient, string queryDir, string queryContainerId)
        {
            _daprClient = daprClient;
            _queryApi = queryApi;
            _queryDir = queryDir;
            _queryContainerId = queryContainerId;
            _actorProxyFactory = actorProxyFactory;
        }

        public IEnumerable<string> ActiveQueries => _results.Keys;

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

        public void ProcessRawChange(JsonElement change)
        {
            var queryId = change.GetProperty("queryId").GetString();

            OnEventRecieved?.Invoke(new RawEvent(change));

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
        }

        public void ProcessControlSignal(JsonElement change)
        {
            var queryId = change.GetProperty("queryId").GetString();

            OnEventRecieved?.Invoke(new RawEvent(change));

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
