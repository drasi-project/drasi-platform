# E2E Tests: InMemory Vector Store Synchronization

## Overview
This test suite validates the **Semantic Kernel Vector Store Reaction** (`reactions/semantickernel/sync-vectorstore`) using an **InMemory vector store** backend with **Azure OpenAI embeddings**.

The reaction continuously synchronizes Drasi query results to a vector store, generating embeddings for each result row using configurable Handlebars templates.

## What's Being Tested

### Core Reaction Flow
```
PostgreSQL → Drasi Queries → SK Vector Store Reaction → InMemory Vector Store
     ↓              ↓                    ↓                        ↓
  Changes     Query Results      Generate Embeddings      Store Documents
```

### Test Scenarios

#### 1. **Initial State Sync** 
Verifies that existing database rows are:
- Detected by Drasi queries
- Processed to generate embeddings via Azure OpenAI
- Stored in the InMemory vector store with proper document structure

```javascript
// Verify 5 initial products are synced
expect(queryData).toHaveLength(5);
const productIds = queryData.map(item => item.id).sort();
expect(productIds).toEqual([1, 2, 3, 4, 5]);
```

#### 2. **Insert Operations** 
Tests that new database inserts:
- Trigger real-time change detection
- Generate new embeddings
- Add documents to vector store

Includes both single and bulk insert scenarios:
```sql
-- Single insert
INSERT INTO products (id, name, description, category_id) 
VALUES (101, 'Test Product', 'A test product for e2e testing', 1);

-- Bulk insert (5 products)
INSERT INTO products (id, name, description, category_id) VALUES 
  (102, 'Bulk Product 1', 'Bulk test product 1', 2),
  (103, 'Bulk Product 2', 'Bulk test product 2', 2),
  -- ... more products
```

#### 3. **Update Operations** 
Validates that updates:
- Regenerate embeddings with new content
- Replace existing documents (same key, new embedding)
- Cascade through joined queries when related data changes

```javascript
// Simple update
await dbClient.query(
  "UPDATE products SET description = $1 WHERE id = $2",
  ["Updated test product description", 101]
);

// Cascade update through join
await dbClient.query(
  "UPDATE categories SET name = $1 WHERE id = $2",
  ["Updated Electronics", 1]
);
```

#### 4. **Delete Operations** 
Ensures deletions:
- Remove documents from vector store
- Handle cascade deletes in join queries
- Maintain consistency between query results and vector store

## Test Configuration

### Queries Tested
1. **Simple Query** (`sk-products-query`): Single table query
   ```cypher
   MATCH (p:products)
   RETURN 
     p.id AS id,
     p.name AS name,
     p.description AS description,
     p.category_id AS category_id
   ```

2. **Join Query** (`sk-products-with-category-query`): Multi-table join with explicit relationship
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
name: sk-inmemory-simple-reaction
spec:
  kind: SyncSemanticKernelVectorStore
  queries:
    sk-products-query: |
      {
        "collectionName": "inmemory_products_simple",
        "keyField": "id",
        "documentTemplate": "Product: {{name}} - {{description}}",
        "titleTemplate": "{{name}}",
        "vectorField": "content_vector",
        "createCollection": true
      }
  properties:
    vectorStoreType: InMemory
    connectionString: ""  # Not required for InMemory
    embeddingServiceType: AzureOpenAI
    embeddingEndpoint: "https://aman-eastus-resource.cognitiveservices.azure.com/"
    embeddingApiKey: "${AZURE_OPENAI_KEY}"  # Set via environment variable
    embeddingModel: "text-embedding-3-large"
    embeddingDimensions: 3072
    distanceFunction: CosineSimilarity
    indexKind: Hnsw
    isFilterable: true
```

### Key Components
- **Vector Store**: InMemory (non-persistent, for testing)
- **Embedding Service**: Azure OpenAI
- **Embedding Model**: text-embedding-3-large (3072 dimensions)
- **Template Engine**: Handlebars for document and title generation
- **Database**: PostgreSQL with logical replication enabled
- **Distance Function**: Cosine Similarity
- **Index Type**: HNSW (Hierarchical Navigable Small World)

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
- IDs 101-106: Used for insert/update/delete tests
- All test data with ID > 100 is cleaned up after tests complete
- Categories are reset to original state after cascade tests

## Environment Variables

### Required
All three environment variables must be set before running the tests:

- `AZURE_OPENAI_KEY`: API key for Azure OpenAI service
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint URL (e.g., `https://your-resource.openai.azure.com/`)
- `AZURE_OPENAI_MODEL`: Embedding model deployment name (e.g., `text-embedding-3-large`)

## Verification Methods

Since InMemory store doesn't expose a query API, verification happens through:

1. **SignalR Monitoring** - Tracks query result changes as proxy for vector store state
   ```javascript
   const queryData = await signalrFixture.requestReload("sk-products-query");
   ```

2. **Reaction Log Analysis** - Checks for embedding generation patterns:
   - "Generated embedding(s) for N text"
   - "Generating embeddings for N document"
   - "Processing N documents for vectorization"
   - "Created N embeddings"
   - "Batch embedding generation: N items"

3. **Query State Validation** - Ensures Drasi queries reflect expected state after operations

## Running the Tests

### Prerequisites
```bash
# Required: Set all Azure OpenAI environment variables
export AZURE_OPENAI_KEY="your-api-key"
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
export AZURE_OPENAI_MODEL="text-embedding-3-large"

# Ensure Docker is running and kind cluster is available
docker info
kind get clusters
```

### Execute Tests
```bash
# From repository root
cd e2e-tests

# Run this specific test suite
npm test -- 07-sync-inmemory-vectorstore-scenario/inmemory-vectorstore.test.js

# Or run with Jest directly
npx jest 07-sync-inmemory-vectorstore-scenario/inmemory-vectorstore.test.js
```

## Expected Behavior

### ✅ Success Indicators:
- All 5 initial products generate embeddings
- Insert operations add documents within 30 seconds
- Update operations regenerate embeddings with new content
- Delete operations remove documents from vector store
- Join query updates cascade correctly when related data changes
- No duplicate documents created (key field ensures uniqueness)
- Resource cleanup completes successfully

### ❌ Common Failures:
- **Missing environment variables**: All three Azure OpenAI variables are required: `AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_MODEL`
- **Invalid API key**: Verify key has access to the specified endpoint and model
- **Wrong endpoint format**: Ensure endpoint includes `https://` and trailing `/`
- **Model not deployed**: Verify the model name matches your Azure OpenAI deployment
- **Timeout errors**: Initial sync may take up to 30 seconds due to embedding generation
- **Port conflicts**: Ensure port 5432 isn't in use by local PostgreSQL
- **Resource cleanup issues**: May leave resources if test fails; manually clean with `kubectl delete`

## Architecture Notes

### InMemory Vector Store Characteristics:
- **Non-persistent**: Data stored in process memory only
- **No external dependencies**: Runs entirely within the reaction pod
- **Restart behavior**: All data lost on reaction restart
- **Use cases**: Testing, development, and temporary scenarios
- **Performance**: Fast operations, no network overhead

### Semantic Kernel Integration:
- Uses Microsoft.SemanticKernel.Connectors.InMemory
- Supports full vector operations (add, update, delete, search)
- Implements IVectorStore interface for consistency across stores

### Sync Point Management:
- Tracks last processed sequence number per query
- Ensures exactly-once processing semantics
- Stored in a special collection within the vector store
- Retention period: 30 days (configurable via `syncPointRetentionDays`)
