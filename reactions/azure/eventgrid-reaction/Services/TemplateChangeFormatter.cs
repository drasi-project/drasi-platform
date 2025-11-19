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
using HandlebarsDotNet;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace Drasi.Reactions.EventGrid.Services
{
    public class TemplateChangeFormatter : IChangeFormatter
    {
        private readonly IHandlebars _handlebars;
        private readonly HandlebarsTemplate<object, object>? _addedTemplate;
        private readonly HandlebarsTemplate<object, object>? _updatedTemplate;
        private readonly HandlebarsTemplate<object, object>? _deletedTemplate;

        public TemplateChangeFormatter(IConfiguration config)
        {
            _handlebars = Handlebars.Create();
            
            var addedTemplateStr = config.GetValue<string>("addedTemplate");
            if (!string.IsNullOrEmpty(addedTemplateStr))
            {
                _addedTemplate = _handlebars.Compile(addedTemplateStr);
            }

            var updatedTemplateStr = config.GetValue<string>("updatedTemplate");
            if (!string.IsNullOrEmpty(updatedTemplateStr))
            {
                _updatedTemplate = _handlebars.Compile(updatedTemplateStr);
            }

            var deletedTemplateStr = config.GetValue<string>("deletedTemplate");
            if (!string.IsNullOrEmpty(deletedTemplateStr))
            {
                _deletedTemplate = _handlebars.Compile(deletedTemplateStr);
            }
        }

        public IEnumerable<JsonElement> Format(ChangeEvent evt)
        {
            var result = new List<JsonElement>();

            // Process added results
            if (_addedTemplate != null)
            {
                foreach (var added in evt.AddedResults)
                {
                    var templateData = new
                    {
                        queryId = evt.QueryId,
                        sequence = evt.Sequence,
                        sourceTimeMs = evt.SourceTimeMs,
                        after = added
                    };

                    var output = _addedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(doc.RootElement.Clone());
                }
            }

            // Process updated results
            if (_updatedTemplate != null)
            {
                foreach (var updated in evt.UpdatedResults)
                {
                    var templateData = new
                    {
                        queryId = evt.QueryId,
                        sequence = evt.Sequence,
                        sourceTimeMs = evt.SourceTimeMs,
                        before = updated.Before,
                        after = updated.After
                    };

                    var output = _updatedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(doc.RootElement.Clone());
                }
            }

            // Process deleted results
            if (_deletedTemplate != null)
            {
                foreach (var deleted in evt.DeletedResults)
                {
                    var templateData = new
                    {
                        queryId = evt.QueryId,
                        sequence = evt.Sequence,
                        sourceTimeMs = evt.SourceTimeMs,
                        before = deleted
                    };

                    var output = _deletedTemplate(templateData);
                    using var doc = JsonDocument.Parse(output);
                    result.Add(doc.RootElement.Clone());
                }
            }

            return result;
        }
    }
}
