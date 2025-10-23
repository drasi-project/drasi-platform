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

using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Drasi.Reactions.SyncVectorStore.Factories;

namespace Drasi.Reactions.SyncVectorStore.Services;

/// <summary>
/// Manages synchronization points for Drasi queries by storing them in a dedicated
/// metadata collection in the vector store, separate from data collections.
/// </summary>
public class SyncPointManager : ISyncPointManager
{
    private readonly IVectorStoreService _vectorStoreService;
    private readonly VectorStoreConfiguration _configuration;
    private readonly ILogger<SyncPointManager> _logger;
    private readonly ConcurrentDictionary<string, long> _syncPointCache;
    private readonly SemaphoreSlim _semaphore = new(1, 1);
    private object? _metadataCollection;
    private string _metadataCollectionName = string.Empty;
    
    // Prefix for metadata collection - will be combined with reaction name
    private const string MetadataCollectionPrefix = "_drasi_metadata_";
    private const string SyncPointKeyPrefix = "sync_";

    public SyncPointManager(
        IVectorStoreService vectorStoreService,
        VectorStoreConfiguration configuration,
        ILogger<SyncPointManager> logger)
    {
        _vectorStoreService = vectorStoreService ?? throw new ArgumentNullException(nameof(vectorStoreService));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _syncPointCache = new ConcurrentDictionary<string, long>();
    }

    public async Task InitializeMetadataCollectionAsync(CancellationToken cancellationToken = default)
    {
        // Get reaction name from environment and create collection name
        var reactionName = Environment.GetEnvironmentVariable("REACTION_NAME") ?? "sk-vectorstore-reaction";
        _metadataCollectionName = $"{MetadataCollectionPrefix}{reactionName}";
        
        _logger.LogInformation("Initializing metadata collection for reaction {ReactionName}: {CollectionName}", 
            reactionName, _metadataCollectionName);
        
        try
        {
            // Create a minimal QueryConfig for the metadata collection
            var metadataConfig = new QueryConfig
            {
                CollectionName = _metadataCollectionName,
                KeyField = "key",
                DocumentTemplate = "{content}",  // Simple template for metadata
                CreateCollection = true
            };
            
            _metadataCollection = await _vectorStoreService.GetOrCreateCollectionAsync(
                _metadataCollectionName, 
                metadataConfig, 
                cancellationToken);
                
            _logger.LogInformation("Successfully initialized metadata collection: {CollectionName}", _metadataCollectionName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize metadata collection: {CollectionName}", _metadataCollectionName);
            throw;
        }
    }

    public async Task<long?> GetSyncPointAsync(
        string reactionName, 
        string queryId,
        CancellationToken cancellationToken = default)
    {
        if (_metadataCollection == null)
        {
            throw new InvalidOperationException("Metadata collection not initialized. Call InitializeMetadataCollectionAsync first.");
        }
        
        var cacheKey = GetCacheKey(reactionName, queryId);
        
        // Check cache first for performance
        if (_syncPointCache.TryGetValue(cacheKey, out var cachedSequence))
        {
            _logger.LogDebug("Found sync point in cache for {ReactionName}/{QueryId}: {Sequence}", 
                reactionName, queryId, cachedSequence);
            return cachedSequence;
        }

        await _semaphore.WaitAsync(cancellationToken);
        try
        {
            // Double-check cache after acquiring lock
            if (_syncPointCache.TryGetValue(cacheKey, out cachedSequence))
            {
                return cachedSequence;
            }

            // Load from metadata collection
            var syncPointKey = GetSyncPointKey(reactionName, queryId);
            var syncPointDoc = await GetSyncPointDocumentAsync(syncPointKey, cancellationToken);
            
            if (syncPointDoc != null)
            {
                // Parse the content JSON to extract sequence
                var metadata = JsonSerializer.Deserialize<SyncPointMetadata>(syncPointDoc.Content);
                if (metadata != null)
                {
                    _syncPointCache[cacheKey] = metadata.Sequence;
                    _logger.LogInformation("Loaded sync point from metadata store for {ReactionName}/{QueryId}: {Sequence}", 
                        reactionName, queryId, metadata.Sequence);
                    return metadata.Sequence;
                }
            }

            _logger.LogDebug("No sync point found for {ReactionName}/{QueryId}", reactionName, queryId);
            return null;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task UpdateSyncPointAsync(
        string reactionName, 
        string queryId,
        long sequence,
        CancellationToken cancellationToken = default)
    {
        if (_metadataCollection == null)
        {
            throw new InvalidOperationException("Metadata collection not initialized. Call InitializeMetadataCollectionAsync first.");
        }
        
        var syncPointKey = GetSyncPointKey(reactionName, queryId);
        var cacheKey = GetCacheKey(reactionName, queryId);

        try
        {
            // Get current processed count from cache/store
            var currentSyncPoint = await GetSyncPointAsync(reactionName, queryId, cancellationToken);
            var processedCount = currentSyncPoint.HasValue ? 
                await GetProcessedCountAsync(syncPointKey, cancellationToken) + 1 : 1;

            var syncPointDoc = CreateSyncPointDocument(reactionName, queryId, sequence, processedCount);
            await _vectorStoreService.UpsertAsync(_metadataCollection, new[] { syncPointDoc }, cancellationToken);
            
            // Update cache
            _syncPointCache[cacheKey] = sequence;
            
            _logger.LogDebug("Updated sync point for {ReactionName}/{QueryId} to sequence {Sequence}", 
                reactionName, queryId, sequence);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update sync point for {ReactionName}/{QueryId} to sequence {Sequence}", 
                reactionName, queryId, sequence);
            throw;
        }
    }
    
    public async Task<bool> TryUpdateSyncPointAsync(
        string reactionName, 
        string queryId,
        long sequence,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await UpdateSyncPointAsync(reactionName, queryId, sequence, cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update sync point for {ReactionName}/{QueryId} to sequence {Sequence}", 
                reactionName, queryId, sequence);
            return false;
        }
    }

    public async Task<bool> InitializeSyncPointAsync(
        string reactionName, 
        string queryId,
        long initialSequence = 0,
        CancellationToken cancellationToken = default)
    {
        if (_metadataCollection == null)
        {
            throw new InvalidOperationException("Metadata collection not initialized. Call InitializeMetadataCollectionAsync first.");
        }
        
        try
        {
            var existingSyncPoint = await GetSyncPointAsync(reactionName, queryId, cancellationToken);
            if (existingSyncPoint.HasValue)
            {
                _logger.LogDebug("Sync point already exists for {ReactionName}/{QueryId}: {Sequence}", 
                    reactionName, queryId, existingSyncPoint.Value);
                return true;
            }

            var syncPointKey = GetSyncPointKey(reactionName, queryId);
            var syncPointDoc = CreateSyncPointDocument(reactionName, queryId, initialSequence, 0);
            
            await _vectorStoreService.UpsertAsync(_metadataCollection, new[] { syncPointDoc }, cancellationToken);
            
            // Update cache
            var cacheKey = GetCacheKey(reactionName, queryId);
            _syncPointCache[cacheKey] = initialSequence;
            
            _logger.LogInformation("Initialized sync point for {ReactionName}/{QueryId} to sequence {Sequence}", 
                reactionName, queryId, initialSequence);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize sync point for {ReactionName}/{QueryId}", 
                reactionName, queryId);
            return false;
        }
    }

