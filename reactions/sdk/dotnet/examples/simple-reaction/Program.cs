using Drasi.Reaction.SDK;

var builder = new ReactionBuilder();

builder.UseChangeEventHandler(async (evt, queryConfig) =>
{
    Console.WriteLine($"Received change event from query {evt.QueryId} sequence {evt.Sequence}");
    
    foreach (var item in evt.AddedResults)
        Console.WriteLine($"Added result: {item}");

    foreach (var item in evt.UpdatedResults)
        Console.WriteLine($"Updated result, before {item.Before}, after {item.After}");

    foreach (var item in evt.DeletedResults)
        Console.WriteLine($"Deleted result: {item}");

});

var reaction = builder.Build();
await reaction.StartAsync();