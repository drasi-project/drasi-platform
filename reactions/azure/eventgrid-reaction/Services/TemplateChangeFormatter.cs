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
using Drasi.Reactions.EventGrid.Models;
using HandlebarsDotNet;
using System.Text.Json;

namespace Drasi.Reactions.EventGrid.Services
{
    public class TemplateChangeFormatter
    {
        private readonly IHandlebars _handlebars;

        public TemplateChangeFormatter()
        {
            _handlebars = Handlebars.Create();
        }

        public IEnumerable<JsonElement> Format(ChangeEvent evt, QueryConfig? queryConfig)
        {
            if (queryConfig == null)
            {
                return Enumerable.Empty<JsonElement>();
            }

            var result = new List<JsonElement>();

            // Process added results
            if (!string.IsNullOrEmpty(queryConfig.Added))
            {
                var addedTemplate = _handlebars.Compile(queryConfig.Added);
                foreach (var added in evt.AddedResults)
                {
                    var templateData = new
                    {
                        after = added
                    };

                    var output = addedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(doc.RootElement.Clone());
                }
            }

            // Process updated results
            if (!string.IsNullOrEmpty(queryConfig.Updated))
            {
                var updatedTemplate = _handlebars.Compile(queryConfig.Updated);
                foreach (var updated in evt.UpdatedResults)
                {
                    var templateData = new
                    {
                        before = updated.Before,
                        after = updated.After
                    };

                    var output = updatedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(doc.RootElement.Clone());
                }
            }

            // Process deleted results
            if (!string.IsNullOrEmpty(queryConfig.Deleted))
            {
                var deletedTemplate = _handlebars.Compile(queryConfig.Deleted);
                foreach (var deleted in evt.DeletedResults)
                {
                    var templateData = new
                    {
                        before = deleted
                    };

                    var output = deletedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(doc.RootElement.Clone());
                }
            }

            return result;
        }
    }
}
