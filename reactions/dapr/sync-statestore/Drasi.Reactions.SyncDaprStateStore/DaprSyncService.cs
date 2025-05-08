using Dapr.Client;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;

/// <summary>
/// Implementation of the synchronization service between Drasi query results and Dapr state store.
/// </summary>
public class DaprSyncService : IDaprSyncService
{
    private readonly IResultViewClient _resultViewClient;
    private readonly DaprClient _daprClient;
    private readonly ILogger<DaprSyncService> _logger;

    public DaprSyncService(
        IResultViewClient resultViewClient,
        DaprClient daprClient,
        ILogger<DaprSyncService> logger)
    {
        _resultViewClient = resultViewClient;
        _daprClient = daprClient;
        _logger = logger;
    }

    /// <summary>
    /// Performs a full synchronization from Drasi to Dapr state store.
    /// </summary>
    public async Task PerformFullSyncAsync(string queryId, QueryConfig queryConfig, string stateStoreName)
    {
        _logger.LogInformation("[SyncService][{QueryId}] Starting full sync to Dapr store '{StateStoreName}'", queryId, stateStoreName);

        int processedCount = 0;
        int errorCount = 0;
        var saveStateItems = new List<SaveStateItem<Dictionary<string, object>>>();

        try
        {
            // Fetch all results from Drasi using AsyncStreaming
            await foreach (var viewItem in _resultViewClient.GetCurrentResult(queryId))
            {
                if (viewItem?.Data == null) continue;

                if (DaprKeyGenerator.TryGenerateKey(queryConfig, stateStoreName, viewItem.Data, _logger, out var daprKey))
                {
                    // Create SaveStateItem without ETag for overwrite
                    saveStateItems.Add(new SaveStateItem<Dictionary<string, object>>(daprKey, viewItem.Data, etag: null));
                    processedCount++;
                    _logger.LogDebug("[SyncService][{QueryId}] Prepared item with key '{DaprKey}' for bulk save.", queryId, daprKey);
                }
                else
                {
                    errorCount++;
                }
            }

            if (saveStateItems.Count > 0)
            {
                _logger.LogDebug("[SyncService][{QueryId}] Saving {Count} items in bulk to Dapr store '{StateStoreName}'", 
                    queryId, saveStateItems.Count, stateStoreName);
                
                // Perform bulk save without transactions or specific concurrency options (defaults to last-write-wins)
                await _daprClient.SaveBulkStateAsync(stateStoreName, saveStateItems);
            }
            else
            {
                _logger.LogDebug("[SyncService][{QueryId}] No items to save in bulk sync", queryId);
            }
        }
        catch (Exception ex)
        {
            // Catch potential exceptions during streaming or bulk save
            errorCount += saveStateItems.Count - processedCount;
            _logger.LogError(ex, "[SyncService][{QueryId}] Error during full sync to Dapr store '{StateStoreName}'", 
                queryId, stateStoreName);
            throw; // Re-throw to indicate failure to ControlSignalHandler
        }

        _logger.LogInformation(
            "[SyncService][{QueryId}] Full sync completed for Dapr store '{StateStoreName}'. Processed: {ProcessedCount}, Errors: {ErrorCount}",
            queryId, stateStoreName, processedCount, errorCount);
    }

