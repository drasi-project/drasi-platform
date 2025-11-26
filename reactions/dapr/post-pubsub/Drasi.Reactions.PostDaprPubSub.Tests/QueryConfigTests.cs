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

using System.ComponentModel.DataAnnotations;
using Xunit;

namespace Drasi.Reactions.PostDaprPubSub.Tests;

public class QueryConfigTests
{
    [Fact]
    public void QueryConfig_DefaultValues_ShouldBeCorrect()
    {
        // Arrange, Act
        var config = new QueryConfig();

        // Assert
        Assert.Equal("drasi-pubsub", config.PubsubName);
        Assert.Equal(string.Empty, config.TopicName);
        Assert.Equal(OutputFormat.Unpacked, config.Format); // Default is unpacked
        Assert.False(config.SkipControlSignals);
        Assert.Null(config.AddedResultsTemplate);
        Assert.Null(config.UpdatedResultsTemplate);
        Assert.Null(config.DeletedResultsTemplate);
        Assert.False(config.HasTemplates);
    }

    [Fact]
    public void ValidateConfig_ValidConfiguration_ShouldHaveNoErrors()
    {
        // Arrange
        var config = new QueryConfig
        {
            PubsubName = "test-pubsub",
            TopicName = "test-topic"
        };

        var validationContext = new ValidationContext(config);
        var validationResults = new List<ValidationResult>();

        // Act
        var isValid = Validator.TryValidateObject(config, validationContext, validationResults, true);

        // Assert
        Assert.True(isValid);
        Assert.Empty(validationResults);
    }

    [Fact]
    public void ValidateConfig_EmptyPubsubName_ShouldHaveError()
    {
        // Arrange
        var config = new QueryConfig
        {
            PubsubName = "",
            TopicName = "test-topic"
        };

        var validationContext = new ValidationContext(config);
        var validationResults = new List<ValidationResult>();

        // Act
        var isValid = Validator.TryValidateObject(config, validationContext, validationResults, true);

        // Assert
        Assert.False(isValid);
        Assert.Single(validationResults);
        Assert.Contains(validationResults, r => r.MemberNames.Contains("PubsubName"));
    }

    [Fact]
    public void ValidateConfig_EmptyTopicName_ShouldHaveError()
    {
        // Arrange
        var config = new QueryConfig
        {
            PubsubName = "test-pubsub",
            TopicName = ""
        };

        var validationContext = new ValidationContext(config);
        var validationResults = new List<ValidationResult>();

        // Act
        var isValid = Validator.TryValidateObject(config, validationContext, validationResults, true);

        // Assert
        Assert.False(isValid);
        Assert.Single(validationResults);
        Assert.Contains(validationResults, r => r.MemberNames.Contains("TopicName"));
    }

    [Fact]
    public void QueryConfig_FormatMode_DefaultIsUnpacked()
    {
        // Arrange, Act
        var config = new QueryConfig();

        // Assert
        Assert.Equal(OutputFormat.Unpacked, config.Format);
    }

    [Fact]
    public void QueryConfig_FormatMode_CanBeSetToPacked()
    {
        // Arrange, Act
        var config = new QueryConfig
        {
            Format = OutputFormat.Packed
        };

        // Assert
        Assert.Equal(OutputFormat.Packed, config.Format);
    }
    
    [Fact]
    public void QueryConfig_HasTemplates_ReturnsFalseWhenNoTemplates()
    {
        // Arrange, Act
        var config = new QueryConfig();

        // Assert
        Assert.False(config.HasTemplates);
    }
    
    [Fact]
    public void QueryConfig_HasTemplates_ReturnsTrueWhenAddedResultsTemplateSet()
    {
        // Arrange, Act
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"id\": \"{{id}}\"}"
        };

        // Assert
        Assert.True(config.HasTemplates);
    }
    
    [Fact]
    public void QueryConfig_HasTemplates_ReturnsTrueWhenUpdatedResultsTemplateSet()
    {
        // Arrange, Act
        var config = new QueryConfig
        {
            UpdatedResultsTemplate = "{\"before\": \"{{before.id}}\", \"after\": \"{{after.id}}\"}"
        };

        // Assert
        Assert.True(config.HasTemplates);
    }
    
    [Fact]
    public void QueryConfig_HasTemplates_ReturnsTrueWhenDeletedResultsTemplateSet()
    {
        // Arrange, Act
        var config = new QueryConfig
        {
            DeletedResultsTemplate = "{\"deletedId\": \"{{id}}\"}"
        };

        // Assert
        Assert.True(config.HasTemplates);
    }
    
    [Fact]
    public void QueryConfig_HasTemplates_ReturnsTrueWhenAllTemplatesSet()
    {
        // Arrange, Act
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"id\": \"{{id}}\"}",
            UpdatedResultsTemplate = "{\"before\": \"{{before.id}}\", \"after\": \"{{after.id}}\"}",
            DeletedResultsTemplate = "{\"deletedId\": \"{{id}}\"}"
        };

        // Assert
        Assert.True(config.HasTemplates);
    }
}