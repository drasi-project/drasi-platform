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

using Dapr;
using Dapr.Client;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Drasi.Reactions.SyncDaprStateStore;
/// <summary>
/// Handles incremental change events from Drasi queries.
/// </summary>
public class ChangeEventHandler : IChangeEventHandler<QueryConfig>
{
    private readonly DaprClient _daprClient;
    private readonly ILogger<ChangeEventHandler> _logger;
    private readonly IQuerySyncPointManager _querySyncPointManager;

    public ChangeEventHandler(
        DaprClient daprClient,
        ILogger<ChangeEventHandler> logger,
        IQuerySyncPointManager querySyncPointManager)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _querySyncPointManager = querySyncPointManager ?? throw new ArgumentNullException(nameof(querySyncPointManager));
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? queryConfig)
    {
        _logger.LogDebug("Received change event for query {QueryId} with sequence {Sequence}. Added: {AddedCount}, Updated: {UpdatedCount}, Deleted: {DeletedCount}",
            evt.QueryId, evt.Sequence, evt.AddedResults?.Count() ?? 0, evt.UpdatedResults?.Count() ?? 0, evt.DeletedResults?.Count() ?? 0);

        var queryName = evt.QueryId;
        var stateStoreName = queryConfig?.StateStoreName ??
            throw new ArgumentNullException($"State store name is null for query {queryName}. Cannot process change event.");

        var syncPoint = _querySyncPointManager.GetSyncPointForQuery(evt.QueryId);
        if (syncPoint == null)
        {
            var message = $"Received Change Event for Query {evt.QueryId} which was not yet initialized.";
            _logger.LogWarning(message);
            throw new InvalidOperationException(message); // Pub/sub should deliver this event again.
        }

        if (evt.Sequence < syncPoint)
        {
            _logger.LogInformation("Skipping change event {Sequence} for query {QueryId} as it is older than current sync point {SyncPoint}.",
                evt.Sequence, evt.QueryId, syncPoint);
            return;
        }

        var itemsToSave = new List<SaveStateItem<Dictionary<string, object>>>();
        var keysToDelete = new List<string>();
        var exceptions = new ConcurrentBag<Exception>();

        // Prepare Adds/Updates for Bulk Save
        var allUpserts = (evt.AddedResults ?? Enumerable.Empty<Dictionary<string, object>>())
            .Concat((evt.UpdatedResults ?? Enumerable.Empty<UpdatedResultElement>()).Select(u => u.After));
        
        foreach (var itemData in allUpserts)
        {
            if (itemData == null || string.IsNullOrEmpty(queryConfig.KeyField))
            {
                continue;
            }

            var itemKey = itemData[queryConfig.KeyField]?.ToString()
                ?? throw new ArgumentNullException($"Key field '{queryConfig.KeyField}' is null.");
            
            if (itemKey == _querySyncPointManager.GetSyncPointKeyForQuery(queryName))
            {
                continue;
            }
            
            // Overwrite the key if it already exists, by using NULL as the ETag
            itemsToSave.Add(new SaveStateItem<Dictionary<string, object>>(itemKey, itemData, etag: null));
        }

        // Prepare Deletes
        foreach (var deletedItem in evt.DeletedResults ?? Enumerable.Empty<Dictionary<string, object>>())
        {
            if (deletedItem == null || string.IsNullOrEmpty(queryConfig.KeyField))
            {
                continue;
            }
            
            var keyToDelete = deletedItem[queryConfig.KeyField]?.ToString()
                ?? throw new ArgumentNullException($"Key field '{queryConfig.KeyField}' is null.");
            keysToDelete.Add(keyToDelete);
        }

        // Execute Bulk Save for Adds/Updates
        if (itemsToSave.Count > 0)
        {
            try
            {
                _logger.LogDebug("Attempting to bulk save {Count} items to Dapr store '{StateStoreName}' for query {QueryId}'s event {Sequence}",
                    itemsToSave.Count, stateStoreName, queryName, evt.Sequence);
                
                await _daprClient.SaveBulkStateAsync(stateStoreName, itemsToSave);
                
                _logger.LogDebug("Successfully bulk saved {Count} items to Dapr store '{StateStoreName}' for query {QueryId}'s event {Sequence}",
                    itemsToSave.Count, stateStoreName, queryName, evt.Sequence);
            }
            catch (DaprException ex)
            {
                var message = $"Dapr bulk save operation failed during event {evt.Sequence} for query {queryName}";
                _logger.LogError(ex, message);
                exceptions.Add(ex);
            }
            catch (Exception ex)
            {
                var message = $"Unexpected error during bulk save operation for event {evt.Sequence} for query {queryName}";
                _logger.LogError(ex, message);
                exceptions.Add(ex);
            }
        }

        // Execute Individual Deletes, as there is no bulk delete operation in Dapr
        if (keysToDelete.Count > 0)
        {
            _logger.LogDebug("Attempting to delete {Count} items from Dapr store '{StateStoreName}' for query {QueryId}'s event {Sequence}",
                keysToDelete.Count, stateStoreName, queryName, evt.Sequence);
            
            var deleteTasks = keysToDelete.Select(async key =>
            {
                try
                {
                    await _daprClient.DeleteStateAsync(stateStoreName, key);
                }
                catch (DaprException ex)
                {
                    var message = $"Dapr delete operation failed for key '{key}' during event {evt.Sequence} for query {queryName}";
                    _logger.LogError(ex, message);
                    exceptions.Add(ex);
                }
                catch (Exception ex)
                {
                    var message = $"Unexpected error during delete operation for key '{key}' during event {evt.Sequence} for query {queryName}";
                    _logger.LogError(ex, message);
                    exceptions.Add(ex);
                }
            }).ToList();
            
            await Task.WhenAll(deleteTasks);
        }

        // If any operations failed, throw an aggregate exception
        if (exceptions.Count > 0)
        {
            throw new AggregateException($"Failed to fully process change event {evt.Sequence} for query {queryName}. See inner exceptions for details.", exceptions);
        }

        if (await _querySyncPointManager.TryUpdateSyncPointAsync(queryName, stateStoreName, evt.Sequence))
        {
            _logger.LogInformation("Successfully processed change-event sequence {Sequence} for query {QueryId}.", evt.Sequence, queryName);
        }
        else
        {
            // Throw exception - this will cause the event to be re-delivered
            _logger.LogWarning("Failed to update sync point for query {QueryId} after processing change event {Sequence}.", queryName, evt.Sequence);
            throw new InvalidOperationException("Failed to update sync point after processing change event.");
        }
    }
}