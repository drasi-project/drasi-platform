# E2E Tests: Qdrant Vector Store Synchronization

## Overview
This test suite validates the **Vector Store Reaction** (`reactions/sync-vectorstore`) using **Qdrant** as the persistent vector database backend with **Azure OpenAI embeddings**.

The reaction continuously synchronizes Drasi query results to Qdrant collections, generating embeddings for each result row using configurable Handlebars templates and storing them persistently in Qdrant.

## What's Being Tested

### Core Reaction Flow
```
PostgreSQL → Drasi Queries → Vector Store Reaction → Qdrant Vector Store
     ↓              ↓                    ↓                      ↓
  Changes     Query Results      Generate Embeddings    Persistent Storage
```

### Test Scenarios

#### 1. **Initial State Sync**
Verifies that existing database rows are:
- Detected by Drasi queries
- Processed to generate embeddings via Azure OpenAI
- Stored in Qdrant collections with proper vector dimensions
- Accessible via Qdrant's HTTP API for verification

```javascript
// Verify collection has initial 5 products
const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_simple");
expect(collectionInfo.result.points_count).toBeGreaterThanOrEqual(5);
// Vector dimensions should match the configured embedding model
expect(collectionInfo.result.config.params.vectors.size).toBe(3072);
```

#### 2. **Insert Operations**
Tests that new database inserts:
- Trigger real-time change detection
- Generate new embeddings
- Add documents to Qdrant with deterministic GUIDs

Includes both single and bulk insert scenarios:
```sql
-- Single insert (ID 201)
INSERT INTO products (id, name, description, category_id) 
VALUES (201, 'Qdrant Test Product', 'A test product for Qdrant e2e testing', 1);

-- Bulk insert (IDs 202-206)
INSERT INTO products (id, name, description, category_id) VALUES 
  (202, 'Qdrant Bulk 1', 'Qdrant bulk test product 1', 2),
  (203, 'Qdrant Bulk 2', 'Qdrant bulk test product 2', 2),
  -- ... more products
```

#### 3. **Update Operations**
Validates that updates:
- Regenerate embeddings with new content
- Replace existing documents in Qdrant (same GUID, new vector)
- Cascade through joined queries when related data changes

```javascript
// Update triggers re-embedding
await dbClient.query(
  "UPDATE products SET description = $1 WHERE id = $2",
  ["Updated Qdrant test product description", 201]
);

// Cascade update through join
await dbClient.query(
  "UPDATE categories SET name = $1 WHERE id = $2",
  ["Updated Electronics", 1]
);
```

#### 4. **Delete Operations**
Ensures deletions:
- Remove documents from Qdrant collections
- Handle cascade deletes in join queries
- Maintain consistency between query results and vector store

#### 5. **Persistence Testing**
Unique to Qdrant (vs InMemory):
- Verifies data persists in Qdrant
- Documents survive across reaction restarts
- Collections maintain their configuration

## Test Configuration

### Queries Tested
1. **Simple Query** (`qdrant-products-query`): Single table query
   ```cypher
   MATCH (p:products)
   RETURN 
     p.id AS id,
     p.name AS name,
     p.description AS description,
     p.category_id AS category_id
   ```

2. **Join Query** (`qdrant-products-category-query`): Multi-table join with explicit relationship
   ```cypher
   MATCH (p:products)-[:HAS_CATEGORY]->(c:categories)
   RETURN 
     p.id AS product_id,
     p.name AS product_name,
     p.description AS product_description,
     c.name AS category_name,
     c.description AS category_description
   ```

### Reaction Configuration
```yaml
apiVersion: v1
kind: Reaction
name: qdrant-simple-reaction
spec:
  kind: SyncVectorStore
  queries:
    qdrant-products-query: |
      {
        "collectionName": "qdrant_products_simple",
        "keyField": "id",
        "documentTemplate": "Product: {{name}} - {{description}}",
        "titleTemplate": "{{name}}",
        "vectorField": "content_vector",
        "createCollection": true
      }
  properties:
    vectorStoreType: Qdrant
    connectionString: "Endpoint=qdrant.default.svc.cluster.local:6334"  # gRPC port
    embeddingServiceType: AzureOpenAI
    embeddingEndpoint: "${E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT}"  # Set via environment variable
    embeddingApiKey: "${E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY}"  # Set via environment variable
    embeddingModel: "${E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL}"  # Set via environment variable
    embeddingDimensions: 3072
    distanceFunction: CosineSimilarity
    indexKind: Hnsw
    isFilterable: true
```

