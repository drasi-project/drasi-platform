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
using HandlebarsDotNet;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.StorageQueue.Services
{
    public class TemplateFormatter : ITemplateFormatter
    {
        private readonly ILogger<TemplateFormatter> _logger;
        private readonly IHandlebars _handlebars;
        private readonly Dictionary<string, HandlebarsTemplate<object, object>> _templateCache = new();
        private readonly SemaphoreSlim _cacheUpdateLock = new(1, 1);

        public TemplateFormatter(ILogger<TemplateFormatter> logger)
        {
            _logger = logger;
            _handlebars = Handlebars.Create();
        }

        public IEnumerable<string> FormatAdded(IEnumerable<Dictionary<string, object>> addedResults, string template)
        {
            var result = new List<string>();
            var compiledTemplate = GetOrCreateTemplate(template);

            foreach (var item in addedResults)
            {
                try
                {
                    var context = new Dictionary<string, object?>
                    {
                        ["after"] = ProcessResultForHandlebars(item)
                    };
                    var output = compiledTemplate(context);
                    result.Add(output);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to format added result with template");
                }
            }

            return result;
        }

        public IEnumerable<string> FormatUpdated(IEnumerable<UpdatedResultElement> updatedResults, string template)
        {
            var result = new List<string>();
            var compiledTemplate = GetOrCreateTemplate(template);

            foreach (var item in updatedResults)
            {
                try
                {
                    var context = new Dictionary<string, object?>
                    {
                        ["before"] = ProcessResultForHandlebars(item.Before),
                        ["after"] = ProcessResultForHandlebars(item.After)
                    };
                    var output = compiledTemplate(context);
                    result.Add(output);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to format updated result with template");
                }
            }

            return result;
        }

        public IEnumerable<string> FormatDeleted(IEnumerable<Dictionary<string, object>> deletedResults, string template)
        {
            var result = new List<string>();
            var compiledTemplate = GetOrCreateTemplate(template);

            foreach (var item in deletedResults)
            {
                try
                {
                    var context = new Dictionary<string, object?>
                    {
                        ["before"] = ProcessResultForHandlebars(item)
                    };
                    var output = compiledTemplate(context);
                    result.Add(output);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to format deleted result with template");
                }
            }

            return result;
        }

        private HandlebarsTemplate<object, object> GetOrCreateTemplate(string template)
        {
            if (_templateCache.TryGetValue(template, out var cachedTemplate))
            {
                return cachedTemplate;
            }

            _cacheUpdateLock.Wait();
            try
            {
                // Double-check pattern
                if (_templateCache.TryGetValue(template, out cachedTemplate))
                {
                    return cachedTemplate;
                }

                // Compile Handlebars template
                var compiledTemplate = _handlebars.Compile(template);
                _templateCache[template] = compiledTemplate;
                return compiledTemplate;
            }
            finally
            {
                _cacheUpdateLock.Release();
            }
        }

        private Dictionary<string, object?> ProcessResultForHandlebars(Dictionary<string, object> result)
        {
            var processed = new Dictionary<string, object?>();
            foreach (var kvp in result)
            {
                // Convert JsonElement values to proper types for Handlebars
                if (kvp.Value is JsonElement element)
                {
                    var converted = ConvertJsonElement(element);
                    // Don't add null or empty string values - Handlebars treats missing keys as falsy
                    if (converted != null && (converted is not string str || !string.IsNullOrEmpty(str)))
                    {
                        processed[kvp.Key] = converted;
                    }
                }
                else if (kvp.Value != null)
                {
                    // Also check for empty strings in non-JsonElement values
                    if (kvp.Value is not string str || !string.IsNullOrEmpty(str))
                    {
                        processed[kvp.Key] = kvp.Value;
                    }
                }
                // Skip null and empty values entirely so Handlebars {{#if}} works correctly
            }
            return processed;
        }

        private static object? ConvertJsonElement(JsonElement element)
        {
            return element.ValueKind switch
            {
                JsonValueKind.String => element.GetString()!,
                JsonValueKind.Number => element.TryGetInt32(out var intVal) ? intVal : 
                                       element.TryGetInt64(out var longVal) ? longVal : element.GetDouble(),
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                JsonValueKind.Null => null,
                JsonValueKind.Object => element.GetRawText(),
                JsonValueKind.Array => element.GetRawText(),
                _ => element.GetRawText()
            };
        }
    }
}
