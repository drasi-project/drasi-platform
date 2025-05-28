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
const util = require('util');
const { loadDrasiImages, installDrasi, tryLoadInfraImages, waitForChildProcess } = require('./infrastructure');
const execAsync = util.promisify(cp.exec);

function getErrorMessage(error, defaultMessage = 'Unknown error') {
  if (error) {
    if (typeof error.message === 'string') {
      return error.message.split('\n')[0];
    } else if (typeof error === 'string') {
      return error.split('\n')[0];
    } else {
      return String(error);
    }
  }
  return defaultMessage;
}

async function clusterExists(clusterName) {
  try {
    const { stdout, stderr } = await execAsync(`kind get clusters`, { encoding: 'utf-8' });
    if (stderr && stderr.trim() !== "") {
      console.warn(`'kind get clusters' stderr: ${stderr.trim()}`);
    }
    return stdout.split('\n').includes(clusterName);
  } catch (error) {
    let msg = getErrorMessage(error);
    console.warn(`Error executing 'kind get clusters': ${msg}. Assuming cluster '${clusterName}' does not exist.`);
    return false;
  }
}

module.exports = async function () {
  const reuseClusterEnv = process.env.REUSE_KIND_CLUSTER === 'true';
  const clusterName = 'drasi-test';
  let clusterIsReused = false;

  if (reuseClusterEnv) {
    console.log(`REUSE_KIND_CLUSTER is true. Checking for existing cluster '${clusterName}'...`);
    if (await clusterExists(clusterName)) {
      console.log(`Cluster '${clusterName}' exists. Reusing it. Attempting to uninstall previous Drasi installation...`);
      try {
        await execAsync(`kubectl config use-context kind-${clusterName}`);
        await waitForChildProcess(cp.exec(`drasi uninstall -y`, { encoding: 'utf-8' }));
        console.log("Drasi uninstall command executed.");
      } catch (error) {
        let uninstallErrorMsg = getErrorMessage(error, 'Unknown error during drasi uninstall');
        console.warn(`'drasi uninstall -y' failed or context switch failed, ignoring. Error: ${uninstallErrorMsg}`);
      }
      clusterIsReused = true;
    } else {
      console.log(`Cluster '${clusterName}' not found. Will proceed with normal cluster creation.`);
    }
  }

  if (!clusterIsReused) {
    try {
      console.log(`Attempting to delete cluster '${clusterName}' (if it exists)...`);
      await waitForChildProcess(cp.exec(`kind delete cluster --name ${clusterName}`, { encoding: 'utf-8' }));
      console.log(`Cluster '${clusterName}' delete command executed.`);
    } catch (error) {
      let deleteErrorMsg = getErrorMessage(error, 'Unknown error during kind delete');
      console.warn(`'kind delete cluster --name ${clusterName}' failed, ignoring. Error: ${deleteErrorMsg}`);
    }

    console.log(`Creating cluster '${clusterName}'...`);
    await waitForChildProcess(cp.exec(`kind create cluster --name ${clusterName}`, { encoding: 'utf-8' }));
    await waitForChildProcess(cp.exec(`docker update --memory=8g --memory-swap=8g --cpus=4 ${clusterName}-control-plane`, { encoding: 'utf-8' }));
  }

  console.log("Loading Docker images into Kind cluster...");
  await Promise.all([
    tryLoadInfraImages(clusterName),
    loadDrasiImages(clusterName)
  ]);

  console.log("Installing Drasi...");
  await installDrasi();
  console.log("Cluster setup complete.");
};
