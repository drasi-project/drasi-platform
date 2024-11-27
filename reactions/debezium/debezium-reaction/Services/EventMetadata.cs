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

using System.Diagnostics.Tracing;
using System.Text.Json;
using Drasi.Reaction.SDK.Models.QueryOutput;
namespace Drasi.Reactions.Debezium.Services;
class EventMetadata
{
	public string Connector { get; }
	public string QueryId { get; }
	public long Seq { get; }
	public long TsMs { get; }
	public string Version { get; }

	public EventMetadata(ChangeEvent evt)
	{
		var queryId = evt.QueryId;
		// Extract metadata from the event
		var tracking = (JsonElement)evt.Metadata["tracking"];
		var query = tracking.GetProperty("query");
		var ts_ms = query.GetProperty("queryEnd_ms").GetInt64();

		
		var source = tracking.GetProperty("source");
		var seq = source.GetProperty("seq").GetInt64();

		Connector = "drasi";
		QueryId = queryId ?? throw new Exception("QueryId is null");
		Seq = seq;
		TsMs = ts_ms;
		Version = "preview.1";
	}
}
