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
using Drasi.Reactions.SyncVectorStore.Services;
using Microsoft.SemanticKernel.Connectors.InMemory;
using Drasi.Reactions.SyncVectorStore.Factories;

namespace Drasi.Reactions.SyncVectorStore.Adapters;

/// <summary>
/// Adapter for InMemory vector store using runtime configuration
/// </summary>
public class InMemoryVectorStoreAdapter : BaseVectorStoreAdapter, IVectorStoreAdapter
{
    private readonly Microsoft.SemanticKernel.Connectors.InMemory.InMemoryVectorStore _vectorStore;
    private readonly Dictionary<string, IVectorCollectionAdapter> _collectionCache = new();
    private readonly SemaphoreSlim _cacheLock = new(1, 1);
    private new readonly ILogger<InMemoryVectorStoreAdapter> _logger;

    public InMemoryVectorStoreAdapter(
        Microsoft.SemanticKernel.Connectors.InMemory.InMemoryVectorStore vectorStore,
        VectorStoreConfiguration configuration,
        ILogger<InMemoryVectorStoreAdapter> logger)
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

            _logger.LogDebug("Getting or creating InMemory collection '{CollectionName}' with {Dimensions} dimensions", 
                collectionName, _configuration.EmbeddingDimensions);
            
            // Build runtime definition - InMemory uses string keys like Qdrant uses Guid
            var definition = BuildCollectionDefinition(config, typeof(string), typeof(Dictionary<string, object?>));
            
            var collection = _vectorStore.GetDynamicCollection(collectionName, definition);
            
            if (config.CreateCollection)
            {
                try
                {
                    await collection.EnsureCollectionExistsAsync(cancellationToken);
                    _logger.LogInformation(
                        "Ensured InMemory collection '{CollectionName}' exists with {Dimensions} dimensions",
                        collectionName, _configuration.EmbeddingDimensions);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to ensure InMemory collection '{CollectionName}' exists",
                        collectionName);
                    throw;
                }
            }

            var adapter = new InMemoryCollectionAdapter(collection, _logger);
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
            
            // For in-memory store, collections don't persist between runs
            // so we just check if it's in our cache
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
            
            _logger.LogDebug("Attempting to delete InMemory collection '{CollectionName}'", collectionName);
            
            // Get the collection and call SK's EnsureCollectionDeletedAsync
            // We need a minimal definition just to get the collection reference
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
            _logger.LogInformation("Successfully deleted InMemory collection '{CollectionName}'", collectionName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete InMemory collection '{CollectionName}'", collectionName);
            throw;
        }
        finally
        {
            _cacheLock.Release();
        }
    }
}

/// <summary>
/// Collection adapter for InMemory that works with dynamic collection
/// </summary>
internal class InMemoryCollectionAdapter : IVectorCollectionAdapter
{
    private readonly InMemoryDynamicCollection _collection;
    private readonly ILogger _logger;

    public string Name => _collection.Name;

    public InMemoryCollectionAdapter(
        InMemoryDynamicCollection collection,
        ILogger logger)
    {
        _collection = collection ?? throw new ArgumentNullException(nameof(collection));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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
            _logger.LogError(ex, "Failed to get document with key '{Key}' from InMemory collection", key);
            throw;
        }
    }

    public async Task EnsureCollectionExistsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _collection.EnsureCollectionExistsAsync(cancellationToken);
            _logger.LogDebug("Ensured InMemory collection exists");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to ensure InMemory collection exists");
            throw;
        }
    }

    public async Task UpsertAsync(IEnumerable<VectorDocument> documents, CancellationToken cancellationToken = default)
    {
        if (!documents.Any())
        {
            _logger.LogDebug("No documents to upsert to InMemory collection");
            return;
        }

        _logger.LogDebug("Upserting {Count} documents to InMemory collection", documents.Count());

        try
        {
            // Convert VectorDocuments to dynamic dictionaries with string keys
            var records = documents.Select(doc => new Dictionary<string, object?>
            {
                ["Key"] = doc.Key,
                ["Content"] = doc.Content,
                ["Vector"] = doc.Vector,
                ["Title"] = doc.Title,
                ["Timestamp"] = doc.Timestamp,
                ["Source"] = doc.Source
            }).ToList();

            await _collection.UpsertAsync(records, cancellationToken);
            
            _logger.LogInformation("Successfully upserted {Count} documents to InMemory collection", 
                records.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upsert documents to InMemory collection");
            throw;
        }
    }

    public async Task DeleteAsync(IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        if (!keys.Any())
        {
            _logger.LogDebug("No documents to delete from InMemory collection");
            return;
        }

        _logger.LogDebug("Deleting {Count} documents from InMemory collection", keys.Count());

        try
        {
            // Delete keys one by one since InMemory might not have batch delete
            foreach (var key in keys)
            {
                await _collection.DeleteAsync(key, cancellationToken);
            }
            
            _logger.LogInformation("Successfully deleted {Count} documents from InMemory collection", 
                keys.Count());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete documents from InMemory collection");
            throw;
        }
    }
}