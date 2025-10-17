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

using Drasi.Reaction.SDK.Services;
using Drasi.Reaction.SDK.Models.ViewService;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace Drasi.Reactions.SyncVectorStore.Services;

/// <summary>
/// Simplified initialization service following Dapr pattern
/// </summary>
public class QueryInitializationService : IQueryInitializationService
{
    private readonly IVectorStoreService _vectorStoreService;
    private readonly IEmbeddingService _embeddingService;
    private readonly ISyncPointManager _syncPointManager;
    private readonly IQueryConfigService _queryConfigService;
    private readonly IResultViewClient _resultViewClient;
    private readonly IDocumentProcessor _documentProcessor;
    private readonly IExtendedManagementClient _managementClient;
    private readonly IErrorStateHandler _errorStateHandler;
    private readonly ILogger<QueryInitializationService> _logger;
    private readonly string _reactionName;
    private const int DefaultWaitForQueryReadySeconds = 300; // 5 minutes

    public QueryInitializationService(
        IVectorStoreService vectorStoreService,
        IEmbeddingService embeddingService,
        ISyncPointManager syncPointManager,
        IQueryConfigService queryConfigService,
        IResultViewClient resultViewClient,
        IDocumentProcessor documentProcessor,
        IExtendedManagementClient managementClient,
        IErrorStateHandler errorStateHandler,
        ILogger<QueryInitializationService> logger)
    {
        _vectorStoreService = vectorStoreService ?? throw new ArgumentNullException(nameof(vectorStoreService));
        _embeddingService = embeddingService ?? throw new ArgumentNullException(nameof(embeddingService));
        _syncPointManager = syncPointManager ?? throw new ArgumentNullException(nameof(syncPointManager));
        _queryConfigService = queryConfigService ?? throw new ArgumentNullException(nameof(queryConfigService));
        _resultViewClient = resultViewClient ?? throw new ArgumentNullException(nameof(resultViewClient));
        _documentProcessor = documentProcessor ?? throw new ArgumentNullException(nameof(documentProcessor));
        _managementClient = managementClient ?? throw new ArgumentNullException(nameof(managementClient));
        _errorStateHandler = errorStateHandler ?? throw new ArgumentNullException(nameof(errorStateHandler));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        _reactionName = Environment.GetEnvironmentVariable("REACTION_NAME") ?? "sk-vectorstore-reaction";
    }

    public async Task InitializeQueriesAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Initializing vector store collections for configured queries");
        
        // Test vector store connectivity with a simple operation
        await TestVectorStoreConnectivity(cancellationToken);
        
        // Test embedding service connectivity
        await TestEmbeddingService(cancellationToken);
        
        // Initialize the metadata collection for storing sync points
        _logger.LogInformation("Initializing metadata collection for sync points");
        await _syncPointManager.InitializeMetadataCollectionAsync(cancellationToken);
        
        // Initialize collections and sync points for each query
        var queryNames = _queryConfigService.GetQueryNames();
        
        foreach (var queryId in queryNames)
        {
            var config = _queryConfigService.GetQueryConfig<QueryConfig>(queryId);
            if (config == null || string.IsNullOrEmpty(config.CollectionName))
            {
                _logger.LogWarning("Skipping query {QueryId} due to missing or invalid configuration", queryId);
                continue;
            }
            
            try
            {
                _logger.LogInformation("Initializing collection for query {QueryId}", queryId);
                
                // Create collection if it doesn't exist
                var collection = await _vectorStoreService.GetOrCreateCollectionAsync(
                    config.CollectionName, config);
                
                // Check if bootstrap is needed (no sync point exists)
                var syncPoint = await _syncPointManager.GetSyncPointAsync(
                    _reactionName, queryId);
                
                if (syncPoint == null)
                {
                    _logger.LogInformation("No sync point found for query {QueryId}. Starting bootstrap...", queryId);
                    
                    // Wait for the query to be ready before bootstrapping
                    if (await _managementClient.WaitForQueryReadyAsync(queryId, DefaultWaitForQueryReadySeconds, cancellationToken))
                    {
                        await BootstrapQuery(queryId, config, collection, cancellationToken);
                    }
                    else
                    {
                        var errorMessage = $"Query {queryId} did not become ready within {DefaultWaitForQueryReadySeconds} seconds";
                        _logger.LogError(errorMessage);
                        _errorStateHandler.Terminate(errorMessage);
                        throw new InvalidOperationException(errorMessage); // This line won't be reached but kept for consistency
                    }
                }
                else
                {
                    _logger.LogInformation("Query {QueryId} already initialized with sync point {SyncPoint}", 
                        queryId, syncPoint.Value);
                }
            }
            catch (Exception ex)
            {
                var errorMessage = $"Failed to initialize query {queryId}: {ex.Message}";
                _logger.LogError(ex, errorMessage);
                _errorStateHandler.Terminate(errorMessage);
                throw new InvalidOperationException(errorMessage, ex);
            }
        }
        
