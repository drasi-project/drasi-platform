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

const cp = require("child_process");

const images = [
  "drasi-project/api",
  "drasi-project/kubernetes-provider",

  //"drasi-project/source-cosmosdb-reactivator",
  "drasi-project/source-debezium-reactivator",
  "drasi-project/source-kubernetes-reactivator",

  "drasi-project/source-change-dispatcher",
  "drasi-project/source-change-router",
  "drasi-project/source-query-api",
  //"drasi-project/source-gremlin-proxy",
  "drasi-project/source-sql-proxy",
  //"drasi-project/source-passthru-proxy",
  "drasi-project/source-kubernetes-proxy",

  "drasi-project/query-container-publish-api",
  "drasi-project/query-container-query-host",
  "drasi-project/query-container-view-svc",

  "drasi-project/reaction-signalr",
  "drasi-project/reaction-storedproc",
  "drasi-project/reaction-gremlin",
  "drasi-project/reaction-sync-dapr-statestore",
<<<<<<< HEAD
  "drasi-project/reaction-post-dapr-output-binding",
=======
  "drasi-project/reaction-post-dapr-pubsub",
>>>>>>> origin/main
];

async function loadDrasiImages(clusterName) {
  let promises = [];

  for (let image of images) {
    promises.push(
      new Promise((resolve, reject) => {
        let p = cp.spawn("kind", [
          "load",
          "docker-image",
          image,
          "--name",
          clusterName,
        ]);
        p.stdout.on("data", function (msg) {
          console.log(`${image} - ${msg.toString()}`);
        });
        p.stderr.on("data", function (msg) {
          console.log(`${image} - ${msg.toString()}`);
        });
        p.once("exit", (code) => {
          if (code == 0) resolve(null);
          else reject();
        });
      }),
    );
  }

  await Promise.all(promises);
}

async function tryLoadInfraImages(clusterName) {
  let promises = [];

  for (let image of ["drasidemo.azurecr.io/my-app:0.3"]) {
    promises.push(
      new Promise((resolve) => {
        let pull = cp.spawn("docker", ["pull", image]);
        pull.stdout.on("data", function (msg) {
          console.log(`${image} - ${msg.toString()}`);
        });
        pull.once("exit", () => {
          let p = cp.spawn("kind", [
            "load",
            "docker-image",
            image,
            "--name",
            clusterName,
          ]);
          p.stdout.on("data", function (msg) {
            console.log(`${image} - ${msg.toString()}`);
          });
          p.stderr.on("data", function (msg) {
            console.log(`${image} - ${msg.toString()}`);
          });
          p.once("exit", () => resolve(null));
        });
      }),
    );
  }

  await Promise.all(promises);
}

async function installDrasi() {
  await waitForChildProcess(
    cp.exec("drasi init --local --version latest", {
      encoding: "utf-8",
    }),
    "install",
  );
}

/**
 * @param {cp.ChildProcess} childProcess
 * @param {string} logPrefix
 */
function waitForChildProcess(childProcess, logPrefix = "") {
  return new Promise((resolve, reject) => {
    childProcess.once("exit", (code) => {
      if (code == 0) resolve(null);
      else reject(`${logPrefix} ${childProcess.spawnfile} exit code ${code}`);
    });
    childProcess.stdout?.on("data", function (msg) {
      console.info(
        `${logPrefix} ${childProcess.spawnfile} ${new Date()} - ${msg.toString()}`,
      );
    });

    childProcess.stderr?.on("data", function (msg) {
      console.error(
        `${logPrefix} ${childProcess.spawnfile} ${new Date()} - ${msg.toString()}`,
      );
    });
  });
}

/**
 * A general-purpose wait function.
 * If actionFn and predicateFn are provided, it polls actionFn until predicateFn returns true or timeout.
 * If actionFn is not provided, it waits for the specified timeout duration.
 *
 * @param {Object} options - The options for waiting.
 * @param {Function} [options.actionFn] - Optional async function to execute on each poll.
 * @param {Function} [options.predicateFn] - Optional function that takes result of actionFn and returns boolean.
 *                                      Required if actionFn is provided.
 * @param {number} [options.timeoutMs=10000] - Maximum time to wait in milliseconds. Defaults to 10 seconds.
 * @param {number} [options.pollIntervalMs=2000] - Interval between polls in milliseconds (if actionFn is used).
 * @param {string} [options.description] - Optional description for logging.
 * @returns {Promise<any>} - The result of actionFn when condition is met, or the last result on timeout.
 *                           Returns undefined for simple timed waits.
 */
async function waitFor({
  actionFn,
  predicateFn,
  timeoutMs = 10000,
  pollIntervalMs = 500,
  description
}) {
  const startTime = Date.now();
  const desc = description || (actionFn ? "a condition to be met" : `a fixed duration of ${timeoutMs / 1000}s`);

  console.log(`Waiting up to ${timeoutMs / 1000}s for ${desc}` +
              (actionFn ? ` (polling every ${pollIntervalMs}ms)...` : '...'));

  if (!actionFn) {
    // Simple timed wait
    await new Promise(resolve => setTimeout(resolve, timeoutMs));
    console.log(`Finished waiting for ${desc}.`);
    return undefined;
  }

  if (actionFn && !predicateFn) {
    throw new Error("`predicateFn` is required if `actionFn` is provided to `waitFor`.");
  }

  let lastResult;
  while (Date.now() - startTime < timeoutMs) {
    try {
      lastResult = await actionFn();
      if (predicateFn(lastResult)) {
        console.log(`${desc} met after ${(Date.now() - startTime) / 1000}s.`);
        return lastResult;
      }
    } catch (error) {
      console.error(`Error during actionFn execution for "${desc}":`, error.message);
      lastResult = undefined;
    }
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  console.warn(`Timeout: ${desc} was not met within ${timeoutMs / 1000}s. Last attempted result:`, lastResult !== undefined ? JSON.stringify(lastResult) : 'undefined');
  return lastResult; // Return the last (unsuccessful) result from actionFn
}

exports.loadDrasiImages = loadDrasiImages;
exports.installDrasi = installDrasi;
exports.tryLoadInfraImages = tryLoadInfraImages;
exports.waitForChildProcess = waitForChildProcess;
exports.waitFor = waitFor;
