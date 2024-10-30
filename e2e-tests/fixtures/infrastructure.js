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

const cp = require('child_process');

const images = [
  "drasi-project/api",
  "drasi-project/kubernetes-provider",

  //"drasi-project/source-cosmosdb-reactivator",
  "drasi-project/source-debezium-reactivator",
  //"drasi-project/source-kubernetes-reactivator",

  "drasi-project/source-change-dispatcher",
  "drasi-project/source-change-router",
  "drasi-project/source-query-api",
  //"drasi-project/source-gremlin-proxy",
  "drasi-project/source-sql-proxy",
  //"drasi-project/source-passthru-proxy",

  "drasi-project/query-container-publish-api",
  "drasi-project/query-container-query-host",
  "drasi-project/query-container-view-svc",

  "drasi-project/reaction-signalr",
  "drasi-project/reaction-storedproc",
  //"drasi-project/reaction-gremlin",
];

async function loadDrasiImages(clusterName) {
  let promises = [];

  for (let image of images) {
    promises.push(new Promise((resolve, reject) => {
      let p = cp.spawn("kind", ["load", "docker-image", image, "--name", clusterName]);
      p.stdout.on('data', function(msg){         
        console.log(`${image} - ${msg.toString()}`);
      });
      p.stderr.on('data', function(msg){         
        console.log(`${image} - ${msg.toString()}`);
      });
      p.once("exit", (code) => {
        if (code == 0)
          resolve(null);
        else
          reject();
      });
    }));
  }
  
  await Promise.all(promises);
}

async function tryLoadInfraImages(clusterName) {
  let promises = [];

  for (let image of ["mongo:6"]) {
    promises.push(new Promise((resolve) => {
      let pull = cp.spawn("docker", ["pull", image]);
      pull.stdout.on('data', function(msg){         
        console.log(`${image} - ${msg.toString()}`);
      });
      pull.once("exit", () => {      
        let p = cp.spawn("kind", ["load", "docker-image", image, "--name", clusterName]);
        p.stdout.on('data', function(msg){         
          console.log(`${image} - ${msg.toString()}`);
        });
        p.stderr.on('data', function(msg){         
          console.log(`${image} - ${msg.toString()}`);
        });
        p.once("exit", () => resolve(null));
      });
    }));
  }
  
  await Promise.all(promises);
}

async function installDrasi() {
  await waitForChildProcess(cp.exec("drasi init --local", {
    encoding: 'utf-8'
  }), "install");
}

/**
 * @param {cp.ChildProcess} childProcess
 * @param {string} logPrefix
 */
function waitForChildProcess(childProcess, logPrefix = "") {
  return new Promise((resolve, reject) => {
    childProcess.once("exit", (code) => {
      if (code == 0)
        resolve(null);
      else
        reject(`${logPrefix} ${childProcess.spawnfile} exit code ${code}`);
    });
    childProcess.stdout?.on('data', function(msg){         
      console.info(`${logPrefix} ${childProcess.spawnfile} - ${msg.toString()}`);
    });

    childProcess.stderr?.on('data', function(msg){         
      console.error(`${logPrefix} ${childProcess.spawnfile} - ${msg.toString()}`);
    });
  });
}

exports.loadDrasiImages = loadDrasiImages;
exports.installDrasi = installDrasi;
exports.tryLoadInfraImages = tryLoadInfraImages;
exports.waitForChildProcess = waitForChildProcess;
