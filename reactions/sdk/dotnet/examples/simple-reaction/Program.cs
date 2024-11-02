

using Drasi.Reaction.SDK;

var builder = new ReactionBuilder();
builder.UseChangeEventHandler(async (evt, queryConfig) =>
{
    Console.WriteLine($"Received change event: {evt}");
});

var reaction = builder.Build();

await reaction.StartAsync();