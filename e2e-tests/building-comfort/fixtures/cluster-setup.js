const cp = require('child_process');
const { loadDrasiImages, installDrasi, tryLoadInfraImages, waitForChildProcess } = require('./infrastructure');

module.exports = async function () {
  console.log("Creating cluster...");
  await waitForChildProcess(cp.exec(`kind delete cluster --name drasi-test`, { encoding: 'utf-8' }));
  await waitForChildProcess(cp.exec(`kind create cluster --name drasi-test --image kindest/node:v1.25.3`, { encoding: 'utf-8' }));

  const reactivator_endpoint = process.env.Cosmos_Reactivator_Endpoint;
  const proxy_endpoint = process.env.Gremlin_Proxy_Endpoint;

  // Create secret for reactivator and proxy endpoints
  await waitForChildProcess(cp.exec(`kubectl create secret generic comfy-creds --from-literal=accountEndpoint=${reactivator_endpoint} --from-literal=ProxyEndpoint=${proxy_endpoint} -n drasi-system`, { encoding: 'utf-8' }));
  await waitForChildProcess(cp.exec(`kubectl list secret -n drasi-system`, { encoding: 'utf-8' }));
  await Promise.all([
    tryLoadInfraImages("drasi-test"),
    loadDrasiImages("drasi-test")
  ]);

  await installDrasi();
};