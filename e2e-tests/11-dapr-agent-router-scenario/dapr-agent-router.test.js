const { afterAll, beforeAll, describe, expect, test } = require('@jest/globals');
const axios = require('axios');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const portfinder = require('portfinder');
const { Client: PgClient } = require('pg');
const { createClient: createRedisClient } = require('redis');
const yaml = require('js-yaml');

const deleteResources = require('../fixtures/delete-resources');
const deployResources = require('../fixtures/deploy-resources');
const { waitForChildProcess } = require('../fixtures/infrastructure');

const SCENARIO_DIR = __dirname;
const NAMESPACE = 'drasi-system';
const REACTION_ID = 'i460-agent-router';
const REACTION_SERVICE = 'reaction';
const DEPLOYMENT_NAME = `${REACTION_ID}-${REACTION_SERVICE}`;
const APP_ID = DEPLOYMENT_NAME;
const ROUTER_ID = `${NAMESPACE}/${APP_ID}`;
const STATE_COMPONENT = `drasi-statestore-${REACTION_ID}`;
const INBOUND_COMPONENT = `drasi-pubsub-${REACTION_ID}`;
const EGRESS_COMPONENT = 'i460-agent-egress';
const CONSUMER_GROUP = REACTION_ID;
const QUERY_ALL = 'i460-router-all';
const QUERY_PRIORITY = 'i460-router-priority';
const QUERY_IDS = [QUERY_ALL, QUERY_PRIORITY];
const POSTGRES_SERVICE = 'i460-router-postgres';
const APPLICATION_REDIS_SERVICE = 'i460-agent-redis';
const INTERNAL_REDIS_SERVICE = 'drasi-redis';
const APPLICATION_NAMESPACE = 'default';
const RECEIVER_NAME = 'i460-agent-receiver';
const RECEIVER_APP_ID = 'i460-e2e-reader';
const RECEIVER_PORT = 8080;
const RECEIVER_TOPIC_PLACEHOLDER = '__I460_INBOX_TOPIC__';
const RUN_ID = `${Date.now()}-${process.pid}`;
const INCARNATION = `i460-e2e-${RUN_ID}`;
const SUBSCRIBER = {
  namespace: APPLICATION_NAMESPACE,
  app_id: RECEIVER_APP_ID,
  agent_name: 'Issue460E2E',
};

const DELIVERY_VALIDATOR = `
import json
import sys
from drasi_agent_router_contracts import AgentDelivery, parse, to_wire

outer = json.load(sys.stdin)
delivery = outer["data"]
if isinstance(delivery, str):
    delivery = json.loads(delivery)
delivery = to_wire(parse(AgentDelivery, delivery))
event = delivery["event"]
payload = event["payload"]
summary = {
    "cloudEventPubsub": outer.get("pubsubname"),
    "cloudEventTopic": outer.get("topic"),
    "envelopeKeys": sorted(delivery),
    "eventKeys": sorted(event),
    "payloadKeys": sorted(payload),
    "schemaVersion": delivery["schemaVersion"],
    "routerId": delivery["routerId"],
    "subscriptionIncarnation": delivery["subscriptionIncarnation"],
    "eventId": delivery["eventId"],
    "operation": event["op"],
    "sequence": str(event["seq"]),
    "timestamp": event["ts_ms"],
    "source": payload["source"],
}
if "before" in payload:
    summary["before"] = payload["before"]
if "after" in payload:
    summary["after"] = payload["after"]
print(json.dumps(summary, separators=(",", ":")))
`;

function loadYaml(fileName) {
  return yaml
    .loadAll(fs.readFileSync(path.join(SCENARIO_DIR, fileName), 'utf8'))
    .filter(Boolean);
}

function receiverResourcesForTopic(resources, topicName) {
  const result = JSON.parse(JSON.stringify(resources));
  const subscription = result.find(resource => resource.kind === 'Subscription');
  if (subscription?.spec.topic !== RECEIVER_TOPIC_PLACEHOLDER) {
    throw new Error('Receiver Subscription topic placeholder is missing');
  }
  subscription.spec.topic = topicName;
  return result;
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function eventually({
  actionFn,
  predicateFn,
  description,
  timeoutMs = 60000,
  pollIntervalMs = 500,
}) {
  const deadline = Date.now() + timeoutMs;
  let lastValue;
  let lastError;

  while (Date.now() < deadline) {
    try {
      lastValue = await actionFn();
      if (predicateFn(lastValue)) {
        return lastValue;
      }
      lastError = undefined;
    } catch (error) {
      lastError = error;
    }
    await sleep(pollIntervalMs);
  }

  const detail = lastError
    ? lastError.message
    : `last value: ${JSON.stringify(lastValue)}`;
  throw new Error(`Timed out waiting for ${description}; ${detail}`);
}

class ReliablePortForward {
  constructor(resourceName, remotePort, namespace, resourceType) {
    this.resourceName = resourceName;
    this.remotePort = remotePort;
    this.namespace = namespace;
    this.resourceType = resourceType;
    this.process = null;
  }

  isActive() {
    return (
      this.process !== null &&
      this.process.exitCode === null &&
      this.process.signalCode === null
    );
  }

  async start() {
    if (this.isActive()) {
      throw new Error(`Port forward for ${this.resourceName} is already active`);
    }

    const localPort = await portfinder.getPortPromise();
    const process = cp.spawn('kubectl', [
      'port-forward',
      `${this.resourceType}/${this.resourceName}`,
      `${localPort}:${this.remotePort}`,
      '-n',
      this.namespace,
      '--address',
      '127.0.0.1',
    ]);
    this.process = process;

    await new Promise((resolve, reject) => {
      let settled = false;
      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          process.kill();
          reject(new Error(`Port forward for ${this.resourceName} did not start`));
        }
      }, 20000);

      const inspect = chunk => {
        const message = chunk.toString();
        if (!settled && message.includes('Forwarding from')) {
          settled = true;
          clearTimeout(timeout);
          resolve();
        }
      };

      process.stdout.on('data', inspect);
      process.stderr.on('data', inspect);
      process.once('error', error => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          reject(error);
        }
      });
      process.once('exit', code => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          reject(
            new Error(
              `Port forward for ${this.resourceName} exited with code ${code}`,
            ),
          );
        }
      });
    });

    return localPort;
  }

  async stop() {
    const process = this.process;
    this.process = null;
    if (
      !process ||
      process.exitCode !== null ||
      process.signalCode !== null
    ) {
      return;
    }

    const exited = new Promise(resolve => {
      process.once('exit', () => {
        resolve();
      });
    });
    process.kill();
    await Promise.race([exited, sleep(5000)]);
    if (process.exitCode === null && process.signalCode === null) {
      process.kill('SIGKILL');
      await Promise.race([exited, sleep(2000)]);
    }
  }
}

