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
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reaction.SDK.Services;
using System.Text.Json;
using System.Text;

namespace Drasi.Reactions.Debug.Server.Services
{
	public class QueryDebugService : BackgroundService, IQueryDebugService
	{
		private readonly IResultViewClient _queryApi;
		private readonly IActorProxyFactory _actorProxyFactory;
		private readonly DaprClient _daprClient;

		private readonly ILogger<QueryDebugService> _logger;
		private readonly ConcurrentDictionary<string, QueryResult> _results = new();

		private readonly LinkedList<JsonElement> _rawEvents = new();
		private readonly string _queryDir;
		private readonly string _queryContainerId;

		private readonly WebSocketService _webSocketService;

		public QueryDebugService(IResultViewClient queryApi, IActorProxyFactory actorProxyFactory, DaprClient daprClient, WebSocketService webSocketService, string queryDir, string queryContainerId, ILogger<QueryDebugService> logger)
		{
			_logger = logger;
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
			await _webSocketService.BroadcastToStream("stream", _rawEvents);
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

		public async Task<QueryResult> GetQueryResult(string queryId)
		{
			_results.TryRemove(queryId, out _);
			return _results.GetOrAdd(queryId, await InitResult(queryId));
		}

		public async Task ProcessRawChange(string queryId, JsonElement change)
		{
			if (!_results.ContainsKey(queryId))
				return;

			var queryResult = _results[queryId];
			foreach (var item in change.GetProperty("deletedResults").EnumerateArray())
			{
				_logger.LogInformation($"Deleting {item.GetRawText()}");
				queryResult.Delete(item);
			}
			foreach (var item in change.GetProperty("addedResults").EnumerateArray())
			{
				_logger.LogInformation($"Adding {item.GetRawText()}");
				queryResult.Add(item);
			}
			foreach (var item in change.GetProperty("updatedResults").EnumerateArray())
			{
				JsonElement groupingKeys;
				item.TryGetProperty("grouping_keys", out groupingKeys);
				var before = item.GetProperty("before");
				var after = item.GetProperty("after");
				_logger.LogInformation($"Updating from {before.GetRawText()} to {after.GetRawText()}");
				queryResult.Update(before, after, groupingKeys);
			}

			await _webSocketService.BroadcastToQueryId(queryId, queryResult);
		}

		public async Task ProcessControlSignal(string queryId, JsonElement change)
		{
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
					_logger.LogError(ex, "Error initializing query: " + queryId);
				}
			});

		}

		private async Task<QueryResult> InitResult(string queryId)
		{
			_logger.LogInformation("Initializing query: " + queryId);
			var result = new QueryResult() { QueryContainerId = this._queryContainerId };
			try
			{
				await foreach (var item in _queryApi.GetCurrentResult(queryId))
				{
					if (item == null)
					{
						_logger.LogWarning("Received null item from GetCurrentResult for queryId: {QueryId}", queryId);
						continue;
					}

					var data = item.Data;
					if (data == null)
					{
						_logger.LogWarning("Item.Data is null for queryId: {QueryId}", queryId);
						continue;
					}
					_logger.LogInformation($"Adding {data.ToString()}");
					var jsonElement = JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(data));
					result.Add(jsonElement);
				}
			}
			catch (Exception ex)
			{
				result.Errors.Add("Error fetching initial data: " + ex.Message);
				_logger.LogError(ex, "Error fetching initial data: " + ex.Message);
			}

			return result;
		}
	}


}
