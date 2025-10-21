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

Tests in `07-sync-inmemory-vectorstore-scenario` and `08-sync-qdrant-vectorstore-scenario` require Azure OpenAI credentials to generate embeddings.

### Running Vectorstore Tests Locally

```bash
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY="your-azure-openai-key"
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT="https://your-instance.openai.azure.com/"
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL="text-embedding-3-large"
npm test
```

### Fork-Based Pull Requests

These tests are **automatically skipped** for fork-based pull requests (GitHub secrets are not available to forks for security reasons).

When credentials are missing, you'll see a clear warning message:
```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  SKIPPING VECTORSTORE E2E TESTS                              │
├─────────────────────────────────────────────────────────────────┤
│ Azure OpenAI credentials are not available.                     │
│ This is expected for fork-based pull requests.                  │
│                                                                  │
│ These tests will run automatically when:                        │
│  • PR is merged to main repository                              │
│  • PR is created from a branch (not a fork)                     │
└─────────────────────────────────────────────────────────────────┘
```

This is **normal and expected** - your PR can still pass CI without these tests. The vectorstore tests will run automatically when:
- Your PR is merged to the main repository
- Your PR is created from a branch in the main repository (not a fork)

## Tools

To manually recreate a clean test cluster and not run any tests run the following

```bash
node recreate-test-cluster.js
```

