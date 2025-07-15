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
using Moq;
using Xunit;

namespace Drasi.Reactions.PostDaprOutputBinding.Tests;

public class QueryFailureTrackerTests
{
    private readonly Mock<ILogger<QueryFailureTracker>> _mockLogger;
    private readonly QueryFailureTracker _tracker;
    
    public QueryFailureTrackerTests()
    {
        _mockLogger = new Mock<ILogger<QueryFailureTracker>>();
        _tracker = new QueryFailureTracker(_mockLogger.Object);
    }
    
    [Fact]
    public void RecordFailure_BelowThreshold_ShouldNotMarkQueryAsFailed()
    {
        // Arrange
        string queryId = "test-query";
        int maxFailures = 3;
        
        // Act
        bool failed1 = _tracker.RecordFailure(queryId, maxFailures, "First failure");
        bool failed2 = _tracker.RecordFailure(queryId, maxFailures, "Second failure");
        
        // Assert
        Assert.False(failed1);
        Assert.False(failed2);
        Assert.False(_tracker.IsQueryFailed(queryId));
        Assert.Null(_tracker.GetFailureReason(queryId));
    }
    
    [Fact]
    public void RecordFailure_ReachesThreshold_ShouldMarkQueryAsFailed()
    {
        // Arrange
        string queryId = "test-query";
        int maxFailures = 3;
        
        // Act
        _tracker.RecordFailure(queryId, maxFailures, "First failure");
        _tracker.RecordFailure(queryId, maxFailures, "Second failure");
        bool failed3 = _tracker.RecordFailure(queryId, maxFailures, "Third failure");
        
        // Assert
        Assert.True(failed3);
        Assert.True(_tracker.IsQueryFailed(queryId));
        Assert.Contains("Third failure", _tracker.GetFailureReason(queryId) ?? string.Empty);
    }
    
    [Fact]
    public void RecordFailure_ExceedsThreshold_ShouldKeepQueryAsFailed()
    {
        // Arrange
        string queryId = "test-query";
        int maxFailures = 2;
        
        // Act
        _tracker.RecordFailure(queryId, maxFailures, "First failure");
        bool failed2 = _tracker.RecordFailure(queryId, maxFailures, "Second failure");
        bool failed3 = _tracker.RecordFailure(queryId, maxFailures, "Third failure");
        
        // Assert
        Assert.True(failed2); // Second failure reaches threshold
        Assert.True(failed3); // Third failure, already failed
        Assert.True(_tracker.IsQueryFailed(queryId));
        Assert.Contains("Second failure", _tracker.GetFailureReason(queryId) ?? string.Empty);
    }
    
    [Fact]
    public void RecordFailure_ThresholdOfOne_ShouldMarkQueryAsFailedImmediately()
    {
        // Arrange
        string queryId = "test-query";
        int maxFailures = 1;
        
        // Act
        bool failed = _tracker.RecordFailure(queryId, maxFailures, "Only failure");
        
        // Assert
        Assert.True(failed);
        Assert.True(_tracker.IsQueryFailed(queryId));
        Assert.Contains("Only failure", _tracker.GetFailureReason(queryId) ?? string.Empty);
    }
    
    [Fact]
    public void ResetFailures_ShouldResetFailedState()
    {
        // Arrange
        string queryId = "test-query";
        int maxFailures = 1;
        _tracker.RecordFailure(queryId, maxFailures, "Only failure");
        Assert.True(_tracker.IsQueryFailed(queryId)); // Verify setup
        
        // Act
        _tracker.ResetFailures(queryId);
        
        // Assert
        Assert.False(_tracker.IsQueryFailed(queryId));
        Assert.Null(_tracker.GetFailureReason(queryId));
    }
    
    [Fact]
    public void IsQueryFailed_NonExistentQuery_ShouldReturnFalse()
    {
        // Act & Assert
        Assert.False(_tracker.IsQueryFailed("non-existent-query"));
    }
    
    [Fact]
    public void GetFailureReason_NonExistentQuery_ShouldReturnNull()
    {
        // Act & Assert
        Assert.Null(_tracker.GetFailureReason("non-existent-query"));
    }
    
    [Fact]
    public void ResetFailures_NonExistentQuery_ShouldNotThrowException()
    {
        // Act & Assert - should not throw
        _tracker.ResetFailures("non-existent-query");
    }
    
    [Fact]
    public void MultipleQueries_ShouldTrackIndependently()
    {
        // Arrange
        string query1 = "query1";
        string query2 = "query2";
        int maxFailures = 2;
        
        // Act
        _tracker.RecordFailure(query1, maxFailures, "Query1 failure 1");
        _tracker.RecordFailure(query2, maxFailures, "Query2 failure 1");
        bool query1Failed = _tracker.RecordFailure(query1, maxFailures, "Query1 failure 2");
        
        // Assert
        Assert.True(query1Failed);
        Assert.True(_tracker.IsQueryFailed(query1));
        Assert.False(_tracker.IsQueryFailed(query2));
        
        // Reset only query1
        _tracker.ResetFailures(query1);
        Assert.False(_tracker.IsQueryFailed(query1));
        Assert.False(_tracker.IsQueryFailed(query2));
    }
    
    [Fact]
    public async Task RecordFailure_ConcurrentOperations_ShouldBeThreadSafe()
    {
        // Arrange
        const string queryId = "test-query";
        const int maxFailures = 100;
        var tasks = new List<Task<bool>>();
        
        // Act
        for (var i = 0; i < 200; i++)
        {
            var i1 = i;
            tasks.Add(Task.Run(() => _tracker.RecordFailure(queryId, maxFailures, $"Failure {i1}")));
        }
        
        await Task.WhenAll(tasks.ToArray());
        
        // Assert
        Assert.True(_tracker.IsQueryFailed(queryId));
    }
}