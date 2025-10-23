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
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace Drasi.Reactions.SyncVectorStore.Services;

/// <summary>
/// Implementation of vector store service using adapter pattern.
/// This service uses store-specific adapters that work with strongly-typed collections.
/// </summary>
public class VectorStoreService : IVectorStoreService
{
    private readonly IVectorStoreAdapter _vectorStoreAdapter;
    private readonly ILogger<VectorStoreService> _logger;
    private readonly Dictionary<string, IVectorCollectionAdapter> _collectionCache = new();
    private readonly SemaphoreSlim _collectionCacheLock = new(1, 1);

    public VectorStoreService(
        IVectorStoreAdapter vectorStoreAdapter,
        ILogger<VectorStoreService> logger)
    {
        _vectorStoreAdapter = vectorStoreAdapter ?? throw new ArgumentNullException(nameof(vectorStoreAdapter));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<object> GetOrCreateCollectionAsync(
        string collectionName, 
        QueryConfig config, 
        CancellationToken cancellationToken = default)
    {
        await _collectionCacheLock.WaitAsync(cancellationToken);
        try
        {
            if (_collectionCache.TryGetValue(collectionName, out var cachedCollection))
            {
                return cachedCollection;
            }

            _logger.LogDebug("Getting or creating collection '{CollectionName}'", collectionName);

            var collection = await _vectorStoreAdapter.GetOrCreateCollectionAsync(
                collectionName, 
                config, 
                cancellationToken);

            _collectionCache[collectionName] = collection;
            return collection;
        }
        finally
        {
            _collectionCacheLock.Release();
        }
    }

    public async Task UpsertAsync(
        object collection,
        IEnumerable<VectorDocument> documents, 
        CancellationToken cancellationToken = default)
    {
        if (collection is not IVectorCollectionAdapter adapter)
        {
            throw new ArgumentException("Invalid collection type. Expected IVectorCollectionAdapter.", nameof(collection));
        }

        var documentList = documents.ToList();
        if (documentList.Count == 0)
        {
            return;
        }

        _logger.LogDebug("Upserting {Count} documents to collection", documentList.Count);

        try
        {
            await adapter.UpsertAsync(documentList, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upsert documents to vector store");
            throw;
        }
    }

    public async Task DeleteAsync(
        object collection,
        IEnumerable<string> keys, 
        CancellationToken cancellationToken = default)
    {
        if (collection is not IVectorCollectionAdapter adapter)
        {
            throw new ArgumentException("Invalid collection type. Expected IVectorCollectionAdapter.", nameof(collection));
        }

        var keyList = keys.ToList();
        if (keyList.Count == 0)
        {
            return;
        }

        _logger.LogDebug("Deleting {Count} documents from collection", keyList.Count);

        try
        {
            await adapter.DeleteAsync(keyList, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete documents from vector store");
            throw;
        }
    }

    public async Task<bool> CollectionExistsAsync(string collectionName, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _vectorStoreAdapter.CollectionExistsAsync(collectionName, cancellationToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "Error checking if collection '{CollectionName}' exists", collectionName);
            throw;
        }
    }
}