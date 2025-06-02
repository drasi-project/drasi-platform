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

using Xunit;
using Moq;
using Dapr.Client;
using Microsoft.Extensions.Logging;
using Dapr;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class QuerySyncPointManagerTests
{
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<ILogger<QuerySyncPointManager>> _mockLogger;
    private readonly QuerySyncPointManager _manager;

    public QuerySyncPointManagerTests()
    {
        _mockDaprClient = new Mock<DaprClient>();
        _mockLogger = new Mock<ILogger<QuerySyncPointManager>>();
        _manager = new QuerySyncPointManager(_mockDaprClient.Object, _mockLogger.Object);
    }

    // Tests that GetSyncPointKeyForQuery returns the correct key format.
    [Fact]
    public void GetSyncPointKeyForQuery_ReturnsCorrectKey()
    {
        // Arrange
        var queryId = "testQuery";
        var expectedKey = "_drasi-sync-statestore-reaction_sync_point__testQuery";

        // Act
        var result = _manager.GetSyncPointKeyForQuery(queryId);

        // Assert
        Assert.Equal(expectedKey, result);
    }

    // Tests that GetSyncPointForQuery returns the sequence number if it exists in the cache.
    [Fact]
    public async Task GetSyncPointForQuery_ReturnsSequenceNumber_WhenExists()
    {
        var queryId = "testQuery";
        var expectedSequence = 123L;

        // Load a sync point first
        _mockDaprClient.Setup(c => c.GetStateAsync<long?>(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<ConsistencyMode?>(),
                It.IsAny<IReadOnlyDictionary<string, string>?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedSequence);

        await _manager.TryLoadSyncPointAsync(queryId, "testStore");

        var result = _manager.GetSyncPointForQuery(queryId);

        Assert.Equal(expectedSequence, result);
    }

    // Tests that GetSyncPointForQuery returns null if the sequence number does not exist in the cache.
    [Fact]
    public void GetSyncPointForQuery_ReturnsNull_WhenNotExists()
    {
        var result = _manager.GetSyncPointForQuery("nonExistentQuery");

        Assert.Null(result);
    }

    // Tests that TryLoadSyncPointAsync loads and caches the sync point when found in Dapr state.
    [Fact]
    public async Task TryLoadSyncPointAsync_LoadsAndCachesSyncPoint_WhenFound()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var expectedSequence = 456L;
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.GetStateAsync<long?>(
                stateStoreName,
                syncPointKey,
                It.IsAny<ConsistencyMode?>(),
                It.IsAny<IReadOnlyDictionary<string, string>?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedSequence);

        var success = await _manager.TryLoadSyncPointAsync(queryName, stateStoreName);

        Assert.True(success);
        Assert.Equal(expectedSequence, _manager.GetSyncPointForQuery(queryName));
    }

    // Tests that TryLoadSyncPointAsync returns false when the sync point is not found in Dapr state.
    [Fact]
    public async Task TryLoadSyncPointAsync_ReturnsFalse_WhenNotFound()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.GetStateAsync<long?>(
                stateStoreName,
                syncPointKey,
                It.IsAny<ConsistencyMode?>(),
                It.IsAny<IReadOnlyDictionary<string, string>?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((long?)null);

        var success = await _manager.TryLoadSyncPointAsync(queryName, stateStoreName);

        Assert.False(success);
        Assert.Null(_manager.GetSyncPointForQuery(queryName));
    }

    // Tests that TryLoadSyncPointAsync returns false and logs an error when DaprClient throws DaprException.
    [Fact]
    public async Task TryLoadSyncPointAsync_ReturnsFalseAndLogs_WhenDaprExceptionOccurs()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.GetStateAsync<long?>(
                stateStoreName,
                syncPointKey,
                It.IsAny<ConsistencyMode?>(),
                It.IsAny<IReadOnlyDictionary<string, string>?>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DaprException("Dapr error"));

        var success = await _manager.TryLoadSyncPointAsync(queryName, stateStoreName);

        Assert.False(success);
        Assert.Null(_manager.GetSyncPointForQuery(queryName));
    }

    // Tests that TryLoadSyncPointAsync returns false and logs an error when DaprClient throws a generic Exception.
    [Fact]
    public async Task TryLoadSyncPointAsync_ReturnsFalseAndLogs_WhenGenericExceptionOccurs()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.GetStateAsync<long?>(
                stateStoreName, 
                syncPointKey, 
                It.IsAny<ConsistencyMode?>(), 
                It.IsAny<IReadOnlyDictionary<string, string>?>(), 
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Generic error"));

        var success = await _manager.TryLoadSyncPointAsync(queryName, stateStoreName);

        Assert.False(success);
        Assert.Null(_manager.GetSyncPointForQuery(queryName));
    }

    // Tests that TryUpdateSyncPointAsync successfully updates the sync point in Dapr and cache.
    [Fact]
    public async Task TryUpdateSyncPointAsync_UpdatesDaprAndCache_Successfully()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var sequenceNumber = 789L;
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.SaveStateAsync<long>(
                stateStoreName,
                syncPointKey,
                sequenceNumber,
                It.IsAny<StateOptions?>(),
                It.IsAny<IReadOnlyDictionary<string, string>?>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var success = await _manager.TryUpdateSyncPointAsync(queryName, stateStoreName, sequenceNumber);

        Assert.True(success);
        Assert.Equal(sequenceNumber, _manager.GetSyncPointForQuery(queryName));
        _mockDaprClient.Verify(c => c.SaveStateAsync<long>(
            stateStoreName,
            syncPointKey,
            sequenceNumber,
            It.IsAny<StateOptions?>(),
            It.IsAny<IReadOnlyDictionary<string, string>?>(),
            It.IsAny<CancellationToken>()),
            Times.Once);
    }

    // Tests that TryUpdateSyncPointAsync returns false and logs an error when DaprClient throws DaprException during save.
    [Fact]
    public async Task TryUpdateSyncPointAsync_ReturnsFalseAndLogs_WhenDaprExceptionOnSave()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var sequenceNumber = 789L;
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.SaveStateAsync<long>(
                stateStoreName, 
                syncPointKey, 
                sequenceNumber, 
                It.IsAny<StateOptions?>(), 
                It.IsAny<IReadOnlyDictionary<string, string>?>(), 
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DaprException("Dapr save error"));

        var success = await _manager.TryUpdateSyncPointAsync(queryName, stateStoreName, sequenceNumber);

        Assert.False(success);
    }

    // Tests that TryUpdateSyncPointAsync returns false and logs an error when DaprClient throws a generic Exception during save.
    [Fact]
    public async Task TryUpdateSyncPointAsync_ReturnsFalseAndLogs_WhenGenericExceptionOnSave()
    {
        var queryName = "testQuery";
        var stateStoreName = "testStore";
        var sequenceNumber = 789L;
        var syncPointKey = _manager.GetSyncPointKeyForQuery(queryName);

        _mockDaprClient.Setup(c => c.SaveStateAsync<long>(
                stateStoreName, 
                syncPointKey, 
                sequenceNumber, 
                It.IsAny<StateOptions?>(), 
                It.IsAny<IReadOnlyDictionary<string, string>?>(), 
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Generic save error"));

        var success = await _manager.TryUpdateSyncPointAsync(queryName, stateStoreName, sequenceNumber);

        Assert.False(success);
    }
}