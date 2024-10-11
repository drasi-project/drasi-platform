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
    public class ChangeFormatter : IChangeFormatter
    {
        public IEnumerable<JObject> FormatAdd(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input)
        {
            var result = new List<JObject>();
            foreach (var inputItem in input)
            {
                var outputItem = new JObject
                {
                    ["op"] = "i",
                    ["ts_ms"] = timestamp,
                    ["seq"] = sequence
                };

                var source = new JObject();
                source["db"] = "Drasi";
                source["table"] = queryId;

                var payload = new JObject();
                payload["source"] = source;
                payload["before"] = null;
                payload["after"] = inputItem;

                outputItem["payload"] = payload;

                result.Add(outputItem);
            }

            return result;
        }

        public IEnumerable<JObject> FormatUpdate(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input)
        {
            var result = new List<JObject>();
            foreach (var inputItem in input)
            {
                var outputItem = new JObject
                {
                    ["op"] = "u",
                    ["ts_ms"] = timestamp,
                    ["seq"] = sequence
                };

                var source = new JObject();
                source["db"] = "Drasi";
                source["table"] = queryId;

                var payload = new JObject();
                payload["source"] = source;
                payload["before"] = inputItem["before"];
                payload["after"] = inputItem["after"];

                outputItem["payload"] = payload;

                result.Add(outputItem);
            }

            return result;
        }

        public IEnumerable<JObject> FormatDelete(string queryId, ulong sequence, ulong timestamp, IEnumerable<JToken> input)
        {
            var result = new List<JObject>();
            foreach (var inputItem in input)
            {
                var outputItem = new JObject
                {
                    ["op"] = "d",
                    ["ts_ms"] = timestamp,
                    ["seq"] = sequence
                };

                var source = new JObject();
                source["db"] = "Drasi";
                source["table"] = queryId;

                var payload = new JObject();
                payload["source"] = source;
                payload["before"] = inputItem;
                payload["after"] = null;

                outputItem["payload"] = payload;

                result.Add(outputItem);
            }

            return result;
        }

        public JObject FormatReloadRow(string queryId, JsonDocument input) 
        {
            if (input.RootElement.TryGetProperty("header", out var header))
            {
                
                var outputItem = new JObject
                {
                    ["op"] = "h",
                    ["ts_ms"] = header.GetProperty("timestamp").GetUInt64(),
                    ["seq"] = header.GetProperty("sequence").GetUInt64()
                };

                return outputItem;
            }

            if (input.RootElement.TryGetProperty("data", out var data))
            {   
                var outputItem = new JObject
                {
                    ["op"] = "r",
                    ["payload"] = new JObject
                    {
                        ["source"] = new JObject
                        {
                            ["db"] = "Drasi",
                            ["table"] = queryId
                        },
                        ["before"] = null,
                        ["after"] = JObject.Parse(data.GetRawText()) //temp workaround
                    }
                };

                return outputItem;
            }

            throw new NotSupportedException($"Unknown message type");
        }

        public JObject FormatControlSignal(string queryId, ulong sequence, ulong timestamp, JToken input)
        {
            var outputItem = new JObject
            {
                ["op"] = "x",
                ["ts_ms"] = timestamp,
                ["seq"] = sequence,
                ["payload"] = input
            };

            return outputItem;
        }
    }
}
