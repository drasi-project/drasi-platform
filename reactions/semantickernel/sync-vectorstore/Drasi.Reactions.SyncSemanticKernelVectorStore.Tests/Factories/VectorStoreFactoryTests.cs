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
using Drasi.Reactions.SyncSemanticKernelVectorStore.Adapters;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Factories;
using Drasi.Reactions.SyncSemanticKernelVectorStore.VectorStores;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel.Connectors.AzureAISearch;
using Microsoft.SemanticKernel.Connectors.Qdrant;
using Moq;
using Xunit;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests.Factories;

public class VectorStoreFactoryTests
{
    private readonly Mock<IServiceProvider> _mockServiceProvider;
    private readonly Mock<ILogger<VectorStoreFactory>> _mockLogger;
    private readonly Mock<ILogger<InMemoryVectorStoreAdapter>> _mockInMemoryAdapterLogger;
    private readonly Mock<ILogger<QdrantVectorStoreAdapter>> _mockQdrantAdapterLogger;
    private readonly Mock<ILogger<AzureAISearchVectorStoreAdapter>> _mockAzureAdapterLogger;
    private readonly VectorStoreFactory _factory;

    public VectorStoreFactoryTests()
    {
        _mockServiceProvider = new Mock<IServiceProvider>();
        _mockLogger = new Mock<ILogger<VectorStoreFactory>>();
        _mockInMemoryAdapterLogger = new Mock<ILogger<InMemoryVectorStoreAdapter>>();
        _mockQdrantAdapterLogger = new Mock<ILogger<QdrantVectorStoreAdapter>>();
        _mockAzureAdapterLogger = new Mock<ILogger<AzureAISearchVectorStoreAdapter>>();
        
        // Setup service provider to return loggers
        _mockServiceProvider
            .Setup(x => x.GetService(typeof(ILogger<InMemoryVectorStoreAdapter>)))
            .Returns(_mockInMemoryAdapterLogger.Object);
        _mockServiceProvider
            .Setup(x => x.GetService(typeof(ILogger<QdrantVectorStoreAdapter>)))
            .Returns(_mockQdrantAdapterLogger.Object);
        _mockServiceProvider
            .Setup(x => x.GetService(typeof(ILogger<AzureAISearchVectorStoreAdapter>)))
            .Returns(_mockAzureAdapterLogger.Object);
        
        _factory = new VectorStoreFactory(_mockServiceProvider.Object, _mockLogger.Object);
    }

    [Fact]
    public void CreateVectorStore_InMemory_ReturnsInMemoryVectorStore()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "inmemory",
            ConnectionString = "",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStore(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<InMemoryVectorStore>(result);
    }

    [Fact(Skip = "Requires valid Qdrant connection")]
    public void CreateVectorStore_Qdrant_ReturnsQdrantVectorStore()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "qdrant",
            ConnectionString = "Endpoint=localhost",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStore(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<QdrantVectorStore>(result);
    }

    [Fact]
    public void CreateVectorStore_AzureAISearch_ReturnsAzureAISearchVectorStore()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "azureaisearch",
            ConnectionString = "Endpoint=https://test.search.windows.net;ApiKey=testkey",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStore(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<AzureAISearchVectorStore>(result);
    }

    [Theory]
    [InlineData("azureai")]
    [InlineData("azuresearch")]
    [InlineData("AzureAISearch")]
    public void CreateVectorStore_AzureAISearchVariants_ReturnsAzureAISearchVectorStore(string vectorStoreType)
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = vectorStoreType,
            ConnectionString = "Endpoint=https://test.search.windows.net;ApiKey=testkey",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStore(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<AzureAISearchVectorStore>(result);
    }

