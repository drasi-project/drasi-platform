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
const gremlin = require('gremlin');


let postgresPortForward = new PortForward("postgres2", 5432);

let postgresClient = new pg.Client({
  database: "test-db",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

let gremlinClient;

beforeAll(async () => {
  const drasiResources = yaml.loadAll(fs.readFileSync(__dirname + '/drasi-resources.yaml', 'utf8'));
  await deployResources(drasiResources);

  // Setting up the postgres database for the Source
  const postgresResources = yaml.loadAll(fs.readFileSync(__dirname + '/postgres-resources.yaml', 'utf8'));
  await deployResources(postgresResources);

  postgresClient.port = await postgresPortForward.start();
  await postgresClient.connect();
  await new Promise(r => setTimeout(r, 15000));



  // Setting up the Gremlin database
  const gremlinResources = yaml.loadAll(fs.readFileSync(__dirname + '/gremlin-resources.yaml', 'utf8'));
  await deployResources(gremlinResources);
  await new Promise(r => setTimeout(r, 10000));

  let gremlinPortForward = new PortForward("gremlin-server-service", 8182);
  let gremlinPort = await gremlinPortForward.start();

  // gremlin-server-service.default.svc.cluster.local
  const traversal = gremlin.process.AnonymousTraversalSource.traversal;
  gremlinClient = traversal().withRemote(new gremlin.driver.DriverRemoteConnection(`ws://localhost:${gremlinPort}/gremlin`, {}));
}, 150000);


test('Test Gremlin Reaction - AddedResultCommand', async () => {
  const gremlinReaction = yaml.loadAll(fs.readFileSync(__dirname + '/gremlin-reaction.yaml', 'utf8'));
  await deployResources(gremlinReaction);

  await postgresClient.query(`INSERT INTO "Item" ("ItemId", "Name", "Category") VALUES (4, 'Drasi', '3')`);
  await waitForCondition(async () => {
    const result = await gremlinClient.V().has('Id', '4').hasNext();
    return result;
  }, 1000,30000)
  .then(() => {
    expect(true).toBeTruthy(); 
  })
  .catch(() => {
    expect(false).toBeTruthy();
  });
}, 140000);


afterAll(async () => {
  // await postgresClient.end();
  // postgresPortForward.stop();

  // const postgresResources = yaml.loadAll(fs.readFileSync(__dirname + '/postgres-resources.yaml', 'utf8'));
  // await deleteResources(postgresResources);

  // const drasiResources = yaml.loadAll(fs.readFileSync(__dirname + '/drasi-resources.yaml', 'utf8'));
  // await deleteResources(drasiResources);

  // await gremlinClient.close();

  // const gremlinResources = yaml.loadAll(fs.readFileSync(__dirname + '/gremlin-resources.yaml', 'utf8'));
  // await deleteResources(gremlinResources);
});


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