    public async Task DeleteSyncPointAsync(
        string reactionName, 
        string queryId,
        CancellationToken cancellationToken = default)
    {
        if (_metadataCollection == null)
        {
            throw new InvalidOperationException("Metadata collection not initialized. Call InitializeMetadataCollectionAsync first.");
        }
        
        var syncPointKey = GetSyncPointKey(reactionName, queryId);
        var cacheKey = GetCacheKey(reactionName, queryId);

        try
        {
            await _vectorStoreService.DeleteAsync(_metadataCollection, new[] { syncPointKey }, cancellationToken);
            
            _syncPointCache.TryRemove(cacheKey, out _);
            
            _logger.LogInformation("Deleted sync point for {ReactionName}/{QueryId}", reactionName, queryId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete sync point for {ReactionName}/{QueryId}", 
                reactionName, queryId);
            throw;
        }
    }

    private string GetSyncPointKey(string reactionName, string queryId)
    {
        // Since we have a dedicated collection per reaction, we only need the queryId as the key
        return $"{SyncPointKeyPrefix}{queryId}";
    }

    private string GetCacheKey(string reactionName, string queryId)
    {
        // Keep cache key with reaction name for clarity in logs
        return $"{reactionName}::{queryId}";
    }

    private VectorDocument CreateSyncPointDocument(string reactionName, string queryId, long sequence, long processedCount)
    {
        var metadata = new SyncPointMetadata
        {
            ReactionName = reactionName,
            QueryId = queryId,
            Sequence = sequence,
            LastUpdated = DateTime.UtcNow,
            ProcessedCount = processedCount,
            Version = "1.0"
        };

        return new VectorDocument
        {
            Key = GetSyncPointKey(reactionName, queryId),
            Content = JsonSerializer.Serialize(metadata, new JsonSerializerOptions 
            { 
                WriteIndented = false 
            }),
            Title = $"Sync Point - Reaction: {reactionName}, Query: {queryId}",
            Source = "drasi-sync-metadata",
            Vector = CreateDummyVector(_configuration.EmbeddingDimensions), // Dummy vector matching configured dimensions
            Timestamp = DateTimeOffset.UtcNow
        };
    }
    
    private ReadOnlyMemory<float> CreateDummyVector(int dimensions)
    {
        // Dummy vector for key-based lookups only
        var vector = new float[dimensions];
        return new ReadOnlyMemory<float>(vector);
    }

    private async Task<VectorDocument?> GetSyncPointDocumentAsync(
        string syncPointKey, 
        CancellationToken cancellationToken)
    {
        try
        {
            if (_metadataCollection is not IVectorCollectionAdapter adapter)
            {
                _logger.LogWarning("Metadata collection does not implement IVectorCollectionAdapter");
                return null;
            }

            return await adapter.GetAsync(syncPointKey, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogDebug("Could not retrieve sync point document {Key}: {Error}", 
                syncPointKey, ex.Message);
        }

        return null;
    }

    private async Task<long> GetProcessedCountAsync(
        string syncPointKey, 
        CancellationToken cancellationToken)
    {
        try
        {
            var syncPointDoc = await GetSyncPointDocumentAsync(syncPointKey, cancellationToken);
            if (syncPointDoc != null)
            {
                var metadata = JsonSerializer.Deserialize<SyncPointMetadata>(syncPointDoc.Content);
                if (metadata != null)
                {
                    return metadata.ProcessedCount;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogDebug("Could not get processed count for {Key}: {Error}", 
                syncPointKey, ex.Message);
        }

        return 0;
    }
    
    /// <summary>
    /// Gets the key used for storing sync points in metadata collection.
    /// Exposed for use in filtering operations.
    /// </summary>
    public static string GetSyncPointKeyForQuery(string queryId)
    {
        // Since we have a dedicated collection per reaction, we only need the queryId as the key
        return $"{SyncPointKeyPrefix}{queryId}";
    }
}