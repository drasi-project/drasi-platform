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

namespace Drasi.Reactions.PostDaprOutputBinding.Tests;

public class QueryConfigTests
{
    // Would we have a default constructor for bindings?

    [Fact]
    public void ValidateConfig_ValidConfiguration_ShouldHaveNoErrors()
    {
        // Arrange
        var config = new QueryConfig
        {
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
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

    [Theory]
    [InlineData(true, false, false)]
    [InlineData(false, true, false)]
    [InlineData(false, false, true)]
    public void ValidateConfig_EmptyRequiredValue_ShouldHaveError(bool bindingNameEmpty, bool bindingTypeEmpty, 
        bool bindingOperationEmpty)
    {
        // Arrange
        var config = new QueryConfig
        {
            BindingName = bindingNameEmpty ? "" : "test-",
            BindingType = bindingTypeEmpty ? "" : "binding-type",
            BindingOperation = bindingOperationEmpty ? "" : "exec",
        };

        var validationContext = new ValidationContext(config);
        var validationResults = new List<ValidationResult>();

        // Act
        var isValid = Validator.TryValidateObject(config, validationContext, validationResults, true);

        // Assert
        Assert.False(isValid);
        Assert.Single(validationResults);
    }
    
    [Fact]
    public void ValidateConfig_NegativeMaxFailureCount_ShouldHaveError()
    {
        // Arrange
        var config = new QueryConfig
        {
            BindingName = "test-binding",
            BindingType = "binding-type",
            BindingOperation = "exec",
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