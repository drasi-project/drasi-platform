

const yaml = require('js-yaml');
const fs = require('fs');
const deployResources = require("../fixtures/deploy-resources");
const PortForward = require('../fixtures/port-forward');
const SignalrFixture = require("../fixtures/signalr-fixture");
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