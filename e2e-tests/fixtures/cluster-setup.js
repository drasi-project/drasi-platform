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
const { loadDrasiImages, installDrasi, tryLoadInfraImages, waitForChildProcess } = require('./infrastructure');
const deployResources = require('./deploy-resources');
const yaml = require('js-yaml');
const fs = require('fs');

module.exports = async function () {
  console.log("Creating cluster...");
  await waitForChildProcess(cp.exec(`kind delete cluster --name drasi-test`, { encoding: 'utf-8' }));
  await waitForChildProcess(cp.exec(`kind create cluster --name drasi-test --image kindest/node:v1.25.3`, { encoding: 'utf-8' }));

  await Promise.all([
    tryLoadInfraImages("drasi-test"),
    loadDrasiImages("drasi-test")
  ]);

  await installPostgres();
  await installDrasi();
};



async function installPostgres() {
  const postgresResources = yaml.loadAll(fs.readFileSync(__dirname + '/postgres.yaml', 'utf8'));
  await deployResources(postgresResources);
}