const { afterAll, beforeAll, describe, expect, test } = require('@jest/globals');
const axios = require('axios');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const deleteResources = require('../fixtures/delete-resources');
const deployResources = require('../fixtures/deploy-resources');
const PortForward = require('../fixtures/port-forward');
const { waitFor, waitForChildProcess } = require('../fixtures/infrastructure');

const SCENARIO_DIR = __dirname;
const REPOSITORY_ROOT = path.resolve(SCENARIO_DIR, '..', '..');
const PYTHON_SDK_ROOT = path.join(REPOSITORY_ROOT, 'reactions', 'sdk', 'python');
const REACTION_PROVIDER_FILE = path.join(SCENARIO_DIR, 'reaction-provider.yaml');
const REACTION_FILE = path.join(SCENARIO_DIR, 'reaction.yaml');
const REACTION_IMAGE = 'drasi-project/e2e-python-state-reaction:latest';
const REACTION_ID = 'python-state-store-e2e';
const REACTION_SERVICE = 'python';
const DEPLOYMENT_NAME = `${REACTION_ID}-${REACTION_SERVICE}`;
const APP_ID = DEPLOYMENT_NAME;
const COMPONENT_NAME = `drasi-statestore-${REACTION_ID}`;
const NAMESPACE = 'drasi-system';

function loadYaml(filePath) {
  return yaml.loadAll(fs.readFileSync(filePath, 'utf8')).filter(Boolean);
}

async function buildAndLoadReactionImage() {
  await waitForChildProcess(
    cp.spawn('docker', [
      'build',
      '-f',
      path.join(PYTHON_SDK_ROOT, 'examples', 'state-store', 'Dockerfile'),
      '-t',
      REACTION_IMAGE,
      PYTHON_SDK_ROOT,
    ]),
    'python-state-reaction-build',
  );
  await waitForChildProcess(
    cp.spawn('kind', [
      'load',
      'docker-image',
      REACTION_IMAGE,
      '--name',
      'drasi-test',
    ]),
    'python-state-reaction-load',
  );
}

function getComponent() {
  try {
    return JSON.parse(
      cp.execFileSync(
        'kubectl',
        ['get', 'component', COMPONENT_NAME, '-n', NAMESPACE, '-o', 'json'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ),
    );
  } catch {
    return null;
  }
}

function getDeployment() {
  return JSON.parse(
    cp.execFileSync(
      'kubectl',
      ['get', 'deployment', DEPLOYMENT_NAME, '-n', NAMESPACE, '-o', 'json'],
      { encoding: 'utf8' },
    ),
  );
}

describe('Reaction provider state store dependency', () => {
  const reactionProviderResources = loadYaml(REACTION_PROVIDER_FILE);
  const reactionResources = loadYaml(REACTION_FILE);
  let portForward;
  let daprPort;
  let reactionDeleted = false;

  beforeAll(async () => {
    await buildAndLoadReactionImage();
    await deployResources(reactionProviderResources);
    await deployResources(reactionResources);

    const component = await waitFor({
      actionFn: getComponent,
      predicateFn: value => value !== null,
      timeoutMs: 30000,
      description: `${COMPONENT_NAME} to be created`,
    });
    expect(component).not.toBeNull();

    portForward = new PortForward(DEPLOYMENT_NAME, 3500, NAMESPACE, 'deployment');
    daprPort = await portForward.start();
  }, 300000);

  afterAll(async () => {
    portForward?.stop();
    const cleanup = reactionDeleted
      ? reactionProviderResources
      : [...reactionResources, ...reactionProviderResources];
    await deleteResources(cleanup);
  }, 180000);

  test('provisions, injects, persists, and removes the reaction state store', async () => {
    const component = getComponent();
    expect(component.spec.type).toBe('state.mongodb');
    expect(component.spec.version).toBe('v1');

    const deployment = getDeployment();
    const reactionContainer = deployment.spec.template.spec.containers.find(
      container => container.name === REACTION_SERVICE,
    );
    const stateStoreEnv = reactionContainer.env.find(
      env => env.name === 'StateStoreName',
    );
    expect(stateStoreEnv.value).toBe(COMPONENT_NAME);

    let sequence = 0;
    const sendChange = async () => {
      sequence += 1;
      await axios.post(
        `http://127.0.0.1:${daprPort}/v1.0/invoke/${APP_ID}/method/counter-query`,
        {
          data: {
            kind: 'change',
            queryId: 'counter-query',
            sequence,
            sourceTimeMs: Date.now(),
            addedResults: [],
            updatedResults: [],
            deletedResults: [],
          },
        },
        { timeout: 10000 },
      );
    };
    const getCounter = async () => {
      const response = await axios.get(
        `http://127.0.0.1:${daprPort}/v1.0/state/${COMPONENT_NAME}/counter`,
        { timeout: 10000 },
      );
      return Number(response.data);
    };

    await sendChange();
    expect(await getCounter()).toBe(1);
    await sendChange();
    expect(await getCounter()).toBe(2);

    portForward.stop();
    await waitForChildProcess(
      cp.exec(
        `kubectl delete pod -n ${NAMESPACE} -l drasi/resource=${REACTION_ID} --wait=true`,
        { encoding: 'utf8' },
      ),
      'delete-python-state-reaction-pod',
    );
    await waitForChildProcess(
      cp.exec(
        `kubectl wait --for=condition=Ready pod -n ${NAMESPACE} -l drasi/resource=${REACTION_ID} --timeout=180s`,
        { encoding: 'utf8' },
      ),
      'wait-python-state-reaction-pod',
    );

    portForward = new PortForward(DEPLOYMENT_NAME, 3500, NAMESPACE, 'deployment');
    daprPort = await portForward.start();
    expect(await getCounter()).toBe(2);
    await sendChange();
    expect(await getCounter()).toBe(3);

    cp.execSync('drasi delete', {
      input: yaml.dump(reactionResources[0]),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    reactionDeleted = true;

    const deletedComponent = await waitFor({
      actionFn: getComponent,
      predicateFn: value => value === null,
      timeoutMs: 30000,
      description: `${COMPONENT_NAME} to be deleted`,
    });
    expect(deletedComponent).toBeNull();
  }, 300000);
});
