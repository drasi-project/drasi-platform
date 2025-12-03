# End to end tests

## Prerequisites
- Docker
- [Kind](https://kind.sigs.k8s.io/)
- Node
- Build the Drasi CLI and add it to your path

## Running

```bash
npm test
```

## Vectorstore Tests (Scenarios 07 & 08)

Tests in `07-sync-inmemory-vectorstore-scenario` and `08-sync-qdrant-vectorstore-scenario` test the vector store reaction pipeline with embeddings.

### Running with Azure OpenAI (Full Semantic Embeddings)

For full semantic embedding testing, provide Azure OpenAI credentials:

```bash
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY="your-azure-openai-key"
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT="https://your-instance.openai.azure.com/"
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL="text-embedding-3-large"
npm test
```

### Running without Azure OpenAI (Mock Embeddings)

When Azure OpenAI credentials are not available, the tests automatically deploy a **mock embedding service** that generates deterministic hash-based embeddings. This allows fork contributors to test the full vector store pipeline.

```bash
# No environment variables needed - mock is used automatically
npm test
```

You'll see this message when mock embeddings are being used:
```
┌─────────────────────────────────────────────────────────────────┐
│ ℹ️  USING MOCK EMBEDDING SERVICE                                │
├─────────────────────────────────────────────────────────────────┤
│ Azure OpenAI credentials are not available.                     │
│ Deploying mock embedding service for testing.                   │
│                                                                  │
│ This allows fork contributors to test the vector store pipeline │
│ with deterministic (hash-based) embeddings.                     │
│                                                                  │
│ Note: Mock embeddings test the pipeline integration, not        │
│ semantic quality. Real embeddings are tested when credentials   │
│ are available.                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### What Gets Tested

| Aspect | Mock Embeddings | Real Embeddings |
|--------|-----------------|-----------------|
| Pipeline integration | ✅ | ✅ |
| Document sync (add/update/delete) | ✅ | ✅ |
| Vector store operations | ✅ | ✅ |
| Embedding API integration | ✅ | ✅ |
| Semantic similarity | ❌ | ✅ |
| Embedding quality | ❌ | ✅ |

### Fork-Based Pull Requests

Fork contributors can now run the vectorstore tests! The mock embedding service is automatically deployed when Azure credentials are not available.

- **Mock mode**: Tests the full pipeline with deterministic embeddings
- **Real mode**: When credentials are available (main repo, non-fork branches), tests use actual Azure OpenAI

## Mock Embedding Service

The mock embedding service is located in `fixtures/mock-embedding-service/`. It:

- Implements the Azure OpenAI embeddings API
- Generates deterministic embeddings using SHA-256 hashing
- Is automatically built, loaded into Kind, and deployed when needed
- Cleans up after tests complete

See `fixtures/mock-embedding-service/README.md` for technical details.

## Tools

To manually recreate a clean test cluster and not run any tests run the following

```bash
node recreate-test-cluster.js
```