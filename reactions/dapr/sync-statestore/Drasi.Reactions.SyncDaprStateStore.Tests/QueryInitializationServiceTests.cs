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
using Dapr.Client;
using Microsoft.Extensions.Logging;
using Drasi.Reaction.SDK.Services;
using Drasi.Reaction.SDK.Models.ViewService;
using Dapr;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class QueryInitializationServiceTests
{
    private readonly Mock<ILogger<QueryInitializationService>> _mockLogger;
    private readonly Mock<IExtendedManagementClient> _mockManagementClient;
    private readonly Mock<IQueryConfigService> _mockQueryConfigService;
    private readonly Mock<IResultViewClient> _mockResultViewClient;
    private readonly Mock<IQuerySyncPointManager> _mockQuerySyncPointManager;
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<IErrorStateHandler> _mockErrorStateHandler;
    private readonly QueryInitializationService _service;

    public QueryInitializationServiceTests()
    {
        _mockLogger = new Mock<ILogger<QueryInitializationService>>();
        _mockManagementClient = new Mock<IExtendedManagementClient>();
        _mockQueryConfigService = new Mock<IQueryConfigService>();
        _mockResultViewClient = new Mock<IResultViewClient>();
        _mockQuerySyncPointManager = new Mock<IQuerySyncPointManager>();
        _mockDaprClient = new Mock<DaprClient>();
        _mockErrorStateHandler = new Mock<IErrorStateHandler>();

        _service = new QueryInitializationService(
            _mockLogger.Object,
            _mockManagementClient.Object,
            _mockQueryConfigService.Object,
            _mockResultViewClient.Object,
            _mockQuerySyncPointManager.Object,
            _mockDaprClient.Object,
            _mockErrorStateHandler.Object);

        // Default setup for Dapr sidecar
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        // Default setup for Dapr state connectivity
        _mockDaprClient.Setup(d => d.GetStateAsync<object>(
            It.IsAny<string>(), 
            It.IsAny<string>(), 
            It.IsAny<ConsistencyMode?>(), 
            It.IsAny<IReadOnlyDictionary<string,string>?>(), 
            It.IsAny<CancellationToken>()))
            .ReturnsAsync((object)null!); // Simulate key not found, which is fine for a ping
    }

    // Tests that StartAsync terminates if Dapr sidecar is not available.
    [Fact]
    public async Task StartAsync_DaprSidecarUnavailable_TerminatesAndThrows()
    {
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DaprException("Sidecar not ready"));

        await Assert.ThrowsAsync<DaprException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        _mockErrorStateHandler.Verify(e => e.Terminate("Dapr sidecar is not available."), Times.Once);
    }
    
    // Tests that StartAsync completes if Dapr sidecar check throws a generic exception.
    [Fact]
    public async Task StartAsync_DaprSidecarWaitThrowsGenericException_TerminatesAndThrows()
    {
        var ex = new Exception("Generic Dapr wait error");
        _mockDaprClient.Setup(d => d.WaitForSidecarAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(ex);

        var actualException = await Assert.ThrowsAsync<Exception>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        Assert.Same(ex, actualException);
        _mockErrorStateHandler.Verify(e => e.Terminate("Unexpected error while waiting for Dapr sidecar."), Times.Once);
    }

    // Tests that StartAsync completes without error if no query names are configured.
    [Fact]
    public async Task StartAsync_NoQueryNames_CompletesSuccessfully()
    {
        _mockQueryConfigService.Setup(s => s.GetQueryNames()).Returns(new List<string>());
        
        await _service.InitializeQueriesAsync(CancellationToken.None);
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }

    // Tests that StartAsync continues to next query if one query config is null.
    [Fact]
    public async Task StartAsync_NullQueryConfig_LogsErrorAndContinues()
    {
        var queryName1 = "query1";
        var queryName2 = "query2";
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName1, queryName2 });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName1))
            .Returns((QueryConfig?)null);
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName2))
            .Returns(new QueryConfig { StateStoreName = "store", KeyField = "id" });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName2, "store", It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await _service.InitializeQueriesAsync(CancellationToken.None);

        // Verify error logged for queryName1, but no termination for the whole process due to this.
        // Termination is handled by QueryConfigValidationService for null configs. Here we just log and skip.
        _mockLogger.Verify(logger => logger.Log(
            LogLevel.Error,
            It.IsAny<EventId>(),
            It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains($"Query configuration is null for query {queryName1}")),
            null,
            It.IsAny<Func<It.IsAnyType, Exception?, string>>()), Times.Once);
        _mockQuerySyncPointManager.Verify(m => m.TryLoadSyncPointAsync(queryName2, "store", It.IsAny<CancellationToken>()), Times.Once);
    }

    // Tests that StartAsync terminates if StateStoreName is null or whitespace in query config.
    [Fact]
    public async Task StartAsync_NullOrWhitespaceStateStoreName_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = " ", KeyField = "id" });

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate($"StateStoreName is not configured for query {queryName}."), Times.Once);
    }

    // Tests that StartAsync terminates if Dapr state store connectivity check fails with DaprApiException.
    [Fact]
    public async Task StartAsync_DaprConnectivityDaprApiException_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "errorStore";
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = "id" });
        _mockDaprClient.Setup(d => d.GetStateAsync<object>(
            stateStoreName, 
            It.Is<string>(s => s.StartsWith(QueryInitializationService.DaprConnectivityTestKeyFormatString.Substring(0,10))), 
            It.IsAny<ConsistencyMode?>(), 
            It.IsAny<IReadOnlyDictionary<string,string>?>(), 
            It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DaprApiException("Dapr API error", "SomeMethod", false));

        await Assert.ThrowsAsync<DaprApiException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => 
            s.Contains($"Dapr API error while trying to connect to state store {stateStoreName}"))), Times.Once);
    }
    
    // Tests that StartAsync terminates if Dapr state store connectivity check fails with a generic Exception.
    [Fact]
    public async Task StartAsync_DaprConnectivityGenericException_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "errorStore";
        var ex = new Exception("Generic Dapr connect error");
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = "id" });
        _mockDaprClient.Setup(d => d.GetStateAsync<object>(
            stateStoreName, 
            It.Is<string>(s => s.StartsWith(QueryInitializationService.DaprConnectivityTestKeyFormatString.Substring(0,10))), 
            It.IsAny<ConsistencyMode?>(), 
            It.IsAny<IReadOnlyDictionary<string,string>?>(), 
            It.IsAny<CancellationToken>()))
            .ThrowsAsync(ex);

        var actualException = await Assert.ThrowsAsync<Exception>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        Assert.Same(ex, actualException);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(s => 
            s.Contains($"Error while trying to connect to Dapr state store {stateStoreName}"))), Times.Once);
    }

    // Tests that StartAsync proceeds if sync point is loaded successfully.
    [Fact]
    public async Task StartAsync_SyncPointLoaded_CompletesInitialization()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = "id" });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await _service.InitializeQueriesAsync(CancellationToken.None);

        _mockResultViewClient.Verify(v => v.GetCurrentResult(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }

    // Tests full sync path: sync point not loaded, query ready, initial sync and update succeed.
    [Fact]
    public async Task StartAsync_FullSyncPath_Successful()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 123L;

        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = keyField });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(
            queryName, QueryInitializationService.DefaultWaitForQueryReadySeconds, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var viewItems = new List<ViewItem>
        {
            // First item: Primarily for the header sequence.
            new ViewItem { Header = new HeaderClass { Sequence = sequence } }, 
            // Second item: Actual data to be saved.
            new ViewItem { Data = new Dictionary<string, object> { { keyField, "item1" }, { "value", "dataValue" } } } 
        }.ToAsyncEnumerable();
        
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(
            stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(
            queryName, stateStoreName, sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await _service.InitializeQueriesAsync(CancellationToken.None);

        _mockResultViewClient.Verify(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(
            stateStoreName, 
            It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => 
                list.Count == 1 && 
                list[0].Key == "item1" && 
                list[0].Value.ContainsKey("value")
            ), 
            It.IsAny<CancellationToken>()), Times.Once);
        _mockQuerySyncPointManager.Verify(m => m.TryUpdateSyncPointAsync(
            queryName, stateStoreName, sequence, It.IsAny<CancellationToken>()), Times.Once);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.IsAny<string>()), Times.Never);
    }

    // Tests that StartAsync terminates if WaitForQueryReadyAsync returns false.
    [Fact]
    public async Task StartAsync_QueryNotReady_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = "id" });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(
            queryName, QueryInitializationService.DefaultWaitForQueryReadySeconds, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(
            $"Query {queryName} did not become ready within the timeout period."), Times.Once);
    }

    // Tests that StartAsync terminates if TryUpdateSyncPointAsync fails after initial sync.
    [Fact]
    public async Task StartAsync_UpdateSyncPointFails_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 123L;

        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = keyField });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(
            queryName, QueryInitializationService.DefaultWaitForQueryReadySeconds, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        
        var viewItems = new List<ViewItem> { 
            new ViewItem { 
                Header = new HeaderClass { Sequence = sequence }, 
                Data = new Dictionary<string, object> { { keyField, "item1" } } 
            } 
        }.ToAsyncEnumerable();
        
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(
            stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(
            queryName, stateStoreName, sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(
            $"Failed to update sync point for query {queryName} in Dapr state store."), Times.Once);
    }
    
    // Tests PerformInitialSyncForQueryAsync terminates if result stream header is null.
    [Fact]
    public async Task PerformInitialSync_NullHeader_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = "store", KeyField = "id" });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, "store", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var viewItems = new List<ViewItem> { 
            new ViewItem { Header = null!, Data = new Dictionary<string, object>() } 
        }.ToAsyncEnumerable();
        
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"Header in result stream is null for query {queryName}"))), Times.Once);
    }

    // Tests PerformInitialSyncForQueryAsync terminates if result stream has no header item.
    [Fact]
    public async Task PerformInitialSync_NoHeaderItem_TerminatesAndThrows()
    {
        var queryName = "testQuery";
            _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = "store", KeyField = "id" });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, "store", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var viewItems = new List<ViewItem>().ToAsyncEnumerable();
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);

        await Assert.ThrowsAsync<InvalidProgramException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"No header returned in result stream for query {queryName}"))), Times.Once);
    }
    
    // Tests PerformInitialSyncForQueryAsync terminates if GetCurrentResult stream header fetch throws.
    [Fact]
    public async Task PerformInitialSync_HeaderFetchThrows_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var ex = new Exception("Stream error");
        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = "store", KeyField = "id" });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, "store", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        
        var mockAsyncEnumerable = new Mock<IAsyncEnumerable<ViewItem>>();
        var mockAsyncEnumerator = new Mock<IAsyncEnumerator<ViewItem>>();
        mockAsyncEnumerator.Setup(e => e.MoveNextAsync()).ThrowsAsync(ex);
        mockAsyncEnumerable.Setup(e => e.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
            .Returns(mockAsyncEnumerator.Object);
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(mockAsyncEnumerable.Object);

        var actualException = await Assert.ThrowsAsync<Exception>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        Assert.Same(ex, actualException);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"Unexpected error while fetching result stream header for query {queryName}"))), Times.Once);
    }

    // Tests PerformInitialSyncForQueryAsync - BuildListOfItemsToSaveAsync - terminates if KeyField is missing in data.
    [Fact]
    public async Task PerformInitialSync_BuildItems_KeyFieldMissingInData_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        var keyField = "id"; // This key will be missing in the data item
        var sequence = 123L;

        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = keyField });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var viewItems = new List<ViewItem>
        {
            new ViewItem { Header = new HeaderClass { Sequence = sequence } },
            new ViewItem { Data = new Dictionary<string, object> { { "otherField", "value" } } }
        }.ToAsyncEnumerable();
        
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);
        
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"Unexpected error while parsing result stream for query {queryName}"))), Times.Once);
    }
    
    // Tests PerformInitialSyncForQueryAsync - BuildListOfItemsToSaveAsync - terminates if an exception occurs during stream parsing.
    [Fact]
    public async Task PerformInitialSync_BuildItems_ThrowsException_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 123L;
        var ex = new FormatException("Parsing error");

        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = keyField });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var mockAsyncEnumerable = new Mock<IAsyncEnumerable<ViewItem>>();
        var mockAsyncEnumerator = new Mock<IAsyncEnumerator<ViewItem>>();
        
        mockAsyncEnumerator.SetupSequence(e => e.MoveNextAsync())
            .ReturnsAsync(true)
            .ThrowsAsync(ex);

        mockAsyncEnumerator.SetupSequence(e => e.Current)
            .Returns(new ViewItem { Header = new HeaderClass { Sequence = sequence } });

        mockAsyncEnumerable.Setup(e => e.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
            .Returns(mockAsyncEnumerator.Object);
            
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(mockAsyncEnumerable.Object);

        var actualException = await Assert.ThrowsAsync<FormatException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        Assert.Same(ex, actualException);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"Unexpected error while parsing result stream for query {queryName}"))), Times.Once);
    }

    // Tests PerformInitialSyncForQueryAsync terminates if SaveBulkStateAsync throws DaprApiException.
    [Fact]
    public async Task PerformInitialSync_SaveBulkDaprApiException_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 123L;

        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = keyField });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        
        var viewItems = new List<ViewItem> 
        {
            new ViewItem { Header = new HeaderClass { Sequence = sequence } },
            new ViewItem { Data = new Dictionary<string, object> { { keyField, "item1" } } }
        }.ToAsyncEnumerable();
        
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(
            stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DaprApiException("Dapr bulk save error", "SomeMethod", false));

        await Assert.ThrowsAsync<DaprApiException>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"Dapr API error while saving result data to state store {stateStoreName}"))), Times.Once);
    }
    
    // Tests PerformInitialSyncForQueryAsync terminates if SaveBulkStateAsync throws a generic Exception.
    [Fact]
    public async Task PerformInitialSync_SaveBulkGenericException_TerminatesAndThrows()
    {
        var queryName = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 123L;
        var ex = new Exception("Generic bulk save error");

        _mockQueryConfigService.Setup(s => s.GetQueryNames())
            .Returns(new List<string> { queryName });
        _mockQueryConfigService.Setup(s => s.GetQueryConfig<QueryConfig>(queryName))
            .Returns(new QueryConfig { StateStoreName = stateStoreName, KeyField = keyField });
        _mockQuerySyncPointManager.Setup(m => m.TryLoadSyncPointAsync(queryName, stateStoreName, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _mockManagementClient.Setup(m => m.WaitForQueryReadyAsync(queryName, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var viewItems = new List<ViewItem> 
        {
            new ViewItem { Header = new HeaderClass { Sequence = sequence } },
            new ViewItem { Data = new Dictionary<string, object> { { keyField, "item1" } } }
        }.ToAsyncEnumerable();
        
        _mockResultViewClient.Setup(v => v.GetCurrentResult(queryName, It.IsAny<CancellationToken>()))
            .Returns(viewItems);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(
            stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(ex);

        var actualException = await Assert.ThrowsAsync<Exception>(() => _service.InitializeQueriesAsync(CancellationToken.None));
        
        Assert.Same(ex, actualException);
        _mockErrorStateHandler.Verify(e => e.Terminate(It.Is<string>(
            s => s.Contains($"Unexpected Error while saving result data to Dapr state store {stateStoreName}"))), Times.Once);
    }
}

// Helper to convert List to IAsyncEnumerable for mocking
public static class TestAsyncEnumerable
{
    public static IAsyncEnumerable<T> ToAsyncEnumerable<T>(this IEnumerable<T> source)
    {
        return new MockAsyncEnumerable<T>(source);
    }

    private class MockAsyncEnumerable<T> : IAsyncEnumerable<T>
    {
        private readonly IEnumerable<T> _source;
        
        public MockAsyncEnumerable(IEnumerable<T> source) => _source = source;
        
        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default) =>
            new MockAsyncEnumerator<T>(_source.GetEnumerator());
    }

    private class MockAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _enumerator;
        
        public MockAsyncEnumerator(IEnumerator<T> enumerator) => _enumerator = enumerator;
        
        public T Current => _enumerator.Current;
        
        public ValueTask<bool> MoveNextAsync() => new(_enumerator.MoveNext());
        
        public ValueTask DisposeAsync()
        {
            _enumerator.Dispose();
            return new ValueTask();
        }
    }
}