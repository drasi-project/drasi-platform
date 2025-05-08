using Drasi.Reaction.SDK;
using Drasi.Reactions.SyncDaprStateStore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

// Entry point for the Sync Dapr StateStore Reaction
// This reaction synchronizes Drasi query results to a configured Dapr state store
var reaction = new ReactionBuilder<QueryConfig>()
    .UseChangeEventHandler<ChangeEventHandler>()
    .UseControlEventHandler<ControlSignalHandler>()
    .UseJsonQueryConfig()
    .ConfigureServices((services) =>
    {
        services.AddDaprClient();
        services.AddSingleton<IDaprSyncService, DaprSyncService>();
        services.AddSingleton<IQuerySyncStateManager, QuerySyncStateManager>();
        services.AddHostedService<StartupValidationService>();
    })
    .Build();

try
{
    await reaction.StartAsync();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Fatal error starting reaction: {ex.Message}");
    Environment.Exit(1);
}