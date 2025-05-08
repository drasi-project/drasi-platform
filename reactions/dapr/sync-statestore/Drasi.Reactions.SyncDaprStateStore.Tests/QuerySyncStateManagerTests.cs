using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class QuerySyncStateManagerTests
{
    private readonly NullLogger<QuerySyncStateManager> _nullLogger = NullLogger<QuerySyncStateManager>.Instance;
    private readonly QuerySyncStateManager _stateManager;

    public QuerySyncStateManagerTests()
    {
        _stateManager = new QuerySyncStateManager(_nullLogger);
    }

    [Fact]
    public void IsInitialized_WhenStateDoesNotExist_ReturnsFalse()
    {
        // Arrange
        string queryId = "query-nonexistent";

        // Act
        bool result = _stateManager.IsInitialized(queryId, out long sequence);

        // Assert
        Assert.False(result);
        Assert.Equal(-1, sequence);
    }

    [Fact]
    public void TryMarkInitialized_WhenNewQuery_ReturnsTrueAndSetsState()
    {
        // Arrange
        string queryId = "query-new";
        long initialSequence = 10;

        // Act
        bool markResult = _stateManager.TryMarkInitialized(queryId, initialSequence);
        bool isInitializedResult = _stateManager.IsInitialized(queryId, out long storedSequence);

        // Assert
        Assert.True(markResult);
        Assert.True(isInitializedResult);
        Assert.Equal(initialSequence, storedSequence);
    }

    [Fact]
    public void IsInitialized_WhenStateExistsAndInitialized_ReturnsTrueAndCorrectSequence()
    {
        // Arrange
        string queryId = "query-initialized";
        long initialSequence = 20;
        _stateManager.TryMarkInitialized(queryId, initialSequence);

        // Act
        bool result = _stateManager.IsInitialized(queryId, out long storedSequence);

        // Assert
        Assert.True(result);
        Assert.Equal(initialSequence, storedSequence);
    }

    [Fact]
    public void TryMarkInitialized_WhenAlreadyInitialized_ReturnsFalseAndKeepsOriginalState()
    {
        // Arrange
        string queryId = "query-already-init";
        long firstSequence = 30;
        long secondSequence = 35;
        _stateManager.TryMarkInitialized(queryId, firstSequence); // First initialization

        // Act
        bool secondMarkResult = _stateManager.TryMarkInitialized(queryId, secondSequence); // Attempt second initialization
        bool isInitializedResult = _stateManager.IsInitialized(queryId, out long storedSequence);

        // Assert
        Assert.False(secondMarkResult);
        Assert.True(isInitializedResult);
        Assert.Equal(firstSequence, storedSequence);
    }

    [Fact]
    public void ResetState_WhenStateExists_RemovesState()
    {
        // Arrange
        string queryId = "query-to-reset";
        long initialSequence = 40;
        _stateManager.TryMarkInitialized(queryId, initialSequence); // Initialize

        // Act
        _stateManager.ResetState(queryId);
        bool isInitializedResult = _stateManager.IsInitialized(queryId, out long storedSequence);

        // Assert
        Assert.False(isInitializedResult); // Should no longer be initialized
        Assert.Equal(-1, storedSequence);
    }

    [Fact]
    public void ResetState_WhenStateDoesNotExist_DoesNothing()
    {
        // Arrange
        string queryId = "query-never-existed";

        // Act
        _stateManager.ResetState(queryId);
        bool isInitializedResult = _stateManager.IsInitialized(queryId, out long storedSequence);

        // Assert
        Assert.False(isInitializedResult);
        Assert.Equal(-1, storedSequence);
    }

    [Fact]
    public void SequenceOfOperations_InitializeResetInitialize_WorksCorrectly()
    {
        // Arrange
        string queryId = "query-lifecycle";
        long firstSequence = 50;
        long secondSequence = 60;

        // Act & Assert - First Init
        Assert.True(_stateManager.TryMarkInitialized(queryId, firstSequence));
        Assert.True(_stateManager.IsInitialized(queryId, out var seq1));
        Assert.Equal(firstSequence, seq1);

        // Act & Assert - Reset
        _stateManager.ResetState(queryId);
        Assert.False(_stateManager.IsInitialized(queryId, out var seq2));
        Assert.Equal(-1, seq2);

        // Act & Assert - Second Init
        Assert.True(_stateManager.TryMarkInitialized(queryId, secondSequence));
        Assert.True(_stateManager.IsInitialized(queryId, out var seq3));
        Assert.Equal(secondSequence, seq3);
    }
}