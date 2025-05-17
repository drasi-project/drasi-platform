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
        Assert.False(config.Packed); // Default is unpacked
        Assert.Equal(5, config.MaxFailureCount);
        Assert.False(config.SkipControlSignals);
    }

    [Fact]
    public void ValidateConfig_ValidConfiguration_ShouldHaveNoErrors()
    {
        // Arrange
        var config = new QueryConfig
        {
            PubsubName = "test-pubsub",
            TopicName = "test-topic",
            MaxFailureCount = 10
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
    public void ValidateConfig_NegativeMaxFailureCount_ShouldHaveError()
    {
        // Arrange
        var config = new QueryConfig
        {
            PubsubName = "test-pubsub",
            TopicName = "test-topic",
            MaxFailureCount = -1
        };

        var validationContext = new ValidationContext(config);
        var validationResults = new List<ValidationResult>();

        // Act
        var isValid = Validator.TryValidateObject(config, validationContext, validationResults, true);

        // Assert
        Assert.False(isValid);
        Assert.Single(validationResults);
        Assert.Contains(validationResults, r => r.MemberNames.Contains("MaxFailureCount"));
    }
}