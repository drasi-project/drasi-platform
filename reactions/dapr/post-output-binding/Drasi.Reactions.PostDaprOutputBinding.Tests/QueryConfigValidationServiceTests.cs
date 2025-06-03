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

using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.PostDaprOutputBinding.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Drasi.Reactions.PostDaprOutputBinding.Tests;

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
            _mockErrorStateHandler.Object
        );
    }
    
    [Fact]
    public async Task ValidateQueryConfigsAsync_NoQueries_LogsWarningAndSucceeds()
    {
        // Arrange
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns(new List<string>());
        
        // Act
        await _service.ValidateQueryConfigsAsync(CancellationToken.None);
        
        // Assert
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }
    
    [Fact]
    public async Task ValidateQueryConfigsAsync_NullQueryConfig_TerminatesWithError()
    {
        // Arrange
        var queryNames = new List<string> { "test-query" };
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns(queryNames);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>("test-query")).Returns((QueryConfig?)null);
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidProgramException>(() => 
            _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        Assert.Contains("test-query", ex.Message);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => s.Contains("test-query"))), Times.Once);
    }
    
    [Fact]
    public async Task ValidateQueryConfigsAsync_InvalidConfig_TerminatesWithError()
    {
        // Arrange
        var queryNames = new List<string> { "test-query" };
        var invalidConfig = new QueryConfig { 
            BindingName = "", // Empty - invalid
            BindingType = "binding-type",
            BindingOperation = "exec"
        };
        
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns(queryNames);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>("test-query")).Returns(invalidConfig);
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidProgramException>(() => 
            _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        Assert.Contains("test-query", ex.Message);
        Assert.Contains("BindingName", ex.Message);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => 
            s.Contains("test-query") && s.Contains("BindingName"))), Times.Once);
    }
    
    [Fact]
    public async Task ValidateQueryConfigsAsync_ValidConfig_Succeeds()
    {
        // Arrange
        var queryNames = new List<string> { "test-query" };
        var validConfig = new QueryConfig { 
            BindingName = "example-binding",
            BindingType = "binding-type",
            BindingOperation = "exec"
        };
        
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns(queryNames);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>("test-query")).Returns(validConfig);
        
        // Act
        await _service.ValidateQueryConfigsAsync(CancellationToken.None);
        
        // Assert
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }
    
    [Fact]
    public async Task ValidateQueryConfigsAsync_MultipleQueries_ValidatesAll()
    {
        // Arrange
        var queryNames = new List<string> { "query1", "query2" };
        var validConfig1 = new QueryConfig { 
            BindingName = "example-binding-1",
            BindingType = "binding-type",
            BindingOperation = "exec"
        };
        var validConfig2 = new QueryConfig { 
            BindingName = "example-binding-2",
            BindingType = "binding-type",
            BindingOperation = "exec"
        };
        
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns(queryNames);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>("query1")).Returns(validConfig1);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>("query2")).Returns(validConfig2);
        
        // Act
        await _service.ValidateQueryConfigsAsync(CancellationToken.None);
        
        // Assert
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>("query1"), Times.Once);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>("query2"), Times.Once);
    }
    
    [Fact]
    public async Task ValidateQueryConfigsAsync_FirstQueryInvalid_StopsValidationAndTerminates()
    {
        // Arrange
        var queryNames = new List<string> { "query1", "query2" };
        var invalidConfig = new QueryConfig { 
            BindingName = "",
            BindingType = "binding-type",
            BindingOperation = "exec"
        };
        
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns(queryNames);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>("query1")).Returns(invalidConfig);
        
        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidProgramException>(() => 
            _service.ValidateQueryConfigsAsync(CancellationToken.None));
        
        // Second query should not be checked after first fails
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>("query2"), Times.Never);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => s.Contains("query1"))), Times.Once);
    }
}