const cp = require('child_process');
const { loadDrasiImages, installDrasi, tryLoadInfraImages, waitForChildProcess } = require('./infrastructure');

module.exports = async function () {
  console.log("Creating cluster...");
  await waitForChildProcess(cp.exec(`kind delete cluster --name drasi-test`, { encoding: 'utf-8' }));
  await waitForChildProcess(cp.exec(`kind create cluster --name drasi-test --image kindest/node:v1.25.3`, { encoding: 'utf-8' }));

  await Promise.all([
    tryLoadInfraImages("drasi-test"),
    loadDrasiImages("drasi-test")
  ]);

  await installDrasi();
};