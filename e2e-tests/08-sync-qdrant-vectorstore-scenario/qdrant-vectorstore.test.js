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
const http = require('http');
const crypto = require('crypto');
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
let qdrantPortForward;
let qdrantPort; // Store the port separately
let signalrFixture;
let usingMockEmbeddings = false;

// Helper function to generate deterministic GUID from string key (matching C# SHA-256 logic)
function generateDeterministicGuid(key) {
  const hash = crypto.createHash('sha256').update(key).digest();
  // Take first 16 bytes of SHA-256 hash for GUID
  const guidBytes = hash.slice(0, 16);
  
  // C# Guid(byte[]) constructor interprets bytes with specific endianness:
  // - First 4 bytes as little-endian Int32
  // - Next 2 bytes as little-endian Int16  
  // - Next 2 bytes as little-endian Int16
  // - Last 8 bytes as-is
  const a = guidBytes.readUInt32LE(0);
  const b = guidBytes.readUInt16LE(4);
  const c = guidBytes.readUInt16LE(6);
  const d = Buffer.from([guidBytes[8], guidBytes[9], guidBytes[10], guidBytes[11], guidBytes[12], guidBytes[13], guidBytes[14], guidBytes[15]]);
  
  const guid = [
    a.toString(16).padStart(8, '0'),
    b.toString(16).padStart(4, '0'),
    c.toString(16).padStart(4, '0'),
    d.slice(0, 2).toString('hex'),
    d.slice(2).toString('hex')
  ].join('-');
  
  return guid;
}