### Key Components
- **Vector Store**: Qdrant (persistent, production-ready)
- **Embedding Service**: Azure OpenAI
- **Embedding Model**: Configured via `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL` environment variable
- **Embedding Dimensions**: 3072 (must match your model's output dimensions)
- **Template Engine**: String templates for document and title generation
- **Database**: PostgreSQL with logical replication enabled
- **Distance Function**: Cosine Similarity
- **Index Type**: HNSW (Hierarchical Navigable Small World)

## Architecture Details

### Qdrant Dual-Port Architecture
Qdrant exposes two APIs on different ports:

1. **Port 6333 - HTTP/REST API** (used by tests for verification)
   - Simple HTTP requests for administrative operations
   - Easy to use from JavaScript tests
   - Used for checking collections, counting documents, retrieving points
   
2. **Port 6334 - gRPC API** (used by reaction for operations)
   - Binary protocol with better performance
   - Used by Semantic Kernel Qdrant connector
   - Handles vector operations efficiently
   - Better for production workloads

```javascript
// Test verification uses HTTP API
qdrantPortForward = new PortForward("qdrant", 6333, "default");

// Reaction configuration uses gRPC API
connectionString: "Endpoint=qdrant.default.svc.cluster.local:6334"
```

### Document ID Generation
The test uses deterministic GUID generation to match C# implementation:
```javascript
function generateDeterministicGuid(key) {
  // Creates MD5 hash of key
  // Interprets bytes with C# Guid constructor endianness
  // Returns GUID in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
}
```

This ensures document IDs in tests match those generated by the C# reaction.

## Test Data

### Initial Data
```sql
-- 3 categories
INSERT INTO categories (id, name, description) VALUES 
  (1, 'Electronics', 'Electronic devices and accessories'),
  (2, 'Books', 'Books and publications'),
  (3, 'Clothing', 'Apparel and accessories');

-- 5 products
INSERT INTO products (id, name, description, category_id) VALUES 
  (1, 'Laptop Pro', 'High-performance laptop with 16GB RAM and 512GB SSD', 1),
  (2, 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 1),
  (3, 'Data Science Handbook', 'Comprehensive guide to data science and machine learning', 2),
  (4, 'Python Programming', 'Learn Python programming from basics to advanced', 2),
  (5, 'Cotton T-Shirt', 'Comfortable cotton t-shirt in multiple colors', 3);
```

### Test-Specific Data
- IDs 201-206: Used for insert/update/delete tests
- All test data with ID > 200 is cleaned up after tests complete
- Categories are reset to original state after cascade tests
- Database is reset to clean state in beforeAll to handle test pollution

## Environment Variables

### Required
All three environment variables must be set before running the tests:

- `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY`: API key for Azure OpenAI service
- `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint URL
  - Format: `https://your-resource.openai.azure.com/`
  - Must include `https://` prefix and trailing `/`
- `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL`: Embedding model deployment name
  - Examples: `text-embedding-3-large`, `text-embedding-3-small`, `text-embedding-ada-002`
  - Must match a deployment in your Azure OpenAI resource
  - Model dimensions must align with `embeddingDimensions` config (3072 for text-embedding-3-large)

## Verification Methods

Unlike InMemory store, Qdrant provides direct verification through its HTTP API:

1. **Direct Qdrant Queries** - Check collections and documents via HTTP API
   ```javascript
   const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_simple");
   const points = await getQdrantPoints(qdrantPort, "qdrant_products_simple");
   ```

2. **Document Verification** - Check specific documents exist by ID
   ```javascript
   const exists = await verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "201");
   ```

3. **SignalR Monitoring** - Track query result changes for timing
   ```javascript
   await signalrFixture.waitForChange("qdrant-products-query",
     change => change.op === "i" && change.payload.after.id === 201
   );
   ```

## Running the Tests

### Prerequisites
```bash
# Required: Set all Azure OpenAI environment variables
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY="your-api-key"
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
export E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL="text-embedding-3-large"

# Ensure Docker is running and kind cluster is available
docker info
kind get clusters
```

### Execute Tests
```bash
# From repository root
cd e2e-tests

# Run this specific test suite
npm test -- 08-sync-qdrant-vectorstore-scenario/qdrant-vectorstore.test.js

# Or run with Jest directly
npx jest 08-sync-qdrant-vectorstore-scenario/qdrant-vectorstore.test.js
```

## Expected Behavior

### ✅ Success Indicators:
- All 5 initial products generate embeddings and appear in Qdrant
- Collections created with correct vector dimensions (matching the embedding model)
- Insert operations add documents within 30 seconds
- Update operations regenerate embeddings with new content
- Delete operations remove documents from Qdrant
- Join query updates cascade correctly when related data changes
- Documents persist in Qdrant (survive restarts)
- Resource cleanup completes successfully

### ❌ Common Failures:
- **Missing environment variables**: All three Azure OpenAI variables are required: `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY`, `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT`, `E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL`
- **Invalid API key**: Verify key has access to the specified endpoint and model
- **Wrong endpoint format**: Ensure endpoint includes `https://` prefix and trailing `/`
- **Model not deployed**: Verify the model name matches your Azure OpenAI deployment
- **Model dimension mismatch**: If using a different model, ensure `embeddingDimensions` matches the model's output (e.g., 1536 for ada-002, 3072 for text-embedding-3-large)
- **Qdrant connection issues**: Check Qdrant pod is running and accessible
- **Timeout errors**: Initial sync may take up to 60 seconds due to embedding generation
- **Port conflicts**: Ensure ports 5432 and 6333 aren't in use locally
- **GUID mismatch**: Document IDs use deterministic GUID generation

## Architecture Notes

### Qdrant Characteristics:
- **Persistent storage**: Data survives pod restarts
- **Production-ready**: Suitable for production workloads
- **Scalable**: Can handle large numbers of vectors
- **Rich query capabilities**: Supports filtering, similarity search
- **Dual API**: HTTP for admin, gRPC for operations

### Semantic Kernel Integration:
- Uses Microsoft.SemanticKernel.Connectors.Qdrant
- Connects via gRPC for optimal performance
- Supports full vector operations (add, update, delete, search)
- Implements IVectorStore interface for consistency

### Sync Point Management:
- Tracks last processed sequence number per query
- Ensures exactly-once processing semantics
- Stored in a special collection within Qdrant
- Persists across reaction restarts (unlike InMemory)