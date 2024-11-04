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
const deployResources = require("../fixtures/deploy-resources");
const pg = require('pg');

let dbClient = new pg.Client({
  database: "test-db",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

beforeAll(async () => {
  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deployResources(resources);
  await dbClient.connect();
  await new Promise(r => setTimeout(r, 15000)); // reactivator is slow to startup
}, 120000);

test('Test StoredProc Reaction - AddedResultCommand', async () => {
  // add a new item
  const storedprocResources = yaml.loadAll(fs.readFileSync(__dirname + '/storedproc-reaction.yaml', 'utf8'));
  await deployResources(storedprocResources);

  await dbClient.query(`INSERT INTO "Item" ("ItemId", "Name", "Category") VALUES (3, 'Drasi', '1')`);

  // sleep 35 seconds
  await new Promise(r => setTimeout(r, 15000));

  // Verify the results from the CommandResult table
  let result = await dbClient.query(`SELECT * FROM "CommandResult" WHERE "ItemId" = 3`);

  expect(result.rows.length == 1).toBeTruthy();
  expect(result.rows[0].Name == "Drasi").toBeTruthy();
  expect(result.rows[0].Category == "1").toBeTruthy();

}, 140000);