function kubectlJson(args) {
  try {
    return JSON.parse(
      cp.execFileSync('kubectl', args, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    );
  } catch (error) {
    if (/\bnot[ -]?found\b|\b404\b/i.test(cleanupErrorText(error))) {
      return null;
    }
    throw error;
  }
}

function getDeployment() {
  return kubectlJson([
    'get',
    'deployment',
    DEPLOYMENT_NAME,
    '-n',
    NAMESPACE,
    '-o',
    'json',
  ]);
}

function getStateComponent() {
  return kubectlJson([
    'get',
    'component',
    STATE_COMPONENT,
    '-n',
    NAMESPACE,
    '-o',
    'json',
  ]);
}

function getInboundComponent() {
  return kubectlJson([
    'get',
    'component',
    INBOUND_COMPONENT,
    '-n',
    NAMESPACE,
    '-o',
    'json',
  ]);
}

function getReceiverDeployment() {
  return kubectlJson([
    'get',
    'deployment',
    RECEIVER_NAME,
    '-n',
    APPLICATION_NAMESPACE,
    '-o',
    'json',
  ]);
}

function getReadyRouterPod() {
  const podList = kubectlJson([
    'get',
    'pods',
    '-n',
    NAMESPACE,
    '-l',
    `drasi/resource=${REACTION_ID},drasi/service=${REACTION_SERVICE}`,
    '-o',
    'json',
  ]);
  if (!podList) {
    return null;
  }

  const pod = podList.items.find(
    item =>
      !item.metadata.deletionTimestamp &&
      item.status.conditions?.some(
        condition => condition.type === 'Ready' && condition.status === 'True',
      ),
  );
  return pod
    ? { name: pod.metadata.name, uid: pod.metadata.uid }
    : null;
}

async function openPostgres(port) {
  return eventually({
    actionFn: async () => {
      const client = new PgClient({
        host: '127.0.0.1',
        port,
        user: 'i460user',
        password: 'i460password',
        database: 'i460db',
      });
      try {
        await client.connect();
        await client.query('SELECT 1');
        return client;
      } catch {
        await client.end().catch(() => {});
        return null;
      }
    },
    predicateFn: client => client !== null,
    description: 'PostgreSQL to accept connections',
    timeoutMs: 60000,
  });
}

async function openRedis(port, name) {
  return eventually({
    actionFn: async () => {
      const client = createRedisClient({ url: `redis://127.0.0.1:${port}` });
      client.on('error', () => {});
      try {
        await client.connect();
        await client.ping();
        return client;
      } catch {
        if (client.isOpen) {
          await client.quit().catch(() => client.disconnect());
        }
        return null;
      }
    },
    predicateFn: client => client !== null,
    description: `${name} Redis to accept connections`,
    timeoutMs: 60000,
  });
}

function redisIdAtLeast(actual, expected) {
  const parse = value => value.split('-').map(part => BigInt(part));
  const [actualTime, actualSequence] = parse(actual);
  const [expectedTime, expectedSequence] = parse(expected);
  return (
    actualTime > expectedTime ||
    (actualTime === expectedTime && actualSequence >= expectedSequence)
  );
}

async function readStream(redisClient, streamName) {
  const messages = await redisClient.xRange(streamName, '-', '+');
  return messages.map(message => ({
    id: message.id,
    raw: message.message.data,
  }));
}

function cloudEventData(raw) {
  const cloudEvent = JSON.parse(raw);
  return typeof cloudEvent.data === 'string'
    ? JSON.parse(cloudEvent.data)
    : cloudEvent.data;
}

function snapshotsContainMarker(payload, marker) {
  return [payload.before, payload.after].some(
    snapshot => snapshot?.marker === marker,
  );
}

function packedChangeContainsMarker(packed, marker, operation) {
  if (operation === 'i') {
    return packed.addedResults?.some(row => row.marker === marker);
  }
  if (operation === 'u') {
    return packed.updatedResults?.some(change =>
      snapshotsContainMarker(change, marker),
    );
  }
  return packed.deletedResults?.some(row => row.marker === marker);
}

function deliveryMatches(raw, { queryId, operation, marker }) {
  const delivery = cloudEventData(raw);
  return (
    delivery.event?.op === operation &&
    delivery.event.payload?.source?.queryId === queryId &&
    snapshotsContainMarker(delivery.event.payload, marker)
  );
}

async function getConsumerGroup(
  redisClient,
  streamName,
  consumerGroup = CONSUMER_GROUP,
) {
  try {
    const groups = await redisClient.xInfoGroups(streamName);
    return groups.find(group => group.name === consumerGroup) ?? null;
  } catch (error) {
    if (error.message?.toLowerCase().includes('no such key')) {
      return null;
    }
    throw error;
  }
}

function groupLastDeliveredId(group) {
  return group?.lastDeliveredId ?? group?.['last-delivered-id'];
}

async function waitForConsumerGroups(internalRedis) {
  return eventually({
    actionFn: async () =>
      Promise.all(
        QUERY_IDS.map(queryId =>
          getConsumerGroup(internalRedis, `${queryId}-results`),
        ),
      ),
    predicateFn: groups => groups.every(Boolean),
    description: 'router Redis consumer groups for both queries',
    timeoutMs: 120000,
  });
}

async function waitForInputProcessed(
  internalRedis,
  queryId,
  operation,
  marker,
) {
  const streamName = `${queryId}-results`;
  const entry = await eventually({
    actionFn: async () => {
      const entries = await readStream(internalRedis, streamName);
      return (
        entries.find(item =>
          packedChangeContainsMarker(
            cloudEventData(item.raw),
            marker,
            operation,
          ),
        ) ?? null
      );
    },
    predicateFn: value => value !== null,
    description: `${queryId} packed input containing ${marker}`,
    timeoutMs: 60000,
  });

  await eventually({
    actionFn: () => getConsumerGroup(internalRedis, streamName),
    predicateFn: group => {
      const lastDeliveredId = groupLastDeliveredId(group);
      return (
        lastDeliveredId &&
        redisIdAtLeast(lastDeliveredId, entry.id) &&
        Number(group.pending) === 0
      );
    },
    description: `${queryId} input ${entry.id} to be acknowledged`,
    timeoutMs: 60000,
  });
}

function validateDeliveryInRouter(raw, podName) {
  const output = cp.execFileSync(
    'kubectl',
    [
      'exec',
      '-i',
      '-n',
      NAMESPACE,
      podName,
      '-c',
      REACTION_SERVICE,
      '--',
      'python',
      '-c',
      DELIVERY_VALIDATOR,
    ],
    {
      input: raw,
      encoding: 'utf8',
      timeout: 20000,
      maxBuffer: 1024 * 1024,
    },
  );
  return JSON.parse(output);
}

async function readReceiverRecords(receiverBaseUrl) {
  const response = await axios.get(`${receiverBaseUrl}/records`, {
    timeout: 10000,
  });
  if (!Array.isArray(response.data?.records)) {
    throw new Error('Receiver records response is invalid');
  }
  return response.data.records.map(record => {
    if (
      !Number.isInteger(record.id) ||
      typeof record.body_base64 !== 'string'
    ) {
      throw new Error('Receiver record is invalid');
    }
    return {
      id: record.id,
      raw: Buffer.from(record.body_base64, 'base64'),
    };
  });
}

function validatedDeliveryMatches(delivery, { queryId, operation, marker }) {
  return (
    delivery.operation === operation &&
    delivery.source?.queryId === queryId &&
    [delivery.before, delivery.after].some(
      snapshot => snapshot?.marker === marker,
    )
  );
}

async function waitForReceiverDelivery({
  receiverBaseUrl,
  validationCache,
  podName,
  queryId,
  operation,
  marker,
}) {
  return eventually({
    actionFn: async () => {
      const records = await readReceiverRecords(receiverBaseUrl);
      for (const record of records) {
        let delivery = validationCache.get(record.id);
        if (!delivery) {
          delivery = validateDeliveryInRouter(record.raw, podName);
          validationCache.set(record.id, delivery);
        }
        if (
          validatedDeliveryMatches(delivery, {
            queryId,
            operation,
            marker,
          })
        ) {
          return delivery;
        }
      }
      return null;
    },
    predicateFn: delivery => delivery !== null,
    description: `${operation} receiver callback for ${queryId}/${marker}`,
    timeoutMs: 60000,
  });
}

async function expectNoDelivery(applicationRedis, topicName, expected) {
  const entries = await readStream(applicationRedis, topicName);
  expect(entries.some(entry => deliveryMatches(entry.raw, expected))).toBe(false);
}

async function assertDelivery({
  receiverBaseUrl,
  receiverValidationCache,
  topicName,
  podName,
  queryId,
  operation,
  marker,
  before,
  after,
}) {
  const delivery = await waitForReceiverDelivery({
    receiverBaseUrl,
    validationCache: receiverValidationCache,
    podName,
    queryId,
    operation,
    marker,
  });

  expect(delivery.cloudEventPubsub).toBe(EGRESS_COMPONENT);
  expect(delivery.cloudEventTopic).toBe(topicName);
  expect(delivery.envelopeKeys).toEqual([
    'event',
    'eventId',
    'routerId',
    'schemaVersion',
    'subscriptionIncarnation',
  ]);
  expect(delivery.eventKeys).toEqual(['op', 'payload', 'seq', 'ts_ms']);
  expect(delivery.payloadKeys).toEqual(
    ['source', before && 'before', after && 'after']
      .filter(Boolean)
      .sort(),
  );
  expect(delivery.schemaVersion).toBe(1);
  expect(delivery.routerId).toBe(ROUTER_ID);
  expect(delivery.subscriptionIncarnation).toBe(INCARNATION);
  expect(delivery.operation).toBe(operation);
  expect(delivery.sequence).toMatch(/^(0|[1-9][0-9]*)$/);
  expect(delivery.eventId).toBe(
    `drasi:v1:${queryId}:${delivery.sequence}:${operation}:0`,
  );
  expect(delivery.timestamp).toBeGreaterThan(0);
  expect(delivery.source.queryId).toBe(queryId);
  expect(delivery.source.ts_ms).toBeGreaterThan(0);
  expect(delivery.before).toEqual(before);
  expect(delivery.after).toEqual(after);
}

function safeExec(command, args) {
  try {
    const output = cp.execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 20000,
      maxBuffer: 1024 * 1024,
    });
    console.error(`Diagnostic ${command} ${args.join(' ')}:\n${output}`);
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n');
    console.error(
      `Diagnostic ${command} ${args.join(' ')} failed: ${error.message}\n${output}`,
    );
  }
}

