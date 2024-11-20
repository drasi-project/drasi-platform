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

﻿using System.Runtime.CompilerServices;
using System.Text.Json.Nodes;
using Drasi.Reaction.SDK.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Drasi.Reactions.SignalR.Services
{
    public class QueryHub : Hub
    {
        internal const string DefaultGroupName = "_noGroupSubscription_";
        private readonly IResultViewClient _viewClient;
        private readonly IChangeFormatter _changeFormatter;
        private readonly ILogger<QueryHub> _logger;

        public QueryHub(IResultViewClient viewClient, IChangeFormatter changeFormatter, ILogger<QueryHub> logger)
        {
            _viewClient = viewClient;
            _changeFormatter = changeFormatter;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            // By default, all clients will join the "_noGroupSubscription_" group when connected
            // We will broadcast to the "_noGroupSubscription_" group when a query is updated
            // Clients who are not subscribed in a group will receive this update
            // Once they join a group, they will be removed from the "_noGroupSubscription_" group
            await Groups.AddToGroupAsync(Context.ConnectionId, DefaultGroupName);
            await base.OnConnectedAsync();
            _logger.LogInformation($"Client connected {Context.ConnectionId}");
        }

        public async IAsyncEnumerable<JObject> Reload(string queryId, [EnumeratorCancellation]CancellationToken cancellationToken)
        {
            _logger.LogInformation("reload request for " + queryId);
            await foreach (var item in _viewClient.GetCurrentResult(queryId, cancellationToken))
            {                
                JObject? output = null;
                try
                {
                    output = _changeFormatter.FormatReloadRow(queryId, item);
                    
                }
                catch (Exception ex)
                {
                    _logger.LogError("reload error " + ex.Message);
                }

                if (output != null)
                    yield return output;
                
            }
            
        }
        public async Task Subscribe(string groupName)
        {
            // Adds the client to the group, with the queryId as the group name
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, DefaultGroupName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            _logger.LogInformation($"Subscribe to {groupName} - {Context.ConnectionId}");
        }


        public async Task Unsubscribe(string groupName)
        {
            // Removes the client from the group, with the queryId as the group name
            await Groups.AddToGroupAsync(Context.ConnectionId, DefaultGroupName);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            _logger.LogInformation($"Unsubscribe from {groupName} - {Context.ConnectionId}");
        }
    }
}
