// Copyright 2024 The Drasi Authors.
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

using System.Diagnostics.CodeAnalysis;
using Drasi.Reaction.SDK;
using Drasi.Reactions.PostDaprOutputBinding;
using Drasi.Reactions.PostDaprOutputBinding.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
try
{
    var reaction = new ReactionBuilder<QueryConfig>()
        .UseChangeEventHandler<ChangeHandler>()
        .UseControlEventHandler<ControlSignalHandler>()
        .UseJsonQueryConfig()
        .ConfigureServices(services =>
        {
            // Register formatters
            services.AddSingleton<DrasiChangeFormatter>();
            services.AddSingleton<IChangeFormatterFactory, ChangeFormatterFactory>();
            
            // Register services
            services.AddSingleton<IErrorStateHandler, ErrorStateHandler>();
            services.AddSingleton<IQueryFailureTracker, QueryFailureTracker>();
            services.AddSingleton<IQueryConfigValidationService, QueryConfigValidationService>();
            services.AddSingleton<IDaprInitializationService, DaprInitializationService>();
            
            // Register Dapr client
            services.AddDaprClient();
        })
        .Build();

    var logger = reaction.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Starting PostDaprOutputBinding reaction");

    // Step 1. Wait for Dapr sidecar
    var daprInitService = reaction.Services.GetRequiredService<IDaprInitializationService>();
    await daprInitService.WaitForDaprSidecarAsync(CancellationToken.None);

    // Step 2. Validate query configurations
    var validationService = reaction.Services.GetRequiredService<IQueryConfigValidationService>();
    await validationService.ValidateQueryConfigsAsync(CancellationToken.None);

    // Step 3. Start the reaction
    await reaction.StartAsync();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Fatal error starting reaction: {ex.Message}");
    Environment.Exit(1);
}