using Drasi.Reaction.SDK;
using Drasi.Reactions.Debezium.Services;
using Microsoft.Extensions.DependencyInjection;


var reaction = new ReactionBuilder()
            .UseChangeEventHandler<DebeziumChangeHandler>()
            .ConfigureServices((services) =>
            {
                services.AddSingleton<DebeziumService>();
            })
            .Build();

await reaction.StartAsync();
