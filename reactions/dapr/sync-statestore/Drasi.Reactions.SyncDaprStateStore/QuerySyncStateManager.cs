using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;

/// <summary>
/// Manages the synchronization state (initialized status and sequence number) for each query.
/// This service should be registered as a singleton.
/// </summary>
public interface IQuerySyncStateManager
{
    /// <summary>
    /// Checks if a query has been successfully initialized (full sync completed).
    /// </summary>
    /// <param name="queryId">The ID of the query.</param>
    /// <param name="initializationSequence">The sequence number at which initialization occurred.</param>
    /// <returns>True if initialized, false otherwise.</returns>
    bool IsInitialized(string queryId, out long initializationSequence);

    /// <summary>
    /// Attempts to mark a query as initialized with a specific sequence number.
    /// This should only be called after a successful full sync.
    /// </summary>
    /// <param name="queryId">The ID of the query.</param>
    /// <param name="sequence">The sequence number of the control event triggering initialization.</param>
    /// <returns>True if the state was successfully updated, false if the query was already marked initialized.</returns>
    bool TryMarkInitialized(string queryId, long sequence);

    /// <summary>
    /// Resets the initialization state for a query. Useful if a query stops or is deleted.
    /// </summary>
    /// <param name="queryId">The ID of the query.</param>
    void ResetState(string queryId);
}

/// <summary>
/// Represents the synchronization state for a single query.
/// </summary>
internal class QuerySyncState
{
    /// <summary>
    /// Gets or sets a value indicating whether the initial full sync has completed successfully.
    /// </summary>
    public bool IsInitialized { get; set; } = false;

    /// <summary>
    /// Gets or sets the sequence number of the control event (e.g., Running)
    /// that triggered the successful initial full sync.
    /// Change events with sequence numbers less than or equal to this value should be ignored.
    /// </summary>
    public long InitializationSequence { get; set; } = -1;
}

/// <summary>
/// Implementation of IQuerySyncStateManager that tracks query initialization state.
/// </summary>
public class QuerySyncStateManager : IQuerySyncStateManager
{
    private readonly ConcurrentDictionary<string, QuerySyncState> _queryStates = new();
    private readonly ILogger<QuerySyncStateManager> _logger;

    /// <summary>
    /// Creates a new instance of the QuerySyncStateManager.
    /// </summary>
    public QuerySyncStateManager(ILogger<QuerySyncStateManager> logger)
    {
        _logger = logger;
    }

    /// </inheritdoc />
    public bool IsInitialized(string queryId, out long initializationSequence)
    {
        if (_queryStates.TryGetValue(queryId, out var state) && state.IsInitialized)
        {
            initializationSequence = state.InitializationSequence;
            return true;
        }
        initializationSequence = -1;
        return false;
    }

    /// </inheritdoc />
    public bool TryMarkInitialized(string queryId, long sequence)
    {
        var newState = new QuerySyncState { IsInitialized = true, InitializationSequence = sequence };

        var updatedState = _queryStates.AddOrUpdate(
            queryId,
            _ => newState,
            (key, existingState) =>
            {
                if (existingState.IsInitialized)
                {
                    _logger.LogWarning("Query {QueryId} already marked as initialized at sequence {ExistingSequence}. Ignoring attempt to mark initialized at sequence {NewSequence}.",
                        queryId, existingState.InitializationSequence, sequence);
                    return existingState;
                }
                return newState;
            });

        // Check if the state is the one we tried to set and it's marked initialized
        bool success = updatedState == newState && newState.IsInitialized;
        if (success)
        {
             _logger.LogDebug("Query {QueryId} successfully marked as initialized at sequence {Sequence}.", queryId, sequence);
        }
        return success;
    }

    /// </inheritdoc />
     public void ResetState(string queryId)
    {
        if (_queryStates.TryRemove(queryId, out _))
        {
            _logger.LogDebug("Reset synchronization state for query {QueryId}.", queryId);
        }
    }
}