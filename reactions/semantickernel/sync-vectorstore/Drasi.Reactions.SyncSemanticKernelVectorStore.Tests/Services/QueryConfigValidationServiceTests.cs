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
using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests.Services;

public class QueryConfigValidationServiceTests
{
    private readonly Mock<IQueryConfigService> _mockQueryConfigService;
    private readonly Mock<ILogger<QueryConfigValidationService>> _mockLogger;
    private readonly QueryConfigValidationService _service;

    public QueryConfigValidationServiceTests()
    {
        _mockQueryConfigService = new Mock<IQueryConfigService>();
        _mockLogger = new Mock<ILogger<QueryConfigValidationService>>();
        _service = new QueryConfigValidationService(_mockQueryConfigService.Object, _mockLogger.Object);
    }

    [Fact]
    public void Constructor_NullQueryConfigService_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new QueryConfigValidationService(null!, _mockLogger.Object));
    }

    [Fact]
    public void Constructor_NullLogger_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new QueryConfigValidationService(_mockQueryConfigService.Object, null!));
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_NoQueries_LogsWarningAndReturns()
    {
        // Arrange
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(new List<string>());

        // Act
        await _service.ValidateQueryConfigsAsync();

        // Assert
        _mockQueryConfigService.Verify(x => x.GetQueryNames(), Times.Once);
        _mockQueryConfigService.Verify(x => x.GetQueryConfig<QueryConfig>(It.IsAny<string>()), Times.Never);
        
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("No queries configured")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_ValidConfigurations_SuccessfullyValidates()
    {
        // Arrange
        var queryNames = new[] { "query1", "query2" };
        var validConfig1 = new QueryConfig 
        { 
            KeyField = "id",
            DocumentTemplate = "{{name}}",
            CollectionName = "collection1"
        };
        var validConfig2 = new QueryConfig 
        { 
            KeyField = "key",
            DocumentTemplate = "{{description}}",
            CollectionName = "collection2"
        };

        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(validConfig1);
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query2"))
            .Returns(validConfig2);

        // Act
        await _service.ValidateQueryConfigsAsync();

        // Assert
        _mockQueryConfigService.Verify(x => x.GetQueryNames(), Times.Once);
        _mockQueryConfigService.Verify(x => x.GetQueryConfig<QueryConfig>("query1"), Times.Once);
        _mockQueryConfigService.Verify(x => x.GetQueryConfig<QueryConfig>("query2"), Times.Once);
        
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Successfully validated 2 query configurations")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_NullConfiguration_ThrowsInvalidOperationException()
    {
        // Arrange
        var queryNames = new[] { "query1" };
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns((QueryConfig?)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ValidateQueryConfigsAsync());
        Assert.Contains("Query configuration for 'query1' is null", ex.Message);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_GetConfigThrows_ThrowsInvalidOperationException()
    {
        // Arrange
        var queryNames = new[] { "query1" };
        var innerException = new Exception("Failed to get config");
        
        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Throws(innerException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ValidateQueryConfigsAsync());
        Assert.Contains("Failed to retrieve query configuration for 'query1'", ex.Message);
        Assert.Same(innerException, ex.InnerException);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_InvalidConfiguration_MissingKeyField_ThrowsInvalidOperationException()
    {
        // Arrange
        var queryNames = new[] { "query1" };
        var invalidConfig = new QueryConfig 
        { 
            KeyField = null!, // Required field is null
            DocumentTemplate = "{{name}}",
            CollectionName = "collection1"
        };

        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(invalidConfig);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ValidateQueryConfigsAsync());
        Assert.Contains("Configuration validation failed for query query1", ex.Message);
        Assert.Contains("keyField", ex.Message);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_InvalidConfiguration_MissingDocumentTemplate_ThrowsInvalidOperationException()
    {
        // Arrange
        var queryNames = new[] { "query1" };
        var invalidConfig = new QueryConfig 
        { 
            KeyField = "id",
            DocumentTemplate = null!, // Required field is null
            CollectionName = "collection1"
        };

        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(invalidConfig);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ValidateQueryConfigsAsync());
        Assert.Contains("Configuration validation failed for query query1", ex.Message);
        Assert.Contains("documentTemplate", ex.Message);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_InvalidConfiguration_MissingCollectionName_ThrowsInvalidOperationException()
    {
        // Arrange
        var queryNames = new[] { "query1" };
        var invalidConfig = new QueryConfig 
        { 
            KeyField = "id",
            DocumentTemplate = "{{name}}",
            CollectionName = null! // Required field is null
        };

        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(invalidConfig);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ValidateQueryConfigsAsync());
        Assert.Contains("Configuration validation failed for query query1", ex.Message);
        Assert.Contains("collectionName", ex.Message);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_OneValidOneInvalid_ThrowsOnFirstInvalid()
    {
        // Arrange
        var queryNames = new[] { "query1", "query2" };
        var validConfig = new QueryConfig 
        { 
            KeyField = "id",
            DocumentTemplate = "{{name}}",
            CollectionName = "collection1"
        };
        var invalidConfig = new QueryConfig 
        { 
            KeyField = null!,
            DocumentTemplate = "{{name}}",
            CollectionName = "collection2"
        };

        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query1"))
            .Returns(validConfig);
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>("query2"))
            .Returns(invalidConfig);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.ValidateQueryConfigsAsync());
        Assert.Contains("Configuration validation failed for query query2", ex.Message);
        
        // Verify it processed both queries (order not guaranteed)
        _mockQueryConfigService.Verify(x => x.GetQueryConfig<QueryConfig>("query1"), Times.AtMostOnce);
        _mockQueryConfigService.Verify(x => x.GetQueryConfig<QueryConfig>("query2"), Times.AtMostOnce);
    }

    [Fact]
    public async Task ValidateQueryConfigsAsync_LogsDebugForEachValidQuery()
    {
        // Arrange
        var queryNames = new[] { "query1", "query2" };
        var validConfig = new QueryConfig 
        { 
            KeyField = "id",
            DocumentTemplate = "{{name}}",
            CollectionName = "collection"
        };

        _mockQueryConfigService
            .Setup(x => x.GetQueryNames())
            .Returns(queryNames.ToList());
        _mockQueryConfigService
            .Setup(x => x.GetQueryConfig<QueryConfig>(It.IsAny<string>()))
            .Returns(validConfig);

        // Act
        await _service.ValidateQueryConfigsAsync();

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Debug,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("is valid")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Exactly(2));
    }
}