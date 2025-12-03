/**
 * Copyright 2025 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const deployResources = require("../fixtures/deploy-resources");
const deleteResources = require("../fixtures/delete-resources");
const yaml = require("js-yaml");
const fs = require("fs");
const pg = require("pg");
const PortForward = require("../fixtures/port-forward");
const SignalrFixture = require("../fixtures/signalr-fixture");
const { waitFor } = require('../fixtures/infrastructure');
const cp = require('child_process');
const {
  setupMockEmbeddingService,
  deleteMockEmbeddingService,
  updateReactionsForMock
} = require('../fixtures/deploy-mock-embedding');

// Resource file paths
const resourcesFilePath = __dirname + '/resources.yaml';
const sourcesFilePath = __dirname + '/sources.yaml';
const queriesFilePath = __dirname + '/queries.yaml';
const reactionProviderFilePath = __dirname + '/reaction-provider.yaml';
const reactionsFilePath = __dirname + '/reactions.yaml';

let resourcesToCleanup = [];
let dbPortForward;
let dbClient;
let signalrFixture;
let usingMockEmbeddings = false;

/**
 * InMemory Vector Store Test Scope
 * 
 * The InMemory vector store doesn't expose an external API for verification.
 * Unlike Qdrant (which has HTTP REST API), the InMemory store exists only in 
 * process memory within the reaction container.
 * 
 * What these tests validate:
 * - Embeddings are generated (via log verification) 
 * - Documents are processed through the pipeline (via logs)
 * - Drasi query state changes correctly (via SignalR as proxy)
 * - The reaction responds to adds/updates/deletes
 * 
 * What these tests cannot validate:
 * - Actual vector store content
 * - Vector dimensions or structure  
 * - Document retrieval or search
 * - Vector similarity operations
 * 
 * For full vector store validation, see: e2e-tests/08-sync-qdrant-vectorstore-scenario/
 */

