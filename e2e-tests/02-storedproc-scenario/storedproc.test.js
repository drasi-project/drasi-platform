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
const pg = require('pg');


let dbPortForward = new PortForward("postgres2", 5432);

let dbClient = new pg.Client({
  database: "test-db",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

beforeAll(async () => {
  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deployResources(resources);

  dbClient.port = await dbPortForward.start();
  await dbClient.connect();
  await new Promise(r => setTimeout(r, 15000)); 
}, 120000);


afterAll(async () => {
  await dbClient.end();
  dbPortForward.stop();
});

test('Test StoredProc Reaction - AddedResultCommand', async () => {
  const storedprocResources = yaml.loadAll(fs.readFileSync(__dirname + '/storedproc-reaction.yaml', 'utf8'));
  await deployResources(storedprocResources);

  // inserts a row into the Item table
  await dbClient.query(`INSERT INTO "Item" ("ItemId", "Name", "Category") VALUES (3, 'Drasi', '2')`);

  await waitForCondition(async () => {
    const result = await dbClient.query(`SELECT * FROM "CommandResult" WHERE "ItemId" = 3`);
    
    return (
      result.rows.length === 1 &&
      result.rows[0].Name === "Drasi" &&
      result.rows[0].Category === "2"
    );
  }, 1000, 30000) 
    .then(() => {
      expect(true).toBeTruthy(); 
    })
    .catch(() => {
      expect(false).toBeTruthy();
    });

}, 140000);



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
