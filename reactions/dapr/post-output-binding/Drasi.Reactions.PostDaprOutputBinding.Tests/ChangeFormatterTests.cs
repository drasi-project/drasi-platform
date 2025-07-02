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

using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.PostDaprOutputBinding.Services;
using Moq;
using Xunit;

namespace Drasi.Reactions.PostDaprOutputBinding.Tests;

public class ChangeFormatterTests
{
    [Fact]
    public void DrasiChangeFormatter_FormatEmptyChangeEvent_ShouldReturnEmptyCollection()
    {
        // Arrange
        var formatter = new DrasiChangeFormatter();
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void DrasiChangeFormatter_FormatAddedResults_ShouldReturnCorrectFormat()
    {
        // Arrange
        var formatter = new DrasiChangeFormatter();
        var addedItem = new Dictionary<string, object> { { "id", "123" }, { "name", "test" } };
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            SourceTimeMs = 1000,
            AddedResults = new[] { addedItem },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"op\":\"i\"", json);
        Assert.Contains("\"queryId\":\"test-query\"", json);
        Assert.Contains("\"id\":\"123\"", json);
        Assert.Contains("\"name\":\"test\"", json);
    }

    [Fact]
    public void DrasiChangeFormatter_FormatUpdatedResults_ShouldReturnCorrectFormat()
    {
        // Arrange
        var formatter = new DrasiChangeFormatter();
        var beforeItem = new Dictionary<string, object> { { "id", "123" }, { "name", "before" } };
        var afterItem = new Dictionary<string, object> { { "id", "123" }, { "name", "after" } };
        var updatedElement = new UpdatedResultElement { Before = beforeItem, After = afterItem };

        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            SourceTimeMs = 1000,
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = new[] { updatedElement },
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"op\":\"u\"", json);
        Assert.Contains("\"queryId\":\"test-query\"", json);
        Assert.Contains("\"before\":{", json);
        Assert.Contains("\"after\":{", json);
        Assert.Contains("\"name\":\"before\"", json);
        Assert.Contains("\"name\":\"after\"", json);
    }

    [Fact]
    public void DrasiChangeFormatter_FormatDeletedResults_ShouldReturnCorrectFormat()
    {
        // Arrange
        var formatter = new DrasiChangeFormatter();
        var deletedItem = new Dictionary<string, object> { { "id", "123" }, { "name", "test" } };
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            SourceTimeMs = 1000,
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = new[] { deletedItem }
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"op\":\"d\"", json);
        Assert.Contains("\"queryId\":\"test-query\"", json);
        Assert.Contains("\"before\":{", json);
        Assert.Contains("\"id\":\"123\"", json);
        Assert.DoesNotContain("\"after\":{", json);
    }

    [Fact]
    public void DrasiChangeFormatter_FormatMultipleResults_ShouldReturnCorrectCount()
    {
        // Arrange
        var formatter = new DrasiChangeFormatter();
        var addedItem = new Dictionary<string, object> { { "id", "123" }, { "name", "test" } };
        var deletedItem = new Dictionary<string, object> { { "id", "456" }, { "name", "deleted" } };
        var beforeItem = new Dictionary<string, object> { { "id", "789" }, { "name", "before" } };
        var afterItem = new Dictionary<string, object> { { "id", "789" }, { "name", "after" } };
        var updatedElement = new UpdatedResultElement { Before = beforeItem, After = afterItem };

        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            SourceTimeMs = 1000,
            AddedResults = new[] { addedItem },
            UpdatedResults = new[] { updatedElement },
            DeletedResults = new[] { deletedItem }
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains(result, r => r.GetRawText().Contains("\"op\":\"i\""));
        Assert.Contains(result, r => r.GetRawText().Contains("\"op\":\"u\""));
        Assert.Contains(result, r => r.GetRawText().Contains("\"op\":\"d\""));
    }

    [Fact]
    public void ChangeFormatterFactory_GetFormatter_ShouldReturnDrasiFormatter()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        var drasiFormatter = new DrasiChangeFormatter();

        serviceProvider.Setup(s => s.GetService(typeof(DrasiChangeFormatter))).Returns(drasiFormatter);

        var factory = new ChangeFormatterFactory(serviceProvider.Object);

        // Act
        var drasiResult = factory.GetFormatter();

        // Assert
        Assert.Same(drasiFormatter, drasiResult);
    }
}