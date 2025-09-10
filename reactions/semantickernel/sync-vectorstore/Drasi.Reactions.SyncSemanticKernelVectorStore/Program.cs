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
using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Factories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;

var reaction = new ReactionBuilder<QueryConfig>()
    .UseChangeEventHandler<ChangeEventHandler>()
    .UseJsonQueryConfig()
    .ConfigureServices(services => 
    {
        // Add HTTP client for external services
        services.AddHttpClient();
        
        // Register embedding service based on configuration
        RegisterEmbeddingService(services);
        
        // Register vector store configuration as singleton
        services.AddSingleton<VectorStoreConfiguration>(serviceProvider =>
        {
            return new VectorStoreConfiguration
            {
                VectorStoreType = Environment.GetEnvironmentVariable("vectorStoreType") 
                    ?? throw new InvalidOperationException("vectorStoreType environment variable is required"),
                ConnectionString = Environment.GetEnvironmentVariable("connectionString") 
                    ?? throw new InvalidOperationException("connectionString environment variable is required"),
                EmbeddingDimensions = int.TryParse(Environment.GetEnvironmentVariable("embeddingDimensions"), out var dims) 
                    ? dims : 3072,
                DistanceFunction = Environment.GetEnvironmentVariable("distanceFunction") ?? "CosineSimilarity",
                IndexKind = Environment.GetEnvironmentVariable("indexKind") ?? "Hnsw",
                IsFilterable = bool.TryParse(Environment.GetEnvironmentVariable("isFilterable"), out var filterable) 
                    ? filterable : true,
                IsFullTextSearchable = bool.TryParse(Environment.GetEnvironmentVariable("isFullTextSearchable"), out var fullText) 
                    ? fullText : false
            };
        });
        
        // Register vector store factory and adapter
        services.AddSingleton<VectorStoreFactory>();
        services.AddSingleton<IVectorStoreAdapter>(serviceProvider =>
        {
            var factory = serviceProvider.GetRequiredService<VectorStoreFactory>();
            var config = serviceProvider.GetRequiredService<VectorStoreConfiguration>();
            return factory.CreateVectorStoreAdapter(config);
        });

        // Register core services (minimal set like Dapr)
        services.AddSingleton<IEmbeddingService, EmbeddingService>();
        services.AddSingleton<IDocumentProcessor, DocumentProcessor>();
        services.AddSingleton<IVectorStoreService, VectorStoreService>();
        services.AddSingleton<ISyncPointManager, SyncPointManager>();
        services.AddSingleton<IErrorStateHandler, ErrorStateHandler>();
        
        // Register SDK services needed for bootstrap and management
        services.AddSingleton<IResultViewClient, ResultViewClient>();
        services.AddSingleton<IManagementClient, ManagementClient>();
        services.AddSingleton<IExtendedManagementClient, ExtendedManagementClient>();
        
        // Register validation and initialization services
        services.AddSingleton<IQueryConfigValidationService, QueryConfigValidationService>();
        services.AddSingleton<IQueryInitializationService, QueryInitializationService>();
    })
    .Build();

try
{
    // Step 1. Validate query configurations
    var validationService = reaction.Services.GetRequiredService<IQueryConfigValidationService>();
    await validationService.ValidateQueryConfigsAsync(CancellationToken.None);

    // Step 2. Initialize the vector store collections for each query
    var initializationService = reaction.Services.GetRequiredService<IQueryInitializationService>();
    await initializationService.InitializeQueriesAsync(CancellationToken.None);

    await reaction.StartAsync();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Fatal error starting reaction: {ex.Message}");
    Environment.Exit(1);
}

// Helper method to register embedding service based on configuration
static void RegisterEmbeddingService(IServiceCollection services)
{
    var embeddingServiceType = Environment.GetEnvironmentVariable("embeddingServiceType") 
        ?? throw new InvalidOperationException("embeddingServiceType environment variable is required");
        
    var embeddingEndpoint = Environment.GetEnvironmentVariable("embeddingEndpoint");
    var embeddingApiKey = Environment.GetEnvironmentVariable("embeddingApiKey");
    var embeddingModel = Environment.GetEnvironmentVariable("embeddingModel");
    
    switch (embeddingServiceType.ToLowerInvariant())
    {
        case "openai":
            if (string.IsNullOrEmpty(embeddingApiKey))
                throw new ArgumentException("API key is required for OpenAI embedding service");
            #pragma warning disable SKEXP0010
            services.AddOpenAIEmbeddingGenerator(
                modelId: embeddingModel ?? "text-embedding-3-small",
                apiKey: embeddingApiKey);
            #pragma warning restore SKEXP0010
            break;
            
        case "azureopenai":
            if (string.IsNullOrEmpty(embeddingEndpoint))
                throw new ArgumentException("Endpoint is required for Azure OpenAI embedding service");
            if (string.IsNullOrEmpty(embeddingApiKey))
                throw new ArgumentException("API key is required for Azure OpenAI embedding service");
            #pragma warning disable SKEXP0010
            services.AddAzureOpenAIEmbeddingGenerator(
                deploymentName: embeddingModel ?? "text-embedding-3-small",
                endpoint: embeddingEndpoint,
                apiKey: embeddingApiKey);
            #pragma warning restore SKEXP0010
            break;
            
        default:
            throw new ArgumentException($"Unsupported embedding service type: {embeddingServiceType}");
    }
}