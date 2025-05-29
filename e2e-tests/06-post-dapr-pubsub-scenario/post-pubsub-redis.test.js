const { describe, beforeAll, afterAll, test, expect } = require('@jest/globals');
const { Client: PgClient } = require('pg');
const { createClient: createRedisClient } = require('redis');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const PortForward = require('../fixtures/port-forward');
const deployResources = require('../fixtures/deploy-resources');
const deleteResources = require('../fixtures/delete-resources');

const SCENARIO_DIR = __dirname;
const K8S_RESOURCES_FILE = path.join(SCENARIO_DIR, 'resources.yaml');
const SOURCES_FILE = path.join(SCENARIO_DIR, 'sources.yaml');
const QUERIES_FILE = path.join(SCENARIO_DIR, 'queries.yaml');
const REACTION_PROVIDER_FILE = path.join(SCENARIO_DIR, 'reaction-provider.yaml');
const REACTIONS_FILE = path.join(SCENARIO_DIR, 'reactions.yaml');

const POSTGRES_SERVICE_NAME = 'pubsub-test-db';
const POSTGRES_NAMESPACE = 'default';
const POSTGRES_PORT = 5432;
const POSTGRES_USER = 'testuser';
const POSTGRES_PASSWORD = 'testpassword';
const POSTGRES_DATABASE = 'testdb';

const DAPR_PUBSUB_REDIS_SERVICE_NAME = 'dapr-pubsub-redis-svc';
const DAPR_PUBSUB_REDIS_NAMESPACE = 'default';
const DAPR_PUBSUB_REDIS_PORT = 6379;

const PACKED_TOPIC = 'e2e-topic-packed';
const UNPACKED_TOPIC = 'e2e-topic-unpacked';

function loadYaml(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.loadAll(content);
}

