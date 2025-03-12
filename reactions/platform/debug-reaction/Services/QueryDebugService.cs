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
using Drasi.Reaction.SDK.Models.ViewService;
using Drasi.Reaction.SDK.Services;
using System.Text.Json;
using System.Text;

namespace Drasi.Reactions.Debug.Server.Services
{
	public class QueryDebugService : IQueryDebugService
	{
		private readonly IResultViewClient _queryApi;
		private readonly IActorProxyFactory _actorProxyFactory;
		private readonly DaprClient _daprClient;

		private readonly ILogger<QueryDebugService> _logger;

		private readonly IChangeBroadcaster _webSocketService;

		private readonly IManagementClient _managementClient;

		public QueryDebugService(IResultViewClient queryApi, IActorProxyFactory actorProxyFactory, DaprClient daprClient, IChangeBroadcaster webSocketService, ILogger<QueryDebugService> logger, IManagementClient managementClient)
		{
			_logger = logger;
			_daprClient = daprClient;
			_queryApi = queryApi;
			_webSocketService = webSocketService;
			_actorProxyFactory = actorProxyFactory;
			_managementClient = managementClient;
		}

		public async Task<Dictionary<string, object>> GetDebugInfo(string queryId)
		{
			try
			{
				var queryContainerId = await _managementClient.GetQueryContainerId(queryId);
				var actor = _actorProxyFactory.Create(new ActorId(queryId), $"{queryContainerId}.ContinuousQuery");
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

		public IAsyncEnumerable<ViewItem> GetQueryResult(string queryId)
		{
			return _queryApi.GetCurrentResult(queryId);
		}

		public async Task ProcessChange(ChangeEvent change)
		{
			var jsonEvent = JsonSerializer.Deserialize<JsonElement>(change.ToJson());
			await ProcessRawChange(change);
			await _webSocketService.BroadcastToStream("stream", jsonEvent);

		}
		public async Task ProcessRawChange(ChangeEvent change)
		{
			var queryId = change.QueryId;

			var queryResult = new QueryResult();
			foreach (var item in change.DeletedResults)
			{
				var result = JsonSerializer.SerializeToElement(item);
				queryResult.DeletedResults.Add(result);
			}
			foreach (var item in change.AddedResults)
			{
				var result = JsonSerializer.SerializeToElement(item);
				queryResult.AddedResults.Add(result);
			}
			foreach (var item in change.UpdatedResults)
			{
				var result = JsonSerializer.SerializeToElement(item);
				queryResult.UpdatedResults.Add(result);
			}


			await _webSocketService.BroadcastToQueryId(queryId, queryResult);
		}

		public async Task ProcessControlSignal(ControlEvent change)
		{
			var queryId = change.QueryId;

			switch (change.ControlSignal.Kind)
			{
				case ControlSignalKind.Deleted:
					var queryResult = new QueryResult();
					queryResult.ResultsClear = true;
					await _webSocketService.BroadcastToQueryId(queryId, queryResult);
					break;
				case ControlSignalKind.BootstrapStarted:
					queryResult = new QueryResult();
					queryResult.ResultsClear = true;
					await _webSocketService.BroadcastToQueryId(queryId, queryResult);
					break;
			}

			var jsonEvent = JsonSerializer.Deserialize<JsonElement>(change.ToJson());
			await _webSocketService.BroadcastToStream("stream", jsonEvent);
		}

	}


}
