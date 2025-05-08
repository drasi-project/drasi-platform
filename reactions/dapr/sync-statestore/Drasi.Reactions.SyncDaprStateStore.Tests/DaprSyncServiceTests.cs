using Dapr.Client;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reaction.SDK.Models.ViewService;
using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Microsoft.Extensions.Logging.Abstractions;
using System.Runtime.CompilerServices;
using Dapr;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class DaprSyncServiceTests
{
    private readonly Mock<IResultViewClient> _mockResultViewClient;
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly ILogger<DaprSyncService> _testLogger;
    private readonly DaprSyncService _service;

    private const string TestQueryId = "test-query-1";
    private const string TestStateStoreName = "test-store";
    private const string TestKeyField = "id";

    public DaprSyncServiceTests()
    {
        _mockResultViewClient = new Mock<IResultViewClient>();
        _mockDaprClient = new Mock<DaprClient>();
        _testLogger = NullLogger<DaprSyncService>.Instance;

        _service = new DaprSyncService(
            _mockResultViewClient.Object,
            _mockDaprClient.Object,
            _testLogger);
    }

    private static QueryConfig CreateValidConfig(QueryConfig.KeyPrefixStrategy prefix = QueryConfig.KeyPrefixStrategy.None, string? appId = null, string? ns = null)
    {
        return new QueryConfig
        {
            KeyField = TestKeyField,
            KeyPrefix = prefix,
            AppId = appId,
            Namespace = ns
        };
    }

    private static Dictionary<string, object> CreateDataDict(string id, string value)
    {
        return new Dictionary<string, object>
        {
            { TestKeyField, id },
            { "value", value }
        };
    }

    private static ViewItem CreateViewItem(string id, string value)
    {
        return new ViewItem
        {
            Data = CreateDataDict(id, value)
        };
    }

    private static async IAsyncEnumerable<ViewItem> CreateAsyncEnumerable(params ViewItem[] items)
    {
        foreach (var item in items)
        {
            yield return item;
        }
        await Task.CompletedTask;
    }

    private static async IAsyncEnumerable<T> ThrowingAsyncEnumerable<T>(Exception exception, [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        await Task.Yield();
        throw exception;

#pragma warning disable CS0162
        if (false) yield return default!;
#pragma warning restore CS0162
    }

    [Fact]
    public async Task PerformFullSyncAsync_WhenNoResults_DoesNotCallSaveBulkState()
    {
        // Arrange
        var config = CreateValidConfig();
        _mockResultViewClient.Setup(c => c.GetCurrentResult(TestQueryId, It.IsAny<CancellationToken>()))
                             .Returns(CreateAsyncEnumerable());

        // Act
        await _service.PerformFullSyncAsync(TestQueryId, config, TestStateStoreName);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(
            TestStateStoreName,
            It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(),
            It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task PerformFullSyncAsync_WhenKeyFieldMissingInData_SkipsItemAndLogsWarning()
    {
        // Arrange
        var config = CreateValidConfig();
        var itemWithKey = CreateViewItem("item1", "value1");
        var itemWithoutKey = new ViewItem { Data = new Dictionary<string, object> { { "otherField", "value2" } } };

        _mockResultViewClient.Setup(c => c.GetCurrentResult(TestQueryId, It.IsAny<CancellationToken>()))
                             .Returns(CreateAsyncEnumerable(itemWithKey, itemWithoutKey));

        // Act
        await _service.PerformFullSyncAsync(TestQueryId, config, TestStateStoreName);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync<Dictionary<string, object>>(
            TestStateStoreName,
            It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => list.Count == 1 && list[0].Key == "item1"),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task PerformFullSyncAsync_WithValidResults_CallsSaveBulkStateCorrectly()
    {
        // Arrange
        var config = CreateValidConfig();
        var item1 = CreateViewItem("key1", "value1");
        var item2 = CreateViewItem("key2", "value2");

        _mockResultViewClient.Setup(c => c.GetCurrentResult(TestQueryId, It.IsAny<CancellationToken>()))
                             .Returns(CreateAsyncEnumerable(item1, item2));

        // Act
        await _service.PerformFullSyncAsync(TestQueryId, config, TestStateStoreName);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync<Dictionary<string, object>>(
            TestStateStoreName,
            It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list =>
                list.Count == 2 &&
                list.Any(i => i.Key == "key1" && i.Value["value"].ToString() == "value1") &&
                list.Any(i => i.Key == "key2" && i.Value["value"].ToString() == "value2")
            ),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task PerformFullSyncAsync_WhenGetCurrentResultThrows_PropagatesException()
    {
        // Arrange
        var config = CreateValidConfig();
        var expectedException = new InvalidOperationException("Failed to get results");

        _mockResultViewClient.Setup(c => c.GetCurrentResult(TestQueryId, It.IsAny<CancellationToken>()))
                             .Returns(ThrowingAsyncEnumerable<ViewItem>(expectedException));

        // Act & Assert
        var actualException = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.PerformFullSyncAsync(TestQueryId, config, TestStateStoreName));

        Assert.Equal(expectedException, actualException);
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(It.IsAny<string>(), It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task PerformFullSyncAsync_WhenSaveBulkStateThrows_PropagatesException()
    {
        // Arrange
        var config = CreateValidConfig();
        var item1 = CreateViewItem("key1", "value1");
        var expectedException = new DaprException("Save failed");

        _mockResultViewClient.Setup(c => c.GetCurrentResult(TestQueryId, It.IsAny<CancellationToken>()))
                             .Returns(CreateAsyncEnumerable(item1));
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(TestStateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(expectedException);

        // Act & Assert
        var actualException = await Assert.ThrowsAsync<DaprException>(() =>
            _service.PerformFullSyncAsync(TestQueryId, config, TestStateStoreName));
        Assert.Equal(expectedException, actualException);
    }

    [Fact]
    public async Task ProcessChangeAsync_WithEmptyEvent_DoesNothing()
    {
        // Arrange
        var config = CreateValidConfig();
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId,
            Sequence = 1,
            Kind = ChangeEventKind.Change,
            AddedResults = [],
            UpdatedResults = [],
            DeletedResults = []
        };

        // Act
        await _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(It.IsAny<string>(), It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<StateOptions>(), It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ProcessChangeAsync_WithOnlyAddsAndUpdates_CallsSaveBulkState()
    {
        // Arrange
        var config = CreateValidConfig();
        var addData = CreateDataDict("add1", "new");
        var updateBeforeData = CreateDataDict("update1", "old");
        var updateAfterData = CreateDataDict("update1", "changed");

        var evt = new ChangeEvent
        {
            QueryId = TestQueryId,
            Sequence = 1,
            Kind = ChangeEventKind.Change,
            AddedResults = [addData],
            UpdatedResults = [new UpdatedResultElement { Before = updateBeforeData, After = updateAfterData }],
            DeletedResults = []
        };

        // Act
        await _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(
            TestStateStoreName,
            It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list =>
                list.Count == 2 &&
                list.Any(i => i.Key == "add1" && i.Value["value"].ToString() == "new") &&
                list.Any(i => i.Key == "update1" && i.Value["value"].ToString() == "changed")
            ),
            It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<StateOptions>(), It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ProcessChangeAsync_WithOnlyDeletes_CallsDeleteStateForEachKey()
    {
        // Arrange
        var config = CreateValidConfig();
        var deleteData1 = CreateDataDict("delete1", "value1");
        var deleteData2 = CreateDataDict("delete2", "value2");
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId,
            Sequence = 1,
            Kind = ChangeEventKind.Change,
            AddedResults = [],
            UpdatedResults = [],
            DeletedResults = [deleteData1, deleteData2]
        };

        // Act
        await _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(It.IsAny<string>(), It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete2", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessChangeAsync_WithMixedOperations_CallsSaveAndDeletes()
    {
        // Arrange
        var config = CreateValidConfig();
        var addData = CreateDataDict("add1", "new");
        var deleteData = CreateDataDict("delete1", "value_to_delete");
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId,
            Sequence = 1,
            Kind = ChangeEventKind.Change,
            AddedResults = [addData],
            UpdatedResults = [],
            DeletedResults = [deleteData]
        };

        // Act
        await _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(
            TestStateStoreName,
            It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => list.Count == 1 && list[0].Key == "add1"),
            It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessChangeAsync_WhenKeyGenerationFailsForSave_SkipsItemAndThrowsAtEnd()
    {
        // Arrange
        var config = CreateValidConfig();
        var validAddData = CreateDataDict("add1", "new");
        var invalidAddData = new Dictionary<string, object> { { "wrongKeyField", "add2" }, { "value", "bad" } };
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId, 
            Sequence = 1, 
            Kind = ChangeEventKind.Change, 
            AddedResults = [validAddData, invalidAddData], 
            UpdatedResults = [], 
            DeletedResults = []
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AggregateException>(() =>
             _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt));

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(
            TestStateStoreName,
            It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => list.Count == 1 && list[0].Key == "add1"),
            It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<StateOptions>(), It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Never);

        Assert.Single(ex.InnerExceptions);
        var innerEx = ex.InnerExceptions[0];
        Assert.IsType<InvalidOperationException>(innerEx);
        Assert.Contains($"Failed to generate Dapr key for save/update item during event {evt.Sequence}", innerEx.Message);
    }

    [Fact]
    public async Task ProcessChangeAsync_WhenKeyGenerationFailsForDelete_SkipsItemAndThrowsAtEnd()
    {
        // Arrange
        var config = CreateValidConfig();
        var validDeleteData = CreateDataDict("delete1", "val");
        var invalidDeleteData = new Dictionary<string, object> { { "wrongKeyField", "delete2" } };
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId, 
            Sequence = 1, 
            Kind = ChangeEventKind.Change, 
            AddedResults = [], 
            UpdatedResults = [], 
            DeletedResults = [validDeleteData, invalidDeleteData]
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AggregateException>(() =>
             _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt));

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(It.IsAny<string>(), It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);

        Assert.Single(ex.InnerExceptions);
        var innerEx = ex.InnerExceptions[0];
        Assert.IsType<InvalidOperationException>(innerEx);
        Assert.Contains($"Failed to generate Dapr key for delete item during event {evt.Sequence}", innerEx.Message);
    }

    [Fact]
    public async Task ProcessChangeAsync_WhenSaveBulkThrows_AttemptsDeletesAndThrowsAggregate()
    {
        // Arrange
        var config = CreateValidConfig();
        var addData = CreateDataDict("add1", "new");
        var deleteData = CreateDataDict("delete1", "val");
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId, 
            Sequence = 1, 
            Kind = ChangeEventKind.Change, 
            AddedResults = [addData], 
            UpdatedResults = [], 
            DeletedResults = [deleteData]
        };
        var saveException = new DaprException("Save failed");
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(TestStateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(saveException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AggregateException>(() =>
             _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt));

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(TestStateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);

        Assert.Single(ex.InnerExceptions);
        var innerEx = ex.InnerExceptions[0];
        Assert.IsType<Exception>(innerEx);
        Assert.Contains($"Dapr bulk save operation failed during event {evt.Sequence}", innerEx.Message);
        Assert.Equal(saveException, innerEx.InnerException);
    }

    [Fact]
    public async Task ProcessChangeAsync_WhenDeleteThrows_AttemptsSaveAndThrowsAggregate()
    {
        // Arrange
        var config = CreateValidConfig();
        var addData = CreateDataDict("add1", "new");
        var deleteData = CreateDataDict("delete1", "val");
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId, 
            Sequence = 1, 
            Kind = ChangeEventKind.Change, 
            AddedResults = [addData], 
            UpdatedResults = [], 
            DeletedResults = [deleteData]
        };
        var deleteException = new DaprException("Delete failed");
        _mockDaprClient.Setup(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(deleteException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AggregateException>(() =>
             _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt));

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(TestStateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);

        Assert.Single(ex.InnerExceptions);
        var innerEx = ex.InnerExceptions[0];
        Assert.IsType<Exception>(innerEx);
        Assert.Contains($"Dapr delete operation failed for key 'delete1' during event {evt.Sequence}", innerEx.Message);
        Assert.Equal(deleteException, innerEx.InnerException);
    }

    [Fact]
    public async Task ProcessChangeAsync_WhenBothSaveAndDeleteThrow_ThrowsAggregateWithBoth()
    {
        // Arrange
        var config = CreateValidConfig();
        var addData = CreateDataDict("add1", "new");
        var deleteData = CreateDataDict("delete1", "val");
        var evt = new ChangeEvent
        {
            QueryId = TestQueryId, 
            Sequence = 1, 
            Kind = ChangeEventKind.Change, 
            AddedResults = [addData], 
            UpdatedResults = [], 
            DeletedResults = [deleteData]
        };
        var saveException = new DaprException("Save failed");
        var deleteException = new DaprException("Delete failed");
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(TestStateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(saveException);
        _mockDaprClient.Setup(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(deleteException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AggregateException>(() =>
             _service.ProcessChangeAsync(TestQueryId, config, TestStateStoreName, evt));

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(TestStateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(TestStateStoreName, "delete1", null, It.IsAny<Dictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);

        Assert.Equal(2, ex.InnerExceptions.Count);

        var innerSaveEx = ex.InnerExceptions.FirstOrDefault(e => e.Message.Contains("bulk save"));
        Assert.NotNull(innerSaveEx);
        Assert.IsType<Exception>(innerSaveEx);
        Assert.Equal(saveException, innerSaveEx.InnerException);

        var innerDeleteEx = ex.InnerExceptions.FirstOrDefault(e => e.Message.Contains("delete operation failed for key 'delete1'"));
        Assert.NotNull(innerDeleteEx);
        Assert.IsType<Exception>(innerDeleteEx);
        Assert.Equal(deleteException, innerDeleteEx.InnerException);
    }
}