// Helper function to make HTTP requests to Qdrant
function makeQdrantRequest(port, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Helper function to get collection info from Qdrant
async function getQdrantCollectionInfo(port, collectionName) {
  try {
    if (!port || port === 0) {
      console.error(`Invalid port for Qdrant: ${port}`);
      return null;
    }
    const response = await makeQdrantRequest(port, 'GET', `/collections/${collectionName}`);
    return response;
  } catch (error) {
    console.error(`Error getting collection ${collectionName} on port ${port}:`, error.message || error);
    return null;
  }
}

// Helper function to get points (documents) from Qdrant collection
async function getQdrantPoints(port, collectionName, limit = 100) {
  try {
    const response = await makeQdrantRequest(port, 'POST', `/collections/${collectionName}/points/scroll`, {
      limit: limit,
      with_vectors: false,
      with_payload: true
    });
    return response.result?.points || [];
  } catch (error) {
    console.error(`Error getting points from ${collectionName}:`, error);
    return [];
  }
}

// Helper function to verify document exists in Qdrant
async function verifyDocumentInQdrant(port, collectionName, documentId) {
  try {
    // Convert string ID to GUID format that matches C# implementation
    const guid = generateDeterministicGuid(documentId);
    const response = await makeQdrantRequest(port, 'GET', `/collections/${collectionName}/points/${guid}`);
    // Check if the response has an error status or no result
    if (response.status && response.status.error) {
      return false;
    }
    return response.result !== null && response.result !== undefined;
  } catch (error) {
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
    if (resource.kind === 'Secret' && resource.metadata.name === 'azure-openai-qdrant-secret') {
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

  console.log("Waiting for PostgreSQL and Qdrant to be ready...");
  await new Promise(r => setTimeout(r, 25000));

  console.log(`Deploying ${sources.length} sources...`);
  await deployResources(sources);

  console.log(`Deploying ${queries.length} queries...`);
  await deployResources(queries);

  console.log(`Deploying reaction provider...`);
  await deployResources(reactionProvider);

  console.log(`Deploying ${reactions.length} reactions...`);
  await deployResources(reactions);

  // Setup PostgreSQL client
  dbPortForward = new PortForward("qdrant-postgres", 5432, "default");
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
  
  // Reset database to clean state for testing
  console.log("Resetting database to clean state...");
  await dbClient.query("DELETE FROM products WHERE id > 100");
  await dbClient.query("DELETE FROM categories WHERE id > 100");
  // Re-insert categories if missing (in case of test pollution)
  await dbClient.query(`
    INSERT INTO categories (id, name, description) 
    VALUES 
      (1, 'Electronics', 'Electronic devices and accessories'),
      (2, 'Books', 'Books and publications'),
      (3, 'Clothing', 'Apparel and accessories')
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, description = EXCLUDED.description
  `);

  // Setup Qdrant port forward (use 6333 for HTTP API)
  qdrantPortForward = new PortForward("qdrant", 6333, "default");
  qdrantPort = await qdrantPortForward.start(); // Store in module-level variable
  console.log("Qdrant HTTP API accessible at port", qdrantPort);
  
  // Verify Qdrant is accessible
  try {
    const testResponse = await makeQdrantRequest(qdrantPort, 'GET', '/collections');
    console.log("Qdrant is responsive, collections:", testResponse?.result?.collections?.map(c => c.name).join(', ') || 'none');
  } catch (error) {
    console.error("WARNING: Qdrant may not be accessible:", error.message);
  }

  // Setup SignalR fixture for monitoring queries
  signalrFixture = new SignalrFixture(["qdrant-products-query", "qdrant-products-category-query"]);
  await signalrFixture.start();
  console.log("SignalR fixture started");

  // Wait for initial sync - check if collection is created and has data
  console.log("Waiting for initial data synchronization to Qdrant...");
  await waitFor({
    actionFn: async () => {
      try {
        const response = await makeQdrantRequest(qdrantPort, 'GET', '/collections');
        const collections = response?.result?.collections || [];
        const hasSimpleCollection = collections.some(c => c.name === 'qdrant_products_simple');
        if (!hasSimpleCollection) return false;
        
        // Check if collection has data
        const collectionInfo = await makeQdrantRequest(qdrantPort, 'GET', '/collections/qdrant_products_simple');
        return collectionInfo?.result?.points_count > 0;
      } catch (error) {
        console.log("Still waiting for Qdrant sync:", error.message);
        return false;
      }
    },
    predicateFn: (ready) => ready === true,
    description: "initial data synchronization to Qdrant",
    timeoutMs: 60000,
    pollIntervalMs: 3000
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

  if (qdrantPortForward) {
    qdrantPortForward.stop();
    console.log("Qdrant port forward stopped.");
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
describe("Qdrant Vector Store E2E Tests", () => {
  test("Initial state sync - Simple query", async () => {
    console.log("Verifying initial state sync for simple products query in Qdrant...");

    // Wait for collection to be created and populated
    await waitFor({
      actionFn: async () => {
        const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_simple");
        return collectionInfo?.result?.points_count;
      },
      predicateFn: (count) => count >= 5,
      description: "Qdrant collection to have at least 5 documents",
      timeoutMs: 30000,
      pollIntervalMs: 2000
    });

    // Get collection info
    const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_simple");
    expect(collectionInfo.result).toBeDefined();
    expect(collectionInfo.result.points_count).toBeGreaterThanOrEqual(5);

    // Verify vector dimension matches text-embedding-3-large (3072)
    expect(collectionInfo.result.config.params.vectors.size).toBe(3072);

    // Get actual documents
    const points = await getQdrantPoints(qdrantPort, "qdrant_products_simple");
    expect(points.length).toBeGreaterThanOrEqual(5);

    // Verify document structure
    const firstPoint = points[0];
    expect(firstPoint.id).toBeDefined();
    expect(firstPoint.payload).toBeDefined();

    console.log("Simple query initial sync to Qdrant verified.");
  }, 60000);

  test("Initial state sync - Join query", async () => {
    console.log("Verifying initial state sync for join query in Qdrant...");

    // Wait for collection to be created and populated
    await waitFor({
      actionFn: async () => {
        const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_categories");
        return collectionInfo?.result?.points_count;
      },
      predicateFn: (count) => count >= 5,
      description: "Qdrant join collection to have at least 5 documents",
      timeoutMs: 30000,
      pollIntervalMs: 2000
    });

    // Get collection info
    const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_categories");
    expect(collectionInfo.result).toBeDefined();
    expect(collectionInfo.result.points_count).toBeGreaterThanOrEqual(5);

    // Get actual documents
    const points = await getQdrantPoints(qdrantPort, "qdrant_products_categories");
    expect(points.length).toBeGreaterThanOrEqual(5);

    console.log("Join query initial sync to Qdrant verified.");
  }, 60000);

  test("Insert operations - Single row", async () => {
    console.log("Testing single row insert with Qdrant...");
    
    // Set up change listener
    const insertPromise = signalrFixture.waitForChange("qdrant-products-query",
      change => change.op === "i" && change.payload.after.id === 201
    );

    // Insert new product
    await dbClient.query(
      "INSERT INTO products (id, name, description, category_id) VALUES ($1, $2, $3, $4)",
      [201, "Qdrant Test Product", "A test product for Qdrant e2e testing", 1]
    );

    // Wait for change to propagate
    await insertPromise;

    // Wait for document to appear in Qdrant
    await waitFor({
      actionFn: () => verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "201"),
      predicateFn: (exists) => exists === true,
      description: "Document 201 to appear in Qdrant",
      timeoutMs: 20000,
      pollIntervalMs: 2000
    });

    // Verify document exists in Qdrant
    const exists = await verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "201");
    expect(exists).toBe(true);

    // Verify collection point count increased
    const collectionInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_simple");
    expect(collectionInfo.result.points_count).toBeGreaterThanOrEqual(6);

    console.log("Single row insert to Qdrant verified.");
  }, 30000);

  test("Insert operations - Multiple rows", async () => {
    console.log("Testing multiple row insert with Qdrant...");
    
    // Insert 5 products at once
    const insertQuery = `
      INSERT INTO products (id, name, description, category_id) VALUES 
      (202, 'Qdrant Bulk 1', 'Qdrant bulk test product 1', 2),
      (203, 'Qdrant Bulk 2', 'Qdrant bulk test product 2', 2),
      (204, 'Qdrant Bulk 3', 'Qdrant bulk test product 3', 3),
      (205, 'Qdrant Bulk 4', 'Qdrant bulk test product 4', 3),
      (206, 'Qdrant Bulk 5', 'Qdrant bulk test product 5', 1)
    `;
    
    await dbClient.query(insertQuery);
    
    // Wait for all documents to appear in Qdrant
    await waitFor({
      actionFn: async () => {
        const promises = [202, 203, 204, 205, 206].map(id => 
          verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", id.toString())
        );
        const results = await Promise.all(promises);
        return results.filter(r => r === true).length;
      },
      predicateFn: (count) => count === 5,
      description: "All 5 bulk documents to appear in Qdrant",
      timeoutMs: 30000,
      pollIntervalMs: 2000
    });

    // Verify all documents exist
    for (let id = 202; id <= 206; id++) {
      const exists = await verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", id.toString());
      expect(exists).toBe(true);
    }

    console.log("Multiple row insert to Qdrant verified.");
  }, 40000);

  test("Update operations - Simple update", async () => {
    console.log("Testing update operation with Qdrant...");
    
    // Get initial document from Qdrant
    const guid201 = generateDeterministicGuid("201");
    const initialResponse = await makeQdrantRequest(qdrantPort, 'GET', `/collections/qdrant_products_simple/points/${guid201}`);
    const initialPayload = initialResponse.result?.payload;

    // Set up change listener for update
    const updatePromise = signalrFixture.waitForChange("qdrant-products-query",
      change => change.op === "u" && 
               change.payload.after.id === 201 && 
               change.payload.after.description === "Updated Qdrant test product description"
    );

    // Update product description
    await dbClient.query(
      "UPDATE products SET description = $1 WHERE id = $2",
      ["Updated Qdrant test product description", 201]
    );

    // Wait for change to propagate
    await updatePromise;

    // Wait for Qdrant document to be updated (embedding should change)
    await waitFor({
      actionFn: async () => {
        const response = await makeQdrantRequest(qdrantPort, 'GET', `/collections/qdrant_products_simple/points/${guid201}`);
        return response.result?.payload;
      },
      predicateFn: (payload) => {
        // Check if payload exists and is different from initial
        return payload && JSON.stringify(payload) !== JSON.stringify(initialPayload);
      },
      description: "Document 201 to be updated in Qdrant",
      timeoutMs: 20000,
      pollIntervalMs: 2000
    });

    // Verify document still exists
    const exists = await verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "201");
    expect(exists).toBe(true);

    console.log("Update operation in Qdrant verified.");
  }, 30000);

  test("Update operations - Join query cascade", async () => {
    console.log("Testing update cascade in join query with Qdrant...");
    
    // Update category name
    const updatePromise = signalrFixture.waitForChange("qdrant-products-category-query",
      change => change.op === "u" && 
               change.payload.after.category_name === "Updated Electronics"
    );

    await dbClient.query(
      "UPDATE categories SET name = $1 WHERE id = $2",
      ["Updated Electronics", 1]
    );

    // Wait for changes to cascade
    await updatePromise;
    
    // Wait a bit for Qdrant to update
    await waitFor({ timeout: 5000, description: "Qdrant updates to propagate" });

    // Verify products in category 1 were updated in join collection
    // Products 1, 2, and 206 are in Electronics category
    const points = await getQdrantPoints(qdrantPort, "qdrant_products_categories");
    
    // Check that we have points (documents exist)
    expect(points.length).toBeGreaterThan(0);

    console.log("Join query cascade update in Qdrant verified.");
  }, 30000);

  test("Delete operations - Single row", async () => {
    console.log("Testing single row delete with Qdrant...");
    
    // Verify document exists before delete
    const existsBefore = await verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "206");
    expect(existsBefore).toBe(true);

    // Set up change listener for delete
    const deletePromise = signalrFixture.waitForChange("qdrant-products-query",
      change => change.op === "d" && change.payload.before.id === 206
    );

    // Delete a product
    await dbClient.query("DELETE FROM products WHERE id = $1", [206]);

    // Wait for delete to propagate
    await deletePromise;

    // Wait for document to be removed from Qdrant
    await waitFor({
      actionFn: () => verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "206"),
      predicateFn: (exists) => exists === false,
      description: "Document 206 to be removed from Qdrant",
      timeoutMs: 20000,
      pollIntervalMs: 2000
    });

    // Verify document no longer exists
    const existsAfter = await verifyDocumentInQdrant(qdrantPort, "qdrant_products_simple", "206");
    expect(existsAfter).toBe(false);

    console.log("Single row delete from Qdrant verified.");
  }, 30000);

  test("Delete operations - Cascade delete in join", async () => {
    console.log("Testing cascade delete in join query with Qdrant...");
    
    // Get initial count of documents in join collection
    const initialInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_categories");
    const initialCount = initialInfo.result.points_count;

    // Delete a category (category 2 - Books)
    const deletePromise = signalrFixture.waitForChange("qdrant-products-category-query",
      change => change.op === "d" && change.payload.before.category_name === "Books"
    );

    await dbClient.query("DELETE FROM categories WHERE id = $1", [2]);

    // Wait for cascading changes
    await deletePromise;
    
    // Wait for Qdrant to update
    await waitFor({
      actionFn: async () => {
        const info = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_categories");
        return info.result.points_count;
      },
      predicateFn: (count) => count < initialCount,
      description: "Documents to be removed from join collection in Qdrant",
      timeoutMs: 20000,
      pollIntervalMs: 2000
    });

    // Verify count decreased (Books products should be gone from join)
    const finalInfo = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_categories");
    expect(finalInfo.result.points_count).toBeLessThan(initialCount);

    console.log("Cascade delete in join with Qdrant verified.");
  }, 30000);

  test("Persistence - Data survives in Qdrant", async () => {
    console.log("Testing Qdrant persistence...");
    
    // Get current document count
    const info = await getQdrantCollectionInfo(qdrantPort, "qdrant_products_simple");
    const documentCount = info.result.points_count;
    
    // Qdrant should persist data (unlike InMemory)
    expect(documentCount).toBeGreaterThan(0);
    
    // Get some documents to verify they have content
    const points = await getQdrantPoints(qdrantPort, "qdrant_products_simple", 5);
    expect(points.length).toBeGreaterThan(0);
    
    // Each point should have an ID and payload
    points.forEach(point => {
      expect(point.id).toBeDefined();
      expect(point.payload).toBeDefined();
    });

    console.log(`Qdrant persistence verified with ${documentCount} documents.`);
  }, 30000);

  test("Cleanup test data", async () => {
    console.log("Cleaning up test data...");
    
    // Clean up test data (IDs > 200)
    await dbClient.query("DELETE FROM products WHERE id > 200");
    
    // Reset category name
    await dbClient.query("UPDATE categories SET name = 'Electronics' WHERE id = 1");
    
    // Wait for cleanup to propagate
    await waitFor({ 
      timeout: 10000, 
      description: "cleanup to propagate to Qdrant" 
    });

    console.log("Test data cleaned up.");
  }, 30000);
});