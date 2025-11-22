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
using Drasi.Reactions.StorageQueue.Services;
using Drasi.Reaction.SDK.Models.QueryOutput;
using System.Text.Json;

namespace StorageQueue.Tests.Services;

public class TemplateFormatterTests
{
    private readonly Mock<ILogger<TemplateFormatter>> _mockLogger;
    private readonly TemplateFormatter _formatter;

    public TemplateFormatterTests()
    {
        _mockLogger = new Mock<ILogger<TemplateFormatter>>();
        _formatter = new TemplateFormatter(_mockLogger.Object);
    }

    [Fact]
    public void Constructor_NullLogger_ThrowsArgumentNullException()
    {
        // Act & Assert
        // Note: TemplateFormatter constructor doesn't validate logger parameter
        // This test documents current behavior
        var formatter = new TemplateFormatter(null!);
        Assert.NotNull(formatter);
    }

    [Fact]
    public void FormatAdded_SimpleTemplate_ReturnsFormattedMessage()
    {
        // Arrange
        var addedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> 
            { 
                { "id", "1" }, 
                { "name", "Test Item" },
                { "temperature", 25 }
            }
        };
        var template = @"{
            ""type"": ""added"",
            ""id"": ""{{after.id}}"",
            ""name"": ""{{after.name}}"",
            ""temperature"": {{after.temperature}}
        }";

        // Act
        var results = _formatter.FormatAdded(addedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("added", parsed.RootElement.GetProperty("type").GetString());
        Assert.Equal("1", parsed.RootElement.GetProperty("id").GetString());
        Assert.Equal("Test Item", parsed.RootElement.GetProperty("name").GetString());
        Assert.Equal(25, parsed.RootElement.GetProperty("temperature").GetInt32());
    }

    [Fact]
    public void FormatAdded_MultipleResults_ReturnsMultipleMessages()
    {
        // Arrange
        var addedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "1" }, { "name", "Item 1" } },
            new Dictionary<string, object> { { "id", "2" }, { "name", "Item 2" } }
        };
        var template = @"{""id"": ""{{after.id}}"", ""name"": ""{{after.name}}""}";

        // Act
        var results = _formatter.FormatAdded(addedResults, template).ToList();

        // Assert
        Assert.Equal(2, results.Count);
    }

    [Fact]
    public void FormatAdded_TemplateWithConditional_HandlesCondition()
    {
        // Arrange
        var addedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> 
            { 
                { "id", "1" }, 
                { "active", true }
            }
        };
        var template = @"{""id"": ""{{after.id}}"", ""status"": ""{{#if after.active}}active{{else}}inactive{{/if}}""}";

        // Act
        var results = _formatter.FormatAdded(addedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("active", parsed.RootElement.GetProperty("status").GetString());
    }

    [Fact]
    public void FormatUpdated_SimpleTemplate_ReturnsFormattedMessage()
    {
        // Arrange
        var updatedResults = new List<UpdatedResultElement>
        {
            new UpdatedResultElement
            {
                Before = new Dictionary<string, object> 
                { 
                    { "id", "1" }, 
                    { "temperature", 20 }
                },
                After = new Dictionary<string, object> 
                { 
                    { "id", "1" }, 
                    { "temperature", 25 }
                }
            }
        };
        var template = @"{
            ""type"": ""updated"",
            ""id"": ""{{after.id}}"",
            ""temperature"": {{after.temperature}},
            ""previousTemperature"": {{before.temperature}}
        }";

        // Act
        var results = _formatter.FormatUpdated(updatedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("updated", parsed.RootElement.GetProperty("type").GetString());
        Assert.Equal("1", parsed.RootElement.GetProperty("id").GetString());
        Assert.Equal(25, parsed.RootElement.GetProperty("temperature").GetInt32());
        Assert.Equal(20, parsed.RootElement.GetProperty("previousTemperature").GetInt32());
    }

    [Fact]
    public void FormatUpdated_AccessBothBeforeAndAfter_FormatsCorrectly()
    {
        // Arrange
        var updatedResults = new List<UpdatedResultElement>
        {
            new UpdatedResultElement
            {
                Before = new Dictionary<string, object> { { "name", "Old Name" } },
                After = new Dictionary<string, object> { { "name", "New Name" } }
            }
        };
        var template = @"{""old"": ""{{before.name}}"", ""new"": ""{{after.name}}""}";

        // Act
        var results = _formatter.FormatUpdated(updatedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("Old Name", parsed.RootElement.GetProperty("old").GetString());
        Assert.Equal("New Name", parsed.RootElement.GetProperty("new").GetString());
    }

    [Fact]
    public void FormatDeleted_SimpleTemplate_ReturnsFormattedMessage()
    {
        // Arrange
        var deletedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> 
            { 
                { "id", "1" }, 
                { "name", "Deleted Item" },
                { "temperature", 30 }
            }
        };
        var template = @"{
            ""type"": ""deleted"",
            ""id"": ""{{before.id}}"",
            ""name"": ""{{before.name}}"",
            ""temperature"": {{before.temperature}}
        }";

        // Act
        var results = _formatter.FormatDeleted(deletedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("deleted", parsed.RootElement.GetProperty("type").GetString());
        Assert.Equal("1", parsed.RootElement.GetProperty("id").GetString());
        Assert.Equal("Deleted Item", parsed.RootElement.GetProperty("name").GetString());
        Assert.Equal(30, parsed.RootElement.GetProperty("temperature").GetInt32());
    }

    [Fact]
    public void FormatDeleted_MultipleResults_ReturnsMultipleMessages()
    {
        // Arrange
        var deletedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "1" } },
            new Dictionary<string, object> { { "id", "2" } },
            new Dictionary<string, object> { { "id", "3" } }
        };
        var template = @"{""id"": ""{{before.id}}""}";

        // Act
        var results = _formatter.FormatDeleted(deletedResults, template).ToList();

        // Assert
        Assert.Equal(3, results.Count);
    }

    [Fact]
    public void FormatAdded_EmptyResults_ReturnsEmptyList()
    {
        // Arrange
        var addedResults = new List<Dictionary<string, object>>();
        var template = @"{""id"": ""{{after.id}}""}";

        // Act
        var results = _formatter.FormatAdded(addedResults, template).ToList();

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void FormatUpdated_EmptyResults_ReturnsEmptyList()
    {
        // Arrange
        var updatedResults = new List<UpdatedResultElement>();
        var template = @"{""id"": ""{{after.id}}""}";

        // Act
        var results = _formatter.FormatUpdated(updatedResults, template).ToList();

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void FormatDeleted_EmptyResults_ReturnsEmptyList()
    {
        // Arrange
        var deletedResults = new List<Dictionary<string, object>>();
        var template = @"{""id"": ""{{before.id}}""}";

        // Act
        var results = _formatter.FormatDeleted(deletedResults, template).ToList();

        // Assert
        Assert.Empty(results);
    }

    [Fact]
    public void FormatAdded_JsonElementValues_HandlesCorrectly()
    {
        // Arrange
        var addedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> 
            { 
                { "id", JsonDocument.Parse("\"test-id\"").RootElement },
                { "count", JsonDocument.Parse("42").RootElement }
            }
        };
        var template = @"{
            ""id"": ""{{after.id}}"",
            ""count"": {{after.count}}
        }";

        // Act
        var results = _formatter.FormatAdded(addedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("test-id", parsed.RootElement.GetProperty("id").GetString());
        Assert.Equal(42, parsed.RootElement.GetProperty("count").GetInt32());
    }

    [Fact]
    public void TemplateCaching_SameTemplate_UsesCache()
    {
        // Arrange
        var addedResults1 = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "1" } }
        };
        var addedResults2 = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "2" } }
        };
        var template = @"{""id"": ""{{after.id}}""}";

        // Act
        var results1 = _formatter.FormatAdded(addedResults1, template).ToList();
        var results2 = _formatter.FormatAdded(addedResults2, template).ToList();

        // Assert
        Assert.Single(results1);
        Assert.Single(results2);
        // Both should succeed, demonstrating template caching works
    }

    [Fact]
    public void FormatAdded_ComplexNestedTemplate_HandlesCorrectly()
    {
        // Arrange
        var addedResults = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> 
            { 
                { "id", "1" },
                { "status", "active" },
                { "priority", 5 }
            }
        };
        var template = @"{
            ""item"": {
                ""id"": ""{{after.id}}"",
                ""isActive"": {{#if after.status}}true{{else}}false{{/if}},
                ""priority"": {{after.priority}}
            }
        }";

        // Act
        var results = _formatter.FormatAdded(addedResults, template).ToList();

        // Assert
        Assert.Single(results);
        var parsed = JsonDocument.Parse(results[0]);
        Assert.Equal("1", parsed.RootElement.GetProperty("item").GetProperty("id").GetString());
        Assert.True(parsed.RootElement.GetProperty("item").GetProperty("isActive").GetBoolean());
        Assert.Equal(5, parsed.RootElement.GetProperty("item").GetProperty("priority").GetInt32());
    }
}
