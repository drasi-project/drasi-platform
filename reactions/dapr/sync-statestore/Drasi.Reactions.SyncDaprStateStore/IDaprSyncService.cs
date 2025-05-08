using Drasi.Reaction.SDK.Models.QueryOutput;

namespace Drasi.Reactions.SyncDaprStateStore;

/// <summary>
/// Service responsible for synchronizing query results to a Dapr state store.
/// </summary>
public interface IDaprSyncService
{
    /// <summary>
    /// Performs a full sync of all results from the specified query to the Dapr state store.
    /// </summary>
    /// <param name="queryId">The ID of the query to sync.</param>
    /// <param name="queryConfig">The configuration for the query.</param>
    /// <param name="stateStoreName">The name of the target Dapr state store.</param>
    /// <returns>A task representing the sync operation.</returns>
    Task PerformFullSyncAsync(string queryId, QueryConfig queryConfig, string stateStoreName);

    /// <summary>
    /// Processes a change event by applying it to the Dapr state store.
    /// </summary>
    /// <param name="queryId">The ID of the query.</param>
    /// <param name="queryConfig">The configuration for the query.</param>
    /// <param name="stateStoreName">The name of the target Dapr state store.</param>
    /// <param name="evt">The change event to process.</param>
    /// <returns>A task representing the change processing operation.</returns>   
    Task ProcessChangeAsync(string queryId, QueryConfig queryConfig, string stateStoreName, ChangeEvent evt);
}