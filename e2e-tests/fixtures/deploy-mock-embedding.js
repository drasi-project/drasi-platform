/**
 * Copyright 2025 The Drasi Authors.
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

/**
 * Mock Embedding Service Deployment Helper
 *
 * This module provides functions to build, load, and deploy the mock embedding
 * service for e2e tests when Azure OpenAI credentials are not available.
 */

const cp = require('child_process');
const path = require('path');
const { waitFor } = require('./infrastructure');

const MOCK_SERVICE_DIR = path.join(__dirname, 'mock-embedding-service');
const MOCK_IMAGE_NAME = 'drasi-project/mock-embedding-service';
const MOCK_IMAGE_TAG = 'latest';
const MOCK_SERVICE_NAME = 'mock-embedding-service';
const MOCK_SERVICE_NAMESPACE = 'default';

/**
 * Build the mock embedding service Docker image
 *
 * @returns {Promise<void>}
 */
async function buildMockEmbeddingImage() {
  console.log('Building mock embedding service Docker image...');

  return new Promise((resolve, reject) => {
    const buildProcess = cp.spawn('docker', [
      'build',
      '-t', `${MOCK_IMAGE_NAME}:${MOCK_IMAGE_TAG}`,
      MOCK_SERVICE_DIR
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    buildProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`[docker build] ${data.toString().trim()}`);
    });

    buildProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      // Docker build often outputs progress to stderr, so just log it
      console.log(`[docker build] ${data.toString().trim()}`);
    });

    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Mock embedding service image built successfully.');
        resolve();
      } else {
        reject(new Error(`Docker build failed with code ${code}: ${stderr}`));
      }
    });

    buildProcess.on('error', (err) => {
      reject(new Error(`Failed to start docker build: ${err.message}`));
    });
  });
}

/**
 * Load the mock embedding service image into the Kind cluster
 *
 * @param {string} clusterName - The name of the Kind cluster
 * @returns {Promise<void>}
 */
async function loadMockEmbeddingImageToKind(clusterName = 'drasi-test') {
  console.log(`Loading mock embedding service image into Kind cluster '${clusterName}'...`);

  return new Promise((resolve, reject) => {
    const loadProcess = cp.spawn('kind', [
      'load',
      'docker-image',
      `${MOCK_IMAGE_NAME}:${MOCK_IMAGE_TAG}`,
      '--name', clusterName
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stderr = '';

    loadProcess.stdout.on('data', (data) => {
      console.log(`[kind load] ${data.toString().trim()}`);
    });

    loadProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log(`[kind load] ${data.toString().trim()}`);
    });

    loadProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Mock embedding service image loaded into Kind cluster.');
        resolve();
      } else {
        reject(new Error(`Kind load failed with code ${code}: ${stderr}`));
      }
    });

    loadProcess.on('error', (err) => {
      reject(new Error(`Failed to start kind load: ${err.message}`));
    });
  });
}

/**
 * Deploy the mock embedding service to the Kubernetes cluster
 *
 * @returns {Promise<void>}
 */
async function deployMockEmbeddingService() {
  console.log('Deploying mock embedding service to Kubernetes...');

  const deploymentPath = path.join(MOCK_SERVICE_DIR, 'deployment.yaml');

  return new Promise((resolve, reject) => {
    const applyProcess = cp.spawn('kubectl', [
      'apply',
      '-f', deploymentPath
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stderr = '';

    applyProcess.stdout.on('data', (data) => {
      console.log(`[kubectl apply] ${data.toString().trim()}`);
    });

    applyProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`[kubectl apply] ${data.toString().trim()}`);
    });

    applyProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Mock embedding service deployed.');
        resolve();
      } else {
        reject(new Error(`kubectl apply failed with code ${code}: ${stderr}`));
      }
    });

    applyProcess.on('error', (err) => {
      reject(new Error(`Failed to start kubectl apply: ${err.message}`));
    });
  });
}

/**
 * Wait for the mock embedding service to be ready
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<boolean>}
 */
