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


// This class is required to overcome the limitation that the standard GraphSON2Reader does not support
// deserializing the numeric data returned by Cosmos Gremlin API. 
// Explained here: https://stackoverflow.com/questions/68092798/gremlin-net-deserialize-number-property/72316108#72316108

using Gremlin.Net.Structure.IO.GraphSON;
using System.Text.Json;

namespace Drasi.Reactions.Gremlin.Services;
public class CustomGraphSON2Reader : GraphSON2Reader
{
	public override dynamic ToObject(JsonElement graphSon) =>
	  graphSon.ValueKind switch
	  {
		  JsonValueKind.Number when graphSon.TryGetInt32(out var intValue) => intValue,
		  JsonValueKind.Number when graphSon.TryGetInt64(out var longValue) => longValue,
		  JsonValueKind.Number when graphSon.TryGetDecimal(out var decimalValue) => decimalValue,

		  _ => base.ToObject(graphSon)
	  };
}