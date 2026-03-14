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
const path = require("path");
const deployResources = require("../fixtures/deploy-resources");
const deleteResources = require("../fixtures/delete-resources");
const PortForward = require("../fixtures/port-forward");
const SignalRFixture = require("../fixtures/signalr-fixture");
const pg = require("pg");
const cp = require("child_process");
const { waitForChildProcess } = require("../fixtures/infrastructure");

const SCENARIO_DIR = __dirname;
const INFRA_FILE = path.join(SCENARIO_DIR, "infrastructure.yaml");
const SOURCES_FILE = path.join(SCENARIO_DIR, "sources.yaml");
const QUERIES_FILE = path.join(SCENARIO_DIR, "queries.yaml");

let signalRFixture = new SignalRFixture(["risky-containers"]);
let dbPortForward = new PortForward("devops-pg", 5432);
let resourcesToCleanup = [];

let dbClient = new pg.Client({
  database: "devops",
  host: "127.0.0.1",
  user: "test",
  password: "test",
});

beforeAll(async () => {
  const infraResources = yaml.loadAll(fs.readFileSync(INFRA_FILE, "utf8"));
  const sourceResources = yaml.loadAll(fs.readFileSync(SOURCES_FILE, "utf8"));
  const queryResources = yaml.loadAll(fs.readFileSync(QUERIES_FILE, "utf8"));
  resourcesToCleanup = [...infraResources, ...sourceResources, ...queryResources];

  // Step 1: Create the K8s context secret
  console.log("Creating K8s context secret...");
  await waitForChildProcess(
    cp.exec(
      "kind get kubeconfig --name drasi-test | sed 's/127.0.0.1.*/kubernetes.default.svc/g' | kubectl create secret generic k8s-context --from-file=context=/dev/stdin -n drasi-system",
      { encoding: "utf-8" },
    ),
  );

  // Step 2: Deploy infrastructure (ConfigMaps, Deployment, Service, Pods)
  console.log("Deploying infrastructure resources...");
  await deployResources(infraResources);

  // Step 3: Deploy sources (PostgreSQL and Kubernetes)
  console.log("Deploying Drasi sources...");
  try {
    await deployResources(sourceResources);
  } catch (e) {
    await waitForChildProcess(
      cp.exec("drasi describe source k8s", { encoding: "utf-8" }),
    );
    await waitForChildProcess(
      cp.exec(
        "kubectl describe pods --selector=drasi/resource=k8s -n drasi-system",
        { encoding: "utf-8" },
      ),
    );
    await waitForChildProcess(
      cp.exec(
        "kubectl logs -l drasi/infra=resource-provider --all-containers=true --since=0 -n drasi-system",
        { encoding: "utf-8" },
      ),
    );
    throw e;
  }

  // Step 4: Deploy queries
  console.log("Deploying Drasi queries...");
  await deployResources(queryResources);

  // Step 5: Start SignalR and DB connections
  await signalRFixture.start();
  dbClient.port = await dbPortForward.start();
  await dbClient.connect();

  // Step 6: Wait for query bootstrap to complete
  await new Promise((r) => setTimeout(r, 5000));
}, 240000);

afterAll(async () => {
  await signalRFixture.stop();
  await dbClient.end();
  dbPortForward.stop();
  await deleteResources(resourcesToCleanup).catch(err =>
    console.error("Error during resource cleanup:", err),
  );
});

test("scenario", async () => {
  let initData = await signalRFixture.requestReload("risky-containers");

  expect(initData.length == 1).toBeTruthy();
  expect(initData[0].image == "ghcr.io/drasi-project/my-app:0.1").toBeTruthy();

  let insertCondition = signalRFixture.waitForChange(
    "risky-containers",
    (change) =>
      change.op == "i" &&
      change.payload.after.image == "ghcr.io/drasi-project/my-app:0.2" &&
      change.payload.after.reason == "Critical Bug",
  );

  await dbClient.query(
    `insert into "RiskyImage" ("Id", "Image", "Reason") values (101, 'ghcr.io/drasi-project/my-app:0.2', 'Critical Bug')`,
  );

  expect(await insertCondition).toBeTruthy();

  let updateCondition = signalRFixture.waitForChange(
    "risky-containers",
    (change) =>
      change.op == "d" &&
      change.payload.before.image == "ghcr.io/drasi-project/my-app:0.2" &&
      change.payload.before.reason == "Critical Bug",
    60000,
  );

  await waitForChildProcess(
    cp.exec(
      "kubectl set image pod/my-app-2 app=ghcr.io/drasi-project/my-app:0.3",
      { encoding: "utf-8" },
    ),
  );

  expect(await updateCondition).toBeTruthy();
}, 120000);
