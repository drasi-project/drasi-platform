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

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Manages synchronization points for Drasi queries to ensure idempotent processing
/// and enable recovery from the last known good position.
/// Sync points are stored in a dedicated metadata collection separate from data collections.
/// </summary>
public interface ISyncPointManager
{
    /// <summary>
    /// Initializes the metadata collection for storing sync points.
    /// This should be called once during reaction startup.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    Task InitializeMetadataCollectionAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets the sync point (last processed sequence number) for a specific query.
    /// </summary>
    /// <param name="reactionName">The name of the reaction instance</param>
    /// <param name="queryId">The unique identifier for the query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The last processed sequence number, or null if no sync point exists</returns>
    Task<long?> GetSyncPointAsync(
        string reactionName, 
        string queryId,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Updates the sync point after successful processing of a change event.
    /// </summary>
    /// <param name="reactionName">The name of the reaction instance</param>
    /// <param name="queryId">The unique identifier for the query</param>
    /// <param name="sequence">The sequence number that was successfully processed</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task UpdateSyncPointAsync(
        string reactionName, 
        string queryId,
        long sequence,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Attempts to update the sync point after successful processing of a change event.
    /// </summary>
    /// <param name="reactionName">The name of the reaction instance</param>
    /// <param name="queryId">The unique identifier for the query</param>
    /// <param name="sequence">The sequence number that was successfully processed</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the sync point was successfully updated, false otherwise</returns>
    Task<bool> TryUpdateSyncPointAsync(
        string reactionName, 
        string queryId,
        long sequence,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Initializes sync point on first run for a query.
    /// </summary>
    /// <param name="reactionName">The name of the reaction instance</param>
    /// <param name="queryId">The unique identifier for the query</param>
    /// <param name="initialSequence">The initial sequence number (default is 0)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if initialization was successful</returns>
    Task<bool> InitializeSyncPointAsync(
        string reactionName, 
        string queryId,
        long initialSequence = 0,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Deletes sync point (for cleanup/reset scenarios).
    /// </summary>
    /// <param name="reactionName">The name of the reaction instance</param>
    /// <param name="queryId">The unique identifier for the query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteSyncPointAsync(
        string reactionName, 
        string queryId,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Metadata stored in the sync point document
/// </summary>
public class SyncPointMetadata
{
    public string ReactionName { get; set; } = string.Empty;
    public string QueryId { get; set; } = string.Empty;
    public long Sequence { get; set; }
    public DateTime LastUpdated { get; set; }
    public long ProcessedCount { get; set; }
    public string Version { get; set; } = "1.0";
}