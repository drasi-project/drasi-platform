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
using Drasi.Reaction.SDK.Models.QueryOutput;
using Dapr;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class ChangeEventHandlerTests
{
    private readonly Mock<DaprClient> _mockDaprClient;
    private readonly Mock<ILogger<ChangeEventHandler>> _mockLogger;
    private readonly Mock<IQuerySyncPointManager> _mockQuerySyncPointManager;
    private readonly ChangeEventHandler _handler;

    public ChangeEventHandlerTests()
    {
        _mockDaprClient = new Mock<DaprClient>();
        _mockLogger = new Mock<ILogger<ChangeEventHandler>>();
        _mockQuerySyncPointManager = new Mock<IQuerySyncPointManager>();
        _handler = new ChangeEventHandler(_mockDaprClient.Object, _mockLogger.Object, _mockQuerySyncPointManager.Object);
    }

    // Tests that HandleChange skips processing of the sync point change event.
    [Fact]
    public async Task HandleChange_SkipsSyncPointKey()
    {
        // Arrange
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var syncPointKey = "_drasi-sync-statestore-reaction_sync_point__testQuery";

        var evt = new ChangeEvent
        {
            QueryId = queryId,
            Sequence = sequence,
            AddedResults = [new Dictionary<string, object> { { keyField, syncPointKey }, { "value", "data1" } }]
        };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };

        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointKeyForQuery(queryId)).Returns(syncPointKey);

        _mockQuerySyncPointManager
            .Setup(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(It.IsAny<string>(), It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    // Tests that HandleChange throws ArgumentNullException if StateStoreName in queryConfig is null.
    [Fact]
    public async Task HandleChange_NullStateStoreName_ThrowsArgumentNullException()
    {
        var evt = new ChangeEvent { QueryId = "testQuery", Sequence = 1 };
        var queryConfig = new QueryConfig { KeyField = "id", StateStoreName = null }; // Null StateStoreName

        await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleChange(evt, queryConfig));
    }

    // Tests that HandleChange throws InvalidOperationException if sync point is not found.
    [Fact]
    public async Task HandleChange_SyncPointNotFound_ThrowsInvalidOperationException()
    {
        var queryId = "testQuery";
        var evt = new ChangeEvent { QueryId = queryId, Sequence = 10 };
        var queryConfig = new QueryConfig { KeyField = "id", StateStoreName = "store" };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns((long?)null);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.HandleChange(evt, queryConfig));
    }

    // Tests that HandleChange skips processing if event sequence is older than current sync point.
    [Fact]
    public async Task HandleChange_OldSequence_SkipsProcessing()
    {
        var queryId = "testQuery";
        var evt = new ChangeEvent { QueryId = queryId, Sequence = 5 };
        var queryConfig = new QueryConfig { KeyField = "id", StateStoreName = "store" };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L); // Current sync point is 10

        await _handler.HandleChange(evt, queryConfig);

        _mockDaprClient.VerifyNoOtherCalls(); // No Dapr operations should occur
        _mockQuerySyncPointManager.Verify(m => m.TryUpdateSyncPointAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<long>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    // Tests successful processing of added items.
    [Fact]
    public async Task HandleChange_AddedItems_SavesAndUpdatesSyncPoint()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent
        {
            QueryId = queryId,
            Sequence = sequence,
            AddedResults = [new Dictionary<string, object> { { keyField, "item1" }, { "value", "data1" } }]
        };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        await _handler.HandleChange(evt, queryConfig);

        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(stateStoreName, It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => list.Count == 1 && list[0].Key == "item1"), It.IsAny<CancellationToken>()), Times.Once);
        _mockQuerySyncPointManager.Verify(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>()), Times.Once);
    }

    // Tests successful processing of updated items.
    [Fact]
    public async Task HandleChange_UpdatedItems_SavesAndUpdatesSyncPoint()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent
        {
            QueryId = queryId,
            Sequence = sequence,
            UpdatedResults = [new UpdatedResultElement { After = new Dictionary<string, object> { { keyField, "item1" }, { "value", "newData" } } }]
        };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        await _handler.HandleChange(evt, queryConfig);

        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(stateStoreName, It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => list.Count == 1 && list[0].Key == "item1"), It.IsAny<CancellationToken>()), Times.Once);
        _mockQuerySyncPointManager.Verify(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>()), Times.Once);
    }

    // Tests successful processing of deleted items.
    [Fact]
    public async Task HandleChange_DeletedItems_DeletesAndUpdatesSyncPoint()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent
        {
            QueryId = queryId,
            Sequence = sequence,
            DeletedResults = [new Dictionary<string, object> { { keyField, "item1" } }]
        };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.DeleteStateAsync(stateStoreName, "item1", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        await _handler.HandleChange(evt, queryConfig);

        _mockDaprClient.Verify(d => d.DeleteStateAsync(stateStoreName, "item1", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockQuerySyncPointManager.Verify(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>()), Times.Once);
    }

    // Tests processing of mixed operations (add, update, delete).
    [Fact]
    public async Task HandleChange_MixedOperations_ProcessesAllAndUpdatesSyncPoint()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent
        {
            QueryId = queryId,
            Sequence = sequence,
            AddedResults = [new Dictionary<string, object> { { keyField, "itemAdd" } }],
            UpdatedResults = [new UpdatedResultElement { After = new Dictionary<string, object> { { keyField, "itemUpdate" } } }],
            DeletedResults = [new Dictionary<string, object> { { keyField, "itemDelete" } }]
        };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        _mockDaprClient.Setup(d => d.DeleteStateAsync(stateStoreName, "itemDelete", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        await _handler.HandleChange(evt, queryConfig);

        _mockDaprClient.Verify(d => d.SaveBulkStateAsync(stateStoreName, It.Is<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(list => list.Count == 2 && list.Any(i => i.Key == "itemAdd") && list.Any(i => i.Key == "itemUpdate")), It.IsAny<CancellationToken>()), Times.Once);
        _mockDaprClient.Verify(d => d.DeleteStateAsync(stateStoreName, "itemDelete", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockQuerySyncPointManager.Verify(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>()), Times.Once);
    }

    // Tests that HandleChange throws ArgumentNullException if KeyField value is null in item data during upsert.
    [Fact]
    public async Task HandleChange_NullKeyFieldValue_Upsert_ThrowsArgumentNullException()
    {
        var queryId = "testQuery";
        var keyField = "id";
        var evt = new ChangeEvent { QueryId = queryId, Sequence = 1, AddedResults = [new Dictionary<string, object> { { keyField, null! } }] }; // KeyField value is null
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = "store" };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(0L);

        await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleChange(evt, queryConfig));
    }

    // Tests that HandleChange throws ArgumentNullException if KeyField value is null in item data during delete.
    [Fact]
    public async Task HandleChange_NullKeyFieldValue_Delete_ThrowsArgumentNullException()
    {
        var queryId = "testQuery";
        var keyField = "id";
        var evt = new ChangeEvent { QueryId = queryId, Sequence = 1, DeletedResults = [new Dictionary<string, object> { { keyField, null! } }] }; // KeyField value is null
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = "store" };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(0L);

        await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleChange(evt, queryConfig));
    }


    // Tests that HandleChange throws AggregateException if SaveBulkStateAsync throws DaprException.
    [Fact]
    public async Task HandleChange_SaveBulkDaprException_ThrowsAggregateException()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent { QueryId = queryId, Sequence = sequence, AddedResults = [new Dictionary<string, object> { { keyField, "item1" } }] };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new DaprException("Dapr save error"));

        var ex = await Assert.ThrowsAsync<AggregateException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.IsType<DaprException>(ex.InnerExceptions.First());
    }

    // Tests that HandleChange throws AggregateException if SaveBulkStateAsync throws a generic Exception.
    [Fact]
    public async Task HandleChange_SaveBulkGenericException_ThrowsAggregateException()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent { QueryId = queryId, Sequence = sequence, AddedResults = [new Dictionary<string, object> { { keyField, "item1" } }] };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new Exception("Generic save error"));

        var ex = await Assert.ThrowsAsync<AggregateException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.IsType<Exception>(ex.InnerExceptions.First());
        Assert.Equal("Generic save error", ex.InnerExceptions.First().Message);
    }

    // Tests that HandleChange throws AggregateException if DeleteStateAsync throws DaprException.
    [Fact]
    public async Task HandleChange_DeleteStateDaprException_ThrowsAggregateException()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent { QueryId = queryId, Sequence = sequence, DeletedResults = [new Dictionary<string, object> { { keyField, "item1" } }] };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.DeleteStateAsync(stateStoreName, "item1", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new DaprException("Dapr delete error"));

        var ex = await Assert.ThrowsAsync<AggregateException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.IsType<DaprException>(ex.InnerExceptions.First());
    }
    
    // Tests that HandleChange throws AggregateException if DeleteStateAsync throws a generic Exception.
    [Fact]
    public async Task HandleChange_DeleteStateGenericException_ThrowsAggregateException()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent { QueryId = queryId, Sequence = sequence, DeletedResults = [new Dictionary<string, object> { { keyField, "item1" } }] };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.DeleteStateAsync(stateStoreName, "item1", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new Exception("Generic delete error"));

        var ex = await Assert.ThrowsAsync<AggregateException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.IsType<Exception>(ex.InnerExceptions.First());
        Assert.Equal("Generic delete error", ex.InnerExceptions.First().Message);
    }


    // Tests that HandleChange throws InvalidOperationException if TryUpdateSyncPointAsync fails.
    [Fact]
    public async Task HandleChange_UpdateSyncPointFails_ThrowsInvalidOperationException()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent { QueryId = queryId, Sequence = sequence, AddedResults = [new Dictionary<string, object> { { keyField, "item1" } }] };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };

        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        _mockQuerySyncPointManager.Setup(m => m.TryUpdateSyncPointAsync(queryId, stateStoreName, sequence, It.IsAny<CancellationToken>())).ReturnsAsync(false); // Update fails

        await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.HandleChange(evt, queryConfig));
    }

    // Tests that HandleChange throws AggregateException if both save and delete operations fail.
    [Fact]
    public async Task HandleChange_BothSaveAndDeleteFail_ThrowsAggregateExceptionWithMultipleInner()
    {
        var queryId = "testQuery";
        var stateStoreName = "store";
        var keyField = "id";
        var sequence = 15L;
        var evt = new ChangeEvent
        {
            QueryId = queryId,
            Sequence = sequence,
            AddedResults = [new Dictionary<string, object> { { keyField, "itemAdd" } }],
            DeletedResults = [new Dictionary<string, object> { { keyField, "itemDelete" } }]
        };
        var queryConfig = new QueryConfig { KeyField = keyField, StateStoreName = stateStoreName };
        _mockQuerySyncPointManager.Setup(m => m.GetSyncPointForQuery(queryId)).Returns(10L);
        _mockDaprClient.Setup(d => d.SaveBulkStateAsync(stateStoreName, It.IsAny<IReadOnlyList<SaveStateItem<Dictionary<string, object>>>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new DaprException("Save failed"));
        _mockDaprClient.Setup(d => d.DeleteStateAsync(stateStoreName, "itemDelete", It.IsAny<StateOptions>(), It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new Exception("Delete failed"));

        var ex = await Assert.ThrowsAsync<AggregateException>(() => _handler.HandleChange(evt, queryConfig));
        Assert.Equal(2, ex.InnerExceptions.Count);
        Assert.Contains(ex.InnerExceptions, innerEx => innerEx is DaprException && innerEx.Message.Contains("Save failed"));
        Assert.Contains(ex.InnerExceptions, innerEx => innerEx is Exception && innerEx.Message.Contains("Delete failed"));
    }
}