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

using Drasi.Reactions.Debug.Server.Models;
using System.Text.Json;

namespace Drasi.Reactions.Debug.Server.Services
{
	public interface IQueryDebugService : IHostedService
	{
		Task<QueryResult> GetQueryResult(string queryId);
		Task ProcessRawChange(string queryId, JsonElement change);
		Task ProcessControlSignal(string queryId, JsonElement change);
		IEnumerable<string> ActiveQueries { get; }
		Task<Dictionary<string, object>> GetDebugInfo(string queryId);
		Task<LinkedList<JsonElement>> GetRawEvents();

		Task ProcessRawEvent(JsonElement change);
	}
}
