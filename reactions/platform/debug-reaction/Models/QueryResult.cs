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

using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.Json.Serialization;
using Drasi.Reaction.SDK.Models.QueryOutput;

namespace Drasi.Reactions.Debug.Server.Models
{
	public class QueryResult
	{
		[JsonPropertyName("addedResults")]
		public List<JsonElement> AddedResults { get; } = new();

		[JsonPropertyName("deletedResults")]
		public List<JsonElement> DeletedResults { get; } = new();

		[JsonPropertyName("updatedResults")]
		public List<JsonElement> UpdatedResults { get; } = new();

		[JsonPropertyName("resultsClear")]
		public bool ResultsClear { get; set; } = false;

		[JsonPropertyName("errors")]
		public List<string> Errors { get; } = new();
	}
}