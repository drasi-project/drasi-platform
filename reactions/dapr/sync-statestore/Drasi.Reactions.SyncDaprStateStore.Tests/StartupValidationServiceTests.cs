using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Microsoft.Extensions.Logging.Abstractions;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class StartupValidationServiceTests
{
    private readonly Mock<IQueryConfigService> _mockQueryConfigService;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<IConfigurationSection> _mockConfigSection;
    private readonly ILogger<StartupValidationService> _testLogger;
    private readonly StartupValidationService _service;

    public StartupValidationServiceTests()
    {
        _mockQueryConfigService = new Mock<IQueryConfigService>();
        _mockConfiguration = new Mock<IConfiguration>();
        _mockConfigSection = new Mock<IConfigurationSection>();
        _testLogger = NullLogger<StartupValidationService>.Instance;

        _mockConfiguration.Setup(c => c.GetSection(It.IsAny<string>()))
                          .Returns(_mockConfigSection.Object);
        _mockConfiguration.Setup(c => c[It.IsAny<string>()])
                          .Returns((string key) => _mockConfigSection.Object.Value);

        _service = new StartupValidationService(
            _testLogger,
            _mockQueryConfigService.Object,
            _mockConfiguration.Object);
    }

    private void SetupStateStoreName(string? value)
    {
        _mockConfiguration.Setup(c => c["stateStoreName"]).Returns(value);
    }

    [Fact]
    public async Task StartAsync_WhenStateStoreNameIsValid_CompletesSuccessfully()
    {
        // Arrange
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([]); // No queries

        // Act
        var exception = await Record.ExceptionAsync(() => _service.StartAsync(CancellationToken.None));

        // Assert
        Assert.Null(exception);
    }

    [Fact]
    public async Task StartAsync_WhenStateStoreNameIsMissing_ThrowsInvalidOperationException()
    {
        // Arrange
        SetupStateStoreName(null); // Simulate missing key
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([]);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains("Required property 'stateStoreName' is missing or empty", ex.Message);
    }

    [Fact]
    public async Task StartAsync_WhenStateStoreNameIsEmpty_ThrowsInvalidOperationException()
    {
        // Arrange
        SetupStateStoreName(string.Empty);
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([]);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains("Required property 'stateStoreName' is missing or empty", ex.Message);
    }

    [Fact]
    public async Task StartAsync_WhenNoQueryConfigsExist_CompletesSuccessfully()
    {
        // Arrange
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([]);

        // Act
        var exception = await Record.ExceptionAsync(() => _service.StartAsync(CancellationToken.None));

        // Assert
        Assert.Null(exception);
    }

    [Fact]
    public async Task StartAsync_WhenOneValidQueryConfigExists_CompletesSuccessfully()
    {
        // Arrange
        const string queryName = "query1";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.None, KeyField = "id" });

        // Act
        var exception = await Record.ExceptionAsync(() => _service.StartAsync(CancellationToken.None));

        // Assert
        Assert.Null(exception);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>(queryName), Times.Once);
    }

    [Fact]
    public async Task StartAsync_WhenMultipleValidQueryConfigsExist_CompletesSuccessfully()
    {
        // Arrange
        const string queryName1 = "query1";
        const string queryName2 = "query2";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName1, queryName2]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName1))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.Name, KeyField = "name" });
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName2))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.AppId, AppId = "app1", KeyField = "productId" });

        // Act
        var exception = await Record.ExceptionAsync(() => _service.StartAsync(CancellationToken.None));

        // Assert
        Assert.Null(exception);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>(queryName1), Times.Once);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>(queryName2), Times.Once);
    }

    [Fact]
    public async Task StartAsync_WhenQueryConfigIsNull_ThrowsInvalidOperationException()
    {
        // Arrange
        const string queryName = "query-deserialization-fails";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName))
                               .Returns((QueryConfig?)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains($"Configuration for query '{queryName}' is null or could not be deserialized", ex.Message);
    }

    [Fact]
    public async Task StartAsync_WhenQueryConfigFailsRequiredValidation_ThrowsInvalidOperationException()
    {
        // Arrange
        const string queryName = "query-missing-keyprefix";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName))
                               .Returns(new QueryConfig { KeyField = "id" /* KeyPrefix = null */ });

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains($"Invalid configuration for query '{queryName}'", ex.Message);
        Assert.Contains("[KeyPrefix: missing required property", ex.Message);
    }

    [Fact]
    public async Task StartAsync_WhenQueryConfigFailsRequiredValidation_KeyFieldMissing_ThrowsInvalidOperationException()
    {
        // Arrange
        const string queryName = "query-missing-keyfield";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.None /* KeyField = null */ });

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains($"Invalid configuration for query '{queryName}'", ex.Message);
        Assert.Contains("[KeyField: missing required property", ex.Message);
    }

    [Theory]
    [InlineData(QueryConfig.KeyPrefixStrategy.AppId, null, null, "AppId", "appId must be specified")] // AppId missing for AppId strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.AppId, "app1", "ns1", "Namespace", "namespace should not be specified")] // Namespace provided for AppId strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.Namespace, null, "ns1", "AppId", "appId must be specified")] // AppId missing for Namespace strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.Namespace, "app1", null, "Namespace", "namespace must be specified")] // Namespace missing for Namespace strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.None, "app1", null, "AppId", "appId should not be specified")] // AppId provided for None strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.None, null, "ns1", "Namespace", "namespace should not be specified")] // Namespace provided for None strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.Name, "app1", null, "AppId", "appId should not be specified")] // AppId provided for Name strategy
    [InlineData(QueryConfig.KeyPrefixStrategy.Name, null, "ns1", "Namespace", "namespace should not be specified")] // Namespace provided for Name strategy
    public async Task StartAsync_WhenQueryConfigFailsCustomValidation_ThrowsInvalidOperationException(
        QueryConfig.KeyPrefixStrategy prefix, string? appId, string? ns, string expectedMember, string expectedErrorPart)
    {
        // Arrange
        const string queryName = "query-custom-validation";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName))
                               .Returns(new QueryConfig { KeyField = "someKey", KeyPrefix = prefix, AppId = appId, Namespace = ns });

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains($"Invalid configuration for query '{queryName}'", ex.Message);
        Assert.Contains($"[{expectedMember}:", ex.Message);
        Assert.Contains(expectedErrorPart, ex.Message);
    }

    [Fact]
    public async Task StartAsync_WhenQueryConfigServiceThrowsException_ThrowsInvalidOperationException()
    {
        // Arrange
        const string queryName = "query-load-error";
        var simulatedException = new FormatException("Simulated config load error");
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([queryName]);
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(queryName))
                               .Throws(simulatedException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains($"Failed to load or validate configuration for query '{queryName}'", ex.Message);
        Assert.Same(simulatedException, ex.InnerException);
    }

    [Fact]
    public async Task StartAsync_WhenMultipleInvalidQueryConfigsExist_ThrowsOnFirstInvalid()
    {
        // Arrange
        const string validQuery = "query-valid";
        const string invalidQuery = "query-invalid";
        const string anotherQuery = "query-never-checked";
        SetupStateStoreName("my-valid-store");
        _mockQueryConfigService.Setup(q => q.GetQueryNames()).Returns([validQuery, invalidQuery, anotherQuery]);

        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(validQuery))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.None, KeyField = "id" });

        // Invalid config: KeyField is required but missing
        _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(invalidQuery))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.Name });

         _mockQueryConfigService.Setup(q => q.GetQueryConfig<QueryConfig>(anotherQuery))
                               .Returns(new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.Name, KeyField = "name" });

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.StartAsync(CancellationToken.None));
        Assert.Contains($"Invalid configuration for query '{invalidQuery}'", ex.Message);
        Assert.Contains("[KeyField: missing required property", ex.Message);

        // Verify that service stopped processing after the first error
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>(validQuery), Times.Once);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>(invalidQuery), Times.Once);
        _mockQueryConfigService.Verify(q => q.GetQueryConfig<QueryConfig>(anotherQuery), Times.Never);
    }

    [Fact]
    public async Task StopAsync_CompletesSuccessfully()
    {
        // Arrange
        var cancellationToken = CancellationToken.None;

        // Act
        var task = _service.StopAsync(cancellationToken);
        await task;

        // Assert
        Assert.True(task.IsCompletedSuccessfully);
    }
}