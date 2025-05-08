using Xunit;
using Microsoft.Extensions.Logging.Abstractions;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class DaprKeyGeneratorTests
{
    private readonly NullLogger _nullLogger = NullLogger.Instance;

    private static Dictionary<string, object> CreateTestData(string keyField, object keyValue)
    {
        return new Dictionary<string, object> { { keyField, keyValue } };
    }

    [Fact]
    public void TryGenerateKey_WhenConfigIsNull_ReturnsFalse()
    {
        // Arrange
        var data = CreateTestData("id", "value1");

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(null, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WhenKeyFieldIsNullInConfig_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = null, KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
        var data = CreateTestData("id", "value1");

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WhenKeyFieldIsEmptyInConfig_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = string.Empty, KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
        var data = CreateTestData("id", "value1");

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WhenKeyFieldNotInDaata_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "id", KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
        var data = new Dictionary<string, object> { { "anotherKey", "value1" } };

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WhenKeyValueIsNullInData_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "id", KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
        var data = CreateTestData("id", null!);

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WhenKeyValueIsEmptyStringInData_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "id", KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
        var data = CreateTestData("id", string.Empty);

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Theory]
    [InlineData("value1")]
    [InlineData(123)]
    [InlineData(true)]
    [InlineData("a-guid-value")]
    public void TryGenerateKey_WithPrefixNone_ReturnsTrueAndCorrectKey(object keyValue)
    {
        // Arrange
        var config = new QueryConfig { KeyField = "dataKey", KeyPrefix = QueryConfig.KeyPrefixStrategy.None };
        var data = CreateTestData("dataKey", keyValue);
        var expectedKey = keyValue.ToString();

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.True(result);
        Assert.Equal(expectedKey, daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixAppId_ReturnsTrueAndCorrectKey()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "pk", KeyPrefix = QueryConfig.KeyPrefixStrategy.AppId, AppId = "app1" };
        var data = CreateTestData("pk", "key123");
        var expectedKey = "app1||key123";

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.True(result);
        Assert.Equal(expectedKey, daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixAppId_ButAppIdMissing_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "pk", KeyPrefix = QueryConfig.KeyPrefixStrategy.AppId, AppId = null }; // AppId missing
        var data = CreateTestData("pk", "key123");

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixNamespace_ReturnsTrueAndCorrectKey()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "user", KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace, AppId = "app2", Namespace = "ns1" };
        var data = CreateTestData("user", "aman");
        var expectedKey = "ns1.app2||aman";

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.True(result);
        Assert.Equal(expectedKey, daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixNamespace_ButNamespaceMissing_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "user", KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace, AppId = "app2", Namespace = null }; // Namespace missing
        var data = CreateTestData("user", "aman");

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixNamespace_ButAppIdMissing_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "user", KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace, AppId = null, Namespace = "ns1" }; // AppId missing
        var data = CreateTestData("user", "aman");

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, "store", data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixName_ReturnsTrueAndCorrectKey()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "docId", KeyPrefix = QueryConfig.KeyPrefixStrategy.Name };
        var data = CreateTestData("docId", 987);
        var stateStoreName = "my-state-store";
        var expectedKey = $"{stateStoreName}||987";

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, stateStoreName, data, _nullLogger, out var daprKey);

        // Assert
        Assert.True(result);
        Assert.Equal(expectedKey, daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixName_ButStateStoreNameMissing_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "docId", KeyPrefix = QueryConfig.KeyPrefixStrategy.Name };
        var data = CreateTestData("docId", 987);

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, null, data, _nullLogger, out var daprKey); // State store name is null

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithPrefixName_ButStateStoreNameEmpty_ReturnsFalse()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "docId", KeyPrefix = QueryConfig.KeyPrefixStrategy.Name };
        var data = CreateTestData("docId", 987);

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, string.Empty, data, _nullLogger, out var daprKey); // State store name is empty

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }

    [Fact]
    public void TryGenerateKey_WithUnknownPrefixStrategy_ReturnsFalse()
    {
        // Arrange
        var invalidPrefixStrategy = (QueryConfig.KeyPrefixStrategy)999;
        var config = new QueryConfig { KeyField = "id", KeyPrefix = invalidPrefixStrategy };
        var data = CreateTestData("id", "value1");
        var stateStoreName = "my-store";

        // Act
        var result = DaprKeyGenerator.TryGenerateKey(config, stateStoreName, data, _nullLogger, out var daprKey);

        // Assert
        Assert.False(result);
        Assert.Null(daprKey);
    }
}