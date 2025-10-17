# Sync Vector Store Reaction

This reaction synchronizes the results of Drasi queries with vector stores, enabling real-time vector search capabilities on continuously updated query results. The implementation uses Microsoft Semantic Kernel for vector store abstractions.

## Features

- **Real-time Vector Sync**: Automatically processes incremental changes from Drasi queries and maintains synchronized vector stores
- **Multiple Vector Store Support**: Currently supports Qdrant, Azure AI Search, and in-memory stores via Semantic Kernel abstractions  
- **Multiple Embedding Services**: Supports OpenAI and Azure OpenAI embedding services
- **Flexible Document Processing**: Configurable document templates using Handlebars templating
- **Sync Point Management**: Tracks synchronization state to ensure reliability and idempotency
- **Initial Bootstrap**: Performs full synchronization when first connecting to a query

## Quick Start

### 1. Deploy the Reaction Provider

First, ensure the reaction provider is registered:

```bash
drasi apply -f reaction-provider.yaml
```

### 2. Create Secrets for External Services

Create Kubernetes secrets for your vector store and embedding service credentials:

```bash
# For Qdrant vector store
kubectl create secret generic qdrant-creds \
  --from-literal=connection-string="Endpoint=https://your-qdrant-cluster.qdrant.io;ApiKey=your-api-key"

# For Azure OpenAI embedding service
kubectl create secret generic azure-openai-creds \
  --from-literal=api-key="your-azure-openai-api-key"
```

### 3. Configure and Deploy a Reaction

Create a reaction configuration file:

```yaml
apiVersion: v1
kind: Reaction
name: product-vector-sync
spec:
  kind: SyncVectorStore
  properties:
    vectorStoreType: "Qdrant"
    connectionString:
      kind: Secret
      name: qdrant-creds
      key: connection-string
    embeddingServiceType: "AzureOpenAI"
    embeddingEndpoint: "https://your-org.openai.azure.com"
    embeddingApiKey:
      kind: Secret
      name: azure-openai-creds
      key: api-key
    embeddingModel: "text-embedding-3-large"
    embeddingDimensions: 3072
  queries:
    product-catalog: |
      {
        "collectionName": "products",
        "keyField": "product_id",
        "documentTemplate": "Product: {{name}}\nDescription: {{description}}\nCategory: {{category}}",
        "titleTemplate": "{{name}}",
        "createCollection": true
      }
```

Deploy the reaction:

```bash
drasi apply -f your-reaction.yaml
```

## Configuration Reference

### Global Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `vectorStoreType` | string | Yes | - | Type of vector store (Qdrant, AzureAISearch, InMemory) |
| `connectionString` | string | Yes | - | Connection string for the vector store |
| `embeddingServiceType` | string | Yes | - | Type of embedding service (OpenAI, AzureOpenAI) |
| `embeddingEndpoint` | string | Conditional | - | Endpoint URL for the embedding service (required for Azure OpenAI) |
| `embeddingApiKey` | string | Yes | - | API key for the embedding service |
| `embeddingModel` | string | No | text-embedding-3-large | Model name/deployment name for embeddings |
| `embeddingDimensions` | integer | No | 3072 | Number of dimensions for embeddings |
| `distanceFunction` | string | No | CosineSimilarity | Distance function for vector similarity (CosineSimilarity, CosineDistance, EuclideanDistance, DotProductSimilarity, ManhattanDistance) |
| `indexKind` | string | No | Hnsw | Index type for vector search (Hnsw, Flat, IvfFlat, DiskAnn) |
| `isFilterable` | boolean | No | true | Enable filtering on data fields |
| `isFullTextSearchable` | boolean | No | false | Enable full-text search on content fields (Azure AI Search only) |

### Per-Query Configuration

Each query can have its own JSON configuration:

```json
{
  "collectionName": "my_collection",
  "keyField": "id",
  "documentTemplate": "Title: {{title}}\nContent: {{content}}",
  "titleTemplate": "{{title}}",
  "vectorField": "content_vector",
  "createCollection": true,
  "syncPointRetentionDays": 30
}
```

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `collectionName` | string | Yes | - | Name of the vector collection to sync with |
| `keyField` | string | Yes | - | Field in query results to use as unique identifier |
| `documentTemplate` | string | Yes | - | Handlebars template for generating document text from query results |
| `titleTemplate` | string | No | - | Handlebars template for generating document title |
| `vectorField` | string | No | content_vector | Field name for the vector in the document |
| `createCollection` | boolean | No | true | Whether to create collection if it doesn't exist |
| `syncPointRetentionDays` | integer | No | 30 | Number of days to retain sync point history |

