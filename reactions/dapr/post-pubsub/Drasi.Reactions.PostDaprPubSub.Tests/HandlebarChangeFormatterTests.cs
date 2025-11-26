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

public class HandlebarChangeFormatterTests
{
    private readonly Mock<ILogger<HandlebarChangeFormatter>> _mockLogger;
    
    public HandlebarChangeFormatterTests()
    {
        _mockLogger = new Mock<ILogger<HandlebarChangeFormatter>>();
    }
    
    [Fact]
    public void Constructor_NullTemplates_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => 
            new HandlebarChangeFormatter(null!, "test-query", _mockLogger.Object));
    }
    
    [Fact]
    public void Constructor_NullQueryId_ThrowsArgumentNullException()
    {
        // Arrange
        var templates = new TemplateConfig { Added = "{\"test\": \"value\"}" };
        
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => 
            new HandlebarChangeFormatter(templates, null!, _mockLogger.Object));
    }
    
    [Fact]
    public void Constructor_NullLogger_ThrowsArgumentNullException()
    {
        // Arrange
        var templates = new TemplateConfig { Added = "{\"test\": \"value\"}" };
        
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => 
            new HandlebarChangeFormatter(templates, "test-query", null!));
    }
    
    [Fact]
    public void Format_AddedTemplate_FormatsAddedResults()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Added = "{\"operation\": \"insert\", \"id\": \"{{after.id}}\", \"name\": \"{{after.name}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var addedItem = new Dictionary<string, object> { { "id", "123" }, { "name", "TestItem" } };
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
        Assert.Contains("\"operation\":\"insert\"", json.Replace(" ", ""));
        Assert.Contains("\"id\":\"123\"", json.Replace(" ", ""));
        Assert.Contains("\"name\":\"TestItem\"", json.Replace(" ", ""));
    }
    
    [Fact]
    public void Format_UpdatedTemplate_FormatsUpdatedResults()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Updated = "{\"operation\": \"update\", \"id\": \"{{after.id}}\", \"oldName\": \"{{before.name}}\", \"newName\": \"{{after.name}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var beforeItem = new Dictionary<string, object> { { "id", "123" }, { "name", "OldName" } };
        var afterItem = new Dictionary<string, object> { { "id", "123" }, { "name", "NewName" } };
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
        Assert.Contains("\"operation\":\"update\"", json.Replace(" ", ""));
        Assert.Contains("\"oldName\":\"OldName\"", json.Replace(" ", ""));
        Assert.Contains("\"newName\":\"NewName\"", json.Replace(" ", ""));
    }
    
    [Fact]
    public void Format_DeletedTemplate_FormatsDeletedResults()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Deleted = "{\"operation\": \"delete\", \"id\": \"{{before.id}}\", \"name\": \"{{before.name}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var deletedItem = new Dictionary<string, object> { { "id", "123" }, { "name", "DeletedItem" } };
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
        Assert.Contains("\"operation\":\"delete\"", json.Replace(" ", ""));
        Assert.Contains("\"id\":\"123\"", json.Replace(" ", ""));
        Assert.Contains("\"name\":\"DeletedItem\"", json.Replace(" ", ""));
    }
    
    [Fact]
    public void Format_QueryIdInTemplate_IncludesQueryId()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Added = "{\"query\": \"{{queryId}}\", \"id\": \"{{after.id}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var addedItem = new Dictionary<string, object> { { "id", "123" } };
        var evt = new ChangeEvent
        {
            QueryId = "my-special-query",
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
        Assert.Contains("\"query\":\"my-special-query\"", json.Replace(" ", ""));
    }
    
    [Fact]
    public void Format_NoTemplateForChangeType_ReturnsEmptyForThatType()
    {
        // Arrange - only added template, but event has deleted results
        var templates = new TemplateConfig 
        { 
            Added = "{\"operation\": \"insert\", \"id\": \"{{after.id}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var deletedItem = new Dictionary<string, object> { { "id", "123" } };
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
        Assert.Empty(result); // No template for deleted, so no output
    }
    
    [Fact]
    public void Format_AllTemplatesConfigured_FormatsAllTypes()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Added = "{\"op\": \"i\", \"id\": \"{{after.id}}\"}",
            Updated = "{\"op\": \"u\", \"id\": \"{{after.id}}\"}",
            Deleted = "{\"op\": \"d\", \"id\": \"{{before.id}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var addedItem = new Dictionary<string, object> { { "id", "1" } };
        var beforeItem = new Dictionary<string, object> { { "id", "2" } };
        var afterItem = new Dictionary<string, object> { { "id", "2" } };
        var updatedElement = new UpdatedResultElement { Before = beforeItem, After = afterItem };
        var deletedItem = new Dictionary<string, object> { { "id", "3" } };
        
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
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"op\":\"i\""));
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"op\":\"u\""));
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"op\":\"d\""));
    }
    
    [Fact]
    public void Format_MultipleAddedResults_FormatsAll()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Added = "{\"id\": \"{{after.id}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var addedItem1 = new Dictionary<string, object> { { "id", "1" } };
        var addedItem2 = new Dictionary<string, object> { { "id", "2" } };
        var addedItem3 = new Dictionary<string, object> { { "id", "3" } };
        
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            SourceTimeMs = 1000,
            AddedResults = new[] { addedItem1, addedItem2, addedItem3 },
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"id\":\"1\""));
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"id\":\"2\""));
        Assert.Contains(result, r => r.GetRawText().Replace(" ", "").Contains("\"id\":\"3\""));
    }
    
    [Fact]
    public void Format_EmptyEvent_ReturnsEmptyCollection()
    {
        // Arrange
        var templates = new TemplateConfig 
        { 
            Added = "{\"id\": \"{{after.id}}\"}",
            Updated = "{\"id\": \"{{after.id}}\"}",
            Deleted = "{\"id\": \"{{before.id}}\"}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var evt = new ChangeEvent
        {
            QueryId = "test-query",
            Sequence = 1,
            SourceTimeMs = 1000,
            AddedResults = Array.Empty<Dictionary<string, object>>(),
            UpdatedResults = Array.Empty<UpdatedResultElement>(),
            DeletedResults = Array.Empty<Dictionary<string, object>>()
        };

        // Act
        var result = formatter.Format(evt).ToList();

        // Assert
        Assert.Empty(result);
    }
    
    [Fact]
    public void Format_InvalidJsonTemplate_LogsErrorAndContinues()
    {
        // Arrange - template produces invalid JSON but shouldn't crash
        var templates = new TemplateConfig 
        { 
            Added = "not valid json {{after.id}}"
        };
        var formatter = new HandlebarChangeFormatter(templates, "test-query", _mockLogger.Object);
        
        var addedItem = new Dictionary<string, object> { { "id", "123" } };
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
        Assert.Empty(result); // Invalid JSON should be skipped
    }
}