function cleanupErrorText(error) {
  return [
    error?.message,
    error?.stdout?.toString(),
    error?.stderr?.toString(),
    typeof error === 'string' ? error : undefined,
  ]
    .filter(Boolean)
    .join('\n');
}

function collectCleanupError(errors, label, error) {
  const detail = cleanupErrorText(error) || String(error);
  const cleanupError = new Error(`${label}: ${detail}`);
  cleanupError.cause = error;
  errors.push(cleanupError);
  console.error(cleanupError.message);
}

async function deleteDefinitions(resources, label, cleanupErrors) {
  for (const resource of resources) {
    try {
      await deleteResources([resource]);
    } catch (error) {
      const name = resource.name ?? resource.metadata?.name;
      const detail = cleanupErrorText(error);
      if (/\bnot[ -]?found\b|\b404\b/i.test(detail)) {
        continue;
      }
      collectCleanupError(
        cleanupErrors,
        `Failed to delete ${label} ${resource.kind}/${name}`,
        error,
      );
    }
  }
}

describe('DaprAgentRouter PostgreSQL to receiving application path', () => {
  const infrastructureResources = loadYaml('resources.yaml');
  const sourceResources = loadYaml('sources.yaml');
  const queryResources = loadYaml('queries.yaml');
  const reactionResources = loadYaml('reactions.yaml');
  const receiverResourceTemplates = loadYaml('receiver.yaml');

  let postgresForward;
  let applicationRedisForward;
  let internalRedisForward;
  let routerForward;
  let receiverForward;
  let receiverDaprForward;
  let postgres;
  let applicationRedis;
  let internalRedis;
  let routerDaprUrl;
  let routerBaseUrl;
  let receiverBaseUrl;
  let receiverDaprUrl;
  let mcpProtocol;
  let mcpRequestId = 0;
  let applicationTopic;
  let deadLetterTopic;
  let deadLetterBaseline = 0;
  let deployedReceiverResources = [];
  let scenarioCompleted = false;
  const receiverValidationCache = new Map();

  const invokeRouter = async (method, route, data, headers = {}) => {
    const response = await axios({
      method,
      url: `${routerBaseUrl}${route}`,
      data,
      headers,
      timeout: 10000,
    });
    return response.data;
  };

  const startRouterForward = async () => {
    await routerForward?.stop();
    routerForward = new ReliablePortForward(
      DEPLOYMENT_NAME,
      3500,
      NAMESPACE,
      'deployment',
    );
    const port = await routerForward.start();
    routerDaprUrl = `http://127.0.0.1:${port}`;
    routerBaseUrl = `${routerDaprUrl}/v1.0/invoke/${APP_ID}.${NAMESPACE}/method`;
    await eventually({
      actionFn: () => invokeRouter('get', '/readyz'),
      predicateFn: body => body?.status === 'ready',
      description: 'router /readyz through Dapr service invocation',
      timeoutMs: 120000,
    });
    await eventually({
      actionFn: async () =>
        (await axios.get(`${routerDaprUrl}/v1.0/metadata`, { timeout: 10000 }))
          .data,
      predicateFn: metadata => {
        const subscriptions = metadata.subscriptions ?? [];
        return QUERY_IDS.every(queryId =>
          subscriptions.some(
            subscription =>
              subscription.pubsubname === INBOUND_COMPONENT &&
              subscription.topic === `${queryId}-results`,
          ),
        );
      },
      description: 'Dapr sidecar subscriptions for both query streams',
      timeoutMs: 120000,
    });
  };

  const deployAndStartReceiver = async topicName => {
    deployedReceiverResources = receiverResourcesForTopic(
      receiverResourceTemplates,
      topicName,
    );
    await deployResources(deployedReceiverResources);

    receiverForward = new ReliablePortForward(
      RECEIVER_NAME,
      RECEIVER_PORT,
      APPLICATION_NAMESPACE,
      'service',
    );
    receiverBaseUrl = `http://127.0.0.1:${await receiverForward.start()}`;
    await eventually({
      actionFn: async () =>
        (await axios.get(`${receiverBaseUrl}/healthz`, { timeout: 10000 }))
          .data,
      predicateFn: body => body?.status === 'ready',
      description: 'receiver HTTP readiness',
      timeoutMs: 60000,
    });

    receiverDaprForward = new ReliablePortForward(
      RECEIVER_NAME,
      3500,
      APPLICATION_NAMESPACE,
      'deployment',
    );
    receiverDaprUrl = `http://127.0.0.1:${await receiverDaprForward.start()}`;
    await eventually({
      actionFn: async () =>
        (
          await axios.get(`${receiverDaprUrl}/v1.0/metadata`, {
            timeout: 10000,
          })
        ).data,
      predicateFn: metadata =>
        (metadata.subscriptions ?? []).some(
          subscription =>
            subscription.pubsubname === EGRESS_COMPONENT &&
            subscription.topic === topicName,
        ),
      description: 'receiver Dapr subscription metadata',
      timeoutMs: 120000,
    });
    await eventually({
      actionFn: () =>
        getConsumerGroup(
          applicationRedis,
          topicName,
          RECEIVER_APP_ID,
        ),
      predicateFn: group => group !== null && Number(group.consumers) >= 1,
      description: 'receiver Redis consumer group on the application inbox',
      timeoutMs: 120000,
    });
  };

  const initializeMcp = async () => {
    const headers = {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    };
    const initialization = await invokeRouter(
      'post',
      '/mcp',
      {
        jsonrpc: '2.0',
        id: ++mcpRequestId,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'platform-i460-e2e', version: '1' },
        },
      },
      headers,
    );
    mcpProtocol = initialization.result.protocolVersion;
    await invokeRouter(
      'post',
      '/mcp',
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { ...headers, 'MCP-Protocol-Version': mcpProtocol },
    );
  };

  const callToolResult = async (name, args) => {
    const response = await invokeRouter(
      'post',
      '/mcp',
      {
        jsonrpc: '2.0',
        id: ++mcpRequestId,
        method: 'tools/call',
        params: { name, arguments: args },
      },
      {
        Accept: 'application/json, text/event-stream',
        'Content-Type': 'application/json',
        'MCP-Protocol-Version': mcpProtocol,
      },
    );
    return response.result;
  };

  const callTool = async (name, args) => {
    const result = await callToolResult(name, args);
    expect(result.isError).toBe(false);
    expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
    return result.structuredContent;
  };

  const subscriptionRequest = (queryId, operations) => ({
    query_id: queryId,
    operations,
    subscriber: SUBSCRIBER,
    subscription_incarnation: INCARNATION,
  });

  const unsubscribeRequest = queryId => ({
    query_id: queryId,
    subscriber: SUBSCRIBER,
    subscription_incarnation: INCARNATION,
  });

  const expectRules = async expectedRules => {
    const snapshot = await invokeRouter('get', '/admin/rules');
    expect(snapshot).toEqual({
      router_id: ROUTER_ID,
      view: 'routing_snapshot',
      rules: expectedRules,
    });
  };

  beforeAll(async () => {
    await deployResources(infrastructureResources);

    postgresForward = new ReliablePortForward(
      POSTGRES_SERVICE,
      5432,
      'default',
      'service',
    );
    postgres = await openPostgres(await postgresForward.start());

    applicationRedisForward = new ReliablePortForward(
      APPLICATION_REDIS_SERVICE,
      6379,
      'default',
      'service',
    );
    applicationRedis = await openRedis(
      await applicationRedisForward.start(),
      'application broker',
    );

    internalRedisForward = new ReliablePortForward(
      INTERNAL_REDIS_SERVICE,
      6379,
      NAMESPACE,
      'service',
    );
    internalRedis = await openRedis(
      await internalRedisForward.start(),
      'Drasi internal broker',
    );

    await deployResources(sourceResources);
    await deployResources(queryResources);
    await Promise.all(
      QUERY_IDS.map(queryId =>
        waitForChildProcess(
          cp.spawn('drasi', [
            'wait',
            'continuousquery',
            queryId,
            '-t',
            '180',
          ]),
          queryId,
        ),
      ),
    );

    await deployResources(reactionResources);
    await startRouterForward();
    await invokeRouter(
      'post',
      '/admin/subscribers/remove-rules',
      { subscriber: SUBSCRIBER },
      { 'Content-Type': 'application/json' },
    );

    const deployment = getDeployment();
    expect(deployment).not.toBeNull();
    expect(deployment.spec.replicas).toBe(1);
    expect(deployment.spec.strategy.type).toBe('Recreate');
    const stateComponent = getStateComponent();
    expect(stateComponent).not.toBeNull();
    expect(stateComponent.spec.type).toBe('state.mongodb');

    const subscriptions = await invokeRouter('get', '/dapr/subscribe');
    expect(subscriptions).toHaveLength(2);
    expect(subscriptions.map(item => item.topic).sort()).toEqual(
      QUERY_IDS.map(queryId => `${queryId}-results`).sort(),
    );
    expect(new Set(subscriptions.map(item => item.pubsubname))).toEqual(
      new Set([INBOUND_COMPONENT]),
    );
    expect(new Set(subscriptions.map(item => item.deadLetterTopic)).size).toBe(1);
    deadLetterTopic = subscriptions[0].deadLetterTopic;

    await waitForConsumerGroups(internalRedis);
    deadLetterBaseline = await internalRedis.xLen(deadLetterTopic);
    await initializeMcp();
  }, 480000);

  afterAll(async () => {
    const cleanupErrors = [];
    if (!scenarioCompleted) {
      safeExec('kubectl', [
        'get',
        'pods',
        '-n',
        NAMESPACE,
        '-l',
        `drasi/resource=${REACTION_ID}`,
        '-o',
        'wide',
      ]);
      safeExec('kubectl', [
        'logs',
        '-n',
        NAMESPACE,
        `deployment/${DEPLOYMENT_NAME}`,
        '-c',
        REACTION_SERVICE,
        '--tail=100',
      ]);
      safeExec('kubectl', [
        'logs',
        '-n',
        NAMESPACE,
        `deployment/${DEPLOYMENT_NAME}`,
        '-c',
        'daprd',
        '--tail=100',
      ]);
      safeExec('drasi', ['describe', 'reaction', REACTION_ID]);
      if (deployedReceiverResources.length > 0) {
        safeExec('kubectl', [
          'logs',
          '-n',
          APPLICATION_NAMESPACE,
          `deployment/${RECEIVER_NAME}`,
          '-c',
          'receiver',
          '--tail=100',
        ]);
        safeExec('kubectl', [
          'logs',
          '-n',
          APPLICATION_NAMESPACE,
          `deployment/${RECEIVER_NAME}`,
          '-c',
          'daprd',
          '--tail=100',
        ]);
      }
      if (receiverBaseUrl) {
        try {
          const records = await readReceiverRecords(receiverBaseUrl);
          const pod = getReadyRouterPod();
          const diagnostics = records.map(record => {
            const summary = {
              id: record.id,
              bytes: record.raw.length,
            };
            if (pod) {
              try {
                summary.delivery = validateDeliveryInRouter(
                  record.raw,
                  pod.name,
                );
              } catch (error) {
                summary.validationError = error.message;
              }
            }
            return summary;
          });
          console.error('Receiver recorded callbacks:', diagnostics);
        } catch (error) {
          console.error('Failed to collect receiver diagnostics:', error);
        }
      }
      if (internalRedis?.isOpen) {
        try {
          const groups = {};
          for (const queryId of QUERY_IDS) {
            groups[queryId] = await getConsumerGroup(
              internalRedis,
              `${queryId}-results`,
            );
          }
          console.error('Router inbound Redis groups:', groups);
          if (deadLetterTopic) {
            console.error(
              `Router dead-letter stream ${deadLetterTopic} length:`,
              await internalRedis.xLen(deadLetterTopic),
            );
          }
          if (applicationTopic && applicationRedis?.isOpen) {
            console.error(
              `Application inbox stream ${applicationTopic} length:`,
              await applicationRedis.xLen(applicationTopic),
            );
          }
        } catch (error) {
          console.error('Failed to collect Redis diagnostics:', error);
        }
      }
    }

    if (applicationTopic) {
      try {
        if (!routerForward?.isActive() && getDeployment()) {
          await startRouterForward();
        }
        if (!routerForward?.isActive()) {
          throw new Error('Router is unavailable for durable rule cleanup');
        }
        await invokeRouter(
          'post',
          '/admin/subscribers/remove-rules',
          { subscriber: SUBSCRIBER },
          { 'Content-Type': 'application/json' },
        );
        const snapshot = await invokeRouter('get', '/admin/rules');
        expect(
          snapshot.rules.filter(
            rule =>
              rule.subscriber.namespace === SUBSCRIBER.namespace &&
              rule.subscriber.app_id === SUBSCRIBER.app_id &&
              rule.subscriber.agent_name === SUBSCRIBER.agent_name,
          ),
        ).toEqual([]);
      } catch (error) {
        collectCleanupError(
          cleanupErrors,
          'Failed to remove scenario router rules',
          error,
        );
      }
    }

    if (postgres) {
      try {
        await postgres.end();
      } catch (error) {
        collectCleanupError(
          cleanupErrors,
          'Failed to close PostgreSQL',
          error,
        );
      }
    }
    for (const [name, client] of [
      ['application broker', applicationRedis],
      ['Drasi internal broker', internalRedis],
    ]) {
      if (client?.isOpen) {
        try {
          await client.quit();
        } catch (error) {
          try {
            client.disconnect();
          } catch (disconnectError) {
            collectCleanupError(
              cleanupErrors,
              `Failed to disconnect ${name} Redis after quit failure`,
              disconnectError,
            );
          }
          collectCleanupError(
            cleanupErrors,
            `Failed to close ${name} Redis`,
            error,
          );
        }
      }
    }
    await Promise.all(
      [
        ['PostgreSQL', postgresForward],
        ['application broker Redis', applicationRedisForward],
        ['Drasi internal Redis', internalRedisForward],
        ['router Dapr', routerForward],
        ['receiver HTTP', receiverForward],
        ['receiver Dapr', receiverDaprForward],
      ].map(async ([name, portForward]) => {
        try {
          await portForward?.stop();
        } catch (error) {
          collectCleanupError(
            cleanupErrors,
            `Failed to stop ${name} port forward`,
            error,
          );
        }
      }),
    );

    await deleteDefinitions(
      [...deployedReceiverResources].reverse(),
      'receiver resource',
      cleanupErrors,
    );
    if (deployedReceiverResources.length > 0) {
      try {
        await eventually({
          actionFn: getReceiverDeployment,
          predicateFn: value => value === null,
          description: `${RECEIVER_NAME} deployment deletion`,
          timeoutMs: 60000,
        });
      } catch (error) {
        collectCleanupError(
          cleanupErrors,
          `Failed to confirm ${RECEIVER_NAME} deployment deletion`,
          error,
        );
      }
    }

    await deleteDefinitions(reactionResources, 'reaction', cleanupErrors);
    try {
      await eventually({
        actionFn: () => ({
          deployment: getDeployment(),
          inboundComponent: getInboundComponent(),
          stateComponent: getStateComponent(),
        }),
        predicateFn: value =>
          value.deployment === null &&
          value.inboundComponent === null &&
          value.stateComponent === null,
        description: `${DEPLOYMENT_NAME} generated resource deletion`,
        timeoutMs: 60000,
      });
    } catch (error) {
      collectCleanupError(
        cleanupErrors,
        `Failed to confirm ${DEPLOYMENT_NAME} generated resource deletion`,
        error,
      );
    }
    await deleteDefinitions(
      [...queryResources].reverse(),
      'query',
      cleanupErrors,
    );
    await deleteDefinitions(sourceResources, 'source', cleanupErrors);

    const daprResources = infrastructureResources.filter(resource =>
      ['Resiliency', 'Component'].includes(resource.kind),
    );
    const workloads = infrastructureResources.filter(resource =>
      ['Deployment', 'StatefulSet'].includes(resource.kind),
    );
    const services = infrastructureResources.filter(
      resource => resource.kind === 'Service',
    );
    const storage = infrastructureResources.filter(
      resource => resource.kind === 'PersistentVolumeClaim',
    );
    const bootstrap = infrastructureResources.filter(resource =>
      ['ConfigMap', 'Secret'].includes(resource.kind),
    );
    await deleteDefinitions(daprResources, 'Dapr resource', cleanupErrors);
    await deleteDefinitions(workloads, 'workload', cleanupErrors);
    await deleteDefinitions(services, 'service', cleanupErrors);
    await deleteDefinitions(storage, 'storage', cleanupErrors);
    await deleteDefinitions(
      bootstrap,
      'bootstrap resource',
      cleanupErrors,
    );
    if (cleanupErrors.length > 0) {
      throw new AggregateError(
        cleanupErrors,
        `${cleanupErrors.length} scenario cleanup operation(s) failed:\n${cleanupErrors
          .map(error => `- ${error.message}`)
          .join('\n')}`,
      );
    }
  }, 300000);

  test('routes selected projected changes and restores durable rules after pod replacement', async () => {
    const catalog = await callTool('list_queries', {});
    expect(catalog.protocol_version).toBe(1);
    expect(catalog.router_id).toBe(ROUTER_ID);
    expect(catalog.queries).toHaveLength(2);
    expect(catalog.queries).toEqual(
      expect.arrayContaining([
        {
          query_id: QUERY_ALL,
          title: 'All issue 460 orders',
          description:
            'Individual projected order rows used to verify router operation filters.',
        },
        {
          query_id: QUERY_PRIORITY,
          title: 'Priority issue 460 orders',
          description:
            'Individual projected order rows whose priority flag is true.',
        },
      ]),
    );
    await expectRules([]);

    const insertSubscription = await callTool(
      'subscribe',
      subscriptionRequest(QUERY_ALL, ['i']),
    );
    expect(insertSubscription).toEqual({
      query_id: QUERY_ALL,
      operations: ['i'],
      subscription_incarnation: INCARNATION,
      topic_name: expect.any(String),
      status: 'created',
    });
    applicationTopic = insertSubscription.topic_name;
    await expectRules([
      {
        ...subscriptionRequest(QUERY_ALL, ['i']),
        topic_name: applicationTopic,
      },
    ]);
    await deployAndStartReceiver(applicationTopic);

    const initialMarker = `i460-selected-${RUN_ID}`;
    const initialInsert = await postgres.query(
      `INSERT INTO router_order (marker, quantity, priority)
       VALUES ($1, $2, $3)
       RETURNING order_id`,
      [initialMarker, 10, true],
    );
    const selectedOrderId = initialInsert.rows[0].order_id;
    await Promise.all(
      QUERY_IDS.map(queryId =>
        waitForInputProcessed(internalRedis, queryId, 'i', initialMarker),
      ),
    );
    const routerPod = await eventually({
      actionFn: getReadyRouterPod,
      predicateFn: value => value !== null,
      description: 'the initial ready router pod',
    });
    await assertDelivery({
      receiverBaseUrl,
      receiverValidationCache,
      topicName: applicationTopic,
      podName: routerPod.name,
      queryId: QUERY_ALL,
      operation: 'i',
      marker: initialMarker,
      after: {
        order_id: selectedOrderId,
        marker: initialMarker,
        quantity: 10,
        priority: true,
      },
    });
    await expectNoDelivery(applicationRedis, applicationTopic, {
      queryId: QUERY_PRIORITY,
      operation: 'i',
      marker: initialMarker,
    });

    const updateSubscription = await callTool(
      'subscribe',
      subscriptionRequest(QUERY_ALL, ['u']),
    );
    expect(updateSubscription).toEqual({
      query_id: QUERY_ALL,
      operations: ['u'],
      subscription_incarnation: INCARNATION,
      topic_name: applicationTopic,
      status: 'updated',
    });
    await expectRules([
      {
        ...subscriptionRequest(QUERY_ALL, ['u']),
        topic_name: applicationTopic,
      },
    ]);

    const filteredInsertMarker = `i460-filtered-insert-${RUN_ID}`;
    const filteredInsert = await postgres.query(
      `INSERT INTO router_order (marker, quantity, priority)
       VALUES ($1, $2, $3)
       RETURNING order_id`,
      [filteredInsertMarker, 20, false],
    );
    const filteredOrderId = filteredInsert.rows[0].order_id;
    await waitForInputProcessed(
      internalRedis,
      QUERY_ALL,
      'i',
      filteredInsertMarker,
    );
    await expectNoDelivery(applicationRedis, applicationTopic, {
      queryId: QUERY_ALL,
      operation: 'i',
      marker: filteredInsertMarker,
    });

    const updatedMarker = `i460-updated-${RUN_ID}`;
    await postgres.query(
      `UPDATE router_order
       SET marker = $1, quantity = $2
       WHERE order_id = $3`,
      [updatedMarker, 11, selectedOrderId],
    );
    await Promise.all(
      QUERY_IDS.map(queryId =>
        waitForInputProcessed(internalRedis, queryId, 'u', updatedMarker),
      ),
    );
    await assertDelivery({
      receiverBaseUrl,
      receiverValidationCache,
      topicName: applicationTopic,
      podName: routerPod.name,
      queryId: QUERY_ALL,
      operation: 'u',
      marker: updatedMarker,
      before: {
        order_id: selectedOrderId,
        marker: initialMarker,
        quantity: 10,
        priority: true,
      },
      after: {
        order_id: selectedOrderId,
        marker: updatedMarker,
        quantity: 11,
        priority: true,
      },
    });
    await expectNoDelivery(applicationRedis, applicationTopic, {
      queryId: QUERY_PRIORITY,
      operation: 'u',
      marker: updatedMarker,
    });

    const deleteSubscription = await callTool(
      'subscribe',
      subscriptionRequest(QUERY_ALL, ['d']),
    );
    expect(deleteSubscription).toEqual({
      query_id: QUERY_ALL,
      operations: ['d'],
      subscription_incarnation: INCARNATION,
      topic_name: applicationTopic,
      status: 'updated',
    });
    const deleteRule = {
      ...subscriptionRequest(QUERY_ALL, ['d']),
      topic_name: applicationTopic,
    };
    await expectRules([deleteRule]);

    const filteredUpdateMarker = `i460-filtered-update-${RUN_ID}`;
    await postgres.query(
      `UPDATE router_order
       SET marker = $1, quantity = $2
       WHERE order_id = $3`,
      [filteredUpdateMarker, 21, filteredOrderId],
    );
    await waitForInputProcessed(
      internalRedis,
      QUERY_ALL,
      'u',
      filteredUpdateMarker,
    );
    await expectNoDelivery(applicationRedis, applicationTopic, {
      queryId: QUERY_ALL,
      operation: 'u',
      marker: filteredUpdateMarker,
    });

    await postgres.query('DELETE FROM router_order WHERE order_id = $1', [
      selectedOrderId,
    ]);
    await Promise.all(
      QUERY_IDS.map(queryId =>
        waitForInputProcessed(internalRedis, queryId, 'd', updatedMarker),
      ),
    );
    await assertDelivery({
      receiverBaseUrl,
      receiverValidationCache,
      topicName: applicationTopic,
      podName: routerPod.name,
      queryId: QUERY_ALL,
      operation: 'd',
      marker: updatedMarker,
      before: {
        order_id: selectedOrderId,
        marker: updatedMarker,
        quantity: 11,
        priority: true,
      },
    });
    await expectNoDelivery(applicationRedis, applicationTopic, {
      queryId: QUERY_PRIORITY,
      operation: 'd',
      marker: updatedMarker,
    });

    const incarnationConflict = await callToolResult('unsubscribe', {
      ...unsubscribeRequest(QUERY_ALL),
      subscription_incarnation: `${INCARNATION}-conflict`,
    });
    expect(incarnationConflict.isError).toBe(true);
    expect(incarnationConflict).not.toHaveProperty('structuredContent');
    expect(incarnationConflict.content).toEqual([
      { type: 'text', text: expect.any(String) },
    ]);
    expect(JSON.parse(incarnationConflict.content[0].text)).toEqual({
      code: 'incarnation_conflict',
      message: expect.any(String),
    });
    await expectRules([deleteRule]);

    expect(
      await callTool('unsubscribe', unsubscribeRequest(QUERY_ALL)),
    ).toEqual({ query_id: QUERY_ALL, removed: true });
    expect(
      await callTool('unsubscribe', unsubscribeRequest(QUERY_ALL)),
    ).toEqual({ query_id: QUERY_ALL, removed: false });
    await expectRules([]);

    const recoverySubscription = await callTool(
      'subscribe',
      subscriptionRequest(QUERY_PRIORITY, ['i']),
    );
    expect(recoverySubscription).toEqual({
      query_id: QUERY_PRIORITY,
      operations: ['i'],
      subscription_incarnation: INCARNATION,
      topic_name: applicationTopic,
      status: 'created',
    });
    const recoveryRule = {
      ...subscriptionRequest(QUERY_PRIORITY, ['i']),
      topic_name: applicationTopic,
    };
    await expectRules([recoveryRule]);

    await routerForward.stop();
    await waitForChildProcess(
      cp.spawn('kubectl', [
        'delete',
        'pod',
        routerPod.name,
        '-n',
        NAMESPACE,
        '--wait=true',
      ]),
      'replace-i460-agent-router-pod',
    );
    const replacementPod = await eventually({
      actionFn: getReadyRouterPod,
      predicateFn: pod => pod !== null && pod.uid !== routerPod.uid,
      description: 'a replacement ready router pod with a new UID',
      timeoutMs: 180000,
    });
    expect(replacementPod.uid).not.toBe(routerPod.uid);

    await startRouterForward();
    await waitForConsumerGroups(internalRedis);
    await expectRules([recoveryRule]);

    const recoveryMarker = `i460-recovered-${RUN_ID}`;
    const recoveryInsert = await postgres.query(
      `INSERT INTO router_order (marker, quantity, priority)
       VALUES ($1, $2, $3)
       RETURNING order_id`,
      [recoveryMarker, 30, true],
    );
    const recoveryOrderId = recoveryInsert.rows[0].order_id;
    await Promise.all(
      QUERY_IDS.map(queryId =>
        waitForInputProcessed(internalRedis, queryId, 'i', recoveryMarker),
      ),
    );
    await assertDelivery({
      receiverBaseUrl,
      receiverValidationCache,
      topicName: applicationTopic,
      podName: replacementPod.name,
      queryId: QUERY_PRIORITY,
      operation: 'i',
      marker: recoveryMarker,
      after: {
        order_id: recoveryOrderId,
        marker: recoveryMarker,
        quantity: 30,
        priority: true,
      },
    });
    await expectNoDelivery(applicationRedis, applicationTopic, {
      queryId: QUERY_ALL,
      operation: 'i',
      marker: recoveryMarker,
    });

    expect(await internalRedis.xLen(deadLetterTopic)).toBe(deadLetterBaseline);
    scenarioCompleted = true;
  }, 360000);
});
