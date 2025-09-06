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

using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Implementation of embedding service using Semantic Kernel text embedding services
/// </summary>
public class EmbeddingService : IEmbeddingService
{
    private readonly IEmbeddingGenerator<string, Embedding<float>> _embeddingGenerator;
    private readonly ILogger<EmbeddingService> _logger;
    private readonly int? _dimensions;

    public EmbeddingService(
        IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator,
        ILogger<EmbeddingService> logger)
    {
        _embeddingGenerator = embeddingGenerator ?? throw new ArgumentNullException(nameof(embeddingGenerator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Try to determine dimensions from the service
        _dimensions = TryGetDimensions();
    }

    public int? Dimensions => _dimensions;

    public async Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new ArgumentException("Text cannot be null or whitespace", nameof(text));
        }

        try
        {
            _logger.LogDebug("Generating embedding for text of length {Length}", text.Length);
            
            var embeddings = await _embeddingGenerator.GenerateAsync(new[] { text }, cancellationToken: cancellationToken);
            var embedding = embeddings.First();
            
            _logger.LogDebug("Successfully generated embedding with {Dimensions} dimensions", embedding.Vector.Length);
            
            return embedding.Vector;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate embedding for text");
            throw;
        }
    }

    public async Task<IReadOnlyList<ReadOnlyMemory<float>>> GenerateEmbeddingsAsync(IList<string> texts, CancellationToken cancellationToken = default)
    {
        if (texts == null || texts.Count == 0)
        {
            return Array.Empty<ReadOnlyMemory<float>>();
        }

        try
        {
            _logger.LogDebug("Generating embeddings for {Count} texts", texts.Count);
            
            var embeddings = await _embeddingGenerator.GenerateAsync(texts, cancellationToken: cancellationToken);
            _logger.LogInformation("Generated embedding for {Count} texts", embeddings.Count);
            
            return embeddings.Select(e => e.Vector).ToArray();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate embeddings for {Count} texts", texts.Count);
            throw;
        }
    }

    private int? TryGetDimensions()
    {
        try
        {
            // For most embedding services, we can't know dimensions until we generate an embedding
            // Some services might expose this information, but it's not standardized
            return null;
        }
        catch
        {
            return null;
        }
    }
}