// Helper to verify embedding was created (check reaction logs)
async function verifyEmbeddingCreation(reactionName, expectedCount) {
  try {
    // Get deployment name for the reaction
    const deploymentName = `${reactionName}-reaction`;
    const logs = cp.execSync(
      `kubectl logs -n drasi-system deployment/${deploymentName} -c reaction --tail=500`,
      { encoding: 'utf8' }
    );
    
    // Look for embedding generation logs - matches logging done in EmbeddingService.cs 
    const embeddingLogs = logs.match(/Generated\s+embedding\s+for\s+\d+\s+texts/gi) || [];
    const totalEmbeddings = embeddingLogs.reduce((sum, log) => {
      const match = log.match(/for\s+(\d+)\s+texts/i);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
    
    console.log(`Found ${totalEmbeddings} embeddings generated (expected ${expectedCount})`);
    return totalEmbeddings >= expectedCount;
  } catch (error) {
    console.error(`Error checking logs: ${error.message}`);
    return false;
  }
}

// Helper to verify initial documents were loaded during bootstrap
async function verifyInitialLoad(reactionName, queryId, expectedCount) {
  try {
    const deploymentName = `${reactionName}-reaction`;
    const logs = cp.execSync(
      `kubectl logs -n drasi-system deployment/${deploymentName} -c reaction --tail=500`,
      { encoding: 'utf8' }
    );
    
    // During bootstrap, QueryInitializationService logs: "Successfully loaded X documents for query Y"
    const loadPattern = new RegExp(`Successfully loaded (\\d+) documents for query ${queryId}`, 'g');
    const loadLogs = logs.match(loadPattern) || [];
    
    if (loadLogs.length > 0) {
      const lastLog = loadLogs[loadLogs.length - 1];
      const match = lastLog.match(/loaded (\d+) documents/);
      if (match) {
        const count = parseInt(match[1]);
        console.log(`Verified initial load of ${count} documents for query ${queryId}`);
        return count === expectedCount;
      }
    }
    
    console.log(`No initial load logs found for query ${queryId}`);
    return false;
  } catch (error) {
    console.error(`Error checking initial load logs: ${error.message}`);
    return false;
  }
}

// Helper to verify documents were deleted from vector store (via logs)
async function verifyDocumentDeletion(reactionName, queryId, expectedCount) {
  try {
    const deploymentName = `${reactionName}-reaction`;
    const logs = cp.execSync(
      `kubectl logs -n drasi-system deployment/${deploymentName} -c reaction --tail=500`,
      { encoding: 'utf8' }
    );
    
    // Look for deletion logs - matches ChangeEventHandler.cs lines 215-217
    const deletePattern = new RegExp(`Successfully deleted \\d+ documents for query ${queryId}`, 'g');
    const deleteLogs = logs.match(deletePattern) || [];
    
    if (deleteLogs.length > 0) {
      // Get the most recent delete log
      const lastLog = deleteLogs[deleteLogs.length - 1];
      const match = lastLog.match(/deleted (\d+) documents/);
      if (match) {
        const count = parseInt(match[1]);
        console.log(`Found deletion of ${count} documents for query ${queryId}`);
        return count === expectedCount;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error checking deletion logs: ${error.message}`);
    return false;
  }
}

beforeAll(async () => {
  // Check if Azure OpenAI credentials are available
  const azureKey = process.env.E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY;
  const azureEndpoint = process.env.E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT;
  const azureModel = process.env.E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL;

  const hasSecrets = azureKey && azureEndpoint && azureModel;

  if (!hasSecrets) {
    console.log(`
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
    `);

    // Deploy mock embedding service
    const mockReady = await setupMockEmbeddingService('drasi-test');
    if (!mockReady) {
      throw new Error('Failed to setup mock embedding service');
    }
    usingMockEmbeddings = true;
  } else {
    console.log(`Azure OpenAI configured: endpoint=${azureEndpoint}, model=${azureModel}`);
  }

  // Load resources
  const infraResources = yaml.loadAll(fs.readFileSync(resourcesFilePath, 'utf8'));
  const sources = yaml.loadAll(fs.readFileSync(sourcesFilePath, 'utf8'));
  const queries = yaml.loadAll(fs.readFileSync(queriesFilePath, 'utf8'));
  const reactionProvider = yaml.loadAll(fs.readFileSync(reactionProviderFilePath, 'utf8'));
  const reactions = yaml.loadAll(fs.readFileSync(reactionsFilePath, 'utf8'));
  
  // Update secret in resources
  infraResources.forEach(resource => {
    if (resource.kind === 'Secret' && resource.metadata.name === 'azure-openai-secret') {
      resource.stringData.apiKey = azureKey;
      resource.stringData.endpoint = azureEndpoint;
      resource.stringData.deploymentName = azureModel;
    }
  });
  
  // Update reactions with embedding service configuration
  if (usingMockEmbeddings) {
    // Use mock embedding service
    console.log('Configuring reactions to use mock embedding service...');
    updateReactionsForMock(reactions);
  } else {
    // Use real Azure OpenAI
    reactions.forEach(reaction => {
      if (reaction.spec?.properties?.embeddingApiKey === '${E2E_SYNC_VECTORSTORE_AZURE_OPENAI_KEY}') {
        reaction.spec.properties.embeddingApiKey = azureKey;
      }
      if (reaction.spec?.properties?.embeddingEndpoint === '${E2E_SYNC_VECTORSTORE_AZURE_OPENAI_ENDPOINT}') {
        reaction.spec.properties.embeddingEndpoint = azureEndpoint;
      }
      if (reaction.spec?.properties?.embeddingModel === '${E2E_SYNC_VECTORSTORE_AZURE_OPENAI_EMBEDDING_MODEL}') {
        reaction.spec.properties.embeddingModel = azureModel;
      }
    });
  }

  resourcesToCleanup = [...infraResources, ...sources, ...queries, ...reactionProvider, ...reactions];

  console.log(`Deploying ${infraResources.length} infrastructure resources...`);
  await deployResources(infraResources);

  console.log("Waiting for PostgreSQL to be ready...");
  await new Promise(r => setTimeout(r, 20000));

  console.log(`Deploying ${sources.length} sources...`);
  await deployResources(sources);

  console.log(`Deploying ${queries.length} queries...`);
  await deployResources(queries);

  console.log(`Deploying reaction provider...`);
  await deployResources(reactionProvider);

  console.log(`Deploying ${reactions.length} reactions...`);
  await deployResources(reactions);

  // Setup PostgreSQL client
  dbPortForward = new PortForward("vectorstore-postgres", 5432, "default");
  const dbPort = await dbPortForward.start();
  dbClient = new pg.Client({
    user: "testuser",
    password: "testpass",
    host: "localhost",
    port: dbPort,
    database: "testdb",
  });
  await dbClient.connect();
  console.log("Connected to PostgreSQL at port", dbPort);

  // Setup SignalR fixture for monitoring queries
  signalrFixture = new SignalrFixture(["products-query", "products-with-category-query"]);
  await signalrFixture.start();
  console.log("SignalR fixture started");

  // Wait for initial sync
  await waitFor({ 
    timeout: 30000, 
    description: "initial data synchronization to vector stores" 
  });

  console.log("Setup complete.");
}, 480000);

afterAll(async () => {
  if (signalrFixture) {
    await signalrFixture.stop();
    console.log("SignalR fixture stopped.");
  }

  if (dbClient) {
    await dbClient.end();
    console.log("PostgreSQL client disconnected.");
  }

  if (dbPortForward) {
    dbPortForward.stop();
    console.log("PostgreSQL port forward stopped.");
  }

  if (resourcesToCleanup.length > 0) {
    console.log(`Deleting ${resourcesToCleanup.length} resources...`);
    await deleteResources(resourcesToCleanup);
    console.log("Teardown complete.");
  }

  // Clean up mock embedding service if it was deployed
  if (usingMockEmbeddings) {
    console.log("Cleaning up mock embedding service...");
    await deleteMockEmbeddingService();
  }
});

// Tests always run - either with real Azure OpenAI or mock embedding service
describe("InMemory Vector Store Pipeline E2E Tests", () => {
  test("Initial state sync - Simple query (validates pipeline, not storage)", async () => {
    console.log("Verifying initial state sync pipeline for simple products query...");

    // Get current state from SignalR (as proxy for vector store state)
    const queryData = await signalrFixture.requestReload("products-query");
    
    // Should have 5 initial products
    expect(queryData).toHaveLength(5);
    
    // Verify all products are present
    const productIds = queryData.map(item => item.id).sort();
    expect(productIds).toEqual([1, 2, 3, 4, 5]);

    // Verify reaction is processing (check logs for embedding generation)
    const embeddingsCreated = await verifyEmbeddingCreation("inmemory-simple-reaction", 5);
    expect(embeddingsCreated).toBe(true);

    // Verify initial documents were loaded during bootstrap
    const initialLoadVerified = await verifyInitialLoad("inmemory-simple-reaction", "products-query", 5);
    expect(initialLoadVerified).toBe(true);

    console.log("Simple query initial sync pipeline verified.");
  }, 60000);

  test("Initial state sync - Join query", async () => {
    console.log("Verifying initial state sync for products with category query...");

    // Get current state from SignalR
    const queryData = await signalrFixture.requestReload("products-with-category-query");
    
    // Should have 5 products with their categories
    expect(queryData).toHaveLength(5);
    
    // Verify join data is correct
    const firstProduct = queryData.find(item => item.product_id === 1);
    expect(firstProduct).toBeDefined();
    expect(firstProduct.product_name).toBe("Laptop Pro");
    expect(firstProduct.category_name).toBe("Electronics");

    // Verify embeddings were generated
    const embeddingsCreated = await verifyEmbeddingCreation("inmemory-join-reaction", 5);
    expect(embeddingsCreated).toBe(true);

    console.log("Join query initial sync verified.");
  }, 60000);

  test("Insert operations - Single row", async () => {
    console.log("Testing single row insert...");
    
    // Set up change listener
    const insertPromise = signalrFixture.waitForChange("products-query",
      change => change.op === "i" && change.payload.after.id === 101
    );

    // Insert new product
    await dbClient.query(
      "INSERT INTO products (id, name, description, category_id) VALUES ($1, $2, $3, $4)",
      [101, "Test Product", "A test product for e2e testing", 1]
    );

    // Wait for change to propagate
    const result = await insertPromise;
    expect(result).toBeTruthy();
    
    // Verify new total count
    const queryData = await signalrFixture.requestReload("products-query");
    expect(queryData).toHaveLength(6);
    
    // Verify the new product exists
    const newProduct = queryData.find(item => item.id === 101);
    expect(newProduct).toBeDefined();
    expect(newProduct.name).toBe("Test Product");

    console.log("Single row insert verified.");
  }, 30000);

  test("Insert operations - Multiple rows", async () => {
    console.log("Testing multiple row insert...");
    
    // Insert 5 products at once
    const insertQuery = `
      INSERT INTO products (id, name, description, category_id) VALUES 
      (102, 'Bulk Product 1', 'Bulk test product 1', 2),
      (103, 'Bulk Product 2', 'Bulk test product 2', 2),
      (104, 'Bulk Product 3', 'Bulk test product 3', 3),
      (105, 'Bulk Product 4', 'Bulk test product 4', 3),
      (106, 'Bulk Product 5', 'Bulk test product 5', 1)
    `;
    
    await dbClient.query(insertQuery);
    
    // Wait for propagation
    await waitFor({
      actionFn: async () => {
        const data = await signalrFixture.requestReload("products-query");
        return data.filter(item => item.id >= 102 && item.id <= 106).length;
      },
      predicateFn: (count) => count === 5,
      description: "5 bulk inserted products to appear",
      timeoutMs: 20000,
      pollIntervalMs: 2000
    });

    // Verify all products are present
    const queryData = await signalrFixture.requestReload("products-query");
    expect(queryData.length).toBeGreaterThanOrEqual(11); // 5 initial + 1 from previous test + 5 bulk
    
    const bulkProducts = queryData.filter(item => item.id >= 102 && item.id <= 106);
    expect(bulkProducts).toHaveLength(5);

    console.log("Multiple row insert verified.");
  }, 30000);

  test("Update operations - Simple update", async () => {
    console.log("Testing update operation...");
    
    // Set up change listener for update
    const updatePromise = signalrFixture.waitForChange("products-query",
      change => change.op === "u" &&
               change.payload.after.id === 101 &&
               change.payload.after.description === "Updated test product description"
    );

    // Update product description
    await dbClient.query(
      "UPDATE products SET description = $1 WHERE id = $2",
      ["Updated test product description", 101]
    );

    // Wait for change to propagate
    const result = await updatePromise;
    expect(result).toBeTruthy();
    
    // Add a small delay to ensure the update has been processed
    await new Promise(r => setTimeout(r, 2000));
    
    // Verify the update
    const queryData = await signalrFixture.requestReload("products-query");
    console.log(`Query data after update: ${JSON.stringify(queryData)}`);
    const updatedProduct = queryData.find(item => item.id === 101);
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.description).toBe("Updated test product description");

    console.log("Update operation verified.");
  }, 30000);

  test("Update operations - Join query cascade", async () => {
    console.log("Testing update cascade in join query...");
    
    // Update category name
    const updatePromise = signalrFixture.waitForChange("products-with-category-query",
      change => change.op === "u" &&
               change.payload.after.category_name === "Updated Electronics"
    );

    await dbClient.query(
      "UPDATE categories SET name = $1 WHERE id = $2",
      ["Updated Electronics", 1]
    );

    // Wait for changes to cascade
    await updatePromise;
    
    // Add delay to ensure update has been processed
    await new Promise(r => setTimeout(r, 2000));
    
    // Verify all products in category 1 show updated category name
    const queryData = await signalrFixture.requestReload("products-with-category-query");
    console.log(`Join query data after category update: ${JSON.stringify(queryData)}`);
    
    // Filter for products that should have category 1 (Electronics)
    const electronicsProducts = queryData.filter(item => 
      item.product_id === 1 || item.product_id === 2 || item.product_id === 106
    );
    
    electronicsProducts.forEach(product => {
      expect(product.category_name).toBe("Updated Electronics");
    });

    console.log("Join query cascade update verified.");
  }, 30000);

  test("Delete operations - Single row", async () => {
    console.log("Testing single row delete...");
    
    // Set up change listener for delete
    const deletePromise = signalrFixture.waitForChange("products-query",
      change => change.op === "d" && change.payload.before.id === 106
    );

    // Delete a product
    await dbClient.query("DELETE FROM products WHERE id = $1", [106]);

    // Wait for delete to propagate
    const result = await deletePromise;
    expect(result).toBeTruthy();
    
    // Verify product is gone from query state
    const queryData = await signalrFixture.requestReload("products-query");
    const deletedProduct = queryData.find(item => item.id === 106);
    expect(deletedProduct).toBeUndefined();

    // Verify deletion was processed (via logs)
    const deletionProcessed = await verifyDocumentDeletion("inmemory-simple-reaction", "products-query", 1);
    expect(deletionProcessed).toBe(true);

    console.log("Single row delete pipeline verified.");
  }, 30000);

  test("Delete operations - Cascade delete in join", async () => {
    console.log("Testing cascade delete in join query...");
    
    // Delete a category (category 2 - Books)
    // This should remove all books from the join query results
    const deletePromise = signalrFixture.waitForChange("products-with-category-query",
      change => change.op === "d" && change.payload.before.category_name === "Books"
    );

    await dbClient.query("DELETE FROM categories WHERE id = $1", [2]);

    // Wait for cascading changes
    await deletePromise;
    
    // Add delay to ensure delete has been processed
    await new Promise(r => setTimeout(r, 2000));
    
    // Verify no products with Books category exist in join results
    const queryData = await signalrFixture.requestReload("products-with-category-query");
    console.log(`Join query data after category delete: ${JSON.stringify(queryData)}`);
    const bookProducts = queryData.filter(item => item.category_name === "Books");
    expect(bookProducts).toHaveLength(0);

    // Products should still exist in simple query
    const simpleQueryData = await signalrFixture.requestReload("products-query");
    const booksInSimple = simpleQueryData.filter(item => item.category_id === 2);
    expect(booksInSimple.length).toBeGreaterThan(0);

    console.log("Cascade delete in join verified.");
  }, 30000);

  test("Cleanup test data", async () => {
    console.log("Cleaning up test data...");
    
    // Clean up test data (IDs > 100)
    await dbClient.query("DELETE FROM products WHERE id > 100");
    
    // Reset category name
    await dbClient.query("UPDATE categories SET name = 'Electronics' WHERE id = 1");
    
    // Wait for cleanup to propagate
    await waitFor({ 
      timeout: 5000, 
      description: "cleanup to propagate" 
    });

    console.log("Test data cleaned up.");
  }, 30000);
});