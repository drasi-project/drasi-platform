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

const yaml = require('js-yaml');
const fs = require('fs');
const PortForward = require('../fixtures/port-forward');
const deployResources = require("../fixtures/deploy-resources");
const deleteResources = require("../fixtures/delete-resources");
const pg = require('pg');
const { QueueServiceClient } = require('@azure/storage-queue');

let dbPortForward = new PortForward("postgres-sq", 5432);
let azuritePortForward = new PortForward("azurite", 10001);

let dbClient = new pg.Client({
  database: "test-db",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

let queueServiceClient;
let queueClient;

beforeAll(async () => {
  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deployResources(resources);

  dbClient.port = await dbPortForward.start();
  await dbClient.connect();

  const azuritePort = await azuritePortForward.start();
  
  // Connect to Azurite
  const connectionString = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:${azuritePort}/devstoreaccount1;`;
  queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
  queueClient = queueServiceClient.getQueueClient("test-queue");
  
  // Create the queue
  await queueClient.create();

  await new Promise(r => setTimeout(r, 15000)); 
}, 120000);


afterAll(async () => {
  await dbClient.end();
  dbPortForward.stop();
  azuritePortForward.stop();

  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deleteResources(resources);

  const reactionResources = yaml.loadAll(fs.readFileSync(__dirname + '/storagequeue-reaction.yaml', 'utf8'));
  await deleteResources(reactionResources);
});

test('Test StorageQueue Template Reaction - Added', async () => {
  const storagequeuereactionResources = yaml.loadAll(fs.readFileSync(__dirname + '/storagequeue-reaction.yaml', 'utf8'));
  await deployResources(storagequeuereactionResources);

  // Wait for reaction to be ready
  await new Promise(r => setTimeout(r, 5000));

  // Clear any existing messages
  await queueClient.clearMessages();

  // Insert a new row
  await dbClient.query(`INSERT INTO "Item" ("ItemId", "Name", "Category", "Temperature") VALUES (3, 'NewItem', '1', 30)`);

  // Wait for the message to appear in the queue
  await waitForCondition(async () => {
    const messages = await queueClient.receiveMessages({ numberOfMessages: 32 });
    
    for (const message of messages.receivedMessageItems) {
      const content = JSON.parse(message.messageText);
      if (content.type === 'added' && content.id === '3' && content.name === 'NewItem' && content.temperature === 30) {
        return true;
      }
    }
    return false;
  }, 1000, 30000) 
    .then(() => {
      expect(true).toBeTruthy(); 
    })
    .catch(() => {
      expect(false).toBeTruthy();
    });

}, 140000);

test('Test StorageQueue Template Reaction - Updated', async () => {
  // Clear messages
  await queueClient.clearMessages();

  // Update a row
  await dbClient.query(`UPDATE "Item" SET "Temperature" = 35 WHERE "ItemId" = 1`);

  // Wait for the update message
  await waitForCondition(async () => {
    const messages = await queueClient.receiveMessages({ numberOfMessages: 32 });
    
    for (const message of messages.receivedMessageItems) {
      const content = JSON.parse(message.messageText);
      if (content.type === 'updated' && content.id === '1' && content.temperature === 35 && content.previousTemperature === 20) {
        return true;
      }
    }
    return false;
  }, 1000, 30000) 
    .then(() => {
      expect(true).toBeTruthy(); 
    })
    .catch(() => {
      expect(false).toBeTruthy();
    });

}, 40000);

test('Test StorageQueue Template Reaction - Deleted', async () => {
  // Clear messages
  await queueClient.clearMessages();

  // Delete a row
  await dbClient.query(`DELETE FROM "Item" WHERE "ItemId" = 2`);

  // Wait for the delete message
  await waitForCondition(async () => {
    const messages = await queueClient.receiveMessages({ numberOfMessages: 32 });
    
    for (const message of messages.receivedMessageItems) {
      const content = JSON.parse(message.messageText);
      if (content.type === 'deleted' && content.id === '2' && content.name === 'Bar' && content.temperature === 25) {
        return true;
      }
    }
    return false;
  }, 1000, 30000) 
    .then(() => {
      expect(true).toBeTruthy(); 
    })
    .catch(() => {
      expect(false).toBeTruthy();
    });

}, 40000);


function waitForCondition(checkFn, interval = 1000, timeout = 30000) {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    const intervalId = setInterval(async () => {
      if (await checkFn()) {
        clearInterval(intervalId);
        resolve();
      } else if (elapsedTime >= timeout) {
        clearInterval(intervalId);
        reject(new Error("Timed out waiting for condition to be met"));
      }

      elapsedTime += interval;
    }, interval);
  });
}
