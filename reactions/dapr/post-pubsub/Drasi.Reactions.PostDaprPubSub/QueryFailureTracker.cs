// Copyright 2024 The Drasi Authors.
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
using System.Collections.Concurrent;

namespace Drasi.Reactions.PostDaprPubSub;

/// <summary>
/// Interface for tracking query failures.
/// </summary>
public interface IQueryFailureTracker
{
    /// <summary>
    /// Records a failure for the specified query.
    /// </summary>
    /// <param name="queryId">The query ID</param>
    /// <param name="maxFailureCount">Maximum allowed failures before query is considered failed</param>
    /// <param name="reason">Reason for the failure</param>
    /// <returns>True if the query is now in a failed state</returns>
    bool RecordFailure(string queryId, int maxFailureCount, string reason);
    
    /// <summary>
    /// Reset the failure count for a query.
    /// </summary>
    /// <param name="queryId">The query ID</param>
    void ResetFailures(string queryId);
    
    /// <summary>
    /// Checks if a query is in a failed state.
    /// </summary>
    /// <param name="queryId">The query ID</param>
    /// <returns>True if query is in failed state</returns>
    bool IsQueryFailed(string queryId);
    
    /// <summary>
    /// Gets the reason a query failed.
    /// </summary>
    /// <param name="queryId">The query ID</param>
    /// <returns>The failure reason or null if not failed</returns>
    string? GetFailureReason(string queryId);
}

/// <summary>
/// Class to store the state of a query in the failure tracker.
/// </summary>
public class QueryState
{
    /// <summary>
    /// Current count of consecutive failures.
    /// </summary>
    public int FailureCount { get; set; } = 0;
    
    /// <summary>
    /// Whether the query is in a failed state.
    /// </summary>
    public bool IsFailed { get; set; } = false;
    
    /// <summary>
    /// The reason for failure, if the query is in a failed state.
    /// </summary>
    public string? Reason { get; set; }
}

/// <summary>
/// Implementation of the query failure tracker using ConcurrentDictionary.
/// </summary>
public class QueryFailureTracker : IQueryFailureTracker
{
    private readonly ConcurrentDictionary<string, QueryState> _queryStates = new();
    private readonly ILogger<QueryFailureTracker> _logger;
    
    public QueryFailureTracker(ILogger<QueryFailureTracker> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    
    public bool RecordFailure(string queryId, int maxFailureCount, string reason)
    {
        var result = _queryStates.AddOrUpdate(
            queryId,
            // If the query doesn't exist yet, create a new state with failure count 1
            _ => 
            {
                var isFailed = 1 >= maxFailureCount;
                var newState = new QueryState 
                { 
                    FailureCount = 1,
                    IsFailed = isFailed,
                    Reason = isFailed 
                        ? $"Exceeded maximum failure count ({maxFailureCount}): {reason}" 
                        : null
                };
                
                _logger.LogWarning("Query {QueryId} failure count: 1/{MaxFailures}", 
                    queryId, maxFailureCount);
                
                if (isFailed)
                {
                    _logger.LogError("Query {QueryId} marked as failed: {Reason}", 
                        queryId, newState.Reason);
                }
                
                return newState;
            },
            // If the query already exists, update its state
            (_, state) =>
            {
                // Only increment and check if not already in failed state
                if (!state.IsFailed)
                {
                    state.FailureCount++;
                    
                    _logger.LogWarning("Query {QueryId} failure count: {FailureCount}/{MaxFailures}", 
                        queryId, state.FailureCount, maxFailureCount);
                    
                    if (state.FailureCount >= maxFailureCount)
                    {
                        state.IsFailed = true;
                        state.Reason = $"Exceeded maximum failure count ({maxFailureCount}): {reason}";
                        
                        _logger.LogError("Query {QueryId} marked as failed: {Reason}", 
                            queryId, state.Reason);
                    }
                }
                return state;
            });
        
        return result.IsFailed;
    }
    
    public void ResetFailures(string queryId)
    {
        _queryStates.AddOrUpdate(
            queryId,
            _ => new QueryState(),
            (_, _) => new QueryState());
    }
    
    public bool IsQueryFailed(string queryId)
    {
        return _queryStates.TryGetValue(queryId, out var state) && state.IsFailed;
    }
    
    public string? GetFailureReason(string queryId)
    {
        return _queryStates.TryGetValue(queryId, out var state) ? state.Reason : null;
    }
}