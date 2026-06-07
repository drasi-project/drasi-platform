/*
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
const deployResources = require('../fixtures/deploy-resources');
const deleteResources = require('../fixtures/delete-resources');
const PortForward = require('../fixtures/port-forward');
const SignalRFixture = require('../fixtures/signalr-fixture');
const oracledb = require('oracledb');

let dbPortForward = new PortForward('oracle', 1521);
let signalrFixture = new SignalRFixture(['oracle-query1']);
let dbConn;

beforeAll(async () => {
  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deployResources(resources);
  await signalrFixture.start();

  const localPort = await dbPortForward.start();
  dbConn = await oracledb.getConnection({
    user: 'testuser',
    password: 'oracle',
    connectString: `127.0.0.1:${localPort}/XEPDB1`,
  });

  await new Promise(r => setTimeout(r, 15000)); // reactivator is slow to startup
}, 180000);

afterAll(async () => {
  await signalrFixture.stop();
  if (dbConn) {
    await dbConn.close();
  }
  dbPortForward.stop();

  const resources = yaml.loadAll(fs.readFileSync(__dirname + '/resources.yaml', 'utf8'));
  await deleteResources(resources);
});

test('Initial data bootstrap returns existing rows', async () => {
  const initData = await signalrFixture.requestReload('oracle-query1');
  expect(initData.length).toBeGreaterThanOrEqual(2);
  const item = initData[0];
  expect(item).toHaveProperty('Id');
  expect(item).toHaveProperty('Name');
  expect(item).toHaveProperty('Category');
  expect(item).toHaveProperty('Score');
}, 30000);

test('A row update propagates as a change event', async () => {
  const updateCondition = signalrFixture.waitForChange(
    'oracle-query1',
    change => change.op === 'u' && change.payload.after.Name === 'UpdatedFoo' && change.payload.after.Id === 1,
    30000,
  );

  await dbConn.execute(`UPDATE ITEM SET NAME = 'UpdatedFoo' WHERE ITEMID = 1`);
  await dbConn.commit();

  expect(await updateCondition).toBeTruthy();
}, 40000);
