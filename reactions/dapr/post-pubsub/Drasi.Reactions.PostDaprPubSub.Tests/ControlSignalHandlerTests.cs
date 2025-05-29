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
using Drasi.Reactions.PostDaprPubSub; // Added for QueryConfig

namespace Drasi.Reactions.PostDaprPubSub.Tests;

public class ControlSignalHandlerTests
{
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<ILogger<ControlSignalHandler>> _mockLogger;
    private readonly ControlSignalHandler _handler;
    
    public ControlSignalHandlerTests()
    {
        _mockDaprClient = new Mock<DaprClient>();
        _mockLogger = new Mock<ILogger<ControlSignalHandler>>();
        
        _handler = new ControlSignalHandler(
            _mockDaprClient.Object,
            _mockLogger.Object
        );
    }
    
    [Fact]
    public async Task HandleControlSignal_NullConfig_ThrowsArgumentNullException()
    {
        // Arrange
        var evt = new ControlEvent { 
            QueryId = "test-query",
            ControlSignal = new ControlSignalClass { Kind = ControlSignalKind.Running }
        };
        
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleControlSignal(evt, null!));
    }
    
    [Fact]
    public async Task HandleControlSignal_SkipControlSignals_DoesNotPublish()
    {
        // Arrange
        var evt = new ControlEvent { 
            QueryId = "test-query",
            ControlSignal = new ControlSignalClass { Kind = ControlSignalKind.Running }
        };
        var config = new QueryConfig { 
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
            SkipControlSignals = true
        };
        
        // Act
        await _handler.HandleControlSignal(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.PublishEventAsync(
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()
        ), Times.Never);
    }
    
    [Fact]
    public async Task HandleControlSignal_PackedFormat_PublishesPackedEvent()
    {
        // Arrange
        var evt = new ControlEvent { 
            QueryId = "test-query",
            ControlSignal = new ControlSignalClass { Kind = ControlSignalKind.Running }
        };
        var config = new QueryConfig { 
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
            Format = OutputFormat.Packed,
            SkipControlSignals = false
        };
        
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleControlSignal(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.PublishEventAsync(
            config.PubsubName,
            config.TopicName,
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }
    
    [Fact]
    public async Task HandleControlSignal_UnpackedFormat_PublishesUnpackedEvent()
    {
        // Arrange
        var evt = new ControlEvent { 
            QueryId = "test-query",
            ControlSignal = new ControlSignalClass { Kind = ControlSignalKind.Running }
        };
        var config = new QueryConfig { 
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
            Format = OutputFormat.Unpacked,
            SkipControlSignals = false
        };
        
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _handler.HandleControlSignal(evt, config);
        
        // Assert
        _mockDaprClient.Verify(dc => dc.PublishEventAsync(
            config.PubsubName,
            config.TopicName,
            It.Is<JsonElement>(je => je.GetRawText().Contains("\"kind\":\"running\"")), // Check for unpacked structure
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }
    
    [Fact]
    public async Task HandleControlSignal_PublishFails_ThrowsException()
    {
        // Arrange
        var evt = new ControlEvent { 
            QueryId = "test-query",
            ControlSignal = new ControlSignalClass { Kind = ControlSignalKind.Running }
        };
        var config = new QueryConfig { 
            PubsubName = "test-pubsub", 
            TopicName = "test-topic",
            Format = OutputFormat.Packed,
            SkipControlSignals = false
        };
        
        var exception = new DaprException("Test error");
        
        _mockDaprClient.Setup(dc => dc.PublishEventAsync(
            config.PubsubName, 
            config.TopicName, 
            It.IsAny<JsonElement>(),
            It.IsAny<CancellationToken>()))
            .ThrowsAsync(exception);
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<DaprException>(() => _handler.HandleControlSignal(evt, config));
        Assert.Same(exception, ex);
    }
    
    [Fact]
    public async Task HandleControlSignal_DifferentControlSignalTypes_FormatsCorrectly()
    {
        // Arrange and run test for each control signal type
        foreach (ControlSignalKind signalKind in Enum.GetValues(typeof(ControlSignalKind)))
        {
            // Arrange
            var evt = new ControlEvent { 
                QueryId = "test-query",
                ControlSignal = new ControlSignalClass { Kind = signalKind }
            };
            
            var config = new QueryConfig { 
                PubsubName = "test-pubsub", 
                TopicName = "test-topic",
                Format = OutputFormat.Unpacked,
                SkipControlSignals = false
            };
            
            _mockDaprClient.Setup(dc => dc.PublishEventAsync(
                config.PubsubName, 
                config.TopicName, 
                It.IsAny<JsonElement>(),
                It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
                
            // Reset call counts before each run
            _mockDaprClient.Invocations.Clear();
            
            // Act
            await _handler.HandleControlSignal(evt, config);
            
            // Assert
            _mockDaprClient.Verify(dc => dc.PublishEventAsync(
                config.PubsubName,
                config.TopicName,
                It.Is<JsonElement>(je => je.GetRawText().Contains($"\"kind\":\"{JsonNamingPolicy.CamelCase.ConvertName(signalKind.ToString())}\"")),
                It.IsAny<CancellationToken>()
            ), Times.Once, $"Failed for control signal type: {signalKind}");
        }
    }
}