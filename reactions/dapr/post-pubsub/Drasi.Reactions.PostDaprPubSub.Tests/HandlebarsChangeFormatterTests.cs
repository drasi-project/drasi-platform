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

using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.PostDaprPubSub.Services;
using System.Text.Json;

namespace Drasi.Reactions.PostDaprPubSub.Tests;

public class HandlebarsChangeFormatterTests
{
    private readonly Mock<ILogger<HandlebarsChangeFormatter>> _mockLogger;

    public HandlebarsChangeFormatterTests()
    {
        _mockLogger = new Mock<ILogger<HandlebarsChangeFormatter>>();
    }

    [Fact]
    public void Format_WithAddedResultsTemplate_FormatsAddedResults()
    {
        // Arrange
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"id\": \"{{id}}\", \"name\": \"{{name}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "123" }, { "name", "test" } }
            },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"id\":\"123\"", json.Replace(" ", ""));
        Assert.Contains("\"name\":\"test\"", json.Replace(" ", ""));
    }

    [Fact]
    public void Format_WithUpdatedResultsTemplate_FormatsUpdatedResults()
    {
        // Arrange
        var config = new QueryConfig
        {
            UpdatedResultsTemplate = "{\"before\": \"{{before.name}}\", \"after\": \"{{after.name}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var beforeItem = new Dictionary<string, object> { { "id", "123" }, { "name", "oldName" } };
        var afterItem = new Dictionary<string, object> { { "id", "123" }, { "name", "newName" } };
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = new[] { new UpdatedResultElement { Before = beforeItem, After = afterItem } },
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"before\":\"oldName\"", json.Replace(" ", ""));
        Assert.Contains("\"after\":\"newName\"", json.Replace(" ", ""));
    }

    [Fact]
    public void Format_WithDeletedResultsTemplate_FormatsDeletedResults()
    {
        // Arrange
        var config = new QueryConfig
        {
            DeletedResultsTemplate = "{\"deletedId\": \"{{id}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = new[]
            {
                new Dictionary<string, object> { { "id", "456" }, { "name", "deleted" } }
            }
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"deletedId\":\"456\"", json.Replace(" ", ""));
    }

    [Fact]
    public void Format_WithNoMatchingTemplate_ReturnsEmpty()
    {
        // Arrange - only added template, but no added results
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"id\": \"{{id}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = new[]
            {
                new Dictionary<string, object> { { "id", "456" } }
            }
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert - no deletedResultsTemplate, so nothing returned for deleted
        Assert.Empty(result);
    }

    [Fact]
    public void Format_WithAllTemplates_FormatsAllChangeTypes()
    {
        // Arrange
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"op\": \"add\", \"id\": \"{{id}}\"}",
            UpdatedResultsTemplate = "{\"op\": \"update\", \"from\": \"{{before.name}}\", \"to\": \"{{after.name}}\"}",
            DeletedResultsTemplate = "{\"op\": \"delete\", \"id\": \"{{id}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var beforeItem = new Dictionary<string, object> { { "name", "old" } };
        var afterItem = new Dictionary<string, object> { { "name", "new" } };
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[] { new Dictionary<string, object> { { "id", "1" } } },
            UpdatedResults = new[] { new UpdatedResultElement { Before = beforeItem, After = afterItem } },
            DeletedResults = new[] { new Dictionary<string, object> { { "id", "3" } } }
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"op\":\"add\""));
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"op\":\"update\""));
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"op\":\"delete\""));
    }

    [Fact]
    public void Format_WithJsonElementValues_ConvertsCorrectly()
    {
        // Arrange
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"name\": \"{{name}}\", \"count\": \"{{count}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        
        // Create a JSON document and extract values
        using var doc = JsonDocument.Parse("{\"name\": \"test\", \"count\": 42}");
        var data = new Dictionary<string, object>
        {
            { "name", doc.RootElement.GetProperty("name") },
            { "count", doc.RootElement.GetProperty("count") }
        };
        
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[] { data },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"name\":\"test\"", json.Replace(" ", ""));
        Assert.Contains("\"count\":\"42\"", json.Replace(" ", ""));
    }

    [Fact]
    public void Format_WithInvalidTemplate_ThrowsInvalidOperationException()
    {
        // Arrange
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"invalid\": \"{{#if unclosed}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[] { new Dictionary<string, object> { { "id", "1" } } },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => formatter.Format(evt).ToList());
    }

    [Fact]
    public void Format_WithConditionalTemplate_HandlesConditionals()
    {
        // Arrange
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"name\": \"{{name}}\", \"admin\": {{#if isAdmin}}true{{else}}false{{/if}} }"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "name", "alice" }, { "isAdmin", true } }
            },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Single(result);
        var json = result[0].GetRawText();
        Assert.Contains("\"admin\":true", json.Replace(" ", ""));
    }

    [Fact]
    public void Format_MultipleAddedResults_FormatsAll()
    {
        // Arrange
        var config = new QueryConfig
        {
            AddedResultsTemplate = "{\"id\": \"{{id}}\"}"
        };
        var formatter = new HandlebarsChangeFormatter(config, _mockLogger.Object);
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            AddedResults = new[]
            {
                new Dictionary<string, object> { { "id", "1" } },
                new Dictionary<string, object> { { "id", "2" } },
                new Dictionary<string, object> { { "id", "3" } }
            },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Equal(3, result.Count);
    }
}
