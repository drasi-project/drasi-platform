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
public class HandlebarsChangeFormatter : IChangeFormatter
{
    private readonly QueryConfig _config;
    private readonly ILogger<HandlebarsChangeFormatter> _logger;
    private readonly IHandlebars _handlebars;
    private readonly Dictionary<string, HandlebarsTemplate<object, object>> _templateCache = new();
    private readonly object _cacheLock = new();

    public HandlebarsChangeFormatter(QueryConfig config, ILogger<HandlebarsChangeFormatter> logger)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _handlebars = Handlebars.Create();
    }

    public IEnumerable<JsonElement> Format(ChangeEvent evt)
    {
        var result = new List<JsonElement>();

        // Process Added results
        if (!string.IsNullOrEmpty(_config.AddedResultsTemplate))
        {
            foreach (var item in evt.AddedResults)
            {
                var formatted = ApplyTemplate(_config.AddedResultsTemplate, item);
                if (formatted != null)
                {
                    result.Add(formatted.Value);
                }
            }
        }

        // Process Updated results
        if (!string.IsNullOrEmpty(_config.UpdatedResultsTemplate))
        {
            foreach (var item in evt.UpdatedResults)
            {
                // For updates, provide both before and after
                var context = new Dictionary<string, object>
                {
                    { "before", item.Before },
                    { "after", item.After }
                };
                var formatted = ApplyTemplate(_config.UpdatedResultsTemplate, context);
                if (formatted != null)
                {
                    result.Add(formatted.Value);
                }
            }
        }

        // Process Deleted results
        if (!string.IsNullOrEmpty(_config.DeletedResultsTemplate))
        {
            foreach (var item in evt.DeletedResults)
            {
                var formatted = ApplyTemplate(_config.DeletedResultsTemplate, item);
                if (formatted != null)
                {
                    result.Add(formatted.Value);
                }
            }
        }

        return result;
    }

    private JsonElement? ApplyTemplate(string template, object data)
    {
        try
        {
            var compiledTemplate = GetOrCreateTemplate(template);
            var processedData = ProcessDataForHandlebars(data);
            var output = compiledTemplate(processedData);
            
            // Parse the output as JSON
            using var doc = JsonDocument.Parse(output);
            return doc.RootElement.Clone();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to apply template: {Template}", template);
            throw new InvalidOperationException($"Failed to apply template: {ex.Message}", ex);
        }
    }

    private HandlebarsTemplate<object, object> GetOrCreateTemplate(string template)
    {
        lock (_cacheLock)
        {
            if (_templateCache.TryGetValue(template, out var cachedTemplate))
            {
                return cachedTemplate;
            }

            var compiledTemplate = _handlebars.Compile(template);
            _templateCache[template] = compiledTemplate;
            return compiledTemplate;
        }
    }

    private object ProcessDataForHandlebars(object data)
    {
        if (data is Dictionary<string, object> dict)
        {
            return ProcessDictForHandlebars(dict);
        }
        
        return data;
    }

    private Dictionary<string, object?> ProcessDictForHandlebars(Dictionary<string, object> dict)
    {
        var processed = new Dictionary<string, object?>();
        foreach (var kvp in dict)
        {
            if (kvp.Value is JsonElement element)
            {
                processed[kvp.Key] = ConvertJsonElement(element);
            }
            else if (kvp.Value is Dictionary<string, object> nestedDict)
            {
                processed[kvp.Key] = ProcessDictForHandlebars(nestedDict);
            }
            else
            {
                processed[kvp.Key] = kvp.Value;
            }
        }
        return processed;
    }

    private static object? ConvertJsonElement(JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number => element.TryGetInt32(out var intVal) ? intVal :
                                   element.TryGetInt64(out var longVal) ? longVal : element.GetDouble(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null => null,
            JsonValueKind.Object => ConvertJsonObject(element),
            JsonValueKind.Array => ConvertJsonArray(element),
            _ => element.GetRawText()
        };
    }

    private static Dictionary<string, object?> ConvertJsonObject(JsonElement element)
    {
        var result = new Dictionary<string, object?>();
        foreach (var property in element.EnumerateObject())
        {
            result[property.Name] = ConvertJsonElement(property.Value);
        }
        return result;
    }

    private static List<object?> ConvertJsonArray(JsonElement element)
    {
        var result = new List<object?>();
        foreach (var item in element.EnumerateArray())
        {
            result.Add(ConvertJsonElement(item));
        }
        return result;
    }
}
