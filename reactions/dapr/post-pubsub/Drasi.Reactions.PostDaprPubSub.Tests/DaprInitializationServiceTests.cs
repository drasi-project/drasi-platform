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
using Dapr;
using Drasi.Reactions.PostDaprPubSub.Services;

namespace Drasi.Reactions.PostDaprPubSub.Tests;

public class DaprInitializationServiceTests
{
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<ILogger<DaprInitializationService>> _mockLogger;
    private readonly Mock<IErrorStateHandler> _mockErrorStateHandler;
    private readonly DaprInitializationService _service;
    
    public DaprInitializationServiceTests()
    {
        _mockDaprClient = new Mock<DaprClient>();
        _mockLogger = new Mock<ILogger<DaprInitializationService>>();
        _mockErrorStateHandler = new Mock<IErrorStateHandler>();
        
        _service = new DaprInitializationService(
            _mockDaprClient.Object,
            _mockLogger.Object,
            _mockErrorStateHandler.Object
        );
    }
    
    [Fact]
    public async Task WaitForDaprSidecarAsync_Success_LogsInfoMessage()
    {
        // Arrange
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Act
        await _service.WaitForDaprSidecarAsync(CancellationToken.None);
        
        // Assert
        _mockDaprClient.Verify(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }
    
    [Fact]
    public async Task WaitForDaprSidecarAsync_DaprException_TerminatesAndRethrows()
    {
        // Arrange
        var exception = new DaprException("Dapr sidecar not available");
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(exception);
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<DaprException>(() => 
            _service.WaitForDaprSidecarAsync(CancellationToken.None));
        
        Assert.Same(exception, ex);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => 
            s.Contains("Dapr sidecar is not available"))), Times.Once);
    }
    
    [Fact]
    public async Task WaitForDaprSidecarAsync_OtherException_TerminatesAndRethrows()
    {
        // Arrange
        var exception = new Exception("Unexpected error");
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(exception);
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<Exception>(() => 
            _service.WaitForDaprSidecarAsync(CancellationToken.None));
        
        Assert.Same(exception, ex);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => 
            s.Contains("Unexpected error while waiting for Dapr sidecar"))), Times.Once);
    }
    
    [Fact]
    public async Task WaitForDaprSidecarAsync_Cancelled_DoesNotCallTerminate()
    {
        // Arrange
        var cts = new CancellationTokenSource();
        cts.Cancel();
        var cancellationToken = cts.Token;
        
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(cancellationToken))
            .ThrowsAsync(new OperationCanceledException());
        
        // Act & Assert
        await Assert.ThrowsAsync<OperationCanceledException>(() => 
            _service.WaitForDaprSidecarAsync(cancellationToken));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }
}