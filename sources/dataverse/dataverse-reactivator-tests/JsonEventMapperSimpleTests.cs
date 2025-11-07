// Copyright 2025 The Drasi Authors.
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

using DataverseReactivator.Services;
using Microsoft.Xrm.Sdk;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace DataverseReactivator.Tests;

/// <summary>
/// Focused tests for JsonEventMapper's ability to correctly extract values from Dataverse types
/// </summary>
public class JsonEventMapperSimpleTests
{
    private readonly JsonEventMapper _mapper;
    private readonly long _reactivatorStartNs;

    public JsonEventMapperSimpleTests()
    {
        _mapper = new JsonEventMapper();
        _reactivatorStartNs = DateTimeOffset.UtcNow.Ticks * 100;
    }

    private JsonObject GetPropertiesFromMappedEvent(Entity entity)
    {
        var changedItem = new NewOrUpdatedItem { NewOrUpdatedEntity = entity };
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();

        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var properties = doc?["payload"]?["after"]?["properties"]?.AsObject();

        return properties ?? throw new InvalidOperationException("Could not extract properties from mapped event");
    }

    [Fact]
    public void MapEventAsync_ShouldExtractMoneyAsDecimal()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_budget"] = new Money(123.45m),
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Should be 123.45, not {"Value": 123.45}
        Assert.Equal(123.45m, props["cr06a_budget"]?.GetValue<decimal>());
    }

    [Fact]
    public void MapEventAsync_ShouldExtractOptionSetAsInteger()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_status"] = new OptionSetValue(2),
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Should be 2, not {"Value": 2}
        Assert.Equal(2, props["cr06a_status"]?.GetValue<int>());
    }

    [Fact]
    public void MapEventAsync_ShouldExtractMultiSelectAsIntArray()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_categories"] = new OptionSetValueCollection
            {
                new OptionSetValue(370650000),
                new OptionSetValue(370650001),
                new OptionSetValue(370650002)
            },
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Should be [370650000, 370650001, 370650002], not [{"Value":...}, ...]
        var categories = props["cr06a_categories"]?.AsArray();
        Assert.NotNull(categories);
        Assert.Equal(3, categories.Count);
        Assert.Equal(370650000, categories[0]?.GetValue<int>());
        Assert.Equal(370650001, categories[1]?.GetValue<int>());
        Assert.Equal(370650002, categories[2]?.GetValue<int>());
    }

    [Fact]
    public void MapEventAsync_ShouldPreserveEntityReferenceStructure()
    {
        // Arrange
        var ownerId = Guid.NewGuid();
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["ownerid"] = new EntityReference("systemuser", ownerId) { Name = "John Doe" },
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - EntityReference should have Id, LogicalName, Name
        var owner = props["ownerid"]?.AsObject();
        Assert.NotNull(owner);
        Assert.Equal(ownerId.ToString(), owner["Id"]?.ToString());
        Assert.Equal("systemuser", owner["LogicalName"]?.ToString());
        Assert.Equal("John Doe", owner["Name"]?.ToString());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleMixedDataTypes()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_name"] = "Test Task",
            ["cr06a_budget"] = new Money(5000.00m),
            ["cr06a_priority"] = new OptionSetValue(1),
            ["cr06a_tags"] = new OptionSetValueCollection { new OptionSetValue(10), new OptionSetValue(20) },
            ["ownerid"] = new EntityReference("systemuser", Guid.NewGuid()) { Name = "Jane Smith" },
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - All types should be correctly extracted
        Assert.Equal("Test Task", props["cr06a_name"]?.ToString());
        Assert.Equal(5000.00m, props["cr06a_budget"]?.GetValue<decimal>());
        Assert.Equal(1, props["cr06a_priority"]?.GetValue<int>());

        var tags = props["cr06a_tags"]?.AsArray();
        Assert.NotNull(tags);
        Assert.Equal(2, tags.Count);
        Assert.Equal(10, tags[0]?.GetValue<int>());
        Assert.Equal(20, tags[1]?.GetValue<int>());

        var owner = props["ownerid"]?.AsObject();
        Assert.NotNull(owner);
        Assert.Equal("Jane Smith", owner["Name"]?.ToString());
    }

    [Fact]
    public void MapEventAsync_ShouldExtractRowVersionAsLSN()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_name"] = "Test",
            RowVersion = "12345"
        };

        var changedItem = new NewOrUpdatedItem { NewOrUpdatedEntity = entity };

        // Act
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();
        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var lsn = doc?["payload"]?["source"]?["lsn"]?.GetValue<long>();

        // Assert
        Assert.Equal(12345L, lsn);
    }

    [Fact]
    public void MapEventAsync_ShouldHandleDeleteRowVersionFormat()
    {
        // Arrange - Delete RowVersion format is "number!timestamp"
        var entityRef = new EntityReference("cr06a_task", Guid.NewGuid())
        {
            RowVersion = "67890!11/07/2025 20:47:30"
        };

        var changedItem = new RemovedOrDeletedItem
        {
            RemovedItem = entityRef,
            Type = ChangeType.RemoveOrDeleted  // Must explicitly set the Type property
        };

        // Act
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();
        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var lsn = doc?["payload"]?["source"]?["lsn"]?.GetValue<long>();
        var op = doc?["op"]?.ToString();

        // Assert
        Assert.Equal("d", op); // Delete operation
        Assert.Equal(67890L, lsn); // Should extract just the number before '!'
    }
}
