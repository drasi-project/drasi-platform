// Copyright 2025 The Drasi Authors.
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
namespace Drasi.Reactions.Debug.Server.Services;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;

public class ChangeHandler : IChangeEventHandler
{
	private readonly IQueryDebugService _debugService;
	private readonly ILogger<ChangeHandler> _logger;


	public ChangeHandler(IQueryDebugService debugService, ILogger<ChangeHandler> logger)
	{
		_debugService = debugService;
		_logger = logger;
	}

	public async Task HandleChange(ChangeEvent evt, object? queryConfig)
	{
		var queryId = evt.QueryId;
		var jsonEvent = JsonSerializer.Deserialize<JsonElement>(evt.ToJson());
		await _debugService.ProcessRawEvent(jsonEvent);
		await _debugService.ProcessRawChange(evt);
	}
}