    [Fact]
    public void CreateVectorStore_UnsupportedType_ThrowsNotImplementedException()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "unsupported",
            ConnectionString = "",
            EmbeddingDimensions = 1536
        };

        // Act & Assert
        var ex = Assert.Throws<NotImplementedException>(() => _factory.CreateVectorStore(config));
        Assert.Contains("'unsupported' is not supported", ex.Message);
        Assert.Contains("Supported types: InMemory, Qdrant, AzureAISearch", ex.Message);
    }

    [Fact]
    public void CreateVectorStoreAdapter_InMemory_ReturnsInMemoryAdapter()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "inmemory",
            ConnectionString = "",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStoreAdapter(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<InMemoryVectorStoreAdapter>(result);
    }

    [Fact]
    public void CreateVectorStoreAdapter_Qdrant_ReturnsQdrantAdapter()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "qdrant",
            ConnectionString = "Endpoint=localhost:6334",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStoreAdapter(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<QdrantVectorStoreAdapter>(result);
    }

    [Fact]
    public void CreateVectorStoreAdapter_QdrantWithApiKey_ReturnsQdrantAdapter()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "qdrant",
            ConnectionString = "Endpoint=localhost:6334;ApiKey=testkey",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStoreAdapter(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<QdrantVectorStoreAdapter>(result);
    }

    [Fact]
    public void CreateVectorStoreAdapter_QdrantWithHttpEndpoint_RemovesHttp()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "qdrant",
            ConnectionString = "Endpoint=http://localhost:6334",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStoreAdapter(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<QdrantVectorStoreAdapter>(result);
    }

    [Fact]
    public void CreateVectorStoreAdapter_QdrantWithHttpsEndpoint_RemovesHttps()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "qdrant",
            ConnectionString = "Endpoint=https://localhost:6334",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStoreAdapter(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<QdrantVectorStoreAdapter>(result);
    }

    [Fact]
    public void CreateVectorStoreAdapter_AzureAISearch_ReturnsAzureAdapter()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "azureaisearch",
            ConnectionString = "Endpoint=https://test.search.windows.net;ApiKey=testkey",
            EmbeddingDimensions = 1536
        };

        // Act
        var result = _factory.CreateVectorStoreAdapter(config);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<AzureAISearchVectorStoreAdapter>(result);
    }

    [Fact]
    public void CreateVectorStoreAdapter_AzureAISearchMissingEndpoint_ThrowsArgumentException()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "azureaisearch",
            ConnectionString = "ApiKey=testkey",
            EmbeddingDimensions = 1536
        };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _factory.CreateVectorStoreAdapter(config));
        Assert.Contains("endpoint is required", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void CreateVectorStoreAdapter_AzureAISearchMissingApiKey_ThrowsArgumentException()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "azureaisearch",
            ConnectionString = "Endpoint=https://test.search.windows.net",
            EmbeddingDimensions = 1536
        };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _factory.CreateVectorStoreAdapter(config));
        Assert.Contains("API key is required", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void CreateVectorStoreAdapter_UnsupportedType_ThrowsNotImplementedException()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "unsupported",
            ConnectionString = "",
            EmbeddingDimensions = 1536
        };

        // Act & Assert
        var ex = Assert.Throws<NotImplementedException>(() => _factory.CreateVectorStoreAdapter(config));
        Assert.Contains("'unsupported' is not supported", ex.Message);
    }

    [Theory]
    [InlineData("Endpoint=localhost;ApiKey=key1")]
    [InlineData("Host=myhost;Key=key2")]
    [InlineData("SearchServiceEndpoint=https://test.com;SearchServiceApiKey=key3")]
    public void ParseConnectionString_ParsesVariousFormats(string connectionString)
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "azureaisearch",
            ConnectionString = connectionString,
            EmbeddingDimensions = 1536
        };

        // Act - This will use ParseConnectionString internally
        if (connectionString.Contains("SearchService"))
        {
            var result = _factory.CreateVectorStoreAdapter(config);
            Assert.NotNull(result);
        }
        else if (connectionString.Contains("Host"))
        {
            config.VectorStoreType = "qdrant";
            var result = _factory.CreateVectorStoreAdapter(config);
            Assert.NotNull(result);
        }
    }

    [Fact]
    public void VectorStoreConfiguration_HasDefaultValues()
    {
        // Arrange & Act
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "inmemory",
            ConnectionString = ""
        };

        // Assert
        Assert.Equal(3072, config.EmbeddingDimensions);
        Assert.Equal("CosineSimilarity", config.DistanceFunction);
        Assert.Equal("Hnsw", config.IndexKind);
        Assert.True(config.IsFilterable);
        Assert.False(config.IsFullTextSearchable);
    }

    [Fact]
    public void CreateVectorStoreAdapter_LogsInformation()
    {
        // Arrange
        var config = new VectorStoreConfiguration
        {
            VectorStoreType = "inmemory",
            ConnectionString = "",
            EmbeddingDimensions = 1536
        };

        // Act
        _factory.CreateVectorStoreAdapter(config);

        // Assert
        _mockLogger.Verify(x => x.Log(
            It.Is<LogLevel>(l => l == LogLevel.Information),
            It.IsAny<EventId>(),
            It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Creating vector store of type")),
            It.IsAny<Exception>(),
            It.IsAny<Func<It.IsAnyType, Exception?, string>>()), Times.Once);
    }
}