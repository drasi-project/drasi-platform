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
const PortForward = require('../fixtures/port-forward');
const SignalrFixture = require("../fixtures/signalr-fixture");
const storedprocReactionManifest = require("../fixtures/storedproc-reaction-manifest");
const pg = require('pg');


let signalrFixture = new SignalrFixture(["query1"]);
let dbPortForward = new PortForward("postgres", 5432);

let dbClient = new pg.Client({
  database: "test-db",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

beforeAll(async () => {
  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deployResources(resources);
  await signalrFixture.start();
  dbClient.port = await dbPortForward.start();
  await dbClient.connect();
  await new Promise(r => setTimeout(r, 15000)); // reactivator is slow to startup
}, 120000);

afterAll(async () => {
  await signalrFixture.stop();
  await dbClient.end();
  dbPortForward.stop();
});

test('A row is updated', async () => {
  let updateCondition = signalrFixture.waitForChange("query1", 
    change => change.op == "u" && change.payload.after.Name == "Bar" && change.payload.after.Id == 1);

  await dbClient.query(`UPDATE "Item" SET "Name" = 'Bar' WHERE "ItemId" = 1`);

  expect(await updateCondition).toBeTruthy();
});

test('Initial data', async () => {
  let initData = await signalrFixture.requestReload("query1");

  expect(initData.length == 2).toBeTruthy();
});


test('Test StoredProc Reaction - AddedResultCommand', async () => {
  // add a new item
  await deployResources([storedprocReactionManifest(["query1"])]);


  await dbClient.query(`INSERT INTO "Item" ("ItemId", "Name", "Category") VALUES (3, 'Bar', '1')`);

  // Verify the results from the CommandResult table
  let result = await dbClient.query(`SELECT * FROM "CommandResult" WHERE "Id" = 3`);
  expect(result.rows.length == 1).toBeTruthy();
  expect(result.rows[0].Name == "Bar").toBeTruthy();
  expect(result.rows[0].Category == "1").toBeTruthy();

});