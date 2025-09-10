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
using Microsoft.SemanticKernel.Connectors.AzureAISearch;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Factories;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Adapters;

/// <summary>
/// Adapter for Azure AI Search vector store using runtime configuration
/// </summary>
public class AzureAISearchVectorStoreAdapter : BaseVectorStoreAdapter, IVectorStoreAdapter
{
    private readonly AzureAISearchVectorStore _vectorStore;
    private readonly Dictionary<string, IVectorCollectionAdapter> _collectionCache = new();
    private readonly SemaphoreSlim _cacheLock = new(1, 1);
    private new readonly ILogger<AzureAISearchVectorStoreAdapter> _logger;

    public AzureAISearchVectorStoreAdapter(
        AzureAISearchVectorStore vectorStore,
        VectorStoreConfiguration configuration,
        ILogger<AzureAISearchVectorStoreAdapter> logger)
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

            _logger.LogDebug("Getting or creating Azure AI Search collection '{CollectionName}' with {Dimensions} dimensions", 
                collectionName, _configuration.EmbeddingDimensions);
            
            // Build runtime definition - Azure AI Search uses string keys
            var definition = BuildCollectionDefinition(config, typeof(string), typeof(Dictionary<string, object?>));
            
            // Override settings for Azure AI Search
            if (definition.Properties != null)
            {
                var vectorProp = definition.Properties.OfType<VectorStoreVectorProperty>().FirstOrDefault();
                if (vectorProp != null)
                {
                    vectorProp.DistanceFunction = MapAzureDistanceFunction(_configuration.DistanceFunction);
                    vectorProp.IndexKind = MapAzureIndexKind(_configuration.IndexKind);
                }
                
                // Azure AI Search supports full-text search on string fields
                var contentProp = definition.Properties.OfType<VectorStoreDataProperty>()
                    .FirstOrDefault(p => p.Name == "Content");
                if (contentProp != null)
                {
                    contentProp.IsFullTextIndexed = _configuration.IsFullTextSearchable;
                }
            }
            
            // Get dynamic collection with runtime definition
            var collection = _vectorStore.GetDynamicCollection(collectionName, definition);
            
            if (config.CreateCollection)
            {
                try
                {
                    await collection.EnsureCollectionExistsAsync(cancellationToken);
                    
                    _logger.LogInformation(
                        "Ensured Azure AI Search index '{CollectionName}' exists with {Dimensions} dimensions",
                        collectionName, _configuration.EmbeddingDimensions);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, 
                        "Failed to ensure Azure AI Search index '{CollectionName}' exists. The index may already exist with different settings.",
                        collectionName);
                    throw;
                }
            }

            var adapter = new AzureAISearchCollectionAdapter(collection, _logger);
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
            
            // For Azure AI Search, we could query the service to check
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
            
            _logger.LogDebug("Attempting to delete Azure AI Search index '{CollectionName}'", collectionName);
            
            // Get minimal collection reference for deletion
            var minimalDefinition = new VectorStoreCollectionDefinition
            {
                Properties = new VectorStoreProperty[]
                {
                    new VectorStoreKeyProperty("Key", typeof(string)),
                    new VectorStoreVectorProperty("Vector", typeof(ReadOnlyMemory<float>), 1)
                }
            };
            
            var collection = _vectorStore.GetDynamicCollection(collectionName, minimalDefinition);
            await collection.EnsureCollectionDeletedAsync(cancellationToken);
            
            _logger.LogInformation("Successfully deleted Azure AI Search index '{CollectionName}'", collectionName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete Azure AI Search index '{CollectionName}'", collectionName);
            throw;
        }
        finally
        {
            _cacheLock.Release();
        }
    }

    /// <summary>
    /// Maps distance function to Azure AI Search-supported values
    /// </summary>
    private string MapAzureDistanceFunction(string? configuredFunction)
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
            // Azure AI Search doesn't support Manhattan or Hamming, default to Cosine
            "Manhattan" => DistanceFunction.CosineSimilarity,
            "ManhattanDistance" => DistanceFunction.CosineSimilarity,
            "HammingDistance" => DistanceFunction.CosineSimilarity,
            _ => DistanceFunction.CosineSimilarity
        };
    }

    /// <summary>
    /// Maps index kind to Azure AI Search-supported values
    /// </summary>
    private string MapAzureIndexKind(string? configuredKind)
    {
        return configuredKind switch
        {
            "Hnsw" => IndexKind.Hnsw,
            "Flat" => IndexKind.Flat,
            // Azure doesn't support IvfFlat or DiskAnn, default to Hnsw
            "IvfFlat" => IndexKind.Hnsw,
            "DiskAnn" => IndexKind.Hnsw,
            _ => IndexKind.Hnsw
        };
    }
}

/// <summary>
/// Collection adapter for Azure AI Search that works with dynamic records
/// </summary>
internal class AzureAISearchCollectionAdapter : IVectorCollectionAdapter
{
    private readonly dynamic _collection;
    private readonly ILogger _logger;
    private readonly string _collectionName;

    public string Name => _collectionName;

    public AzureAISearchCollectionAdapter(
        dynamic collection,
        ILogger logger)
    {
        _collection = collection ?? throw new ArgumentNullException(nameof(collection));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _collectionName = "AzureAISearchCollection"; // Default name, could be passed as parameter
    }

    public async Task<VectorDocument?> GetAsync(
        string key,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var record = await _collection.GetAsync(key, null, cancellationToken);
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
            _logger.LogError(ex, "Failed to get document with key '{Key}' from Azure AI Search index", key);
            throw;
        }
    }

    public async Task EnsureCollectionExistsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _collection.EnsureCollectionExistsAsync(cancellationToken);
            _logger.LogDebug("Ensured Azure AI Search index exists");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to ensure Azure AI Search index exists");
            throw;
        }
    }

    public async Task UpsertAsync(IEnumerable<VectorDocument> documents, CancellationToken cancellationToken = default)
    {
        if (!documents.Any())
        {
            _logger.LogDebug("No documents to upsert to Azure AI Search index");
            return;
        }

        _logger.LogDebug("Upserting {Count} documents to Azure AI Search index", documents.Count());

        try
        {
            // Convert VectorDocuments to dynamic dictionaries
            var records = documents.Select(doc => new Dictionary<string, object?>
            {
                ["Key"] = doc.Key,
                ["Content"] = doc.Content,
                ["Vector"] = doc.Vector,
                ["Title"] = doc.Title,
                ["Timestamp"] = doc.Timestamp,
                ["Source"] = doc.Source
            });

            // Use the SK UpsertAsync method for multiple records
            await _collection.UpsertAsync(records, cancellationToken);
            
            _logger.LogInformation("Successfully upserted {Count} documents to Azure AI Search index", 
                documents.Count());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upsert documents to Azure AI Search index");
            throw;
        }
    }

    public async Task DeleteAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        if (!keys.Any())
        {
            _logger.LogDebug("No documents to delete from Azure AI Search index");
            return;
        }

        _logger.LogDebug("Deleting {Count} documents from Azure AI Search index", keys.Count());

        try
        {
            // Use the SK DeleteAsync method for multiple keys
            await _collection.DeleteAsync(keys, cancellationToken);
            
            _logger.LogInformation("Successfully deleted {Count} documents from Azure AI Search index", 
                keys.Count());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete documents from Azure AI Search index");
            throw;
        }
    }
}