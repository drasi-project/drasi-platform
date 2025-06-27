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

using Xunit;
using Moq;
using Dapr.Client;
using Microsoft.Extensions.Logging;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.PostDaprPubSub.Services;
using System.Text.Json;
using Dapr;

namespace Drasi.Reactions.PostDaprPubSub.Tests;

public class ChangeHandlerTests
{
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<IChangeFormatterFactory> _mockFormatterFactory;
    private readonly Mock<ILogger<ChangeHandler>> _mockLogger;
<<<<<<< HEAD
    private readonly Mock<IQueryFailureTracker> _mockFailureTracker;
=======
>>>>>>> origin/main
    private readonly ChangeHandler _handler;
    
    public ChangeHandlerTests()
    {
        _mockDaprClient = new Mock<DaprClient>();
        _mockFormatterFactory = new Mock<IChangeFormatterFactory>();
        _mockLogger = new Mock<ILogger<ChangeHandler>>();
<<<<<<< HEAD
        _mockFailureTracker = new Mock<IQueryFailureTracker>();
=======
>>>>>>> origin/main
        
        _handler = new ChangeHandler(
            _mockDaprClient.Object,
            _mockFormatterFactory.Object,
<<<<<<< HEAD
            _mockLogger.Object,
            _mockFailureTracker.Object
=======
            _mockLogger.Object
>>>>>>> origin/main
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
<<<<<<< HEAD
    public async Task HandleChange_QueryInFailedState_ThrowsInvalidOperationException()
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query" };
        var config = new QueryConfig { PubsubName = "test-pubsub", TopicName = "test-topic" };
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(true);
        _mockFailureTracker.Setup(ft => ft.GetFailureReason("test-query")).Returns("Test failure reason");
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.HandleChange(evt, config));
        Assert.Contains("test-query", ex.Message);
        Assert.Contains("Test failure reason", ex.Message);
    }
    
    [Fact]
=======
>>>>>>> origin/main
    public async Task HandleChange_PackedFormat_PublishesPackedEvent()
    {
        // Arrange
        var evt = new ChangeEvent { 
            QueryId = "test-query",
            AddedResults = new[] { new Dictionary<string, object> { { "id", "1" } } }
        };
        var config = new QueryConfig { 
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
<<<<<<< HEAD
            Packed = true
        };
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
=======
            Format = OutputFormat.Packed
        };
        
>>>>>>> origin/main
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(), 
            It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleChange(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.PublishEventAsync(
            config.PubsubName,
            config.TopicName,
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
<<<<<<< HEAD
        
        _mockFailureTracker.Verify(ft => ft.ResetFailures("test-query"), Times.Once);
=======
>>>>>>> origin/main
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
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
<<<<<<< HEAD
            Packed = false // Unpacked is default
=======
            Format = OutputFormat.Unpacked
>>>>>>> origin/main
        };
        
        var mockFormatter = new Mock<IChangeFormatter>();
        var formattedElements = new[] { 
            JsonDocument.Parse("{\"test\":\"value\"}").RootElement 
        };
        
        mockFormatter.Setup(f => f.Format(evt)).Returns(formattedElements);
        _mockFormatterFactory.Setup(ff => ff.GetFormatter()).Returns(mockFormatter.Object);
        
<<<<<<< HEAD
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
=======
>>>>>>> origin/main
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleChange(evt, config);
        
        // Assert
        _mockFormatterFactory.Verify(ff => ff.GetFormatter(), Times.Once);
        mockFormatter.Verify(f => f.Format(evt), Times.Once);
        _mockDaprClient.Verify(dc => dc.PublishEventAsync(
            config.PubsubName,
            config.TopicName,
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
<<<<<<< HEAD
        
        _mockFailureTracker.Verify(ft => ft.ResetFailures("test-query"), Times.Once);
    }
    
    [Fact]
    public async Task HandleChange_PublishFails_RecordsFailureAndRethrows()
=======
    }
    
    [Fact]
    public async Task HandleChange_PublishFails_ThrowsException()
>>>>>>> origin/main
    {
        // Arrange
        var evt = new ChangeEvent { QueryId = "test-query" };
        var config = new QueryConfig { 
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
<<<<<<< HEAD
            Packed = true,
            MaxFailureCount = 3
=======
            Format = OutputFormat.Packed
>>>>>>> origin/main
        };
        
        var exception = new DaprException("Test error");
        
<<<<<<< HEAD
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
=======
>>>>>>> origin/main
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()))
            .ThrowsAsync(exception);
        
<<<<<<< HEAD
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
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
            Packed = true,
            MaxFailureCount = 3
        };
        
        var exception = new DaprException("Test error");
        
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
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
=======
        // Act & Assert
        var ex = await Assert.ThrowsAsync<DaprException>(() => _handler.HandleChange(evt, config));
        Assert.Same(exception, ex);
>>>>>>> origin/main
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
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
<<<<<<< HEAD
            Packed = false // Unpacked
=======
            Format = OutputFormat.Unpacked
>>>>>>> origin/main
        };
        
        var mockFormatter = new Mock<IChangeFormatter>();
        var formattedElements = new[] { 
            JsonDocument.Parse("{\"id\":\"1\"}").RootElement,
            JsonDocument.Parse("{\"id\":\"2\"}").RootElement
        };
        
        mockFormatter.Setup(f => f.Format(evt)).Returns(formattedElements);
        _mockFormatterFactory.Setup(ff => ff.GetFormatter()).Returns(mockFormatter.Object);
        
<<<<<<< HEAD
        _mockFailureTracker.Setup(ft => ft.IsQueryFailed("test-query")).Returns(false);
=======
>>>>>>> origin/main
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleChange(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.PublishEventAsync(
            config.PubsubName,
            config.TopicName,
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()
        ), Times.Exactly(2));
    }
}