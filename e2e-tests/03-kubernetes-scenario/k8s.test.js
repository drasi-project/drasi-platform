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

const yaml = require("js-yaml");
const fs = require("fs");
const deployResources = require("../fixtures/deploy-resources");
const deleteResources = require("../fixtures/delete-resources");
const PortForward = require("../fixtures/port-forward");
const SignalrFixture = require("../fixtures/signalr-fixture");
const pg = require("pg");
const cp = require("child_process");
const { waitForChildProcess } = require("../fixtures/infrastructure");

let signalrFixture = new SignalrFixture(["risky-containers"]);
let dbPortForward = new PortForward("devops-pg", 5432);

let dbClient = new pg.Client({
  database: "devops",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

beforeAll(async () => {
  await waitForChildProcess(
    cp.exec(
      "kind get kubeconfig -n drasi-test | sed 's/127.0.0.1.*/kubernetes.default.svc/g' | kubectl create secret generic k8s-context --from-file=context=/dev/stdin -n drasi-system",
      { encoding: "utf-8" },
    ),
  );

  const resources = yaml.loadAll(
    fs.readFileSync(__dirname + "/resources.yaml", "utf8"),
  );
  await deployResources(resources);
  await signalrFixture.start();
  dbClient.port = await dbPortForward.start();
  await dbClient.connect();
  await new Promise((r) => setTimeout(r, 15000)); // reactivator is slow to startup
}, 120000);

afterAll(async () => {
  await signalrFixture.stop();
  await dbClient.end();
  dbPortForward.stop();
  const resources = yaml.loadAll(
    fs.readFileSync(__dirname + "/resources.yaml", "utf8"),
  );
  await deleteResources(resources);
});

test("scenario", async () => {
  let initData = await signalrFixture.requestReload("risky-containers");

  expect(initData.length == 1).toBeTruthy();
  expect(initData[0].image == "drasidemo.azurecr.io/my-app:0.1").toBeTruthy();

  let insertCondition = signalrFixture.waitForChange(
    "risky-containers",
    (change) =>
      change.op == "i" &&
      change.payload.after.image == "drasidemo.azurecr.io/my-app:0.2" &&
      change.payload.after.reason == "Critical Bug",
  );

  await dbClient.query(
    `insert into "RiskyImage" ("Id", "Image", "Reason") values (101, 'drasidemo.azurecr.io/my-app:0.2', 'Critical Bug')`,
  );

  expect(await insertCondition).toBeTruthy();

  let updateCondition = signalrFixture.waitForChange(
    "risky-containers",
    (change) =>
      change.op == "d" &&
      change.payload.before.image == "drasidemo.azurecr.io/my-app:0.2" &&
      change.payload.before.reason == "Critical Bug",
    60000,
  );

  await waitForChildProcess(
    cp.exec(
      "kubectl set image pod/my-app-2 app=drasidemo.azurecr.io/my-app:0.3",
      { encoding: "utf-8" },
    ),
  );

  expect(await updateCondition).toBeTruthy();
}, 120000);