#### Document Template Format

Uses Handlebars templating with `{{fieldName}}` placeholders:

```
"Product: {{name}}\nDescription: {{description}}\nPrice: ${{price}}\nCategory: {{category}}"
```

## Vector Store Connection Strings

### Qdrant
```
Endpoint=https://your-cluster.qdrant.io;ApiKey=your-api-key
```
Or for local deployment:
```
Endpoint=localhost:6334
```

### Azure AI Search
```
Endpoint=https://your-service.search.windows.net;ApiKey=your-api-key
```

### InMemory
No connection string required for in-memory store (used for testing/development).

## Embedding Service Configuration

### OpenAI
```yaml
embeddingServiceType: "OpenAI"
embeddingApiKey: "your-openai-api-key"
embeddingModel: "text-embedding-3-small"  # Optional, defaults to text-embedding-3-small
```

### Azure OpenAI
```yaml
embeddingServiceType: "AzureOpenAI"
embeddingEndpoint: "https://your-org.openai.azure.com"  # Required
embeddingApiKey: "your-azure-openai-api-key"
embeddingModel: "text-embedding-3-large"  # Your deployment name
```

## Example Use Cases

### 1. E-commerce Product Search

Sync product catalog data to enable semantic search:

```yaml
queries:
  product-catalog: |
    {
      "collectionName": "products",
      "keyField": "product_id",
      "documentTemplate": "Product: {{name}}\nDescription: {{description}}\nBrand: {{brand}}\nCategory: {{category}}",
      "titleTemplate": "{{name}} - {{brand}}",
      "createCollection": true
    }
```

### 2. Customer Support Knowledge Base

Build a searchable knowledge base from support articles:

```yaml
queries:
  knowledge-base: |
    {
      "collectionName": "support_articles",
      "keyField": "article_id", 
      "documentTemplate": "Title: {{title}}\nContent: {{content}}\nTags: {{tags}}",
      "titleTemplate": "{{title}}",
      "createCollection": true
    }
```

### 3. Multi-Language Content

Sync content across different languages:

```yaml
queries:
  english-content: |
    {
      "collectionName": "content_en",
      "keyField": "content_id",
      "documentTemplate": "{{title}}\n{{body}}",
      "titleTemplate": "{{title}}"
    }
  spanish-content: |
    {
      "collectionName": "content_es", 
      "keyField": "content_id",
      "documentTemplate": "{{title}}\n{{body}}",
      "titleTemplate": "{{title}}"
    }
```

## Monitoring and Troubleshooting

### Check Reaction Status

```bash
drasi list reactions
drasi describe reaction your-reaction-name
```

### View Logs

```bash
kubectl logs -n drasi-system deployment/your-reaction-name-reaction -f
```

### Common Issues

1. **Vector Store Connection Errors**: Verify connection string format and network connectivity
2. **Embedding Service Failures**: Check API keys, endpoints (for Azure OpenAI), and rate limits
3. **Invalid Document Templates**: Ensure field names in Handlebars templates match query result fields (use {{fieldName}} syntax)
4. **Collection Creation Failures**: Verify vector store permissions and that embedding dimensions match configuration
5. **Sync Point Errors**: Check that the reaction has proper access to manage sync points in the vector store

## Development

### Building Locally

```bash
# Restore dependencies
make restore

# Build the solution
make dotnet-build

# Run tests
make test

# Build Docker image
make build

# Load to kind cluster
make kind-load
```

### Testing

The reaction includes comprehensive unit tests covering:
- Document processing with Handlebars template rendering
- Embedding generation via OpenAI/Azure OpenAI services  
- Vector store adapter operations for Qdrant, Azure AI Search, and InMemory stores
- Query configuration validation
- Sync point management and recovery
- Initial query bootstrap and incremental updates

Run tests with:

```bash
dotnet test Drasi.Reactions.SyncSemanticKernelVectorStore.Tests/
```

For coverage reporting:
```bash
dotnet test --collect:"XPlat Code Coverage"
```

## Contributing

This reaction is part of the Drasi platform. Contributions are welcome through the main Drasi repository.

## License

Licensed under the Apache License, Version 2.0.