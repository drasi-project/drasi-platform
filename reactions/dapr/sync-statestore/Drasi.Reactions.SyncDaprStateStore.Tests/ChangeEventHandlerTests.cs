using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class ChangeEventHandlerTests
{
    private readonly Mock<IDaprSyncService> _mockDaprSyncService;
    private readonly Mock<IQuerySyncStateManager> _mockStateManager;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly ILogger<ChangeEventHandler> _testLogger;
    private readonly ChangeEventHandler _handler;

    private const string TestQueryId = "test-query-change";
    private const string ValidStateStoreName = "my-state-store";

    public ChangeEventHandlerTests()
    {
        _mockDaprSyncService = new Mock<IDaprSyncService>();
        _mockStateManager = new Mock<IQuerySyncStateManager>();
        _mockConfiguration = new Mock<IConfiguration>();
        _testLogger = NullLogger<ChangeEventHandler>.Instance;

        _handler = new ChangeEventHandler(
            _mockDaprSyncService.Object,
            _mockStateManager.Object,
            _mockConfiguration.Object,
            _testLogger);
    }

    private static ChangeEvent CreateChangeEvent(long sequence)
    {
        return new ChangeEvent
        {
            QueryId = TestQueryId,
            Sequence = sequence,
            Kind = ChangeEventKind.Change,
            AddedResults = [],
            UpdatedResults = [],
            DeletedResults = []
        };
    }

    private static QueryConfig CreateValidQueryConfig()
    {
        return new QueryConfig { KeyField = "id", KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
    }

    [Fact]
    public async Task HandleChange_WhenQueryConfigIsNull_LogsErrorAndReturns()
    {
        // Arrange
        var evt = CreateChangeEvent(10);
        QueryConfig? queryConfig = null;

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.ProcessChangeAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>(), It.IsAny<ChangeEvent>()), Times.Never);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task HandleChange_WhenStateStoreNameIsMissingOrEmpty_LogsErrorAndReturns(string? stateStoreName)
    {
        // Arrange
        var evt = CreateChangeEvent(10);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(stateStoreName);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.ProcessChangeAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>(), It.IsAny<ChangeEvent>()), Times.Never);
    }

    [Fact]
    public async Task HandleChange_WhenNotInitialized_LogsWarningAndReturns()
    {
        // Arrange
        var evt = CreateChangeEvent(10);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        long initSeq;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out initSeq)).Returns(false);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.ProcessChangeAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>(), It.IsAny<ChangeEvent>()), Times.Never);
    }

    [Theory]
    [InlineData(50, 50)] // Sequence equal to init sequence
    [InlineData(49, 50)] // Sequence less than init sequence
    public async Task HandleChange_WhenSequenceNotNewerThanInitialization_LogsInfoAndReturns(long eventSequence, long initSequence)
    {
        // Arrange
        var evt = CreateChangeEvent(eventSequence);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        
        long capturedInitSequence = initSequence;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out capturedInitSequence))
                         .Returns(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.ProcessChangeAsync(It.IsAny<string>(), It.IsAny<QueryConfig>(), It.IsAny<string>(), It.IsAny<ChangeEvent>()), Times.Never);
    }

    [Fact]
    public async Task HandleChange_WhenInitializedAndSequenceIsNewer_CallsProcessChangeAsync()
    {
        // Arrange
        long initSequence = 50;
        long eventSequence = 51; // Newer sequence
        var evt = CreateChangeEvent(eventSequence);
        var queryConfig = CreateValidQueryConfig();
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        
        long capturedInitSequence = initSequence;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out capturedInitSequence))
                         .Returns(true);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.ProcessChangeAsync(TestQueryId, queryConfig, ValidStateStoreName, evt), Times.Once);
    }

    [Fact]
    public async Task HandleChange_WhenProcessChangeAsyncThrows_LogsError()
    {
        // Arrange
        long initSequence = 50;
        long eventSequence = 51;
        var evt = CreateChangeEvent(eventSequence);
        var queryConfig = CreateValidQueryConfig();
        var expectedException = new InvalidOperationException("Dapr sync failed");
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(ValidStateStoreName);
        
        long capturedInitSequence = initSequence;
        _mockStateManager.Setup(s => s.IsInitialized(TestQueryId, out capturedInitSequence))
                         .Returns(true);
        _mockDaprSyncService.Setup(s => s.ProcessChangeAsync(TestQueryId, queryConfig, ValidStateStoreName, evt))
                            .ThrowsAsync(expectedException);

        // Act
        await _handler.HandleChange(evt, queryConfig);

        // Assert
        _mockDaprSyncService.Verify(s => s.ProcessChangeAsync(TestQueryId, queryConfig, ValidStateStoreName, evt), Times.Once);
    }
}