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
using System.Threading;
using System.Threading.Tasks;
using Drasi.Reaction.SDK.Models.ViewService;
using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using static Drasi.Reaction.SDK.Models.ViewService.ViewItem;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests.Services;

public class QueryInitializationServiceTests
{
    private readonly Mock<IVectorStoreService> _mockVectorStoreService;
    private readonly Mock<IEmbeddingService> _mockEmbeddingService;
    private readonly Mock<ISyncPointManager> _mockSyncPointManager;
    private readonly Mock<IQueryConfigService> _mockQueryConfigService;
    private readonly Mock<IResultViewClient> _mockResultViewClient;
    private readonly Mock<IDocumentProcessor> _mockDocumentProcessor;
    private readonly Mock<IExtendedManagementClient> _mockManagementClient;
    private readonly Mock<IErrorStateHandler> _mockErrorStateHandler;
    private readonly Mock<ILogger<QueryInitializationService>> _mockLogger;
    private readonly QueryInitializationService _service;

    public QueryInitializationServiceTests()
    {
        _mockVectorStoreService = new Mock<IVectorStoreService>();
        _mockEmbeddingService = new Mock<IEmbeddingService>();
        _mockSyncPointManager = new Mock<ISyncPointManager>();
        _mockQueryConfigService = new Mock<IQueryConfigService>();
        _mockResultViewClient = new Mock<IResultViewClient>();
        _mockDocumentProcessor = new Mock<IDocumentProcessor>();
        _mockManagementClient = new Mock<IExtendedManagementClient>();
        _mockErrorStateHandler = new Mock<IErrorStateHandler>();
        _mockLogger = new Mock<ILogger<QueryInitializationService>>();

        _service = new QueryInitializationService(
            _mockVectorStoreService.Object,
            _mockEmbeddingService.Object,
            _mockSyncPointManager.Object,
            _mockQueryConfigService.Object,
            _mockResultViewClient.Object,
            _mockDocumentProcessor.Object,
            _mockManagementClient.Object,
            _mockErrorStateHandler.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task InitializeQueriesAsync_TestsConnectivityAndInitializesMetadataCollection()
    {
        // Arrange
        SetupConnectivityTests();
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string>());

        // Act
        await _service.InitializeQueriesAsync(CancellationToken.None);

        // Assert
        // Verify connectivity tests
        _mockVectorStoreService.Verify(x => x.GetOrCreateCollectionAsync(
            It.Is<string>(s => s.StartsWith("_drasi_test_")),
            It.IsAny<QueryConfig>(),
            It.IsAny<CancellationToken>()), Times.Once);
        
        _mockEmbeddingService.Verify(x => x.GenerateEmbeddingAsync(
            "test",
            It.IsAny<CancellationToken>()), Times.Once);
        
        // Verify metadata collection initialization
        _mockSyncPointManager.Verify(x => x.InitializeMetadataCollectionAsync(
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task InitializeQueriesAsync_SkipsQueryWithMissingConfiguration()
    {
        // Arrange
        SetupConnectivityTests();
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string> { "query1" });
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns((QueryConfig?)null);

        // Act
        await _service.InitializeQueriesAsync(CancellationToken.None);

        // Assert - only the test collection for connectivity should be created
        _mockVectorStoreService.Verify(x => x.GetOrCreateCollectionAsync(
            It.Is<string>(s => !s.StartsWith("_drasi_test_")),
            It.Is<QueryConfig>(q => q.CollectionName != null),
            It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task InitializeQueriesAsync_InitializesCollectionForEachQuery()
    {
        // Arrange
        SetupConnectivityTests();
        SetupQueryWithExistingSyncPoint("query1", "collection1", 100);

        // Act
        await _service.InitializeQueriesAsync(CancellationToken.None);

        // Assert
        _mockVectorStoreService.Verify(x => x.GetOrCreateCollectionAsync(
            "collection1",
            It.Is<QueryConfig>(q => q.CollectionName == "collection1"),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task InitializeQueriesAsync_BootstrapsQueryWithNoSyncPoint()
    {
        // Arrange
        SetupConnectivityTests();
        
        var config = new QueryConfig
        {
            CollectionName = "collection1",
            KeyField = "id"
        };
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string> { "query1" });
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(config);
        
        var mockCollection = new Mock<object>();
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                "collection1",
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection.Object);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(
                It.IsAny<string>(),
                "query1",
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((long?)null);
        
        _mockManagementClient
            .Setup(x => x.WaitForQueryReadyAsync(
                "query1",
                It.IsAny<int>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        
        SetupBootstrapData("query1", 1000, new List<Dictionary<string, object>>());

        // Act
        await _service.InitializeQueriesAsync(CancellationToken.None);

        // Assert
        _mockManagementClient.Verify(x => x.WaitForQueryReadyAsync(
            "query1",
            300,
            It.IsAny<CancellationToken>()), Times.Once);
        
        _mockSyncPointManager.Verify(x => x.InitializeSyncPointAsync(
            It.IsAny<string>(),
            "query1",
            1000,
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task InitializeQueriesAsync_BootstrapsWithInitialData()
    {
        // Arrange
        SetupConnectivityTests();
        
        var config = new QueryConfig
        {
            CollectionName = "collection1",
            KeyField = "id"
        };
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string> { "query1" });
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(config);
        
        var mockCollection = new Mock<object>();
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                "collection1",
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection.Object);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(
                It.IsAny<string>(),
                "query1",
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((long?)null);
        
        _mockManagementClient
            .Setup(x => x.WaitForQueryReadyAsync(
                "query1",
                It.IsAny<int>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        
        var initialData = new List<Dictionary<string, object>>
        {
            new() { ["id"] = "1", ["name"] = "Item1" },
            new() { ["id"] = "2", ["name"] = "Item2" }
        };
        
        SetupBootstrapData("query1", 1000, initialData);
        
        var documents = new List<VectorDocument>
        {
            new() { Key = "1", Content = "Item1" },
            new() { Key = "2", Content = "Item2" }
        };
        
        _mockDocumentProcessor
            .Setup(x => x.ProcessDocumentsAsync(
                initialData,
                config,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(documents);

        // Act
        await _service.InitializeQueriesAsync(CancellationToken.None);

        // Assert
        _mockVectorStoreService.Verify(x => x.UpsertAsync(
            mockCollection.Object,
            It.Is<IEnumerable<VectorDocument>>(docs => docs.Count() == 2),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task InitializeQueriesAsync_TerminatesOnQueryNotReady()
    {
        // Arrange
        SetupConnectivityTests();
        
        var config = new QueryConfig
        {
            CollectionName = "collection1",
            KeyField = "id"
        };
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string> { "query1" });
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(config);
        
        var mockCollection = new Mock<object>();
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                "collection1",
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection.Object);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(
                It.IsAny<string>(),
                "query1",
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((long?)null);
        
        _mockManagementClient
            .Setup(x => x.WaitForQueryReadyAsync(
                "query1",
                It.IsAny<int>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await _service.InitializeQueriesAsync(CancellationToken.None));
        
        // The terminate method is called twice - once in the initialization service and once in catch block
        _mockErrorStateHandler.Verify(x => x.Terminate(
            It.IsAny<string>()),
            Times.Exactly(2));
    }

    [Fact]
    public async Task InitializeQueriesAsync_TerminatesOnVectorStoreConnectivityFailure()
    {
        // Arrange
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                It.Is<string>(s => s.StartsWith("_drasi_test_")),
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Connection failed"));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(x => x.Terminate(
            It.Is<string>(s => s.Contains("Unable to connect to vector store"))),
            Times.Once);
    }

    [Fact]
    public async Task InitializeQueriesAsync_TerminatesOnEmbeddingServiceFailure()
    {
        // Arrange
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                It.Is<string>(s => s.StartsWith("_drasi_test_")),
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Mock<object>().Object);
        
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingAsync(
                "test",
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Embedding service unavailable"));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(x => x.Terminate(
            It.Is<string>(s => s.Contains("Unable to connect to embedding service"))),
            Times.Once);
    }

    private void SetupConnectivityTests()
    {
        // Setup successful connectivity tests
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                It.Is<string>(s => s.StartsWith("_drasi_test_")),
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Mock<object>().Object);
        
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingAsync(
                "test",
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new float[] { 0.1f, 0.2f, 0.3f }.AsMemory());
        
        _mockSyncPointManager
            .Setup(x => x.InitializeMetadataCollectionAsync(
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
    }

    private void SetupQueryWithExistingSyncPoint(string queryId, string collectionName, long syncPoint)
    {
        var config = new QueryConfig
        {
            CollectionName = collectionName,
            KeyField = "id"
        };
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string> { queryId });
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>(queryId))
            .Returns(config);
        
        _mockVectorStoreService
            .Setup(x => x.GetOrCreateCollectionAsync(
                collectionName,
                It.IsAny<QueryConfig>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Mock<object>().Object);
        
        _mockSyncPointManager
            .Setup(x => x.GetSyncPointAsync(
                It.IsAny<string>(),
                queryId,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(syncPoint);
    }

    private void SetupBootstrapData(string queryId, long syncPoint, List<Dictionary<string, object>> data)
    {
        var viewItems = new List<ViewItem>();
        
        // Add header item
        viewItems.Add(new ViewItem
        {
            Header = new HeaderClass { Sequence = syncPoint }
        });
        
        // Add data items
        foreach (var item in data)
        {
            viewItems.Add(new ViewItem { Data = item });
        }
        
        var asyncEnumerable = new TestAsyncEnumerable<ViewItem>(viewItems);
        
        _mockResultViewClient
            .Setup(x => x.GetCurrentResult(queryId, It.IsAny<CancellationToken>()))
            .Returns(asyncEnumerable);
    }

    private class TestAsyncEnumerable<T> : IAsyncEnumerable<T>
    {
        private readonly IEnumerable<T> _items;

        public TestAsyncEnumerable(IEnumerable<T> items)
        {
            _items = items;
        }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
        {
            return new TestAsyncEnumerator<T>(_items.GetEnumerator());
        }
    }

    private class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _enumerator;

        public TestAsyncEnumerator(IEnumerator<T> enumerator)
        {
            _enumerator = enumerator;
        }

        public T Current => _enumerator.Current;

        public ValueTask DisposeAsync()
        {
            _enumerator.Dispose();
            return ValueTask.CompletedTask;
        }

        public ValueTask<bool> MoveNextAsync()
        {
            return ValueTask.FromResult(_enumerator.MoveNext());
        }
    }
}