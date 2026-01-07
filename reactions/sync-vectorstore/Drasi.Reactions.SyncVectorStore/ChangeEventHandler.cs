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

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.SyncVectorStore.Services;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncVectorStore;

/// <summary>
/// Handles incremental change events from Drasi queries and syncs them to Semantic Kernel vector stores
/// </summary>
public class ChangeEventHandler : IChangeEventHandler<QueryConfig>
{
    private readonly IVectorStoreService _vectorStoreService;
    private readonly IDocumentProcessor _documentProcessor;
    private readonly ISyncPointManager _syncPointManager;
    private readonly ILogger<ChangeEventHandler> _logger;
    private readonly string _reactionName;

    public ChangeEventHandler(
        IVectorStoreService vectorStoreService,
        IDocumentProcessor documentProcessor,
        ISyncPointManager syncPointManager,
        ILogger<ChangeEventHandler> logger)
    {
        _vectorStoreService = vectorStoreService ?? throw new ArgumentNullException(nameof(vectorStoreService));
        _documentProcessor = documentProcessor ?? throw new ArgumentNullException(nameof(documentProcessor));
        _syncPointManager = syncPointManager ?? throw new ArgumentNullException(nameof(syncPointManager));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        // Get reaction name from environment
        _reactionName = Environment.GetEnvironmentVariable("REACTION_NAME") ?? "sk-vectorstore-reaction";
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? queryConfig)
    {
        if (queryConfig == null)
        {
            _logger.LogError("Query configuration is null for query {QueryId}", evt.QueryId);
            throw new ArgumentNullException(nameof(queryConfig), $"Query configuration is null for query {evt.QueryId}");
        }

        _logger.LogInformation(
            "Processing change event for query {QueryId} with sequence {Sequence}. Added: {AddedCount}, Updated: {UpdatedCount}, Deleted: {DeletedCount}",
            evt.QueryId, evt.Sequence, 
            evt.AddedResults?.Count() ?? 0, 
            evt.UpdatedResults?.Count() ?? 0, 
            evt.DeletedResults?.Count() ?? 0);

        try
        {
            // Get or create the vector collection for this query
            var collection = await _vectorStoreService.GetOrCreateCollectionAsync(
                queryConfig.CollectionName!, 
                queryConfig);

            // Check sync point to prevent duplicate processing
            var syncPoint = await _syncPointManager.GetSyncPointAsync(
                _reactionName, evt.QueryId);
            
            if (syncPoint == null)
            {
                // This should not happen - sync point should be initialized during bootstrap
                var message = $"Received Change Event for Query {evt.QueryId} which was not yet initialized. Sync point not found.";
                _logger.LogWarning(message);
                throw new InvalidOperationException(message); // Event will be redelivered
            }
            
            if (evt.Sequence < syncPoint.Value)
            {
                _logger.LogInformation(
                    "Skipping duplicate event. Sequence {Sequence} < sync point {SyncPoint} for reaction {ReactionName}, query {QueryId}",
                    evt.Sequence, syncPoint.Value, _reactionName, evt.QueryId);
                return; // Skip processing this event as it's already been processed
            }

            // Process additions and updates
            await ProcessUpserts(collection, evt, queryConfig);

            // Process deletions
            await ProcessDeletions(collection, evt, queryConfig);

            // Update sync point after successful processing (must be atomic)
            if (await _syncPointManager.TryUpdateSyncPointAsync(
                _reactionName, evt.QueryId, evt.Sequence))
            {
                _logger.LogInformation(
                    "Successfully processed change event {Sequence} for query {QueryId}", 
                    evt.Sequence, evt.QueryId);
            }
            else
            {
                // If we fail to update sync point after processing, this is critical
                // The event will be redelivered and processed again
                _logger.LogWarning(
                    "Failed to update sync point after processing change event {Sequence} for query {QueryId}. Event will be redelivered.",
                    evt.Sequence, evt.QueryId);
                throw new InvalidOperationException(
                    $"Failed to update sync point after processing change event {evt.Sequence} for query {evt.QueryId}. This may cause duplicate processing.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, 
                "Failed to process change event {Sequence} for query {QueryId}. Sync point not updated.", 
                evt.Sequence, evt.QueryId);
            throw;
        }
    }

    private async Task ProcessUpserts(
        object collection,
        ChangeEvent evt, 
        QueryConfig queryConfig)
    {
        // Combine added and updated results for upserting
        var allUpserts = new List<Dictionary<string, object>>();

        if (evt.AddedResults != null)
        {
            allUpserts.AddRange(evt.AddedResults);
        }

        if (evt.UpdatedResults != null)
        {
            // Use the "After" version of updated results
            allUpserts.AddRange(evt.UpdatedResults.Select(u => u.After));
        }

        if (allUpserts.Count == 0)
        {
            _logger.LogDebug("No documents to upsert for query {QueryId}", evt.QueryId);
            return;
        }

        _logger.LogDebug("Processing {Count} documents for upsert in query {QueryId}", allUpserts.Count, evt.QueryId);

        var documentList = new List<VectorDocument>();
        try
        {
            // Process the results into vector documents
            var vectorDocuments = await _documentProcessor.ProcessDocumentsAsync(
                allUpserts, queryConfig);

            documentList = vectorDocuments.ToList();
            if (documentList.Count > 0)
            {
                // Upsert the documents to the vector store
                await _vectorStoreService.UpsertAsync(collection, documentList);
                
                _logger.LogInformation(
                    "Successfully upserted {Count} documents for query {QueryId}",
                    documentList.Count, evt.QueryId);
            }
            else
            {
                _logger.LogWarning("No valid vector documents generated from {Count} query results for query {QueryId}", 
                    allUpserts.Count, evt.QueryId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upsert documents for query {QueryId}", evt.QueryId);
            throw;
        }
    }

    private async Task ProcessDeletions(
        object collection,
        ChangeEvent evt, 
        QueryConfig queryConfig)
    {
        if (evt.DeletedResults == null || !evt.DeletedResults.Any())
        {
            _logger.LogDebug("No documents to delete for query {QueryId}", evt.QueryId);
            return;
        }

        _logger.LogDebug("Processing {Count} documents for deletion in query {QueryId}", 
            evt.DeletedResults.Count(), evt.QueryId);

        var keysToDelete = new List<string>();
        try
        {
            foreach (var deletedResult in evt.DeletedResults)
            {
                try
                {
                    var key = _documentProcessor.ExtractKey(deletedResult, queryConfig);
                    keysToDelete.Add(key);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to extract key from deleted result for query {QueryId}", evt.QueryId);
                }
            }

            if (keysToDelete.Count > 0)
            {
                await _vectorStoreService.DeleteAsync(collection, keysToDelete);
                
                _logger.LogInformation(
                    "Successfully deleted {Count} documents for query {QueryId}",
                    keysToDelete.Count, evt.QueryId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete documents for query {QueryId}", evt.QueryId);
            throw;
        }
    }
}