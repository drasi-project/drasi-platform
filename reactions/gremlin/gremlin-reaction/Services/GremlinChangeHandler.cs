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

namespace Drasi.Reactions.Gremlin.Services;

using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reaction.SDK;
using Microsoft.Extensions.Logging;

class GremlinChangeHandler : IChangeEventHandler
{
	private readonly GremlinService _gremlinService;
	private readonly ILogger<GremlinChangeHandler> _logger;

	public GremlinChangeHandler(GremlinService gremlinService, ILogger<GremlinChangeHandler> logger)
	{
		_gremlinService = gremlinService;
		_logger = logger;
	}

	// TODO review query config param
	public async Task HandleChange(ChangeEvent evt, object? queryConfig)
	{
		_logger.LogInformation($"Received change event from query {evt.QueryId} sequence {evt.Sequence}");

		foreach (var addedResult in evt.AddedResults)
		{
			_gremlinService.ProcessAddedQueryResults(addedResult);
		}

		foreach (var updatedResult in evt.UpdatedResults)
		{
			_gremlinService.ProcessUpdatedQueryResults(updatedResult);
		}

		foreach (var deletedResult in evt.DeletedResults)
		{
			_gremlinService.ProcessDeletedQueryResults(deletedResult);
		}
	}
}