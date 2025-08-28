// Copyright 2025 The Drasi Authors.
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

using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.RegularExpressions;
using HandlebarsDotNet;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Implementation of document processor for converting query results to vector documents
/// </summary>
public class DocumentProcessor : IDocumentProcessor
{
    private readonly IEmbeddingService _embeddingService;
    private readonly ILogger<DocumentProcessor> _logger;
    private readonly Dictionary<string, HandlebarsTemplate<object, object>> _templateCache = new();
    private readonly SemaphoreSlim _cacheUpdateLock = new(1, 1);
    private readonly IHandlebars _handlebars;

    public DocumentProcessor(
        IEmbeddingService embeddingService,
        ILogger<DocumentProcessor> logger)
    {
        _embeddingService = embeddingService ?? throw new ArgumentNullException(nameof(embeddingService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _handlebars = Handlebars.Create();
    }

    public async Task<IEnumerable<VectorDocument>> ProcessDocumentsAsync(
        IEnumerable<Dictionary<string, object>> results,
        QueryConfig config,
        CancellationToken cancellationToken = default)
    {
        var resultList = results.ToList();
        if (resultList.Count == 0)
        {
            return Enumerable.Empty<VectorDocument>();
        }

        _logger.LogDebug("Processing {Count} documents for vectorization", resultList.Count);

        var documents = new List<VectorDocument>();
        var textsToEmbed = new List<string>();

        // First pass: extract keys, generate texts, and collect metadata
        foreach (var result in resultList)
        {
            try
            {
                var key = ExtractKey(result, config);
                var text = GenerateDocumentText(result, config);
                var title = GenerateTitle(result, config);

                var doc = new VectorDocument
                {
                    Key = key,
                    Content = text,
                    Title = title,
                    Timestamp = DateTimeOffset.UtcNow,
                    Source = "drasi"
                };

                documents.Add(doc);
                textsToEmbed.Add(text);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to process document with data: {Data}", 
                    JsonSerializer.Serialize(result));
            }
        }

        if (documents.Count == 0)
        {
            _logger.LogWarning("No valid documents to process after extraction");
            return Enumerable.Empty<VectorDocument>();
        }

        // Second pass: generate embeddings in batch
        try
        {
            var embeddings = await _embeddingService.GenerateEmbeddingsAsync(textsToEmbed, cancellationToken);

            for (int i = 0; i < documents.Count && i < embeddings.Count; i++)
            {
                documents[i].Vector = embeddings[i];
            }

            _logger.LogInformation("Successfully processed {Count} documents with embeddings", documents.Count);
            return documents;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate embeddings for documents");
            throw;
        }
    }

    public string ExtractKey(Dictionary<string, object> result, QueryConfig config)
    {
        if (string.IsNullOrEmpty(config.KeyField))
        {
            throw new ArgumentException("Key field is not configured", nameof(config));
        }

        if (!result.TryGetValue(config.KeyField, out var keyValue) || keyValue == null)
        {
            throw new ArgumentException($"Key field '{config.KeyField}' not found or null in result");
        }

        return keyValue.ToString()!;
    }

    public string GenerateDocumentText(Dictionary<string, object> result, QueryConfig config)
    {
        if (string.IsNullOrEmpty(config.DocumentTemplate))
        {
            throw new ArgumentException("Document template is not configured", nameof(config));
        }

        try
        {
            var compiledTemplate = GetOrCreateTemplate(config.DocumentTemplate);
            var processedResult = ProcessResultForHandlebars(result);
            return compiledTemplate(processedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate document text from template: {Template}", config.DocumentTemplate);
            throw new InvalidOperationException($"Failed to generate document text: {ex.Message}", ex);
        }
    }

    public string? GenerateTitle(Dictionary<string, object> result, QueryConfig config)
    {
        if (string.IsNullOrEmpty(config.TitleTemplate))
        {
            return null;
        }

        try
        {
            var compiledTemplate = GetOrCreateTemplate(config.TitleTemplate);
            var processedResult = ProcessResultForHandlebars(result);
            return compiledTemplate(processedResult);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to generate title from template: {Template}", config.TitleTemplate);
            return null;
        }
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