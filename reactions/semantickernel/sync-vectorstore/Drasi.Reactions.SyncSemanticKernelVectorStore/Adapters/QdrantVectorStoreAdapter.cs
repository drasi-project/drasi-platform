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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel.Connectors.Qdrant;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Factories;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Adapters;

/// <summary>
/// Adapter for Qdrant vector store using runtime configuration
/// </summary>
public class QdrantVectorStoreAdapter : BaseVectorStoreAdapter, IVectorStoreAdapter
{
    private readonly QdrantVectorStore _vectorStore;
    private readonly Dictionary<string, IVectorCollectionAdapter> _collectionCache = new();
    private readonly SemaphoreSlim _cacheLock = new(1, 1);
    private new readonly ILogger<QdrantVectorStoreAdapter> _logger;

    public QdrantVectorStoreAdapter(
        QdrantVectorStore vectorStore,
        VectorStoreConfiguration configuration,
        ILogger<QdrantVectorStoreAdapter> logger)
        : base(configuration, logger)
    {
        _vectorStore = vectorStore ?? throw new ArgumentNullException(nameof(vectorStore));
        _logger = logger;
    }

    public async Task<IVectorCollectionAdapter> GetOrCreateCollectionAsync(
        string collectionName,
        QueryConfig config,
        CancellationToken cancellationToken = default)
    {
        await _cacheLock.WaitAsync(cancellationToken);
        try
        {
            if (_collectionCache.TryGetValue(collectionName, out var cachedAdapter))
            {
                return cachedAdapter;
            }

            _logger.LogDebug("Getting or creating Qdrant collection '{CollectionName}' with {Dimensions} dimensions", 
                collectionName, _configuration.EmbeddingDimensions);
            
            // Build runtime definition - Qdrant uses Guid keys
            var definition = BuildCollectionDefinition(config, typeof(Guid), typeof(Dictionary<string, object?>));
            
            // Override distance function mapping for Qdrant
            if (definition.Properties != null)
            {
                var vectorProp = definition.Properties.OfType<VectorStoreVectorProperty>().FirstOrDefault();
                if (vectorProp != null)
                {
                    vectorProp.DistanceFunction = MapQdrantDistanceFunction(_configuration.DistanceFunction);
                    // Qdrant only supports HNSW
                    vectorProp.IndexKind = IndexKind.Hnsw;
                }
            }
            
            // Get dynamic collection - required for Dictionary<string, object?> records
            // QdrantDynamicCollection is QdrantCollection<object, Dictionary<string, object?>>
            var collection = _vectorStore.GetDynamicCollection(collectionName, definition);
            
            if (config.CreateCollection)
            {
                try
                {
                    await collection.EnsureCollectionExistsAsync(cancellationToken);
                    
                    _logger.LogInformation(
                        "Ensured Qdrant collection '{CollectionName}' exists with {Dimensions} dimensions",
                        collectionName, _configuration.EmbeddingDimensions);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, 
                        "Failed to ensure Qdrant collection '{CollectionName}' exists. The collection may already exist with different settings.",
                        collectionName);
                    throw;
                }
            }

            var adapter = new QdrantCollectionAdapter(collection, _logger);
            _collectionCache[collectionName] = adapter;
            
            return adapter;
        }
        finally
        {
            _cacheLock.Release();
        }
    }

    public async Task<bool> CollectionExistsAsync(
        string collectionName,
        CancellationToken cancellationToken = default)
    {
        await _cacheLock.WaitAsync(cancellationToken);
        try
        {
            // Check if collection exists in cache
            if (_collectionCache.ContainsKey(collectionName))
            {
                return true;
            }
            
            // For Qdrant, we could query the service to check
            // but for now we'll just check our cache
            return false;
        }
        finally
        {
            _cacheLock.Release();
        }
    }

    public async Task EnsureCollectionDeletedAsync(
        string collectionName,
        CancellationToken cancellationToken = default)
    {
        await DeleteCollectionAsync(collectionName, cancellationToken);
    }

    public async Task<bool> DeleteCollectionAsync(
        string collectionName,
        CancellationToken cancellationToken = default)
    {
        await _cacheLock.WaitAsync(cancellationToken);
        try
        {
            // Remove from cache
            _collectionCache.Remove(collectionName);
            
            _logger.LogDebug("Attempting to delete Qdrant collection '{CollectionName}'", collectionName);
            
            // Get minimal collection reference for deletion
            var minimalDefinition = new VectorStoreCollectionDefinition
            {
                Properties = new VectorStoreProperty[]
                {
                    new VectorStoreKeyProperty("Key", typeof(Guid)),
                    new VectorStoreVectorProperty("Vector", typeof(ReadOnlyMemory<float>), 1)
                }
            };
            
            var collection = _vectorStore.GetDynamicCollection(collectionName, minimalDefinition);
            await collection.EnsureCollectionDeletedAsync(cancellationToken);
            
            _logger.LogInformation("Successfully deleted Qdrant collection '{CollectionName}'", collectionName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete Qdrant collection '{CollectionName}'", collectionName);
            throw;
        }
        finally
        {
            _cacheLock.Release();
        }
    }

    /// <summary>
    /// Maps distance function to Qdrant-supported values
    /// </summary>
    private string MapQdrantDistanceFunction(string? configuredFunction)
    {
        return configuredFunction switch
        {
            "Cosine" => DistanceFunction.CosineSimilarity,
            "CosineSimilarity" => DistanceFunction.CosineSimilarity,
            "CosineDistance" => DistanceFunction.CosineDistance,
            "Euclidean" => DistanceFunction.EuclideanDistance,
            "EuclideanDistance" => DistanceFunction.EuclideanDistance,
            "DotProduct" => DistanceFunction.DotProductSimilarity,
            "DotProductSimilarity" => DistanceFunction.DotProductSimilarity,
            "Manhattan" => DistanceFunction.ManhattanDistance,
            // Qdrant doesn't support Hamming, default to Cosine
            "HammingDistance" => DistanceFunction.CosineSimilarity,
            _ => DistanceFunction.CosineSimilarity
        };
    }
}

