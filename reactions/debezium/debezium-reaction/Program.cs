using Drasi.Reaction.SDK;
using Drasi.Reactions.Debezium;


var reaction = new ReactionBuilder().Build();

await reaction.StartAsync();
