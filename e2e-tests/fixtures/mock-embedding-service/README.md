# Mock Embedding Service

A lightweight mock service that mimics the Azure OpenAI Embeddings API for e2e testing purposes.

## Purpose

This service enables fork contributors to run vector store e2e tests without requiring Azure OpenAI credentials. It generates deterministic embeddings based on SHA-256 hashes of the input text, allowing the full vector store pipeline to be tested.

## How It Works

1. **Deterministic Embeddings**: The service generates embeddings by hashing the input text with SHA-256 and converting the hash bytes into a normalized float vector. The same text always produces the same embedding.

2. **Azure OpenAI API Compatible**: Implements the Azure OpenAI embeddings endpoint format:
   ```
   POST /openai/deployments/{model}/embeddings?api-version={version}
   ```

3. **Automatic Deployment**: When tests detect missing Azure OpenAI credentials, they automatically:
   - Build this Docker image
   - Load it into the Kind cluster
   - Deploy it as a Kubernetes service
   - Configure reactions to use it

## API Endpoints

### POST /openai/deployments/{model}/embeddings

Generate embeddings for input texts.

**Request:**
```json
{
  "input": ["text1", "text2", ...]
}
```

**Response:**
```json
{
  "object": "list",
  "data": [
    {"object": "embedding", "embedding": [...], "index": 0},
    {"object": "embedding", "embedding": [...], "index": 1}
  ],
  "model": "{model}",
  "usage": {"prompt_tokens": 10, "total_tokens": 10}
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "mock-embedding-service",
  "dimensions": 3072,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### GET /

Service information.

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `8080` | Port to listen on |
| `EMBEDDING_DIMENSIONS` | `3072` | Number of dimensions for generated embeddings |

## Local Development

```bash
# Install dependencies
npm install

# Run the service
npm start

# Test with curl
curl -X POST http://localhost:8080/openai/deployments/test-model/embeddings \
  -H "Content-Type: application/json" \
  -H "api-key: test-key" \
  -d '{"input": ["Hello world"]}'
```

## Building the Docker Image

```bash
docker build -t drasi-project/mock-embedding-service:latest .
```

## Limitations

- **Not for semantic search**: Mock embeddings are hash-based, not semantically meaningful
- **Testing only**: Should never be used in production
- **Fixed dimensions**: Defaults to 3072 to match `text-embedding-3-large`

## What Tests Validate with Mock

- Full pipeline integration (source → query → reaction → vector store)
- Document upsert/delete operations
- Vector store collection creation
- Embedding API integration

## What Tests Cannot Validate with Mock

- Semantic similarity or search quality
- Actual embedding model behavior
- Azure OpenAI rate limits or error handling
