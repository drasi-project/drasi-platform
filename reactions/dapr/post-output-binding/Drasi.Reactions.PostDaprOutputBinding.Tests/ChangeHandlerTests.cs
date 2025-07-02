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

using System.Text.Json;
using Dapr;
using Dapr.Client;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.PostDaprOutputBinding.Services;
using HandlebarsDotNet;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Drasi.Reactions.PostDaprOutputBinding.Tests;

public class ChangeHandlerTests
{
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<IChangeFormatterFactory> _mockFormatterFactory;
    private readonly Mock<ILogger<ChangeHandler>> _mockLogger;
    private readonly Mock<IQueryFailureTracker> _mockFailureTracker;
    private readonly Mock<IConfiguration> _mockConfig;
    
    private readonly ChangeHandler _handler;
    
    public ChangeHandlerTests()
    {
        _mockDaprClient = new Mock<DaprClient>();
        _mockFormatterFactory = new Mock<IChangeFormatterFactory>();
        _mockLogger = new Mock<ILogger<ChangeHandler>>();
        _mockFailureTracker = new Mock<IQueryFailureTracker>();
        _mockConfig = new Mock<IConfiguration>();
        var mockSection = new Mock<IConfigurationSection>();
        mockSection
            .Setup(s => s.GetChildren())
            .Returns(new List<IConfigurationSection>());
        _mockConfig
            .Setup(c => c.GetSection("metadata"))
            .Returns(mockSection.Object);
        
        _handler = new ChangeHandler(
            _mockDaprClient.Object,
            _mockFormatterFactory.Object,
            _mockLogger.Object,
            _mockFailureTracker.Object,
            _mockConfig.Object
        );
    }
    
