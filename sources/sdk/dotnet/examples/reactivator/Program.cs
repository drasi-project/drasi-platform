﻿using System.Runtime.CompilerServices;
using System.Text.Json.Nodes;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;
using Microsoft.Extensions.Configuration;

var reactivator = new ReactivatorBuilder()
    .UseChangeMonitor<ChangeMonitor>()
    .UseDeprovisionHandler<DeprovisionHandler>()
    .Build();

await reactivator.StartAsync();


class ChangeMonitor : IChangeMonitor
{
    private readonly IStateStore stateStore;

    public ChangeMonitor(IStateStore stateStore, IConfiguration configuration)
    {
        this.stateStore = stateStore;
        Console.WriteLine($"Connection string: {configuration["connectionString"]}");
    }

    public async IAsyncEnumerable<SourceChange> Monitor([EnumeratorCancellation] CancellationToken cancellationToken = default)
    {        
        var counter = BitConverter.ToUInt32(await stateStore.Get("cursor") ?? [0, 0, 0, 0]);
        while (!cancellationToken.IsCancellationRequested)
        {
            counter++;
            var person1Id = $"person-{counter}";
            yield return new SourceChange(ChangeOp.INSERT, new SourceElement(person1Id, ["Person"], new JsonObject
            {
                { "name", "Alice" },
                { "age", 30 }
            }), DateTimeOffset.Now.ToUnixTimeMilliseconds(), counter);

            counter++;
            var person2Id = $"person-{counter}";
            yield return new SourceChange(ChangeOp.INSERT, new SourceElement(person2Id, ["Person"], new JsonObject
            {
                { "name", "Bob" },
                { "age", 40 }
            }), DateTimeOffset.Now.ToUnixTimeMilliseconds(), counter);

            counter++;
            yield return new SourceChange(ChangeOp.INSERT, new SourceElement($"rel-{counter}", ["Knows"], null, person1Id, person2Id), DateTimeOffset.Now.ToUnixTimeMilliseconds(), counter);

            await stateStore.Put("cursor", BitConverter.GetBytes(counter));
            await Task.Delay(5000, cancellationToken);
        }
    }
}

class DeprovisionHandler : IDeprovisionHandler
{
    public async Task Deprovision(IStateStore stateStore)
    {
        await stateStore.Delete("cursor");
    }
}