    /// <summary>
    /// Processes a change event by applying adds/updates via SaveBulkStateAsync and deletes via DeleteStateAsync.
    /// Uses a last-write-wins strategy (no ETags).
    /// Collects all exceptions and throws an AggregateException if any errors occur.
    /// </summary>
    public async Task ProcessChangeAsync(string queryId, QueryConfig queryConfig, string stateStoreName, ChangeEvent evt)
    {
        _logger.LogDebug("[SyncService][{QueryId}][Seq:{Sequence}] Processing change event for Dapr store '{StateStoreName}'. Adds:{Adds}, Updates:{Updates}, Deletes:{Deletes}",
            queryId, evt.Sequence, stateStoreName, evt.AddedResults?.Length ?? 0, evt.UpdatedResults?.Length ?? 0, evt.DeletedResults?.Length ?? 0);

        var itemsToSave = new List<SaveStateItem<Dictionary<string, object>>>();
        var keysToDelete = new List<string>();
        var exceptions = new List<Exception>();

        // Prepare Adds/Updates for Bulk Save
        var allUpserts = (evt.AddedResults ?? Enumerable.Empty<Dictionary<string, object>>())
                         .Concat((evt.UpdatedResults ?? Enumerable.Empty<UpdatedResultElement>()).Select(u => u.After));

        foreach (var itemData in allUpserts)
        {
            if (itemData == null) continue;

            if (DaprKeyGenerator.TryGenerateKey(queryConfig, stateStoreName, itemData, _logger, out var daprKey))
            {
                itemsToSave.Add(new SaveStateItem<Dictionary<string, object>>(daprKey, itemData, null));
                _logger.LogDebug("[SyncService][{QueryId}][Seq:{Sequence}] Prepared item with key '{DaprKey}' for bulk save.", queryId, evt.Sequence, daprKey);
            }
            else
            {
                exceptions.Add(new InvalidOperationException($"Failed to generate Dapr key for save/update item during event {evt.Sequence}"));
            }
        }

        // Prepare Deletes
        foreach (var deletedItem in evt.DeletedResults ?? Enumerable.Empty<Dictionary<string, object>>())
        {
            if (deletedItem == null) continue;

            if (DaprKeyGenerator.TryGenerateKey(queryConfig, stateStoreName, deletedItem, _logger, out var daprKey))
            {
                keysToDelete.Add(daprKey);
            }
            else
            {
                exceptions.Add(new InvalidOperationException($"Failed to generate Dapr key for delete item during event {evt.Sequence}"));
            }
        }

        // Execute Bulk Save for Adds/Updates
        if (itemsToSave.Count > 0)
        {
            try
            {
                _logger.LogDebug("[SyncService][{QueryId}][Seq:{Sequence}] Saving {Count} items in bulk to Dapr store '{StateStoreName}'", 
                    queryId, evt.Sequence, itemsToSave.Count, stateStoreName);
                await _daprClient.SaveBulkStateAsync(stateStoreName, itemsToSave);
            }
            catch (Exception ex)
            {
                exceptions.Add(new Exception($"Dapr bulk save operation failed during event {evt.Sequence}", ex));
                _logger.LogError(ex, "[SyncService][{QueryId}][Seq:{Sequence}] Error saving {Count} items in bulk to Dapr store '{StateStoreName}'", 
                    queryId, evt.Sequence, itemsToSave.Count, stateStoreName);
            }
        }

        // Execute Individual Deletes
        if (keysToDelete.Count > 0)
        {
            _logger.LogDebug("[SyncService][{QueryId}][Seq:{Sequence}] Deleting {Count} items from Dapr store '{StateStoreName}'", 
                queryId, evt.Sequence, keysToDelete.Count, stateStoreName);
                
            var deleteTasks = keysToDelete.Select(async key =>
            {
                try
                {
                    await _daprClient.DeleteStateAsync(stateStoreName, key);
                }
                catch (Exception ex)
                {
                    lock (exceptions)
                    {
                        exceptions.Add(new Exception($"Dapr delete operation failed for key '{key}' during event {evt.Sequence}", ex));
                    }
                    _logger.LogError(ex, "[SyncService][{QueryId}][Seq:{Sequence}] Error deleting item with key '{DaprKey}' from Dapr store '{StateStoreName}'", 
                        queryId, evt.Sequence, key, stateStoreName);
                }
            }).ToList();
            
            await Task.WhenAll(deleteTasks);
        }

        // If any operations failed, throw an aggregate exception
        if (exceptions.Count > 0)
        {
            throw new AggregateException($"Failed to fully process change event {evt.Sequence} for query {queryId}. See inner exceptions for details.", exceptions);
        }
    }
}