/// <summary>
/// Collection adapter for Qdrant that works with QdrantDynamicCollection
/// QdrantDynamicCollection is QdrantCollection<object, Dictionary<string, object?>>
/// </summary>
internal class QdrantCollectionAdapter : IVectorCollectionAdapter
{
    private readonly dynamic _collection;
    private readonly ILogger _logger;
    // Keep a mapping of string keys to Guid keys for consistency
    private readonly Dictionary<string, Guid> _keyMapping = new();
    private readonly string _collectionName;

    public string Name => _collectionName;

    public QdrantCollectionAdapter(
        dynamic collection,
        ILogger logger)
    {
        _collection = collection ?? throw new ArgumentNullException(nameof(collection));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _collectionName = "QdrantCollection"; // Default name, could be passed as parameter
    }

    public async Task<VectorDocument?> GetAsync(
        string key,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var guidKey = GenerateDeterministicGuid(key);
            var record = await _collection.GetAsync(guidKey, null, cancellationToken);
            if (record == null)
            {
                return null;
            }

            return new VectorDocument
            {
                Key = key,
                Content = record.GetValueOrDefault("Content") as string ?? string.Empty,
                Vector = record.GetValueOrDefault("Vector") as ReadOnlyMemory<float>? ?? ReadOnlyMemory<float>.Empty,
                Title = record.GetValueOrDefault("Title") as string ?? string.Empty,
                Timestamp = record.GetValueOrDefault("Timestamp") as DateTimeOffset? ?? DateTimeOffset.UtcNow,
                Source = record.GetValueOrDefault("Source") as string ?? string.Empty
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get document with key '{Key}' from Qdrant collection", key);
            throw;
        }
    }

    public async Task EnsureCollectionExistsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _collection.EnsureCollectionExistsAsync(cancellationToken);
            _logger.LogDebug("Ensured Qdrant collection exists");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to ensure Qdrant collection exists");
            throw;
        }
    }

    public async Task UpsertAsync(IEnumerable<VectorDocument> documents, CancellationToken cancellationToken = default)
    {
        if (!documents.Any())
        {
            _logger.LogDebug("No documents to upsert to Qdrant collection");
            return;
        }

        _logger.LogDebug("Upserting {Count} documents to Qdrant collection", documents.Count());

        try
        {
            // Convert VectorDocuments to dynamic dictionaries with Guid keys
            var records = new List<Dictionary<string, object?>>();
            
            foreach (var doc in documents)
            {
                // Generate deterministic Guid from string key
                Guid guidKey = GenerateDeterministicGuid(doc.Key);
                _keyMapping[doc.Key] = guidKey;
                
                records.Add(new Dictionary<string, object?>
                {
                    ["Key"] = guidKey,
                    ["Content"] = doc.Content,
                    ["Vector"] = doc.Vector,
                    ["Title"] = doc.Title,
                    ["Timestamp"] = doc.Timestamp,
                    ["Source"] = doc.Source
                });
            }

            // Use the SK UpsertAsync method for multiple records
            await _collection.UpsertAsync(records, cancellationToken);
            
            _logger.LogInformation("Successfully upserted {Count} documents to Qdrant collection", 
                records.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upsert documents to Qdrant collection");
            throw;
        }
    }

    public async Task DeleteAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        if (!keys.Any())
        {
            _logger.LogDebug("No documents to delete from Qdrant collection");
            return;
        }

        _logger.LogDebug("Deleting {Count} documents from Qdrant collection", keys.Count());

        try
        {
            // Convert string keys to Guids then cast to object for QdrantDynamicCollection
            // QdrantDynamicCollection is QdrantCollection<object, Dictionary<string, object?>>
            var guidKeys = keys.Select(key => (object)GenerateDeterministicGuid(key)).ToList();
            
            // Pass as IEnumerable<object> which is what QdrantDynamicCollection expects
            await _collection.DeleteAsync(guidKeys, cancellationToken);
            
            // Clean up key mapping
            foreach (var key in keys)
            {
                _keyMapping.Remove(key);
            }
            
            _logger.LogInformation("Successfully deleted {Count} documents from Qdrant collection", 
                guidKeys.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete documents from Qdrant collection");
            throw;
        }
    }

    /// <summary>
    /// Generates a deterministic GUID from a string key
    /// </summary>
    private static Guid GenerateDeterministicGuid(string key)
    {
        using var md5 = System.Security.Cryptography.MD5.Create();
        byte[] hash = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(key));
        return new Guid(hash);
    }
}