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
using Microsoft.Extensions.Logging;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests;

public class ChangeEventHandlerTests
{
    private readonly Mock<IVectorStoreService> _mockVectorStoreService;
    private readonly Mock<IDocumentProcessor> _mockDocumentProcessor;
    private readonly Mock<ISyncPointManager> _mockSyncPointManager;
    private readonly Mock<ILogger<ChangeEventHandler>> _mockLogger;
    private readonly ChangeEventHandler _handler;
    private readonly string _reactionName = "test-reaction";

    public ChangeEventHandlerTests()
    {
        Environment.SetEnvironmentVariable("REACTION_NAME", _reactionName);
        
        _mockVectorStoreService = new Mock<IVectorStoreService>();
        _mockDocumentProcessor = new Mock<IDocumentProcessor>();
        _mockSyncPointManager = new Mock<ISyncPointManager>();
        _mockLogger = new Mock<ILogger<ChangeEventHandler>>();
        
        _handler = new ChangeEventHandler(
            _mockVectorStoreService.Object,
            _mockDocumentProcessor.Object,
            _mockSyncPointManager.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task HandleChange_NullQueryConfig_ThrowsArgumentNullException()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query", Sequence = 1 };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleChange(evt, null));
    }

    [Fact]
    public async Task HandleChange_SyncPointNotFound_ThrowsInvalidOperationException()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query", Sequence = 10 };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((long?)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.Contains("not yet initialized", ex.Message);
    }

    [Fact]
    public async Task HandleChange_OldSequence_SkipsProcessing()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query", Sequence = 5 };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L); // Current sync point is higher than event sequence

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDocumentProcessor.VerifyNoOtherCalls();
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<long>(), It.IsAny<CancellationToken>()), 
            Times.Never);
    }

    [Fact]
    public async Task HandleChange_AddedItems_ProcessesAndUpdatesSyncPoint()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item1" }, { "name", "Test Item" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        var mockVectorDoc = new VectorDocument { Key = "item1", Content = "Test content" };
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(It.IsAny<IEnumerable<Dictionary<string, object>>>(), queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VectorDocument> { mockVectorDoc });
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockVectorStoreService.Verify(x => x.UpsertAsync(
            mockCollection, 
            It.Is<IEnumerable<VectorDocument>>(docs => docs.Count() == 1 && docs.First().Key == "item1"), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
        
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            _reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task HandleChange_UpdatedItems_ProcessesAndUpdatesSyncPoint()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            UpdatedResults = new[]
            {
                new UpdatedResultElement 
                { 
                    After = new Dictionary<string, object> { { "id", "item1" }, { "name", "Updated Item" } }
                }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        var mockVectorDoc = new VectorDocument { Key = "item1", Content = "Updated content" };
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(It.IsAny<IEnumerable<Dictionary<string, object>>>(), queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VectorDocument> { mockVectorDoc });
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockVectorStoreService.Verify(x => x.UpsertAsync(
            mockCollection, 
            It.Is<IEnumerable<VectorDocument>>(docs => docs.Count() == 1 && docs.First().Key == "item1"), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
        
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            _reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task HandleChange_DeletedItems_ProcessesAndUpdatesSyncPoint()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            DeletedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item1" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ExtractKey(It.IsAny<Dictionary<string, object>>(), queryConfig))
            .Returns("item1");
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockVectorStoreService.Verify(x => x.DeleteAsync(
            mockCollection, 
            It.Is<IEnumerable<string>>(keys => keys.Count() == 1 && keys.First() == "item1"), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
        
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            _reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task HandleChange_MixedOperations_ProcessesAllAndUpdatesSyncPoint()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item-add" }, { "name", "New Item" } }
            },
            UpdatedResults = new[]
            {
                new UpdatedResultElement 
                { 
                    After = new Dictionary<string, object> { { "id", "item-update" }, { "name", "Updated Item" } }
                }
            },
            DeletedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item-delete" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        var mockVectorDocs = new List<VectorDocument> 
        { 
            new VectorDocument { Key = "item-add", Content = "New content" },
            new VectorDocument { Key = "item-update", Content = "Updated content" }
        };
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(It.IsAny<IEnumerable<Dictionary<string, object>>>(), queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockVectorDocs);
        
        _mockDocumentProcessor
            .Setup(x => x.ExtractKey(It.IsAny<Dictionary<string, object>>(), queryConfig))
            .Returns("item-delete");
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockVectorStoreService.Verify(x => x.UpsertAsync(
            mockCollection, 
            It.Is<IEnumerable<VectorDocument>>(docs => docs.Count() == 2), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
        
        _mockVectorStoreService.Verify(x => x.DeleteAsync(
            mockCollection, 
            It.Is<IEnumerable<string>>(keys => keys.Count() == 1 && keys.First() == "item-delete"), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
        
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            _reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task HandleChange_FiltersOutSyncPointKeys()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "sync_test-query" }, { "value", "sync data" } },
                new Dictionary<string, object> { { "id", "item1" }, { "name", "Regular Item" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        var mockVectorDoc = new VectorDocument { Key = "item1", Content = "Regular content" };
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(
                It.Is<IEnumerable<Dictionary<string, object>>>(docs => docs.Count() == 1 && !docs.Any(d => d["id"].ToString()!.StartsWith("sync_"))), 
                queryConfig, 
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VectorDocument> { mockVectorDoc });
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDocumentProcessor.Verify(x => x.ProcessDocumentsAsync(
            It.Is<IEnumerable<Dictionary<string, object>>>(docs => docs.Count() == 1), 
            queryConfig, 
            It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task HandleChange_UpdateSyncPointFails_ThrowsInvalidOperationException()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item1" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(It.IsAny<IEnumerable<Dictionary<string, object>>>(), queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VectorDocument> { new VectorDocument { Key = "item1" } });
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false); // Sync point update fails

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.Contains("Failed to update sync point", ex.Message);
    }

    [Fact]
    public async Task HandleChange_UpsertThrowsException_PropagatesException()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item1" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(It.IsAny<IEnumerable<Dictionary<string, object>>>(), queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VectorDocument> { new VectorDocument { Key = "item1" } });
        
        _mockVectorStoreService
            .Setup(x => x.UpsertAsync(It.IsAny<object>(), It.IsAny<IEnumerable<VectorDocument>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Upsert failed"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _handler.HandleChange(evt, queryConfig));
        
        // Verify sync point was not updated
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<long>(), It.IsAny<CancellationToken>()), 
            Times.Never);
    }

    [Fact]
    public async Task HandleChange_EmptyDocumentsAfterProcessing_LogsWarning()
    {
        // Arrange
        var evt = new ChangeEvent 
        { 
            QueryId = "test-query", 
            Sequence = 15,
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "item1" } }
            }
        };
        var queryConfig = new QueryConfig 
        { 
            KeyField = "id", 
            CollectionName = "test-collection"
        };
        
        var mockCollection = new object();
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(_reactionName, evt.QueryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10L);
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(It.IsAny<IEnumerable<Dictionary<string, object>>>(), queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VectorDocument>()); // Empty list
        
        _mockSyncPointManager
            .Setup(x => x.TryUpdateSyncPointAsync(_reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockVectorStoreService.Verify(x => x.UpsertAsync(
            It.IsAny<object>(), It.IsAny<IEnumerable<VectorDocument>>(), It.IsAny<CancellationToken>()), 
            Times.Never);
        
        _mockSyncPointManager.Verify(x => x.TryUpdateSyncPointAsync(
            _reactionName, evt.QueryId, evt.Sequence, It.IsAny<CancellationToken>()), 
            Times.Once);
    }
}