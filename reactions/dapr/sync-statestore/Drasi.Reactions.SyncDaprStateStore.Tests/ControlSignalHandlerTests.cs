using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class ControlSignalHandlerTests
{
    private readonly Mock<IDaprSyncService> _mockDaprSyncService;
    private readonly Mock<IQuerySyncStateManager> _mockStateManager;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly ILogger<ControlSignalHandler> _testLogger;
    private readonly ControlSignalHandler _handler;

    private const string TestQueryId = "test-query-control";
    private const string ValidStateStoreName = "my-state-store";

    public ControlSignalHandlerTests()
    {
        _mockDaprSyncService = new Mock<IDaprSyncService>();
        _mockStateManager = new Mock<IQuerySyncStateManager>();
        _mockConfiguration = new Mock<IConfiguration>();
        _testLogger = NullLogger<ControlSignalHandler>.Instance;

        _handler = new ControlSignalHandler(
            _mockDaprSyncService.Object,
            _mockStateManager.Object,
            _mockConfiguration.Object,
            _testLogger);
    }

    private static ControlEvent CreateControlEvent(long sequence, ControlSignalKind signalKind)
    {
        return new ControlEvent
        {
            QueryId = TestQueryId,
            Sequence = sequence,
            Kind = ControlEventKind.Control,
            ControlSignal = new ControlSignalClass { Kind = signalKind }
        };
    }

    private static QueryConfig CreateValidQueryConfig()
    {
        return new QueryConfig { KeyField = "id", KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
    }

    [Fact]
    public async Task HandleControlSignal_WhenQueryConfigIsNull_LogsErrorAndReturns()
    {
        // Arrange
        var evt = CreateControlEvent(10, ControlSignalKind.BootstrapCompleted);
        QueryConfig? queryConfig = null;

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>()), Times.Never);
        _mockStateManager.Verify(s => s.TryMarkInitialized(It.IsAny<string>(), It.IsAny<long>()), Times.Never);
        _mockStateManager.Verify(s => s.ResetState(It.IsAny<string>()), Times.Never);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task HandleControlSignal_WhenStateStoreNameIsMissingOrEmpty_LogsErrorAndReturns(string? stateStoreName)
    {
        // Arrange
        var evt = CreateControlEvent(10, ControlSignalKind.BootstrapCompleted);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(stateStoreName);

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>()), Times.Never);
        _mockStateManager.Verify(s => s.TryMarkInitialized(It.IsAny<string>(), It.IsAny<long>()), Times.Never);
        _mockStateManager.Verify(s => s.ResetState(It.IsAny<string>()), Times.Never);
    }

    [Theory]
    [InlineData(ControlSignalKind.Deleted)]
    [InlineData(ControlSignalKind.BootstrapStarted)]
    [InlineData(ControlSignalKind.Running)]
    public async Task HandleControlSignal_WhenSignalIsNotBootstrapCompleted_ResetsStateAndReturns(ControlSignalKind signalKind)
    {
        // Arrange
        var evt = CreateControlEvent(10, signalKind);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>()), Times.Never);
        _mockStateManager.Verify(s => s.TryMarkInitialized(It.IsAny<string>(), It.IsAny<long>()), Times.Never);
        _mockStateManager.Verify(s => s.ResetState(TestQueryId), Times.Once);
    }

    [Fact]
    public async Task HandleControlSignal_BootstrapCompletedSignal_WhenNotInitialized_PerformsSyncAndMarksInitialized()
    {
        // Arrange
        long eventSequence = 20;
        var evt = CreateControlEvent(eventSequence, ControlSignalKind.BootstrapCompleted);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        long initSeq;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out initSeq)).Returns(false);

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockStateManager.Verify(s => s.ResetState(TestQueryId), Times.Never);
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(TestQueryId, queryConfig, ValidStateStoreName), Times.Once);
        _mockStateManager.Verify(s => s.TryMarkInitialized(TestQueryId, eventSequence), Times.Once);
    }

    [Theory]
    [InlineData(30, 30)]
    [InlineData(29, 30)]
    public async Task HandleControlSignal_BootstrapCompletedSignal_WhenAlreadyInitializedWithNewerOrEqualSequence_DoesNothing(long eventSequence, long initSequence)
    {
        // Arrange
        var evt = CreateControlEvent(eventSequence, ControlSignalKind.BootstrapCompleted);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        
        long capturedInitSequence = initSequence;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out capturedInitSequence))
                         .Returns(true);

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockStateManager.Verify(s => s.ResetState(It.IsAny<string>()), Times.Never);
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>()), Times.Never);
        _mockStateManager.Verify(s => s.TryMarkInitialized(It.IsAny<string>(), It.IsAny<long>()), Times.Never);
    }

    [Fact]
    public async Task HandleControlSignal_BootstrapCompletedSignal_WhenInitializedWithOlderSequence_ResetsPerformsSyncAndMarksInitialized()
    {
        // Arrange
        long initSequence = 40;
        long eventSequence = 41;
        var evt = CreateControlEvent(eventSequence, ControlSignalKind.BootstrapCompleted);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        
        long capturedInitSequence = initSequence;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out capturedInitSequence))
                         .Returns(true);

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockStateManager.Verify(s => s.ResetState(TestQueryId), Times.Once);
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(TestQueryId, queryConfig, ValidStateStoreName), Times.Once);
        _mockStateManager.Verify(s => s.TryMarkInitialized(TestQueryId, eventSequence), Times.Once);
    }

    [Fact]
    public async Task HandleControlSignal_BootstrapCompletedSignal_WhenPerformFullSyncThrows_LogsErrorAndResetsState()
    {
        // Arrange
        long eventSequence = 50;
        var evt = CreateControlEvent(eventSequence, ControlSignalKind.BootstrapCompleted);
        var queryConfig = CreateValidQueryConfig();
        var expectedException = new TimeoutException("Sync timed out");
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        long initSeq;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out initSeq)).Returns(false);
        _mockDaprSyncService.Setup(s => s.PerformFullSyncAsync(TestQueryId, queryConfig, ValidStateStoreName))
                            .ThrowsAsync(expectedException);

        // Act
        await _handler.HandleControlSignal(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.PerformFullSyncAsync(TestQueryId, queryConfig, ValidStateStoreName), Times.Once);
        _mockStateManager.Verify(s => s.TryMarkInitialized(TestQueryId, eventSequence), Times.Never);
        _mockStateManager.Verify(s => s.ResetState(TestQueryId), Times.Once);
    }
}