async function waitForMockServiceReady(timeoutMs = 60000) {
  console.log('Waiting for mock embedding service to be ready...');

  return waitFor({
    actionFn: async () => {
      try {
        const result = cp.execSync(
          `kubectl get deployment ${MOCK_SERVICE_NAME} -n ${MOCK_SERVICE_NAMESPACE} -o jsonpath='{.status.readyReplicas}'`,
          { encoding: 'utf8', timeout: 5000 }
        ).trim();
        return parseInt(result) >= 1;
      } catch (error) {
        return false;
      }
    },
    predicateFn: (ready) => ready === true,
    timeoutMs: timeoutMs,
    pollIntervalMs: 2000,
    description: 'mock embedding service to be ready'
  });
}

/**
 * Delete the mock embedding service from the Kubernetes cluster
 *
 * @returns {Promise<void>}
 */
async function deleteMockEmbeddingService() {
  console.log('Deleting mock embedding service from Kubernetes...');

  const deploymentPath = path.join(MOCK_SERVICE_DIR, 'deployment.yaml');

  return new Promise((resolve) => {
    const deleteProcess = cp.spawn('kubectl', [
      'delete',
      '-f', deploymentPath,
      '--ignore-not-found'
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stderr = '';

    deleteProcess.stdout.on('data', (data) => {
      console.log(`[kubectl delete] ${data.toString().trim()}`);
    });

    deleteProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log(`[kubectl delete] ${data.toString().trim()}`);
    });

    deleteProcess.on('close', (code) => {
      if (code !== 0) {
        console.warn(`[kubectl delete] Warning: Delete exited with code ${code}. Error: ${stderr}`);
      } else {
        console.log('Mock embedding service deleted.');
      }
      resolve();
    });

    deleteProcess.on('error', (err) => {
      console.error(`[kubectl delete] Error: ${err.message}`);
      // Ignore errors on delete but log them
      resolve();
    });
  });
}

/**
 * Full setup: Build, load, deploy and wait for mock embedding service
 *
 * @param {string} clusterName - The name of the Kind cluster
 * @returns {Promise<boolean>} - True if setup was successful
 */
async function setupMockEmbeddingService(clusterName = 'drasi-test') {
  try {
    console.log('\n========================================');
    console.log('Setting up Mock Embedding Service');
    console.log('========================================\n');

    // Step 1: Build the Docker image
    await buildMockEmbeddingImage();

    // Step 2: Load into Kind cluster
    await loadMockEmbeddingImageToKind(clusterName);

    // Step 3: Deploy to Kubernetes
    await deployMockEmbeddingService();

    // Step 4: Wait for service to be ready
    const ready = await waitForMockServiceReady(60000);

    if (ready) {
      console.log('\n========================================');
      console.log('Mock Embedding Service Ready!');
      console.log('Endpoint: http://mock-embedding-service.default.svc.cluster.local');
      console.log('========================================\n');
      return true;
    } else {
      console.error('Mock embedding service failed to become ready.');
      return false;
    }
  } catch (error) {
    console.error('Error setting up mock embedding service:', error.message);
    return false;
  }
}

/**
 * Get the mock embedding service endpoint URL
 *
 * @returns {string}
 */
function getMockEmbeddingEndpoint() {
  return `http://${MOCK_SERVICE_NAME}.${MOCK_SERVICE_NAMESPACE}.svc.cluster.local`;
}

/**
 * Update reaction configurations to use the mock embedding service
 *
 * @param {Array} reactions - Array of reaction YAML objects
 * @returns {Array} - Updated reaction objects
 */
function updateReactionsForMock(reactions) {
  const mockEndpoint = getMockEmbeddingEndpoint();

  // Create deep copy to avoid mutation
  const updatedReactions = JSON.parse(JSON.stringify(reactions));

  updatedReactions.forEach(reaction => {
    if (reaction.spec?.properties) {
      reaction.spec.properties.embeddingEndpoint = mockEndpoint;
      reaction.spec.properties.embeddingApiKey = 'mock-api-key';
      reaction.spec.properties.embeddingModel = 'mock-embedding-model';
    }
  });

  return updatedReactions;
}

module.exports = {
  buildMockEmbeddingImage,
  loadMockEmbeddingImageToKind,
  deployMockEmbeddingService,
  waitForMockServiceReady,
  deleteMockEmbeddingService,
  setupMockEmbeddingService,
  getMockEmbeddingEndpoint,
  updateReactionsForMock,
  MOCK_SERVICE_NAME,
  MOCK_SERVICE_NAMESPACE,
  MOCK_IMAGE_NAME,
  MOCK_IMAGE_TAG
};
