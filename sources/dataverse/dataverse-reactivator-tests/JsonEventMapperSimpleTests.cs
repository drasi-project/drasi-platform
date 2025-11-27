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

    [Fact]
    public void MapEventAsync_ShouldHandleNullValues()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_name"] = "Test",
            ["cr06a_budget"] = null,  // Null Money field
            ["cr06a_description"] = null,  // Null string field
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Null values should be preserved as null
        Assert.Equal("Test", props["cr06a_name"]?.ToString());
        Assert.Null(props["cr06a_budget"]);
        Assert.Null(props["cr06a_description"]);
    }

    [Fact]
    public void MapEventAsync_ShouldHandleEmptyMultiSelectCollection()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_categories"] = new OptionSetValueCollection(),  // Empty collection
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Should be empty array []
        var categories = props["cr06a_categories"]?.AsArray();
        Assert.NotNull(categories);
        Assert.Empty(categories);
    }

    [Fact]
    public void MapEventAsync_ShouldHandleNegativeMoneyValues()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_balance"] = new Money(-999.99m),
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert
        Assert.Equal(-999.99m, props["cr06a_balance"]?.GetValue<decimal>());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleZeroMoneyValue()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_cost"] = new Money(0m),
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert
        Assert.Equal(0m, props["cr06a_cost"]?.GetValue<decimal>());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleVeryLargeMoneyValues()
    {
        // Arrange - Test with large decimal value
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_total"] = new Money(999999999.99m),
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert
        Assert.Equal(999999999.99m, props["cr06a_total"]?.GetValue<decimal>());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleNegativeOptionSetValues()
    {
        // Arrange - Some option sets might use negative values
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_status"] = new OptionSetValue(-1),
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert
        Assert.Equal(-1, props["cr06a_status"]?.GetValue<int>());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleMultiSelectWithSingleValue()
    {
        // Arrange - Multi-select with only one value
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_categories"] = new OptionSetValueCollection
            {
                new OptionSetValue(100)
            },
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Should still be an array with one element
        var categories = props["cr06a_categories"]?.AsArray();
        Assert.NotNull(categories);
        Assert.Single(categories);
        Assert.Equal(100, categories[0]?.GetValue<int>());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleEntityReferenceWithoutName()
    {
        // Arrange - EntityReference without Name property set
        var refId = Guid.NewGuid();
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["regardingobjectid"] = new EntityReference("account", refId),  // No Name set
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Should have Id and LogicalName, Name might be null
        var regarding = props["regardingobjectid"]?.AsObject();
        Assert.NotNull(regarding);
        Assert.Equal(refId.ToString(), regarding["Id"]?.ToString());
        Assert.Equal("account", regarding["LogicalName"]?.ToString());
    }

    [Fact]
    public void MapEventAsync_ShouldPreserveGuidFormat()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var entity = new Entity("cr06a_task")
        {
            Id = taskId,
            ["cr06a_name"] = "Test",
            RowVersion = "1"
        };

        var changedItem = new NewOrUpdatedItem { NewOrUpdatedEntity = entity };

        // Act
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();
        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var elementId = doc?["payload"]?["after"]?["id"]?.ToString();

        // Assert - ID should be preserved as string
        Assert.Equal(taskId.ToString(), elementId);
    }

    [Fact]
    public void MapEventAsync_ShouldPreserveEntityLogicalName()
    {
        // Arrange
        var entity = new Entity("cr06a_customentity")
        {
            Id = Guid.NewGuid(),
            ["cr06a_field"] = "value",
            RowVersion = "1"
        };

        var changedItem = new NewOrUpdatedItem { NewOrUpdatedEntity = entity };

        // Act
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();
        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var labels = doc?["payload"]?["after"]?["labels"]?.AsArray();

        // Assert - Labels should contain the logical name
        Assert.NotNull(labels);
        Assert.Single(labels);
        Assert.Equal("cr06a_customentity", labels[0]?.ToString());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleComplexEntityWithManyFields()
    {
        // Arrange - Entity with 15+ fields of various types
        var entity = new Entity("cr06a_project")
        {
            Id = Guid.NewGuid(),
            ["cr06a_name"] = "Complex Project",
            ["cr06a_description"] = "A very detailed description of the project",
            ["cr06a_budget"] = new Money(50000.00m),
            ["cr06a_actualcost"] = new Money(45000.50m),
            ["cr06a_status"] = new OptionSetValue(1),
            ["cr06a_priority"] = new OptionSetValue(2),
            ["cr06a_phase"] = new OptionSetValue(3),
            ["cr06a_tags"] = new OptionSetValueCollection {
                new OptionSetValue(10),
                new OptionSetValue(20),
                new OptionSetValue(30)
            },
            ["cr06a_categories"] = new OptionSetValueCollection {
                new OptionSetValue(100),
                new OptionSetValue(200)
            },
            ["ownerid"] = new EntityReference("systemuser", Guid.NewGuid()) { Name = "Project Manager" },
            ["regardingobjectid"] = new EntityReference("account", Guid.NewGuid()) { Name = "Main Client" },
            ["cr06a_startdate"] = new DateTime(2025, 1, 1),
            ["cr06a_enddate"] = new DateTime(2025, 12, 31),
            ["cr06a_progress"] = 75,
            ["cr06a_isactive"] = true,
            RowVersion = "98765"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Verify all fields are present and correctly typed
        Assert.Equal("Complex Project", props["cr06a_name"]?.ToString());
        Assert.Equal(50000.00m, props["cr06a_budget"]?.GetValue<decimal>());
        Assert.Equal(45000.50m, props["cr06a_actualcost"]?.GetValue<decimal>());
        Assert.Equal(1, props["cr06a_status"]?.GetValue<int>());
        Assert.Equal(2, props["cr06a_priority"]?.GetValue<int>());

        var tags = props["cr06a_tags"]?.AsArray();
        Assert.NotNull(tags);
        Assert.Equal(3, tags.Count);

        var categories = props["cr06a_categories"]?.AsArray();
        Assert.NotNull(categories);
        Assert.Equal(2, categories.Count);

        var owner = props["ownerid"]?.AsObject();
        Assert.Equal("Project Manager", owner?["Name"]?.ToString());

        Assert.Equal(75, props["cr06a_progress"]?.GetValue<int>());
        Assert.True(props["cr06a_isactive"]?.GetValue<bool>());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleDeleteWithoutRowVersion()
    {
        // Arrange - Delete without RowVersion (should use timestamp fallback)
        var entityRef = new EntityReference("cr06a_task", Guid.NewGuid());
        // No RowVersion set

        var changedItem = new RemovedOrDeletedItem
        {
            RemovedItem = entityRef,
            Type = ChangeType.RemoveOrDeleted
        };

        // Act
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();
        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var lsn = doc?["payload"]?["source"]?["lsn"]?.GetValue<long>();

        // Assert - LSN should be a timestamp (large number)
        Assert.NotNull(lsn);
        Assert.True(lsn > 0);
    }

    [Fact]
    public void MapEventAsync_ShouldHandleUpdateWithoutRowVersion()
    {
        // Arrange - Update without RowVersion (should use timestamp fallback)
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_name"] = "Test"
            // No RowVersion set
        };

        var changedItem = new NewOrUpdatedItem { NewOrUpdatedEntity = entity };

        // Act
        var result = _mapper.MapEventAsync(changedItem, _reactivatorStartNs).GetAwaiter().GetResult();
        var json = result.ToJson();
        var doc = JsonNode.Parse(json);
        var lsn = doc?["payload"]?["source"]?["lsn"]?.GetValue<long>();

        // Assert - LSN should be a timestamp (large number)
        Assert.NotNull(lsn);
        Assert.True(lsn > 0);
    }

    [Fact]
    public void MapEventAsync_ShouldHandleSpecialCharactersInStringFields()
    {
        // Arrange
        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["cr06a_name"] = "Test \"with\" 'quotes'",
            ["cr06a_description"] = "Line 1\nLine 2\tTabbed",
            ["cr06a_notes"] = "Unicode: 你好 🎉 émojis",
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - Special characters should be preserved
        Assert.Equal("Test \"with\" 'quotes'", props["cr06a_name"]?.ToString());
        Assert.Equal("Line 1\nLine 2\tTabbed", props["cr06a_description"]?.ToString());
        Assert.Equal("Unicode: 你好 🎉 émojis", props["cr06a_notes"]?.ToString());
    }

    [Fact]
    public void MapEventAsync_ShouldHandleMultipleEntityReferences()
    {
        // Arrange
        var ownerId = Guid.NewGuid();
        var accountId = Guid.NewGuid();
        var contactId = Guid.NewGuid();

        var entity = new Entity("cr06a_task")
        {
            Id = Guid.NewGuid(),
            ["ownerid"] = new EntityReference("systemuser", ownerId) { Name = "Owner" },
            ["regardingobjectid"] = new EntityReference("account", accountId) { Name = "Account" },
            ["cr06a_primarycontact"] = new EntityReference("contact", contactId) { Name = "Contact" },
            RowVersion = "1"
        };

        // Act
        var props = GetPropertiesFromMappedEvent(entity);

        // Assert - All EntityReferences should be correctly structured
        var owner = props["ownerid"]?.AsObject();
        Assert.Equal(ownerId.ToString(), owner?["Id"]?.ToString());
        Assert.Equal("Owner", owner?["Name"]?.ToString());

        var account = props["regardingobjectid"]?.AsObject();
        Assert.Equal(accountId.ToString(), account?["Id"]?.ToString());
        Assert.Equal("Account", account?["Name"]?.ToString());

        var contact = props["cr06a_primarycontact"]?.AsObject();
        Assert.Equal(contactId.ToString(), contact?["Id"]?.ToString());
        Assert.Equal("Contact", contact?["Name"]?.ToString());
    }
}
