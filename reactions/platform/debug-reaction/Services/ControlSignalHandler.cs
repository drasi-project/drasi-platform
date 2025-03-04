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







public class ControlSignalHandler : IControlEventHandler
{
	private readonly IQueryDebugService _debugService;
	private readonly ILogger<ControlSignalHandler> _logger;

	public ControlSignalHandler(IQueryDebugService debugService, ILogger<ControlSignalHandler> logger)
	{
		_debugService = debugService;
		_logger = logger;
	}

	public async Task HandleControlSignal(ControlEvent evt, object? queryConfig)
	{
		var queryId = evt.QueryId;
		await _debugService.ProcessControlSignal(evt);
	}
}