        _logger.LogInformation("All queries initialized successfully");
    }
    
    private async Task TestVectorStoreConnectivity(CancellationToken cancellationToken)
    {
        var testCollectionName = $"_drasi_test_{Guid.NewGuid():N}";
        
        try
        {
            // Simple test - try to create and then delete a test collection to verify connectivity
            var testConfig = new QueryConfig { CollectionName = testCollectionName };
            
            // This should succeed even if collection doesn't exist (will be created)
            var testCollection = await _vectorStoreService.GetOrCreateCollectionAsync(testCollectionName, testConfig);
            
            // Test collection name includes a GUID so it won't conflict with anything
            
            _logger.LogInformation("Vector store connectivity test successful");
        }
        catch (Exception ex)
        {
            var errorMessage = $"Vector store connectivity test failed for collection {testCollectionName}. Unable to connect to vector store: {ex.Message}";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw new InvalidOperationException("Unable to connect to vector store", ex);
        }
    }
    
    private async Task TestEmbeddingService(CancellationToken cancellationToken)
    {
        try
        {
            // Generate a simple test embedding
            var testText = "test";
            var embedding = await _embeddingService.GenerateEmbeddingAsync(testText);
            
            if (embedding.IsEmpty)
            {
                throw new InvalidOperationException("Embedding service returned empty result");
            }
            
            _logger.LogInformation("Embedding service test successful (dimensions: {Dimensions})", embedding.Length);
        }
        catch (Exception ex)
        {
            var errorMessage = $"Embedding service test failed. Unable to connect to embedding service: {ex.Message}";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw new InvalidOperationException("Unable to connect to embedding service", ex);
        }
    }
    
    private async Task BootstrapQuery(string queryId, QueryConfig config, object collection, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Fetching initial data for query {QueryId} from ResultViewClient...", queryId);
            
            var initialData = new List<Dictionary<string, object>>();
            long syncPointSequence;
            
            // Get the result stream
            var stream = _resultViewClient.GetCurrentResult(queryId, cancellationToken);
            
            await using (var streamEnumerator = stream.GetAsyncEnumerator(cancellationToken))
            {
                // First, get the header which should be the first item
                syncPointSequence = await GetQuerySyncPointFromHeaderAsync(streamEnumerator, queryId);
                
                // Then collect all the data items
                initialData = await BuildInitialDataListAsync(streamEnumerator, queryId, config.KeyField, cancellationToken);
            }
            
            // Process and load the initial data if any exists
            if (initialData.Any())
            {
                _logger.LogInformation("Loading {Count} initial items for query {QueryId}", 
                    initialData.Count, queryId);
                
                var documents = await _documentProcessor.ProcessDocumentsAsync(
                    initialData, config, cancellationToken);
                
                // Bulk insert all documents
                if (documents.Any())
                {
                    await _vectorStoreService.UpsertAsync(collection, documents);
                    _logger.LogInformation("Successfully loaded {Count} documents for query {QueryId}", 
                        documents.Count(), queryId);
                }
            }
            else
            {
                _logger.LogInformation("No initial data to load for query {QueryId}", queryId);
            }
            
            // Initialize sync point with the actual sequence from the stream header
            var initialized = await _syncPointManager.InitializeSyncPointAsync(
                _reactionName, queryId, syncPointSequence);
            
            if (!initialized)
            {
                _logger.LogWarning("Sync point already exists for query {QueryId}. This may indicate a previous incomplete bootstrap.", queryId);
            }
            else
            {
                _logger.LogInformation("Initialized sync point to sequence {Sequence} for query {QueryId}", 
                    syncPointSequence, queryId);
            }
            
            _logger.LogInformation("Bootstrap completed for query {QueryId} with sync point {SyncPoint}", 
                queryId, syncPointSequence);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Bootstrap failed for query {QueryId}", queryId);
            throw;
        }
    }
    
    private async Task<long> GetQuerySyncPointFromHeaderAsync(IAsyncEnumerator<ViewItem> streamEnumerator, string queryId)
    {
        try
        {
            if (await streamEnumerator.MoveNextAsync())
            {
                var firstItem = streamEnumerator.Current;
                if (firstItem?.Header == null)
                {
                    var errorMessage = $"Header in result stream is null for query {queryId}. Aborting initial sync.";
                    _logger.LogError(errorMessage);
                    _errorStateHandler.Terminate(errorMessage);
                    throw new InvalidOperationException(errorMessage);
                }

                _logger.LogDebug("Found sync point sequence {Sequence} from result stream header for query {QueryId}", 
                    firstItem.Header.Sequence, queryId);
                return firstItem.Header.Sequence;
            }
            else
            {
                var errorMessage = $"No header returned in result stream for query {queryId}. Aborting initial sync.";
                _logger.LogError(errorMessage);
                _errorStateHandler.Terminate(errorMessage);
                throw new InvalidOperationException(errorMessage);
            }
        }
        catch (Exception ex)
        {
            var errorMessage = $"Unexpected error while fetching result stream header for query {queryId}.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
    }
    
    private async Task<List<Dictionary<string, object>>> BuildInitialDataListAsync(
        IAsyncEnumerator<ViewItem> streamEnumerator, 
        string queryId,
        string? keyFieldName,
        CancellationToken cancellationToken)
    {
        var dataItems = new List<Dictionary<string, object>>();
        try
        {
            while (await streamEnumerator.MoveNextAsync())
            {
                if (cancellationToken.IsCancellationRequested) 
                    return dataItems;

                var viewItem = streamEnumerator.Current;
                if (viewItem?.Data == null) 
                    continue;

                dataItems.Add(viewItem.Data);
                
                _logger.LogDebug("Collected item with key {ItemKey} for query {QueryId}.",
                    viewItem.Data.GetValueOrDefault(keyFieldName ?? "id"), queryId);
            }

            return dataItems;
        }
        catch (Exception ex)
        {
            var errorMessage = $"Unexpected error while parsing result stream for query {queryId}.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
    }
}