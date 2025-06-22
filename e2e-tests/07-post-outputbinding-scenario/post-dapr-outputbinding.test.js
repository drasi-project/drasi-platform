/**
 * Copyright 2024 The Drasi Authors.
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
const redis = require("redis");
const PortForward = require("../fixtures/port-forward");
const { waitFor } = require('../fixtures/infrastructure'); // Corrected import path

// Define paths to your resource files
const resourcesFilePath = __dirname + '/resources.yaml';
const reactionProviderFilePath = __dirname + '/reaction-provider.yaml';
const sourcesFilePath = __dirname + '/sources.yaml';
const queriesFilePath = __dirname + '/queries.yaml';
const reactionsFilePath = __dirname + '/reactions.yaml';

let resourcesToCleanup = [];

let dbPortForward;
let dbClient;

let productRedisPortForward, inventoryRedisPortForward;
let productRedisClient, inventoryRedisClient;

// Function to get state from Redis Hash
// Attempts to parse the value as JSON, but returns raw value if parsing fails
async function getStateFromRedis(redisClient, key) {
  try {
    if (!redisClient || !redisClient.isOpen) {
      console.error(`Redis client for key "${key}" is not open or not initialized.`);
      return null;
    }
    console.log(`Attempting to get state for key "${key}" from Redis...`);

    let rawValue = await redisClient.hGet(key, "data");

    if (rawValue !== null) {
      console.log(`Raw value for key "${key}" (from HGET key "data"): ${rawValue}`);
    } else {
      console.log(`Key "${key}" not found or has no parsable data in Redis.`);
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (e) {
      console.error(`Failed to parse Redis value for key "${key}":`, rawValue, e);
      return rawValue;
    }
  } catch (error) {
      console.error(`Error during getStateFromRedis for key "${key}":`, error.message, error.stack);
    return null;
  }
}

beforeAll(async () => {
  // Load resources from resources.yaml
  const infraResources = yaml.loadAll(fs.readFileSync(resourcesFilePath, 'utf8'));
  // Load the reaction-provider
  const reactionProviderResources = yaml.loadAll(fs.readFileSync(reactionProviderFilePath, 'utf8'));
  // Load Drasi source
  const sources = yaml.loadAll(fs.readFileSync(sourcesFilePath, 'utf8'));
  // Load Drasi Query
  const queries = yaml.loadAll(fs.readFileSync(queriesFilePath, 'utf8'));
  // Load Drasi Reactions
  const reactions = yaml.loadAll(fs.readFileSync(reactionsFilePath, 'utf8'));

  // Combine all resources to be deployed
  resourcesToCleanup = [...infraResources, ...reactionProviderResources, ...sources, ...queries, ...reactions];

  console.log(`Deploying ${infraResources.length} infra resources...`);
  await deployResources(infraResources);

  console.log("Waiting for infra resources to initialize...");
  await new Promise(r => setTimeout(r, 30000));

  console.log(`Deploying ${sources.length} sources...`);
  await deployResources(sources);

  console.log(`Deploying ${queries.length} queries...`);
  await deployResources(queries);

  console.log(`Deploying PostOutputBinding reaction provider...`)
  await deployResources(reactionProviderResources);

  console.log(`Deploying ${reactions.length} reactions...`);
  await deployResources(reactions);

  // Setup PostgreSQL client
  dbPortForward = new PortForward("product-inventory-db", 5432, "default");
  const dbPort = await dbPortForward.start();
  dbClient = new pg.Client({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: dbPort,
    database: "productdb",
  });
  await dbClient.connect();
  console.log("Connected to PostgreSQL, with port forwarded at", dbPort);

  // Setup Redis clients
  productRedisPortForward = new PortForward("redis-product", 6379, "default");
  const productRedisPort = await productRedisPortForward.start();
  productRedisClient = redis.createClient({ url: `redis://localhost:${productRedisPort}` });
  await productRedisClient.connect();
  console.log("Connected to Product Redis, with port forwarded at", productRedisPort);

  inventoryRedisPortForward = new PortForward("redis-inventory", 6379, "default");
  const inventoryRedisPort = await inventoryRedisPortForward.start();
  inventoryRedisClient = redis.createClient({ url: `redis://localhost:${inventoryRedisPort}` });
  await inventoryRedisClient.connect();
  console.log("Connected to Inventory Redis, with port forwarded at", inventoryRedisPort);

  await waitFor({ timeout: 15000, description: "initial propagation after setup" })
 
  console.log("Setup complete.");
}, 480000);

afterAll(async () => {
  if (dbClient) {
    await dbClient.end();
    console.log("PostgreSQL client disconnected.");
  }

  if (dbPortForward) {
    dbPortForward.stop();
    console.log("PostgreSQL port forward stopped.");
  }

  if (productRedisClient) {
    await productRedisClient.quit();
    console.log("Product Redis client disconnected.");
  }
  if (productRedisPortForward) {
    productRedisPortForward.stop();
    console.log("Product Redis port forward stopped.");
  }

  if (inventoryRedisClient) {
    await inventoryRedisClient.quit();
    console.log("Inventory Redis client disconnected.");
  }
  if (inventoryRedisPortForward) {
    inventoryRedisPortForward.stop();
    console.log("Inventory Redis port forward stopped.");
  }

  if (resourcesToCleanup.length > 0) {
    console.log(`Deleting ${resourcesToCleanup.length} resources...`);
    //await deleteResources(resourcesToCleanup);
    console.log("Teardown complete.");
  }
});

describe("Dapr OutputBinding Reaction Test Suite", () => {
  test("UNPACKED: should sync the initial state to Dapr statestore with create", async () => {
    console.log("Verifying initial state sync for Product data...");
    const newProductName = `Test Unpacked Packed ${Date.now()}`;
      const newProductPrice = 99.99;
      await dbClient.query(
          "INSERT INTO product (name, description, price) VALUES ($1, 'Unpacked Test Desc', $2)",
          [newProductName, newProductPrice]
    );

    const receivedMessage = await waitFor({
      actionFn: () => productRedisClient.get('product'),
      predicateFn: (messages) => messages && messages.length >= 1,
      timeoutMs: 10000,
      pollIntervalMs: 1000,
      description: `unpacked message for product "${newProductName}" to appear in Redis`
    });
    // 1. Verify Product Data (product-statestore)
    expect(receivedMessage).toBeDefined();
    // JSON Stringify the keys to log them
    console.log("Received keys from Redis:", JSON.stringify(receivedMessage));
    expect(receivedMessage).toBeDefined();

    const cloudEvent = receivedMessage;
    expect(cloudEvent).toBeDefined();

    const drasiPackedEvent = cloudEvent.data; 
    expect(drasiPackedEvent).toBeDefined();

    expect(drasiPackedEvent.queryId).toBe('product-updates-unpacked');
    expect(drasiPackedEvent.sourceTimeMs).toBeGreaterThan(0); 
    expect(drasiPackedEvent.sequence).toBeGreaterThanOrEqual(0); 

    expect(drasiPackedEvent.addedResults).toBeInstanceOf(Array);
    expect(drasiPackedEvent.addedResults.length).toBe(1);
    expect(drasiPackedEvent.updatedResults).toBeInstanceOf(Array);
    expect(drasiPackedEvent.updatedResults.length).toBe(0);
    expect(drasiPackedEvent.deletedResults).toBeInstanceOf(Array);
    expect(drasiPackedEvent.deletedResults.length).toBe(0);

    const addedItem = drasiPackedEvent.addedResults[0];
    expect(addedItem).toBeDefined();
        
    expect(addedItem.product_id).toBeDefined(); 
    expect(addedItem.name).toBe(newProductName); 
    expect(parseFloat(addedItem.price)).toBe(newProductPrice);

        // Ensure no 'op' or 'payload' fields from the unpacked format are present at this level
    expect(drasiPackedEvent.op).toBeUndefined();
    expect(drasiPackedEvent.payload).toBeUndefined();
  });
});