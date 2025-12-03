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

namespace Drasi.Reactions.EventBridge.Services;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;


public class CloudEvent
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public object Data { get; set; } = new object();

    [JsonPropertyName("specversion")]
    public string Version { get; set; } = "1.0";

    /// <summary>
    /// Metadata extension attributes for the cloud event.
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, object>? ExtensionData { get; set; }

    /// <summary>
    /// Sets metadata as extension attributes.
    /// </summary>
    [JsonIgnore]
    public Dictionary<string, string>? Metadata
    {
        set
        {
            if (value != null)
            {
                ExtensionData ??= new Dictionary<string, object>();
                foreach (var kvp in value)
                {
                    ExtensionData[kvp.Key] = kvp.Value;
                }
            }
        }
    }
}