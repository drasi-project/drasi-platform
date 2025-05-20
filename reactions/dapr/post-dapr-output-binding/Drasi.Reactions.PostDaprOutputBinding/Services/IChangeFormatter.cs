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

using System.Text.Json;
using Drasi.Reaction.SDK.Models.QueryOutput;

namespace Drasi.Reactions.PostDaprOutputBinding.Services;

/// <summary>
/// Interface for formatting change events.
/// </summary>
public interface IChangeFormatter
{
    /// <summary>
    /// Formats a change event into a collection of JSON elements.
    /// </summary>
    /// <param name="evt">The change event to format</param>
    /// <returns>A collection of formatted JSON elements</returns>
    IEnumerable<JsonElement> Format(ChangeEvent evt);
}