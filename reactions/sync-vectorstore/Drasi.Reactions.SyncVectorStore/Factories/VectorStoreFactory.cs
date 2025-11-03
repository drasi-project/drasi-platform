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

using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel.Connectors.AzureAISearch;
using Microsoft.SemanticKernel.Connectors.Qdrant;
using Microsoft.SemanticKernel.Connectors.InMemory;
using Azure;
using Azure.Search.Documents.Indexes;
using Qdrant.Client;
using Drasi.Reactions.SyncVectorStore.Services;
using Drasi.Reactions.SyncVectorStore.Adapters;
using Microsoft.Extensions.DependencyInjection;

namespace Drasi.Reactions.SyncVectorStore.Factories;

/// <summary>
/// Factory for creating vector store adapter instances based on configuration
/// </summary>
public class VectorStoreFactory
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<VectorStoreFactory> _logger;

    public VectorStoreFactory(IServiceProvider serviceProvider, ILogger<VectorStoreFactory> logger)
    {
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Create a raw vector store instance based on the configuration
    /// </summary>
    public object CreateVectorStore(VectorStoreConfiguration config)
    {
        _logger.LogInformation("Creating vector store instance of type {VectorStoreType}", config.VectorStoreType);
        
        return config.VectorStoreType.ToLowerInvariant() switch
        {
            "inmemory" => new Microsoft.SemanticKernel.Connectors.InMemory.InMemoryVectorStore(),
            "qdrant" => CreateQdrantVectorStore(config),
            "azureaisearch" or "azureai" or "azuresearch" => CreateAzureAISearchVectorStore(config),
            _ => throw new NotImplementedException($"Vector store type '{config.VectorStoreType}' is not supported. Supported types: InMemory, Qdrant, AzureAISearch")
        };
    }

    /// <summary>
    /// Create a vector store adapter based on the configuration
    /// </summary>
    public IVectorStoreAdapter CreateVectorStoreAdapter(VectorStoreConfiguration config)
    {
        _logger.LogInformation("Creating vector store of type {VectorStoreType} with {Dimensions} dimensions", 
            config.VectorStoreType, config.EmbeddingDimensions);
        
        return config.VectorStoreType.ToLowerInvariant() switch
        {
            "inmemory" => CreateInMemoryVectorStoreAdapter(config),
            "qdrant" => CreateQdrantVectorStoreAdapter(config),
            "azureaisearch" or "azureai" or "azuresearch" => CreateAzureAISearchVectorStoreAdapter(config),
            _ => throw new NotImplementedException($"Vector store type '{config.VectorStoreType}' is not supported. Supported types: InMemory, Qdrant, AzureAISearch")
        };
    }

    private IVectorStoreAdapter CreateInMemoryVectorStoreAdapter(VectorStoreConfiguration config)
    {
        try
        {
            // For in-memory store, no connection string is needed
            _logger.LogInformation("Creating in-memory vector store adapter for testing/development");
            
            var vectorStore = new Microsoft.SemanticKernel.Connectors.InMemory.InMemoryVectorStore();
            var adapterLogger = _serviceProvider.GetRequiredService<ILogger<InMemoryVectorStoreAdapter>>();
            
            var adapter = new InMemoryVectorStoreAdapter(vectorStore, config, adapterLogger);
            
            _logger.LogInformation("Successfully created in-memory vector store adapter with {Dimensions} dimensions", 
                config.EmbeddingDimensions);
            return adapter;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create in-memory vector store");
            throw;
        }
    }

    private QdrantVectorStore CreateQdrantVectorStore(VectorStoreConfiguration config)
    {
        try
        {
            var connectionParams = ParseConnectionString(config.ConnectionString);
            string? endpoint = connectionParams.GetValueOrDefault("Endpoint") ?? 
                               connectionParams.GetValueOrDefault("Host");
            
            if (string.IsNullOrEmpty(endpoint))
                throw new ArgumentException("Endpoint or Host is required in connection string for Qdrant");
            
            string? apiKey = connectionParams.GetValueOrDefault("ApiKey") ?? 
                            connectionParams.GetValueOrDefault("Key");
            
            // Remove http:// or https:// from endpoint if present
            endpoint = endpoint.Replace("http://", "").Replace("https://", "");
            
            var qdrantClient = string.IsNullOrEmpty(apiKey) 
                ? new QdrantClient(endpoint)
                : new QdrantClient(endpoint, apiKey: apiKey);
            
            return new QdrantVectorStore(qdrantClient, ownsClient: true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Qdrant vector store");
            throw;
        }
    }

    private AzureAISearchVectorStore CreateAzureAISearchVectorStore(VectorStoreConfiguration config)
    {
        try
        {
            var connectionParams = ParseConnectionString(config.ConnectionString);
            string? endpoint = connectionParams.GetValueOrDefault("Endpoint") ?? 
                               connectionParams.GetValueOrDefault("ServiceUrl");
            string? apiKey = connectionParams.GetValueOrDefault("ApiKey") ?? 
                            connectionParams.GetValueOrDefault("Key");
            
            if (string.IsNullOrEmpty(endpoint))
                throw new ArgumentException("Endpoint is required for Azure AI Search");
            if (string.IsNullOrEmpty(apiKey))
                throw new ArgumentException("ApiKey is required for Azure AI Search");
            
            var searchIndexClient = new SearchIndexClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
            return new AzureAISearchVectorStore(searchIndexClient);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Azure AI Search vector store");
            throw;
        }
    }

    private IVectorStoreAdapter CreateQdrantVectorStoreAdapter(VectorStoreConfiguration config)
    {
        try
        {
            _logger.LogInformation("Creating Qdrant vector store adapter");
            
            // Parse connection string for Qdrant parameters
            var connectionParams = ParseConnectionString(config.ConnectionString);
            
            // Extract Qdrant connection parameters
            string? endpoint = connectionParams.GetValueOrDefault("Endpoint") ?? 
                               connectionParams.GetValueOrDefault("Host");
            
            if (string.IsNullOrEmpty(endpoint))
                throw new ArgumentException("Endpoint or Host is required in connection string for Qdrant");
            
            string? apiKey = connectionParams.GetValueOrDefault("ApiKey") ?? 
                            connectionParams.GetValueOrDefault("Key");
            
            // Remove http:// or https:// from endpoint if present
            if (endpoint.StartsWith("http://"))
                endpoint = endpoint.Substring(7);
            if (endpoint.StartsWith("https://"))
                endpoint = endpoint.Substring(8);
            
            // Extract port if present
            int port = 6334; // Default gRPC port for Qdrant
            if (endpoint.Contains(":"))
            {
                var parts = endpoint.Split(':');
                endpoint = parts[0];
                if (int.TryParse(parts[1], out var parsedPort))
                {
                    port = parsedPort;
                }
            }
            
            // Create Qdrant client
            // The third parameter is for HTTPS/TLS - we use false for plain HTTP/gRPC
            QdrantClient qdrantClient;
            if (!string.IsNullOrEmpty(apiKey))
            {
                qdrantClient = new QdrantClient(endpoint, port, false, apiKey);
            }
            else
            {
                qdrantClient = new QdrantClient(endpoint, port, false);
            }
            
            // Create QdrantVectorStore using the Semantic Kernel connector
            // ownsClient: true - the vector store will dispose the client when disposed
            var vectorStore = new QdrantVectorStore(qdrantClient, ownsClient: true);
            
            var adapterLogger = _serviceProvider.GetRequiredService<ILogger<QdrantVectorStoreAdapter>>();
            
            var adapter = new QdrantVectorStoreAdapter(vectorStore, config, adapterLogger);
            
            _logger.LogInformation("Successfully created Qdrant vector store adapter with endpoint: {Endpoint}:{Port} and {Dimensions} dimensions", 
                endpoint, port, config.EmbeddingDimensions);
            return adapter;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Qdrant vector store");
            throw;
        }
    }

    private IVectorStoreAdapter CreateAzureAISearchVectorStoreAdapter(VectorStoreConfiguration config)
    {
        try
        {
            _logger.LogInformation("Creating Azure AI Search vector store adapter");
            
            // Parse connection string for Azure AI Search parameters
            var connectionParams = ParseConnectionString(config.ConnectionString);
            
            // Extract Azure AI Search connection parameters
            string? endpoint = connectionParams.GetValueOrDefault("Endpoint") ?? 
                              connectionParams.GetValueOrDefault("SearchServiceEndpoint");
            
            string? apiKey = connectionParams.GetValueOrDefault("ApiKey") ?? 
                            connectionParams.GetValueOrDefault("Key") ??
                            connectionParams.GetValueOrDefault("SearchServiceApiKey");
            
            if (string.IsNullOrEmpty(endpoint))
            {
                throw new ArgumentException("Azure AI Search endpoint is required in connection string");
            }
            
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new ArgumentException("Azure AI Search API key is required in connection string");
            }
            
            // Create Azure AI Search client
            var searchIndexClient = new SearchIndexClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
            
            // Create AzureAISearchVectorStore using the Semantic Kernel connector
            var vectorStore = new AzureAISearchVectorStore(searchIndexClient);
            
            var adapterLogger = _serviceProvider.GetRequiredService<ILogger<AzureAISearchVectorStoreAdapter>>();
            
            var adapter = new AzureAISearchVectorStoreAdapter(vectorStore, config, adapterLogger);
            
            _logger.LogInformation("Successfully created Azure AI Search vector store adapter with endpoint: {Endpoint} and {Dimensions} dimensions", 
                endpoint, config.EmbeddingDimensions);
            return adapter;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Azure AI Search vector store");
            throw;
        }
    }

    /// <summary>
    /// Parse a connection string into key-value pairs
    /// </summary>
    private static Dictionary<string, string> ParseConnectionString(string connectionString)
    {
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return result;
        }

        var parts = connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var part in parts)
        {
            var keyValue = part.Split('=', 2);
            if (keyValue.Length == 2)
            {
                result[keyValue[0].Trim()] = keyValue[1].Trim();
            }
        }

        return result;
    }
}

/// <summary>
/// Configuration for creating vector stores
/// </summary>
public class VectorStoreConfiguration
{
    public required string VectorStoreType { get; set; }
    public required string ConnectionString { get; set; }
    public int EmbeddingDimensions { get; set; } = 3072;
    public string DistanceFunction { get; set; } = "CosineSimilarity";
    public string IndexKind { get; set; } = "Hnsw";
    public bool IsFilterable { get; set; } = true;
    public bool IsFullTextSearchable { get; set; } = false;
}