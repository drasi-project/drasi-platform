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
using Dapr;
using Dapr.Client;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;
/// <summary>
/// Manages the synchronization points (sequence numbers) for Drasi queries.
/// This includes loading them from and persisting them to a Dapr state store,
/// as well as maintaining an in-memory cache for quick access.
/// This service should be registered as a singleton.
/// </summary>
public interface IQuerySyncPointManager
{
    /// <summary>
    /// Attempts to load the sync point from the Dapr state store.
    /// </summary>
    /// <param name="queryId">The unique identifier for the query.</param>
    /// <param name="stateStoreName">The Dapr state store name where the query's metadata is stored.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>
    /// A task representing the asynchronous operation. The task result is a boolean
    /// indicating whether the sync point was successfully loaded.
    /// </returns>
    Task<bool> TryLoadSyncPointAsync(string queryId, string stateStoreName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the sync point for a query if available.
    /// </summary>
    /// <param name="queryId">The unique identifier for the query.</param>
    /// <returns>
    /// The sync point for the query if available, otherwise null.
    /// </returns>
    long? GetSyncPointForQuery(string queryId);

    /// <summary>
    /// Updates the sync point in the Dapr state store for a given query.
    /// </summary>
    /// <param name="queryId">The unique identifier for the query.</param>
    /// <param name="stateStoreName">The Dapr state store name where the query's metadata is stored.</param>
    /// <param name="sequenceNumber">The sequence number to be set as the new sync point.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>
    /// A task representing the asynchronous operation. The task result is a boolean
    /// indicating whether the sync point was successfully updated.
    /// </returns>
    Task<bool> TryUpdateSyncPointAsync(string queryId, string stateStoreName, long sequenceNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the Dapr sync point key for a given query ID.
    /// This key is used to store and retrieve the sync point from the Dapr state store.
    /// </summary>
    /// <param name="queryId">The unique identifier for the query.</param>
    /// <returns>
    /// The Dapr sync point key for the given query ID.
    /// </returns>
    public string GetSyncPointKeyForQuery(string queryId);
}

public class QuerySyncPointManager : IQuerySyncPointManager
{
    private readonly DaprClient _daprClient;
    private readonly ILogger<QuerySyncPointManager> _logger;
    private readonly ConcurrentDictionary<string, long> _syncPoints = new();

    private const string DaprSyncPointKeyFormatString = "_drasi-sync-statestore-reaction_sync_point__{0}";

    public string GetSyncPointKeyForQuery(string queryId)
    {
        return string.Format(DaprSyncPointKeyFormatString, queryId);
    }

    public QuerySyncPointManager(DaprClient daprClient, ILogger<QuerySyncPointManager> logger)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public long? GetSyncPointForQuery(string queryId)
    {
        if (_syncPoints.TryGetValue(queryId, out var sequenceNumber))
        {
            return sequenceNumber;
        }
        return null;
    }

    public async Task<bool> TryLoadSyncPointAsync(string queryId, string stateStoreName, CancellationToken cancellationToken = default)
    {
        var syncPointKey = GetSyncPointKeyForQuery(queryId);
        try
        {
            _logger.LogDebug("Attempting to load sync point for query {QueryId} using syncPointKey {SyncPointKey}...",
                queryId, syncPointKey);
            
            var sequenceValue = await _daprClient.GetStateAsync<long?>(stateStoreName, syncPointKey, cancellationToken: cancellationToken);
            
            if (sequenceValue.HasValue)
            {
                _logger.LogDebug("Loaded sync point {Sequence} for query {QueryId}", sequenceValue.Value, queryId);
                _syncPoints[queryId] = sequenceValue.Value;
                return true;
            }
        }
        catch (DaprException ex)
        {
            _logger.LogError(ex, "Dapr Error reading sync point sequence number for query {QueryId} from Dapr state store {StateStoreName}.",
                queryId, stateStoreName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error reading sync point sequence number for query {QueryId} from Dapr state store {StateStoreName}.",
                queryId, stateStoreName);
        }

        _logger.LogDebug("No sync point found for query {QueryId} in Dapr state store {StateStoreName}.",
            queryId, stateStoreName);
        return false;
    }

    public async Task<bool> TryUpdateSyncPointAsync(string queryId, string stateStoreName, long sequenceNumber, CancellationToken cancellationToken = default)
    {
        var syncPointKey = GetSyncPointKeyForQuery(queryId);
        try
        {
            _logger.LogDebug("Attempting to update sync point for query {QueryId} to {SequenceNumber}...",
                queryId, sequenceNumber);
            
            await _daprClient.SaveStateAsync<long>(stateStoreName, syncPointKey, sequenceNumber, cancellationToken: cancellationToken);

            _logger.LogDebug("Updated sync point for query {QueryId} to {SequenceNumber}.", queryId, sequenceNumber);
            
            _syncPoints[queryId] = sequenceNumber;
            return true;
        }
        catch (DaprException ex)
        {
            _logger.LogError(ex, "Dapr Error writing sync point sequence number for query {QueryId} to Dapr state store {StateStoreName}.",
                queryId, stateStoreName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error writing sync point sequence number for query {QueryId} to Dapr state store {StateStoreName}.",
                queryId, stateStoreName);
        }

        _logger.LogDebug("Failed to update sync point for query {QueryId} in Dapr state store {StateStoreName}.",
            queryId, stateStoreName);
        return false;
    }
}