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

using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.StorageQueue.Models;

namespace Drasi.Reactions.StorageQueue.Services
{
    public interface ITemplateFormatter
    {
        IEnumerable<string> FormatAdded(IEnumerable<Dictionary<string, object>> addedResults, string template);
        IEnumerable<string> FormatUpdated(IEnumerable<UpdatedResultElement> updatedResults, string template);
        IEnumerable<string> FormatDeleted(IEnumerable<Dictionary<string, object>> deletedResults, string template);
    }
}
