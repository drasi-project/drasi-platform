using System.ComponentModel.DataAnnotations;
using Xunit;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;

public class QueryConfigTests
{
    private static List<ValidationResult> ValidateModel(object model)
    {
        var validationContext = new ValidationContext(model);
        var validationResults = new List<ValidationResult>();
        Validator.TryValidateObject(model, validationContext, validationResults, true);
        return validationResults;
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNull_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig { KeyField = "id" }; // KeyPrefix is null

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(QueryConfig.KeyPrefix)) && r.ErrorMessage != null && r.ErrorMessage.Contains("missing required property"));
    }

    [Fact]
    public void Validate_WhenKeyFieldIsNull_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.None }; // KeyField is null

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(QueryConfig.KeyField)) && r.ErrorMessage != null && r.ErrorMessage.Contains("missing required property"));
    }

    [Fact]
    public void Validate_WhenKeyFieldIsEmpty_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig { KeyPrefix = QueryConfig.KeyPrefixStrategy.None, KeyField = "" };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(QueryConfig.KeyField)) && r.ErrorMessage != null && r.ErrorMessage.Contains("missing required property"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNone_AndKeyFieldIsValid_ReturnsSuccess()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.None,
            KeyField = "id"
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsAppId_AndAppIdIsMissing_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.AppId,
            KeyField = "id",
            AppId = null // Missing AppId
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("appId must be specified when keyPrefix is 'appId'"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsAppId_AndAppIdIsEmpty_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.AppId,
            KeyField = "id",
            AppId = "" // Empty AppId
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("appId must be specified when keyPrefix is 'appId'"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsAppId_AndAppIdIsValid_ReturnsSuccess()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.AppId,
            KeyField = "id",
            AppId = "my-app"
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNamespace_AndNamespaceIsMissing_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace,
            KeyField = "id",
            AppId = "my-app",
            Namespace = null // Missing Namespace
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("namespace must be specified when keyPrefix is 'namespace'"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNamespace_AndNamespaceIsEmpty_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace,
            KeyField = "id",
            AppId = "my-app",
            Namespace = "" // Empty Namespace
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("namespace must be specified when keyPrefix is 'namespace'"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNamespace_AndAppIdIsMissing_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace,
            KeyField = "id",
            Namespace = "my-namespace",
            AppId = null // Missing AppId
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("appId must be specified when keyPrefix is 'namespace'"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNamespace_AndAppIdIsEmpty_ReturnsValidationError()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace,
            KeyField = "id",
            Namespace = "my-namespace",
            AppId = "" // Empty AppId
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.NotEmpty(results);
        Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("appId must be specified when keyPrefix is 'namespace'"));
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsNamespace_AndAllFieldsValid_ReturnsSuccess()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.Namespace,
            KeyField = "id",
            AppId = "my-app",
            Namespace = "my-namespace"
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void Validate_WhenKeyPrefixIsName_AndKeyFieldIsValid_ReturnsSuccess()
    {
        // Arrange
        var config = new QueryConfig
        {
            KeyPrefix = QueryConfig.KeyPrefixStrategy.Name,
            KeyField = "id"
        };

        // Act
        var results = ValidateModel(config);

        // Assert
        Assert.Empty(results);
    }
}