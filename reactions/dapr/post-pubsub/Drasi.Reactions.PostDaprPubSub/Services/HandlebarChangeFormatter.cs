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
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Drasi.Reactions.PostDaprPubSub.Services;

/// <summary>
/// Formatter that uses Handlebars templates to format change events.
/// </summary>
public class HandlebarChangeFormatter : IChangeFormatter
{
    private readonly HandlebarsTemplate<object, object>? _addedTemplate;
    private readonly HandlebarsTemplate<object, object>? _updatedTemplate;
    private readonly HandlebarsTemplate<object, object>? _deletedTemplate;
    private readonly string _queryId;
    private readonly ILogger<HandlebarChangeFormatter> _logger;

    public HandlebarChangeFormatter(
        TemplateConfig templates,
        string queryId,
        ILogger<HandlebarChangeFormatter> logger)
    {
        _queryId = queryId ?? throw new ArgumentNullException(nameof(queryId));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        if (templates == null)
        {
            throw new ArgumentNullException(nameof(templates));
        }

        var handlebars = Handlebars.Create();
        
        if (!string.IsNullOrEmpty(templates.Added))
        {
            _addedTemplate = handlebars.Compile(templates.Added);
        }
        
        if (!string.IsNullOrEmpty(templates.Updated))
        {
            _updatedTemplate = handlebars.Compile(templates.Updated);
        }
        
        if (!string.IsNullOrEmpty(templates.Deleted))
        {
            _deletedTemplate = handlebars.Compile(templates.Deleted);
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
                try
                {
                    var context = new { after = added, queryId = evt.QueryId };
                    var rendered = _addedTemplate(context);
                    using var doc = JsonDocument.Parse(rendered);
                    result.Add(doc.RootElement.Clone());
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing added template for query {QueryId}", evt.QueryId);
                }
            }
        }
        
        // Process updated results
        if (_updatedTemplate != null)
        {
            foreach (var updated in evt.UpdatedResults)
            {
                try
                {
                    var context = new { before = updated.Before, after = updated.After, queryId = evt.QueryId };
                    var rendered = _updatedTemplate(context);
                    using var doc = JsonDocument.Parse(rendered);
                    result.Add(doc.RootElement.Clone());
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing updated template for query {QueryId}", evt.QueryId);
                }
            }
        }
        
        // Process deleted results
        if (_deletedTemplate != null)
        {
            foreach (var deleted in evt.DeletedResults)
            {
                try
                {
                    var context = new { before = deleted, queryId = evt.QueryId };
                    var rendered = _deletedTemplate(context);
                    using var doc = JsonDocument.Parse(rendered);
                    result.Add(doc.RootElement.Clone());
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing deleted template for query {QueryId}", evt.QueryId);
                }
            }
        }

        return result;
    }
}
