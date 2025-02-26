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

using System.Text.Json.Serialization;

namespace Drasi.Source.SDK.Models;

/// <summary>
/// A request to bootstrap a continuous query
/// </summary>
public class BootstrapRequest
{
    /// <summary>
    /// Labels of nodes to bootstrap requested by the query
    /// </summary>
    [JsonPropertyName("nodeLabels")]
    public List<string> NodeLabels { get; set; } = [];

    /// <summary>
    /// Labels of relations to bootstrap requested by the query
    /// </summary>
    [JsonPropertyName("relLabels")]
    public List<string> RelationLabels { get; set; } = [];

}