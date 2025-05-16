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

namespace Drasi.Reactions.SyncDaprStateStore.Tests;
public class QueryConfigValidationServiceTests
{
    private readonly Mock<ILogger<QueryConfigValidationService>> _mockLogger;
    private readonly Mock<IQueryConfigService> _mockQueryConfigService;
    private readonly Mock<IErrorStateHandler> _mockErrorStateHandler;
    private readonly QueryConfigValidationService _service;

    public QueryConfigValidationServiceTests()
    {
        _mockLogger = new Mock<ILogger<QueryConfigValidationService>>();
        _mockQueryConfigService = new Mock<IQueryConfigService>();
        _mockErrorStateHandler = new Mock<IErrorStateHandler>();
        _service = new QueryConfigValidationService(
            _mockLogger.Object, 
            _mockQueryConfigService.Object, 
            _mockErrorStateHandler.Object);
    }

    // Tests that StartAsync completes without error when no query names are returned.
    [Fact]
    public async Task StartAsync_NoQueryNames_CompletesSuccessfully()
    {
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string>());
        
        await _service.ValidateQueryConfigsAsync(CancellationToken.None);
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }

    // Tests that StartAsync terminates and throws if query config is null.
    [Fact]
    public async Task StartAsync_NullQueryConfig_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName)).Returns((QueryConfig?)null);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate($"Query configuration for '{queryName}' is null."), Times.Once);
    }

    // Tests that StartAsync terminates and throws if GetQueryConfig throws an exception.
    [Fact]
    public async Task StartAsync_GetQueryConfigThrows_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var exceptionMessage = "Failed to retrieve";
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName)).Throws(new Exception(exceptionMessage));

        var ex = await Assert.ThrowsAsync<Exception>(() => _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        Assert.Equal(exceptionMessage, ex.Message);
        _mockErrorStateHandler.Verify(e => e.Terminate($"Failed to retrieve query configuration for '{queryName}': {exceptionMessage}"), Times.Once);
    }

    // Tests that StartAsync completes successfully for a valid query configuration.
    [Fact]
    public async Task StartAsync_ValidQueryConfig_CompletesSuccessfully()
    {
        var queryName = "testQuery";
        var queryConfig = new QueryConfig { KeyField = "id", StateStoreName = "store" };
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName)).Returns(queryConfig);

        await _service.ValidateQueryConfigsAsync(CancellationToken.None);
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }

    // Tests that StartAsync terminates and throws if KeyField is missing in query config.
    [Fact]
    public async Task StartAsync_MissingKeyField_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var queryConfig = new QueryConfig { StateStoreName = "store" }; // KeyField is null
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName)).Returns(queryConfig);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => s.Contains("KeyField"))), Times.Once);
    }

    // Tests that StartAsync terminates and throws if StateStoreName is missing in query config.
    [Fact]
    public async Task StartAsync_MissingStateStoreName_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var queryConfig = new QueryConfig { KeyField = "id" }; // StateStoreName is null
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName)).Returns(queryConfig);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => s.Contains("StateStoreName"))), Times.Once);
    }

    // Tests that StartAsync terminates and throws if both KeyField and StateStoreName are missing.
    [Fact]
    public async Task StartAsync_MissingBothFields_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var queryConfig = new QueryConfig(); // Both null
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName)).Returns(queryConfig);

        var ex = await Assert.ThrowsAsync<InvalidProgramException>(() => _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        Assert.Contains("Configuration validation failed", ex.Message);
        _mockErrorStateHandler.Verify(
            e => e.Terminate(It.Is<string>(s => s.Contains("KeyField") && s.Contains("StateStoreName"))), 
            Times.Once);
    }
}