function waitForPropagation(ms = 10000) { // Default to 10s
    console.log(`Waiting ${ms / 1000}s for propagation...`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearRedisStream(redisClient, streamKey) {
    try {
        // XTRIM with MAXLEN 0 deletes all entries.
        await redisClient.xTrim(streamKey, 'MAXLEN', 0);
        console.log(`Cleared Redis stream: ${streamKey}`);
    } catch (err) {
        // Ignore if stream doesn't exist (error code 'ERR no such key')
        if (err.message && !err.message.toLowerCase().includes('no such key')) {
            console.error(`Error clearing Redis stream ${streamKey}:`, err);
        } else {
            console.log(`Redis stream ${streamKey} did not exist or already cleared.`);
        }
    }
}


async function getMessagesFromRedisStream(redisClient, streamKey, lastId = '0-0') {
    try {
        const messages = await redisClient.xRange(streamKey, '-', '+');
        if (!messages || messages.length === 0) {
            return [];
        }
        return messages.map(msg => {
            const id = msg.id;
            const fields = msg.message;
            if (fields && fields.data) {
                try {
                    return { id, data: JSON.parse(fields.data) };
                } catch (e) {
                    console.warn(`Failed to parse JSON from 'data' field in message ${id} from stream ${streamKey}:`, fields.data);
                    return { id, data: fields.data };
                }
            }
            console.warn(`Message ${id} from stream ${streamKey} did not have a 'data' field:`, fields);
            return { id, data: fields };
        });
    } catch (err) {
        if (err.message && err.message.toLowerCase().includes("no such key")) {
            return [];
        }
        console.error(`Error reading from Redis stream ${streamKey}:`, err);
        throw err;
    }
}


describe('PostDaprPubSub Reaction with Redis Stream Verification', () => {
    let pgClient;
    let redisClient;
    let pgPortForward;
    let redisPortForward;

    const k8sResources = loadYaml(K8S_RESOURCES_FILE);
    const sourceResources = loadYaml(SOURCES_FILE);
    const queryResources = loadYaml(QUERIES_FILE);
    const reactionProviderResources = loadYaml(REACTION_PROVIDER_FILE);
    const reactionResources = loadYaml(REACTIONS_FILE);

    const allResourceDefinitions = [
        ...k8sResources,
        ...sourceResources,
        ...queryResources,
        ...reactionProviderResources,
        ...reactionResources,
    ];


    beforeAll(async () => {
        console.log("Starting E2E test setup for PostDaprPubSub (Redis)...");
        try {
            // 1. deploy all k8s resouces first
            console.log("Deploying K8s resources...");
            await deployResources(k8sResources);

            // 2. then wait for 15 seconds
            console.log("Waiting for K8s resources to stabilize...");
            await waitForPropagation(15000);

            // 3. then deploy sources.yaml
            console.log("Deploying Drasi Source resources...");
            await deployResources(sourceResources);

            // 4. then deploy queries.yaml
            console.log("Deploying Drasi Query resources...");
            await deployResources(queryResources);

            // 5. Then deploy reaction-provider
            console.log("Deploying Drasi ReactionProvider resources...");
            await deployResources(reactionProviderResources);

            // 6. then deploy reaction
            console.log("Deploying Drasi Reaction resources...");
            await deployResources(reactionResources);
            console.log("All Drasi resources deployed.");

            pgPortForward = new PortForward(POSTGRES_SERVICE_NAME, POSTGRES_PORT, POSTGRES_NAMESPACE);
            const localPgPort = await pgPortForward.start();
            pgClient = new PgClient({
                host: 'localhost',
                port: localPgPort,
                user: POSTGRES_USER,
                password: POSTGRES_PASSWORD,
                database: POSTGRES_DATABASE,
            });
            await pgClient.connect();
            console.log("Connected to PostgreSQL via port forward.");

            redisPortForward = new PortForward(DAPR_PUBSUB_REDIS_SERVICE_NAME, DAPR_PUBSUB_REDIS_PORT, DAPR_PUBSUB_REDIS_NAMESPACE);
            const localRedisPort = await redisPortForward.start();
            redisClient = createRedisClient({ url: `redis://localhost:${localRedisPort}` });
            await redisClient.connect();
            console.log("Connected to Dapr Pub/Sub Redis via port forward.");

            console.log("Waiting for 15 more seconds after all setup...");
            await waitForPropagation(15000);

        } catch (error) {
            console.error("Error during beforeAll setup:", error);
            if (pgPortForward) pgPortForward.stop();
            if (redisPortForward) redisPortForward.stop();
            if (pgClient) await pgClient.end().catch(console.error);
            if (redisClient) await redisClient.quit().catch(console.error);
            await deleteResources(allResourceDefinitions).catch(err => console.error("Cleanup failed during error handling:", err));
            throw error;
        }
    }, 300000); // 5 minutes timeout for setup

    afterAll(async () => {
        console.log("Starting E2E test teardown...");
        if (pgClient) await pgClient.end().catch(err => console.error("Error closing PG client:", err));
        if (redisClient) await redisClient.quit().catch(err => console.error("Error quitting Redis client:", err));
        
        if (pgPortForward) pgPortForward.stop();
        if (redisPortForward) redisPortForward.stop();
        
        console.log("Attempting to delete Drasi and K8s resources...");
        await deleteResources(allResourceDefinitions).catch(err => console.error("Error during deleteResources:", err)); 
        console.log("Teardown complete.");
    }, 300000); // 5 minutes timeout for teardown

    test('PACKED: should publish a packed ChangeEvent to the correct Redis Stream on INSERT', async () => {
        await clearRedisStream(redisClient, PACKED_TOPIC);

        const newProductName = `Test Product Packed ${Date.now()}`;
        const newProductPrice = 99.99;
        await pgClient.query(
            "INSERT INTO product (name, description, price) VALUES ($1, 'Packed Test Desc', $2)",
            [newProductName, newProductPrice]
        );
        await waitForPropagation();

        const messages = await getMessagesFromRedisStream(redisClient, PACKED_TOPIC);
        expect(messages.length).toEqual(1);

        const cloudEvent = messages[0].data; 
        expect(cloudEvent).toBeDefined();
        expect(cloudEvent.topic).toBe(PACKED_TOPIC);
        
        const drasiEvent = cloudEvent.data;
        expect(drasiEvent).toBeDefined();
        expect(drasiEvent.payload).toBeDefined();
        expect(drasiEvent.payload.after).toBeDefined();
        expect(drasiEvent.payload.after.name).toBe(newProductName);
        expect(drasiEvent.op).toBe('i');
        expect(parseFloat(drasiEvent.payload.after.price)).toBe(newProductPrice);
    }, 20000);

    test('UNPACKED: should publish individual unpacked change notifications on INSERT', async () => {
        await clearRedisStream(redisClient, UNPACKED_TOPIC);

        const newProductName = `Test Product Unpacked ${Date.now()}`;
        const newProductPrice = 49.50;
        await pgClient.query(
            "INSERT INTO product (name, description, price) VALUES ($1, 'Unpacked Test Desc', $2)",
            [newProductName, newProductPrice]
        );
        await waitForPropagation();

        const messages = await getMessagesFromRedisStream(redisClient, UNPACKED_TOPIC);
        expect(messages.length).toEqual(1);

        const cloudEvent = messages[0].data;
        expect(cloudEvent).toBeDefined();
        expect(cloudEvent.topic).toBe(UNPACKED_TOPIC);

        const drasiEvent = cloudEvent.data;
        expect(drasiEvent).toBeDefined();
        expect(drasiEvent.op).toBe('i'); // Insert operation
        expect(drasiEvent.payload).toBeDefined();
        expect(drasiEvent.payload.source).toBeDefined();
        expect(drasiEvent.payload.source.queryId).toBe('product-updates-unpacked');
        expect(drasiEvent.payload.after).toBeDefined();
        expect(drasiEvent.payload.after.name).toBe(newProductName);
        expect(parseFloat(drasiEvent.payload.after.price)).toBe(newProductPrice);
        expect(drasiEvent.payload.before).toBeUndefined();
    }, 20000);

    test('UNPACKED: should publish individual unpacked change notifications on UPDATE', async () => {
        // Ensure a product exists to update.
        const productNameToUpdate = `ProductToUpdate ${Date.now()}`;
        const initialDescription = "Initial Description";
        const initialPrice = 50.00;
        await pgClient.query(
            "INSERT INTO product (name, description, price) VALUES ($1, $2, $3)",
            [productNameToUpdate, initialDescription, initialPrice]
        );
        await waitForPropagation(5000); // Wait for insert to propagate

        await clearRedisStream(redisClient, UNPACKED_TOPIC); // Clear before update

        const updatedDescription = 'High-performance laptop - Updated Model';
        await pgClient.query(
            "UPDATE product SET description = $1 WHERE name = $2",
            [updatedDescription, productNameToUpdate]
        );
        await waitForPropagation();

        const messages = await getMessagesFromRedisStream(redisClient, UNPACKED_TOPIC);
        expect(messages.length).toEqual(1);
        
        const cloudEvent = messages[0].data;
        expect(cloudEvent).toBeDefined();
        expect(cloudEvent.topic).toBe(UNPACKED_TOPIC);

        const drasiEvent = cloudEvent.data;
        expect(drasiEvent).toBeDefined();
        expect(drasiEvent.op).toBe('u'); // Update operation
        expect(drasiEvent.payload).toBeDefined();
        expect(drasiEvent.payload.source).toBeDefined();
        expect(drasiEvent.payload.source.queryId).toBe('product-updates-unpacked');
        expect(drasiEvent.payload.after).toBeDefined();
        expect(drasiEvent.payload.after.name).toBe(productNameToUpdate);
        expect(drasiEvent.payload.after.description).toBe(updatedDescription);
        expect(drasiEvent.payload.before).toBeDefined();
        expect(drasiEvent.payload.before.name).toBe(productNameToUpdate);
        expect(drasiEvent.payload.before.description).toBe(initialDescription);
    }, 20000);
});