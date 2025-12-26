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

using Drasi.Reactions.EventBridge.Models;
using Drasi.Reaction.SDK.Models.QueryOutput;
using HandlebarsDotNet;
using System.Text.Json;

namespace Drasi.Reactions.EventBridge.Services
{
    /// <summary>
    /// Represents a formatted template result with data and optional metadata.
    /// </summary>
    public class TemplateResult
    {
        public JsonElement Data { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
    }

    public class TemplateChangeFormatter
    {
        private readonly IHandlebars _handlebars;

        public TemplateChangeFormatter()
        {
            _handlebars = Handlebars.Create();
        }

        public IEnumerable<TemplateResult> Format(ChangeEvent evt, QueryConfig? queryConfig)
        {
            if (queryConfig == null)
            {
                return Enumerable.Empty<TemplateResult>();
            }

            var result = new List<TemplateResult>();

            // Process added results
            if (queryConfig.Added != null && !string.IsNullOrEmpty(queryConfig.Added.Template))
            {
                var addedTemplate = _handlebars.Compile(queryConfig.Added.Template);
                foreach (var added in evt.AddedResults)
                {
                    var templateData = new
                    {
                        after = added
                    };

                    var output = addedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(new TemplateResult
                    {
                        Data = doc.RootElement.Clone(),
                        Metadata = queryConfig.Added.Metadata
                    });
                }
            }

            // Process updated results
            if (queryConfig.Updated != null && !string.IsNullOrEmpty(queryConfig.Updated.Template))
            {
                var updatedTemplate = _handlebars.Compile(queryConfig.Updated.Template);
                foreach (var updated in evt.UpdatedResults)
                {
                    var templateData = new
                    {
                        before = updated.Before,
                        after = updated.After
                    };

                    var output = updatedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(new TemplateResult
                    {
                        Data = doc.RootElement.Clone(),
                        Metadata = queryConfig.Updated.Metadata
                    });
                }
            }

            // Process deleted results
            if (queryConfig.Deleted != null && !string.IsNullOrEmpty(queryConfig.Deleted.Template))
            {
                var deletedTemplate = _handlebars.Compile(queryConfig.Deleted.Template);
                foreach (var deleted in evt.DeletedResults)
                {
                    var templateData = new
                    {
                        before = deleted
                    };

                    var output = deletedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(new TemplateResult
                    {
                        Data = doc.RootElement.Clone(),
                        Metadata = queryConfig.Deleted.Metadata
                    });
                }
            }

            return result;
        }
    }
}
