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
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests.Services;

public class VectorStoreServiceTests
{
    private readonly Mock<IVectorStoreAdapter> _mockAdapter;
    private readonly Mock<ILogger<VectorStoreService>> _mockLogger;
    private readonly VectorStoreService _service;

    public VectorStoreServiceTests()
    {
        _mockAdapter = new Mock<IVectorStoreAdapter>();
        _mockLogger = new Mock<ILogger<VectorStoreService>>();
        _service = new VectorStoreService(_mockAdapter.Object, _mockLogger.Object);
    }

    [Fact]
    public void Constructor_NullAdapter_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new VectorStoreService(null!, _mockLogger.Object));
    }

    [Fact]
    public void Constructor_NullLogger_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new VectorStoreService(_mockAdapter.Object, null!));
    }

    [Fact]
    public async Task GetOrCreateCollectionAsync_NewCollection_CreatesAndCaches()
    {
        // Arrange
        var collectionName = "test-collection";
        var queryConfig = new QueryConfig { KeyField = "id" };
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        
        _mockAdapter
            .Setup(x => x.GetOrCreateCollectionAsync(collectionName, queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollectionAdapter.Object);

        // Act
        var result1 = await _service.GetOrCreateCollectionAsync(collectionName, queryConfig);
        var result2 = await _service.GetOrCreateCollectionAsync(collectionName, queryConfig);

        // Assert
        Assert.Same(mockCollectionAdapter.Object, result1);
        Assert.Same(result1, result2); // Should return cached instance
        
        // Verify adapter was called only once due to caching
        _mockAdapter.Verify(x => x.GetOrCreateCollectionAsync(collectionName, queryConfig, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetOrCreateCollectionAsync_MultipleCollections_CachesEachSeparately()
    {
        // Arrange
        var collection1Name = "collection1";
        var collection2Name = "collection2";
        var queryConfig = new QueryConfig { KeyField = "id" };
        var mockCollection1Adapter = new Mock<IVectorCollectionAdapter>();
        var mockCollection2Adapter = new Mock<IVectorCollectionAdapter>();
        
        _mockAdapter
            .Setup(x => x.GetOrCreateCollectionAsync(collection1Name, queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection1Adapter.Object);
        _mockAdapter
            .Setup(x => x.GetOrCreateCollectionAsync(collection2Name, queryConfig, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockCollection2Adapter.Object);

        // Act
        var result1 = await _service.GetOrCreateCollectionAsync(collection1Name, queryConfig);
        var result2 = await _service.GetOrCreateCollectionAsync(collection2Name, queryConfig);
        var result1Again = await _service.GetOrCreateCollectionAsync(collection1Name, queryConfig);

        // Assert
        Assert.Same(mockCollection1Adapter.Object, result1);
        Assert.Same(mockCollection2Adapter.Object, result2);
        Assert.Same(result1, result1Again);
        
        _mockAdapter.Verify(x => x.GetOrCreateCollectionAsync(collection1Name, queryConfig, It.IsAny<CancellationToken>()), Times.Once);
        _mockAdapter.Verify(x => x.GetOrCreateCollectionAsync(collection2Name, queryConfig, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpsertAsync_ValidCollection_CallsAdapterUpsert()
    {
        // Arrange
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        var documents = new List<VectorDocument>
        {
            new VectorDocument { Key = "doc1", Content = "Content 1" },
            new VectorDocument { Key = "doc2", Content = "Content 2" }
        };

        // Act
        await _service.UpsertAsync(mockCollectionAdapter.Object, documents);

        // Assert
        mockCollectionAdapter.Verify(x => x.UpsertAsync(
            It.Is<IEnumerable<VectorDocument>>(docs => docs.Count() == 2),
            It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task UpsertAsync_EmptyDocuments_DoesNotCallAdapter()
    {
        // Arrange
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        var documents = new List<VectorDocument>();

        // Act
        await _service.UpsertAsync(mockCollectionAdapter.Object, documents);

        // Assert
        mockCollectionAdapter.Verify(x => x.UpsertAsync(
            It.IsAny<IEnumerable<VectorDocument>>(),
            It.IsAny<CancellationToken>()), 
            Times.Never);
    }

    [Fact]
    public async Task UpsertAsync_InvalidCollectionType_ThrowsArgumentException()
    {
        // Arrange
        var invalidCollection = new object();
        var documents = new List<VectorDocument> { new VectorDocument { Key = "doc1" } };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => 
            _service.UpsertAsync(invalidCollection, documents));
        Assert.Contains("Invalid collection type", ex.Message);
    }

    [Fact]
    public async Task UpsertAsync_AdapterThrowsException_PropagatesException()
    {
        // Arrange
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        var documents = new List<VectorDocument> { new VectorDocument { Key = "doc1" } };
        var expectedException = new InvalidOperationException("Upsert failed");
        
        mockCollectionAdapter
            .Setup(x => x.UpsertAsync(It.IsAny<IEnumerable<VectorDocument>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => 
            _service.UpsertAsync(mockCollectionAdapter.Object, documents));
        Assert.Same(expectedException, ex);
    }

    [Fact]
    public async Task DeleteAsync_ValidCollection_CallsAdapterDelete()
    {
        // Arrange
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        var keys = new List<string> { "key1", "key2", "key3" };

        // Act
        await _service.DeleteAsync(mockCollectionAdapter.Object, keys);

        // Assert
        mockCollectionAdapter.Verify(x => x.DeleteAsync(
            It.Is<IEnumerable<string>>(k => k.Count() == 3),
            It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_EmptyKeys_DoesNotCallAdapter()
    {
        // Arrange
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        var keys = new List<string>();

        // Act
        await _service.DeleteAsync(mockCollectionAdapter.Object, keys);

        // Assert
        mockCollectionAdapter.Verify(x => x.DeleteAsync(
            It.IsAny<IEnumerable<string>>(),
            It.IsAny<CancellationToken>()), 
            Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_InvalidCollectionType_ThrowsArgumentException()
    {
        // Arrange
        var invalidCollection = new object();
        var keys = new List<string> { "key1" };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => 
            _service.DeleteAsync(invalidCollection, keys));
        Assert.Contains("Invalid collection type", ex.Message);
    }

    [Fact]
    public async Task DeleteAsync_AdapterThrowsException_PropagatesException()
    {
        // Arrange
        var mockCollectionAdapter = new Mock<IVectorCollectionAdapter>();
        var keys = new List<string> { "key1" };
        var expectedException = new InvalidOperationException("Delete failed");
        
        mockCollectionAdapter
            .Setup(x => x.DeleteAsync(It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => 
            _service.DeleteAsync(mockCollectionAdapter.Object, keys));
        Assert.Same(expectedException, ex);
    }

    [Fact]
    public async Task CollectionExistsAsync_CollectionExists_ReturnsTrue()
    {
        // Arrange
        var collectionName = "test-collection";
        _mockAdapter
            .Setup(x => x.CollectionExistsAsync(collectionName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _service.CollectionExistsAsync(collectionName);

        // Assert
        Assert.True(result);
        _mockAdapter.Verify(x => x.CollectionExistsAsync(collectionName, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CollectionExistsAsync_CollectionDoesNotExist_ReturnsFalse()
    {
        // Arrange
        var collectionName = "test-collection";
        _mockAdapter
            .Setup(x => x.CollectionExistsAsync(collectionName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _service.CollectionExistsAsync(collectionName);

        // Assert
        Assert.False(result);
        _mockAdapter.Verify(x => x.CollectionExistsAsync(collectionName, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CollectionExistsAsync_AdapterThrowsException_PropagatesException()
    {
        // Arrange
        var collectionName = "test-collection";
        var expectedException = new InvalidOperationException("Check failed");
        
        _mockAdapter
            .Setup(x => x.CollectionExistsAsync(collectionName, It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => 
            _service.CollectionExistsAsync(collectionName));
        Assert.Same(expectedException, ex);
    }

    [Fact]
    public async Task CollectionExistsAsync_OperationCancelledException_DoesNotLog()
    {
        // Arrange
        var collectionName = "test-collection";
        var cancelledException = new OperationCanceledException();
        
        _mockAdapter
            .Setup(x => x.CollectionExistsAsync(collectionName, It.IsAny<CancellationToken>()))
            .ThrowsAsync(cancelledException);

        // Act & Assert
        await Assert.ThrowsAsync<OperationCanceledException>(() => 
            _service.CollectionExistsAsync(collectionName));
        
        // Verify no error logging for OperationCanceledException
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Never);
    }
}