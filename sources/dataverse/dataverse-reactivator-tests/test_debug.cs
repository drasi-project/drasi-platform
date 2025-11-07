using Microsoft.Xrm.Sdk;
using System;

var entityRef = new EntityReference("cr06a_task", Guid.NewGuid())
{
    RowVersion = "67890!11/07/2025 20:47:30"
};

var changedItem = new RemovedOrDeletedItem { RemovedItem = entityRef };

Console.WriteLine($"Type property: {changedItem.Type}");
Console.WriteLine($"Expected: {ChangeType.RemoveOrDeleted}");
