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

async function waitForPropagation(duration = 10000) { // Default 10 seconds
  console.log(`Waiting ${duration / 1000}s for propagation...`);
  return new Promise(resolve => setTimeout(resolve, duration));
}

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

  console.log(`Deploying SyncDaprStateStore reaction provider...`)
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

  await waitForPropagation();
 
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
    await deleteResources(resourcesToCleanup);
    console.log("Teardown complete.");
  }
});

describe("Sync Dapr Statestore Reaction Test Suite", () => {
  test("INITIAL: should sync the initial state to Dapr statestores", async () => {
    console.log("Verifying initial state sync for Product data...");

    // 1. Verify Product Data (product-statestore)
    const productKeys = await productRedisClient.keys('*');
    // Expect 3 product entries + 1 checkpoint key
    expect(productKeys.length).toBe(4); 
    expect(productKeys).toContain('_drasi-sync-statestore-reaction_sync_point__product-query');

    const expectedProducts = [
      { 
        key: "1", 
        data: { product_id: 1, name: 'SuperWidget', description: 'An amazing widget with all the features.' } 
      },
      { 
        key: "2", 
        data: { product_id: 2, name: 'MegaGadget', description: 'The biggest gadget you have ever seen.' } 
      },
      { 
        key: "3", 
        data: { product_id: 3, name: 'TinyThing', description: 'A small but powerful thing.' } 
      },
    ];

    for (const expectedProduct of expectedProducts) {
      const state = await getStateFromRedis(productRedisClient, expectedProduct.key);
      expect(state).not.toBeNull();
      expect(state.product_id).toEqual(expectedProduct.data.product_id);
      expect(state.product_name).toEqual(expectedProduct.data.name);
      expect(state.product_description).toEqual(expectedProduct.data.description);
    }
    console.log("Product data verification successful.");

    // 2. Verify Inventory Data (inventory-statestore)
    console.log("Verifying initial state sync for Inventory data...");
    const inventoryKeys = await inventoryRedisClient.keys('*');
    // Expect 4 inventory entries + 1 checkpoint key
    expect(inventoryKeys.length).toBe(5);
    expect(inventoryKeys).toContain('_drasi-sync-statestore-reaction_sync_point__inventory-query');

    // Based on resources.yaml and assuming SERIAL starts at 1 for inventory_id
    // and the query joins product details
    const expectedInventory = [
      { 
        key: "1", // inventory_id
        data: { 
          inventory_id: 1, 
          product_id: 1, // SuperWidget
          product_quantity: 100, 
          product_location: 'Warehouse A',
          product_name: 'SuperWidget',
          product_description: 'An amazing widget with all the features.'
        } 
      },
      { 
        key: "2", // inventory_id
        data: { 
          inventory_id: 2, 
          product_id: 2, // MegaGadget
          product_quantity: 50, 
          product_location: 'Warehouse B',
          product_name: 'MegaGadget',
          product_description: 'The biggest gadget you have ever seen.'
        } 
      },
      { 
        key: "3", // inventory_id
        data: { 
          inventory_id: 3, 
          product_id: 3, // TinyThing
          product_quantity: 200, 
          product_location: 'Warehouse A',
          product_name: 'TinyThing',
          product_description: 'A small but powerful thing.'
        } 
      },
      { 
        key: "4", // inventory_id
        data: { 
          inventory_id: 4, 
          product_id: 1, // SuperWidget
          product_quantity: 75, 
          product_location: 'Warehouse C',
          product_name: 'SuperWidget',
          product_description: 'An amazing widget with all the features.'
        } 
      },
    ];

    for (const expectedItem of expectedInventory) {
      const state = await getStateFromRedis(inventoryRedisClient, expectedItem.key);
      expect(state).not.toBeNull();
      expect(state.inventory_id).toEqual(expectedItem.data.inventory_id);
      expect(state.product_id).toEqual(expectedItem.data.product_id);
      expect(state.product_quantity).toEqual(expectedItem.data.product_quantity);
      expect(state.product_location).toEqual(expectedItem.data.product_location);
      expect(state.product_name).toEqual(expectedItem.data.product_name);
      expect(state.product_description).toEqual(expectedItem.data.product_description);
    }
    console.log("Inventory data verification successful.");
    console.log("Initial state synced and verified successfully.");
  });

  test("ADD: should sync a new product and then its inventory", async () => {
    console.log("Testing ADD operations...");
    const newProductId = 4;
    const newProductName = "NewProduct";
    const newProductDesc = "A brand new test product.";

    // 1. Add a new product (with no inventory)
    await dbClient.query(
      "INSERT INTO product (product_id, name, description) VALUES ($1, $2, $3)",
      [newProductId, newProductName, newProductDesc]
    );
    console.log(`Added product ${newProductId} - ${newProductName}. Waiting for propagation...`);
    await waitForPropagation();

    // Verify product in product-statestore
    let productState = await getStateFromRedis(productRedisClient, String(newProductId));
    expect(productState).not.toBeNull();
    expect(productState.product_id).toEqual(newProductId);
    expect(productState.product_name).toEqual(newProductName);
    expect(productState.product_description).toEqual(newProductDesc);
    console.log(`Product ${newProductId} verified in product-statestore.`);

    // Since we only added a product, the inventory should remain unchanged
    const inventoryKeys = await inventoryRedisClient.keys('*');
    expect(inventoryKeys.length)
      .withContext("Inventory keys count after adding new product should remain unchanged")
      .toBe(5);

    // 2. Add inventory for the new product
    const newInventoryId = 5;
    const newInventoryQuantity = 10;
    const newInventoryLocation = "Warehouse Z";
    await dbClient.query(
      "INSERT INTO inventory (inventory_id, product_id, quantity, location) VALUES ($1, $2, $3, $4)",
      [newInventoryId, newProductId, newInventoryQuantity, newInventoryLocation]
    );
    console.log(`Added inventory ${newInventoryId} for product ${newProductId}. Waiting for propagation...`);
    await waitForPropagation();

    // Verify inventory in inventory-statestore
    let inventoryState = await getStateFromRedis(inventoryRedisClient, String(newInventoryId));
    expect(inventoryState).not.toBeNull();
    expect(inventoryState.inventory_id).toEqual(newInventoryId);
    expect(inventoryState.product_id).toEqual(newProductId);
    expect(inventoryState.product_quantity).toEqual(newInventoryQuantity);
    expect(inventoryState.product_location).toEqual(newInventoryLocation);
    expect(inventoryState.product_name).toEqual(newProductName); // From join
    expect(inventoryState.product_description).toEqual(newProductDesc); // From join
    console.log(`Inventory ${newInventoryId} for product ${newProductId} verified in inventory-statestore.`);
  }, 30000);

  test("UPDATE: should sync product updates to both statestores", async () => {
    console.log("Testing UPDATE operations...");
    const productIdToUpdate = 1; // SuperWidget
    const originalProductName = "SuperWidget";
    const updatedProductDesc = "An amazingly updated SuperWidget with even more features!";

    await dbClient.query(
      "UPDATE product SET description = $1 WHERE product_id = $2",
      [updatedProductDesc, productIdToUpdate]
    );
    console.log(`Updated product ${productIdToUpdate} description. Waiting for propagation...`);
    await waitForPropagation();

    // Verify updated product in product-statestore
    let productState = await getStateFromRedis(productRedisClient, String(productIdToUpdate));
    expect(productState).not.toBeNull();
    expect(productState.product_id).toEqual(productIdToUpdate);
    expect(productState.product_name).toEqual(originalProductName); // Name shouldn't change
    expect(productState.product_description).toEqual(updatedProductDesc);
    console.log(`Product ${productIdToUpdate} update verified in product-statestore.`);

    // Verify update in related inventory items in inventory-statestore
    // Inventory items for product_id = 1 are inventory_id = 1 and 4
    const relatedInventoryIds = ["1", "4"];
    for (const invId of relatedInventoryIds) {
      let inventoryState = await getStateFromRedis(inventoryRedisClient, invId);
      expect(inventoryState).not.toBeNull();
      expect(inventoryState.product_id).toEqual(productIdToUpdate);
      expect(inventoryState.product_name).toEqual(originalProductName);
      expect(inventoryState.product_description).toEqual(updatedProductDesc); // Description from joined product
      console.log(`Inventory ${invId} update (due to product update) verified in inventory-statestore.`);
    }
  }, 30000);

  test("DELETE: should sync deletions correctly", async () => {
    console.log("Testing DELETE operations...");
    const productToDeleteCascaded = 1; // SuperWidget
    const inventoryIdToDeleteDirectly = "4"; // Belongs to product_id 1 (SuperWidget)
    const otherInventoryForProduct1 = "1"; // Also belongs to product_id 1

    // 1. Delete inventory_id=4 (which corresponds to product_id=1)
    await dbClient.query(
      "DELETE FROM inventory WHERE inventory_id = $1",
      [parseInt(inventoryIdToDeleteDirectly)]
    );
    console.log(`Deleted inventory ${inventoryIdToDeleteDirectly}. Waiting for propagation...`);
    await waitForPropagation();

    // Verify inventory_id=4 is gone from inventory-statestore
    let deletedInventoryState = await getStateFromRedis(inventoryRedisClient, inventoryIdToDeleteDirectly);
    expect(deletedInventoryState).toBeNull();
    console.log(`Inventory ${inventoryIdToDeleteDirectly} verified as deleted from inventory-statestore.`);

    // Verify other inventory for product 1 (inventory_id=1) still exists
    let remainingInventoryState = await getStateFromRedis(inventoryRedisClient, otherInventoryForProduct1);
    expect(remainingInventoryState).not.toBeNull();
    expect(remainingInventoryState.inventory_id).toEqual(parseInt(otherInventoryForProduct1));
    expect(remainingInventoryState.product_id).toEqual(productToDeleteCascaded);
    console.log(`Inventory ${otherInventoryForProduct1} verified as still present in inventory-statestore.`);

    // Verify product_id=1 is NOT impacted in product-statestore yet
    let productStateAfterInvDelete = await getStateFromRedis(productRedisClient, String(productToDeleteCascaded));
    expect(productStateAfterInvDelete).not.toBeNull(); // Should still exist
    expect(productStateAfterInvDelete.product_id).toEqual(productToDeleteCascaded);
    console.log(`Product ${productToDeleteCascaded} verified as still present in product-statestore after partial inventory delete.`);

    // 2. Delete product_id=1 itself
    // This should also cascade delete inventory_id=1 due to ON DELETE CASCADE in DB
    await dbClient.query(
      "DELETE FROM product WHERE product_id = $1",
      [productToDeleteCascaded]
    );
    console.log(`Deleted product ${productToDeleteCascaded}. Waiting for propagation...`);
    await waitForPropagation();

    // Verify product_id=1 is gone from product-statestore
    let deletedProductState = await getStateFromRedis(productRedisClient, String(productToDeleteCascaded));
    expect(deletedProductState).toBeNull();
    console.log(`Product ${productToDeleteCascaded} verified as deleted from product-statestore.`);

    // Verify remaining inventory for product 1 (inventory_id=1) is also gone from inventory-statestore
    let cascadedDeletedInventoryState = await getStateFromRedis(inventoryRedisClient, otherInventoryForProduct1);
    expect(cascadedDeletedInventoryState).toBeNull();
    console.log(`Inventory ${otherInventoryForProduct1} (related to product ${productToDeleteCascaded}) verified as deleted from inventory-statestore due to product deletion.`);
  }, 30000);
});