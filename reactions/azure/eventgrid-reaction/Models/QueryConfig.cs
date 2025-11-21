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

namespace Drasi.Reactions.EventGrid.Models
{
    /// <summary>
    /// Configuration for templates per query per change type.
    /// Used when format is set to "template".
    /// </summary>
    public class QueryConfig
    {
        /// <summary>
        /// Template for formatting added results.
        /// </summary>
        [JsonPropertyName("added")]
        public string? Added { get; set; }

        /// <summary>
        /// Template for formatting updated results.
        /// </summary>
        [JsonPropertyName("updated")]
        public string? Updated { get; set; }

        /// <summary>
        /// Template for formatting deleted results.
        /// </summary>
        [JsonPropertyName("deleted")]
        public string? Deleted { get; set; }
    }
}
