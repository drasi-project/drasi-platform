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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests.Services;

public class SyncPointManagerTests
{
    private readonly Mock<IVectorStoreService> _mockVectorStoreService;
    private readonly Mock<ILogger<SyncPointManager>> _mockLogger;
    private readonly Mock<IVectorCollectionAdapter> _mockMetadataCollection;
    private readonly SyncPointManager _syncPointManager;

    public SyncPointManagerTests()
    {
        _mockVectorStoreService = new Mock<IVectorStoreService>();
        _mockLogger = new Mock<ILogger<SyncPointManager>>();
        _mockMetadataCollection = new Mock<IVectorCollectionAdapter>();
        _syncPointManager = new SyncPointManager(
            _mockVectorStoreService.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task InitializeMetadataCollectionAsync_CreatesMetadataCollection()
    {
        // Arrange
        Environment.SetEnvironmentVariable("REACTION_NAME", "test-reaction");
        var expectedCollectionName = "_drasi_metadata_test-reaction";
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                expectedCollectionName,
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockMetadataCollection.Object);

        // Act
        await _syncPointManager.InitializeMetadataCollectionAsync();

        // Assert
        _mockVectorStoreService.Verify(x => x.GetOrCreateCollectionAsync(
            expectedCollectionName,
            It.Is<QueryConfig>(q => 
                q.CollectionName == expectedCollectionName &&
                q.KeyField == "key" &&
                q.CreateCollection == true),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetSyncPointAsync_ThrowsWhenMetadataCollectionNotInitialized()
    {
        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await _syncPointManager.GetSyncPointAsync("reaction", "query1"));
    }

    [Fact]
    public async Task GetSyncPointAsync_ReturnsNullWhenNoSyncPointExists()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        _mockMetadataCollection
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((VectorDocument?)null);

        // Act
        var result = await _syncPointManager.GetSyncPointAsync("test-reaction", "query1");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetSyncPointAsync_ReturnsCachedValueOnSecondCall()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        var syncPointDoc = CreateSyncPointDocument("test-reaction", "query1", 100);
        _mockMetadataCollection
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(syncPointDoc);

        // Act
        var result1 = await _syncPointManager.GetSyncPointAsync("test-reaction", "query1");
        var result2 = await _syncPointManager.GetSyncPointAsync("test-reaction", "query1");

        // Assert
        Assert.Equal(100, result1);
        Assert.Equal(100, result2);
        
        // Verify GetAsync was called only once (second call used cache)
        _mockMetadataCollection.Verify(x => x.GetAsync(
            It.IsAny<string>(), 
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateSyncPointAsync_UpdatesValueAndCache()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        var capturedDocuments = new List<VectorDocument>();
        _mockVectorStoreService
            .Setup(x => x.UpsertAsync(
                _mockMetadataCollection.Object,
                It.IsAny<IEnumerable<VectorDocument>>(),
                It.IsAny<CancellationToken>()))
            .Callback<object, IEnumerable<VectorDocument>, CancellationToken>((_, docs, __) =>
                capturedDocuments.AddRange(docs))
            .Returns(Task.CompletedTask);

        // Act
        await _syncPointManager.UpdateSyncPointAsync("test-reaction", "query1", 200);

        // Assert
        Assert.Single(capturedDocuments);
        var doc = capturedDocuments.First();
        Assert.Equal("sync_query1", doc.Key);
        
        var metadata = JsonSerializer.Deserialize<SyncPointMetadata>(doc.Content);
        Assert.NotNull(metadata);
        Assert.Equal(200, metadata.Sequence);
        Assert.Equal("test-reaction", metadata.ReactionName);
        Assert.Equal("query1", metadata.QueryId);
    }

    [Fact]
    public async Task TryUpdateSyncPointAsync_ReturnsTrueOnSuccess()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        _mockVectorStoreService
            .Setup(x => x.UpsertAsync(
                _mockMetadataCollection.Object,
                It.IsAny<IEnumerable<VectorDocument>>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _syncPointManager.TryUpdateSyncPointAsync("test-reaction", "query1", 300);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task TryUpdateSyncPointAsync_ReturnsFalseOnException()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        _mockVectorStoreService
            .Setup(x => x.UpsertAsync(
                _mockMetadataCollection.Object,
                It.IsAny<IEnumerable<VectorDocument>>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Storage error"));

        // Act
        var result = await _syncPointManager.TryUpdateSyncPointAsync("test-reaction", "query1", 300);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task InitializeSyncPointAsync_CreatesNewSyncPoint()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        _mockMetadataCollection
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((VectorDocument?)null);
        
        var capturedDocuments = new List<VectorDocument>();
        _mockVectorStoreService
            .Setup(x => x.UpsertAsync(
                _mockMetadataCollection.Object,
                It.IsAny<IEnumerable<VectorDocument>>(),
                It.IsAny<CancellationToken>()))
            .Callback<object, IEnumerable<VectorDocument>, CancellationToken>((_, docs, __) =>
                capturedDocuments.AddRange(docs))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _syncPointManager.InitializeSyncPointAsync("test-reaction", "query1", 50);

        // Assert
        Assert.True(result);
        Assert.Single(capturedDocuments);
        
        var metadata = JsonSerializer.Deserialize<SyncPointMetadata>(capturedDocuments.First().Content);
        Assert.NotNull(metadata);
        Assert.Equal(50, metadata.Sequence);
        Assert.Equal(0, metadata.ProcessedCount);
    }

    [Fact]
    public async Task InitializeSyncPointAsync_ReturnsTrueIfAlreadyExists()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        var existingDoc = CreateSyncPointDocument("test-reaction", "query1", 100);
        _mockMetadataCollection
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingDoc);

        // Act
        var result = await _syncPointManager.InitializeSyncPointAsync("test-reaction", "query1", 50);

        // Assert
        Assert.True(result);
        
        // Verify no upsert was called since sync point already exists
        _mockVectorStoreService.Verify(x => x.UpsertAsync(
            It.IsAny<object>(),
            It.IsAny<IEnumerable<VectorDocument>>(),
            It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteSyncPointAsync_DeletesSyncPointAndClearsCache()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        // First add a sync point to cache
        var syncPointDoc = CreateSyncPointDocument("test-reaction", "query1", 100);
        _mockMetadataCollection
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(syncPointDoc);
        
        await _syncPointManager.GetSyncPointAsync("test-reaction", "query1");
        
        // Setup delete
        _mockVectorStoreService
            .Setup(x => x.DeleteAsync(
                _mockMetadataCollection.Object,
                It.IsAny<IEnumerable<string>>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _syncPointManager.DeleteSyncPointAsync("test-reaction", "query1");

        // Assert
        _mockVectorStoreService.Verify(x => x.DeleteAsync(
            _mockMetadataCollection.Object,
            It.Is<IEnumerable<string>>(keys => keys.Single() == "sync_query1"),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateSyncPointAsync_IncrementsProcessedCount()
    {
        // Arrange
        await InitializeMetadataCollection();
        
        // Set up existing sync point with processed count
        var existingDoc = CreateSyncPointDocument("test-reaction", "query1", 100, 5);
        _mockMetadataCollection
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingDoc);
        
        var capturedDocuments = new List<VectorDocument>();
        _mockVectorStoreService
            .Setup(x => x.UpsertAsync(
                _mockMetadataCollection.Object,
                It.IsAny<IEnumerable<VectorDocument>>(),
                It.IsAny<CancellationToken>()))
            .Callback<object, IEnumerable<VectorDocument>, CancellationToken>((_, docs, __) =>
                capturedDocuments.AddRange(docs))
            .Returns(Task.CompletedTask);

        // Act
        await _syncPointManager.UpdateSyncPointAsync("test-reaction", "query1", 200);

        // Assert
        var metadata = JsonSerializer.Deserialize<SyncPointMetadata>(capturedDocuments.First().Content);
        Assert.NotNull(metadata);
        Assert.Equal(6, metadata.ProcessedCount); // Should be incremented from 5 to 6
    }

    [Fact]
    public void GetSyncPointKeyForQuery_ReturnsCorrectKey()
    {
        // Act
        var key = SyncPointManager.GetSyncPointKeyForQuery("query1");

        // Assert
        Assert.Equal("sync_query1", key);
    }

    private async Task InitializeMetadataCollection()
    {
        Environment.SetEnvironmentVariable("REACTION_NAME", "test-reaction");
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                It.IsAny<string>(),
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockMetadataCollection.Object);
        
        await _syncPointManager.InitializeMetadataCollectionAsync();
    }

    private VectorDocument CreateSyncPointDocument(string reactionName, string queryId, long sequence, long processedCount = 0)
    {
        var metadata = new SyncPointMetadata
        {
            ReactionName = reactionName,
            QueryId = queryId,
            Sequence = sequence,
            LastUpdated = DateTime.UtcNow,
            ProcessedCount = processedCount,
            Version = "1.0"
        };

        return new VectorDocument
        {
            Key = $"sync_{queryId}",
            Content = JsonSerializer.Serialize(metadata),
            Title = $"Sync Point - Reaction: {reactionName}, Query: {queryId}",
            Source = "drasi-sync-metadata",
            Vector = new[] { 0.0f },
            Timestamp = DateTimeOffset.UtcNow
        };
    }
}