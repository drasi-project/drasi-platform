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

﻿using System.Text.Json;
using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;

namespace SignalrReaction.Services
{
    public interface IChangeFormatter
    {
        IEnumerable<JObject> FormatAdd(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input);
        IEnumerable<JObject> FormatDelete(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input);
        IEnumerable<JObject> FormatUpdate(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input);

        JObject FormatReloadRow(string queryId, JsonDocument input);

        JObject FormatControlSignal(string queryId, ulong sequence, ulong timestamp, JToken input);
    }
}