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
using Drasi.Reactions.EventBridge.Models.Unpacked;
using Drasi.Reaction.SDK.Models.QueryOutput;
using HandlebarsDotNet;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.EventBridge.Services
{
    public class HandlebarsChangeFormatter
    {
        private readonly ILogger<HandlebarsChangeFormatter> _logger;
        private readonly IHandlebars _handlebars;
        private readonly Dictionary<string, HandlebarsTemplate<object, object>> _templateCache = new();
        private readonly SemaphoreSlim _cacheUpdateLock = new(1, 1);

        public HandlebarsChangeFormatter(ILogger<HandlebarsChangeFormatter> logger)
        {
            _logger = logger;
            _handlebars = Handlebars.Create();
        }

        public IEnumerable<ChangeNotification> Format(ChangeEvent evt, QueryConfig? queryConfig)
        {
            var result = new List<ChangeNotification>();

            if (queryConfig == null)
            {
                _logger.LogWarning("No query config provided for Handlebars formatting");
                return result;
            }

            // Process added results
            if (!string.IsNullOrEmpty(queryConfig.AddedTemplate))
            {
                foreach (var inputItem in evt.AddedResults)
                {
                    try
                    {
                        var template = GetOrCreateTemplate(queryConfig.AddedTemplate);
                        var processedResult = ProcessResultForHandlebars(inputItem);
                        var formattedData = template(new { after = processedResult });
                        
                        var outputItem = new ChangeNotification
                        {
                            Op = ChangeNotificationOp.I,
                            TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                            Payload = new PayloadClass()
                            {
                                Source = new SourceClass()
                                {
                                    QueryId = evt.QueryId,
                                    TsMs = evt.SourceTimeMs
                                },
                                After = new Dictionary<string, object> { { "formatted", formattedData } }
                            }
                        };
                        result.Add(outputItem);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to format added result using Handlebars template");
                        throw;
                    }
                }
            }

            // Process updated results
            if (!string.IsNullOrEmpty(queryConfig.UpdatedTemplate))
            {
                foreach (var inputItem in evt.UpdatedResults)
                {
                    try
                    {
                        var template = GetOrCreateTemplate(queryConfig.UpdatedTemplate);
                        var processedBefore = ProcessResultForHandlebars(inputItem.Before);
                        var processedAfter = ProcessResultForHandlebars(inputItem.After);
                        var formattedData = template(new { before = processedBefore, after = processedAfter });
                        
                        var outputItem = new ChangeNotification
                        {
                            Op = ChangeNotificationOp.U,
                            TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                            Payload = new PayloadClass()
                            {
                                Source = new SourceClass()
                                {
                                    QueryId = evt.QueryId,
                                    TsMs = evt.SourceTimeMs
                                },
                                Before = new Dictionary<string, object> { { "formatted", formattedData } },
                                After = new Dictionary<string, object> { { "formatted", formattedData } }
                            }
                        };
                        result.Add(outputItem);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to format updated result using Handlebars template");
                        throw;
                    }
                }
            }

            // Process deleted results
            if (!string.IsNullOrEmpty(queryConfig.DeletedTemplate))
            {
                foreach (var inputItem in evt.DeletedResults)
                {
                    try
                    {
                        var template = GetOrCreateTemplate(queryConfig.DeletedTemplate);
                        var processedResult = ProcessResultForHandlebars(inputItem);
                        var formattedData = template(new { before = processedResult });
                        
                        var outputItem = new ChangeNotification
                        {
                            Op = ChangeNotificationOp.D,
                            TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                            Payload = new PayloadClass()
                            {
                                Source = new SourceClass()
                                {
                                    QueryId = evt.QueryId,
                                    TsMs = evt.SourceTimeMs
                                },
                                Before = new Dictionary<string, object> { { "formatted", formattedData } }
                            }
                        };
                        result.Add(outputItem);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to format deleted result using Handlebars template");
                        throw;
                    }
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

        private static object ConvertJsonElement(JsonElement element)
        {
            return element.ValueKind switch
            {
                JsonValueKind.String => element.GetString()!,
                JsonValueKind.Number => element.TryGetInt32(out var intVal) ? intVal : 
                                       element.TryGetInt64(out var longVal) ? longVal : element.GetDouble(),
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                JsonValueKind.Null => null!,
                JsonValueKind.Object => element.GetRawText(),
                JsonValueKind.Array => element.GetRawText(),
                _ => element.GetRawText()
            };
        }
    }
}
