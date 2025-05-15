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

using Drasi.Reaction.SDK;
using Drasi.Reactions.SyncDaprStateStore;
using Microsoft.Extensions.DependencyInjection;

var reaction = new ReactionBuilder<QueryConfig>()
    .UseChangeEventHandler<ChangeEventHandler>()
    .UseJsonQueryConfig()
    .ConfigureServices(services => 
    {
        services.AddDaprClient();
        services.AddSingleton<IQuerySyncPointManager, QuerySyncPointManager>();
        services.AddSingleton<IExtendedManagementClient, ExtendedManagementClient>();
        services.AddSingleton<IErrorStateHandler, ErrorStateHandler>();
        services.AddHttpClient();
        services.AddSingleton<IQueryConfigValidationService, QueryConfigValidationService>();
        services.AddSingleton<IQueryInitializationService, QueryInitializationService>();
    })
    .Build();

try
{
    // Step 1. Validate query configurations
    var validationService = reaction.Services.GetRequiredService<IQueryConfigValidationService>();
    await validationService.ValidateQueryConfigsAsync(CancellationToken.None);

    // Step 2. Initialize the query states for each query
    var initializationService = reaction.Services.GetRequiredService<IQueryInitializationService>();
    await initializationService.InitializeQueriesAsync(CancellationToken.None);

    await reaction.StartAsync();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Fatal error starting reaction: {ex.Message}");
    Environment.Exit(1);
}