    [Fact]
    public async Task HandleChange_NullConfig_ThrowsArgumentNullException()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query" };
        
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleChange(evt, null));
    }
    
    [Fact]
    public async Task HandleChange_QueryInFailedState_ThrowsInvalidOperationException()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query" };
        var config = new QueryConfig {                 
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec"
        };
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(true);
        _mockFailureTracker.Setup(ft => ft.GetFailureReason("test-query")).Returns("Test failure reason");
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.HandleChange(evt, config));
        Assert.Contains("test-query", ex.Message);
        Assert.Contains("Test failure reason", ex.Message);
    }
    
    [Fact]
    public async Task HandleChange_PackedFormat_PublishesPackedEvent()
    {
        // Arrange
        var evt = new ChangeEvent { 
            QueryId = "test-query",
            AddedResults = new[] { new Dictionary<string, object> { { "id", "1" } } }
        };
        var config = new QueryConfig {                 
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
            Packed = OutputFormat.Packed
        };
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        _mockDaprClient.Setup(dc => dc.InvokeBindingAsync(
                config.BindingName,
                config.BindingOperation,
                It.IsAny<JsonElement>(),
                null,
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleChange(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.InvokeBindingAsync(
            config.BindingName,
            config.BindingOperation,
            It.IsAny<JsonElement>(),
            null,
            It.IsAny<CancellationToken>()
        ), Times.Once);
        
        _mockFailureTracker.Verify(ft => ft.ResetFailures("test-query"), Times.Once);
    }
    
    [Fact]
    public async Task HandleChange_UnpackedFormat_PublishesUnpackedEvents()
    {
        // Arrange
        var evt = new ChangeEvent { 
            QueryId = "test-query",
            AddedResults = new[] { new Dictionary<string, object> { { "id", "1" } } }
        };
        var config = new QueryConfig {             
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
            Packed = OutputFormat.Unpacked // Unpacked is default
        };
        
        var mockFormatter = new Mock<IChangeFormatter>();
        var formattedElements = new[] { 
            JsonDocument.Parse("{\"test\":\"value\"}").RootElement 
        };
        
        mockFormatter.Setup(f => f.Format(evt)).Returns(formattedElements);
        _mockFormatterFactory.Setup(ff => ff.GetFormatter()).Returns(mockFormatter.Object);
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        _mockDaprClient.Setup(dc => dc.InvokeBindingAsync(
                config.BindingName,
                config.BindingOperation,
                It.IsAny<JsonElement>(),
                null,
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleChange(evt, config);
        
        // Assert
        _mockFormatterFactory.Verify(ff => ff.GetFormatter(), Times.Once);
        mockFormatter.Verify(f => f.Format(evt), Times.Once);
        _mockDaprClient.Verify(dc => dc.InvokeBindingAsync(
            config.BindingName,
            config.BindingOperation,
            It.IsAny<JsonElement>(),
            null,
            It.IsAny<CancellationToken>()
        ), Times.Once);
        
        _mockFailureTracker.Verify(ft => ft.ResetFailures("test-query"), Times.Once);
    }

    [Fact]
    public async Task HandleChange_ValidTemplate()
    {
        // Arrange
        var evt = new ChangeEvent { 
            QueryId = "test-query",
            AddedResults = new[] { 
                new Dictionary<string, object> { { "id", "1" } },
                new Dictionary<string, object> { { "id", "2" } }
            }
        };
        var config = new QueryConfig { 
            BindingName = "test-binding",
            BindingType = "redis",
            BindingMetadataTemplate = """
                                      {
                                        "key": "{{targetKey}}"
                                      }
                                      """,
            BindingOperation = "create",
            Packed = OutputFormat.Unpacked // Unpacked
        };
        
        var mockFormatter = new Mock<IChangeFormatter>();
        var formattedElements = new[] { 
            JsonDocument.Parse("{\"id\":\"1\"}").RootElement,
            JsonDocument.Parse("{\"id\":\"2\"}").RootElement
        };
        var children = new List<IConfigurationSection>
        {
            Mock.Of<IConfigurationSection>(s => s.Key == "targetKey" && s.Value == "key1")
        };

        var mockSection = new Mock<IConfigurationSection>();
        mockSection
            .Setup(s => s.GetChildren())
            .Returns(children);
        _mockConfig
            .Setup(c => c.GetSection("metadata"))
            .Returns(mockSection.Object);
        
        var localHandler = new ChangeHandler(
            _mockDaprClient.Object,
            _mockFormatterFactory.Object,
            _mockLogger.Object,
            _mockFailureTracker.Object,
            _mockConfig.Object
        );
        
        mockFormatter.Setup(f => f.Format(evt)).Returns(formattedElements);
        _mockFormatterFactory.Setup(ff => ff.GetFormatter()).Returns(mockFormatter.Object);
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        
        var expectedMetadata = new Dictionary<string, string>
        {
            { "key", "key1" }
        };
        
        _mockDaprClient.Setup(dc => dc.InvokeBindingAsync(
                config.BindingName,
                config.BindingOperation,
                It.IsAny<JsonElement>(),
                It.IsAny<Dictionary<string,string>>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await localHandler.HandleChange(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.InvokeBindingAsync(
            config.BindingName,
            config.BindingOperation,
            It.IsAny<JsonElement>(),
            expectedMetadata,
            It.IsAny<CancellationToken>()
        ), Times.Exactly(2));
    }
    
    [Fact]
    public async Task HandleChange_InvalidTemplate_ThrowsJsonException()
    {
        // Arrange
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[] {
                new Dictionary<string, object> { { "id", "1" } }
            }
        };
        var config = new QueryConfig
        {
            BindingName = "test-binding",
            BindingType = "redis",
            // Invalid JSON template: curly brace is missing at the end
            BindingMetadataTemplate = "{ \"key\": \"{{targetKey}\"  ", // malformed template output
            BindingOperation = "create",
            Packed = OutputFormat.Unpacked
        };

        var mockFormatter = new Mock<IChangeFormatter>();
        var formattedElements = new[] {
            JsonDocument.Parse("{\"id\":\"1\"}").RootElement
        };
        var children = new List<IConfigurationSection>
        {
            Mock.Of<IConfigurationSection>(s => s.Key == "targetKey" && s.Value == "key1")
        };
        var mockSection = new Mock<IConfigurationSection>();
        mockSection
            .Setup(s => s.GetChildren())
            .Returns(children);
        _mockConfig
            .Setup(c => c.GetSection("metadata"))
            .Returns(mockSection.Object);

        var localHandler = new ChangeHandler(
            _mockDaprClient.Object,
            _mockFormatterFactory.Object,
            _mockLogger.Object,
            _mockFailureTracker.Object,
            _mockConfig.Object
        );
        mockFormatter.Setup(f => f.Format(evt)).Returns(formattedElements);
        _mockFormatterFactory.Setup(ff => ff.GetFormatter()).Returns(mockFormatter.Object);
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);

        // Act & Assert
        await Assert.ThrowsAsync<HandlebarsParserException>(async () =>
        {
            await localHandler.HandleChange(evt, config);
        });
    }
    
    [Fact]
    public async Task HandleChange_PublishFails_RecordsFailureAndRethrows()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query" };
        var config = new QueryConfig { 
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
            Packed = OutputFormat.Packed,
            MaxFailureCount = 3
        };
        
        var exception = new DaprException("Test error");
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        _mockDaprClient.Setup(dc => dc.InvokeBindingAsync(
                config.BindingName,
                config.BindingOperation,
                It.IsAny<JsonElement>(),
                null,
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(exception);
        
        _mockFailureTracker.Setup(ft => ft.RecordFailure(
            "test-query", 
            config.MaxFailureCount, 
            It.IsAny<string>()))
            .Returns(false); // Not yet failed
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<DaprException>(() => _handler.HandleChange(evt, config));
        Assert.Same(exception, ex);
        
        _mockFailureTracker.Verify(ft => ft.RecordFailure(
            "test-query",
            config.MaxFailureCount,
            It.IsAny<string>()
        ), Times.Once);
    }
    
    [Fact]
    public async Task HandleChange_MultipleFailuresExceedingThreshold_MarksQueryAsFailed()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query" };
        var config = new QueryConfig { 
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
            Packed = OutputFormat.Packed,
            MaxFailureCount = 3
        };
        
        var exception = new DaprException("Test error");
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        _mockDaprClient.Setup(dc => dc.InvokeBindingAsync(
                config.BindingName,
                config.BindingOperation,
                It.IsAny<JsonElement>(),
                null,
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(exception);
        
        _mockFailureTracker.Setup(ft => ft.RecordFailure(
            "test-query", 
            config.MaxFailureCount, 
            It.IsAny<string>()))
            .Returns(true); // Query is now failed
        
        // Act & Assert
        await Assert.ThrowsAsync<DaprException>(() => _handler.HandleChange(evt, config));
        
        _mockFailureTracker.Verify(ft => ft.RecordFailure(
            "test-query",
            config.MaxFailureCount,
            It.IsAny<string>()
        ), Times.Once);
    }
    
    [Fact]
    public async Task HandleChange_MultipleUnpackedEvents_PublishesEachEvent()
    {
        // Arrange
        var evt = new ChangeEvent { 
            QueryId = "test-query",
            AddedResults = new[] { 
                new Dictionary<string, object> { { "id", "1" } },
                new Dictionary<string, object> { { "id", "2" } }
            }
        };
        var config = new QueryConfig { 
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
            Packed = OutputFormat.Unpacked // Unpacked
        };
        
        var mockFormatter = new Mock<IChangeFormatter>();
        var formattedElements = new[] { 
            JsonDocument.Parse("{\"id\":\"1\"}").RootElement,
            JsonDocument.Parse("{\"id\":\"2\"}").RootElement
        };
        
        mockFormatter.Setup(f => f.Format(evt)).Returns(formattedElements);
        _mockFormatterFactory.Setup(ff => ff.GetFormatter()).Returns(mockFormatter.Object);
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        _mockDaprClient.Setup(dc => dc.InvokeBindingAsync(
                config.BindingName,
                config.BindingOperation,
                It.IsAny<JsonElement>(),
                null,
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleChange(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.InvokeBindingAsync(
            config.BindingName,
            config.BindingOperation,
            It.IsAny<JsonElement>(),
            null,
            It.IsAny<CancellationToken>()
        ), Times.Exactly(2));
    }
}