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

const { describe, beforeAll, afterAll, test, expect } = require('@jest/globals');
const { Client: PgClient } = require('pg');
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const PortForward = require('../fixtures/port-forward');
const deployResources = require('../fixtures/deploy-resources');
const deleteResources = require('../fixtures/delete-resources');
const { waitFor } = require('../fixtures/infrastructure');

const SCENARIO_DIR = __dirname;
const K8S_RESOURCES_FILE = path.join(SCENARIO_DIR, 'resources.yaml');
const SOURCES_FILE = path.join(SCENARIO_DIR, 'sources.yaml');
const QUERIES_FILE = path.join(SCENARIO_DIR, 'queries.yaml');
const REACTIONS_FILE = path.join(SCENARIO_DIR, 'reactions.yaml');

const POSTGRES_SERVICE_NAME = 'eventgrid-test-db';
const POSTGRES_NAMESPACE = 'default';
const POSTGRES_PORT = 5432;
const POSTGRES_USER = 'testuser';
const POSTGRES_PASSWORD = 'testpassword';
const POSTGRES_DATABASE = 'testdb';

const EVENTGRID_SERVICE_NAME = 'eventgrid-emulator-svc';
const EVENTGRID_NAMESPACE = 'default';
const EVENTGRID_PORT = 8080;

function loadYaml(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.loadAll(content);
}

/**
 * Get events from the Event Grid emulator
 * The Workleap Event Grid Emulator provides an endpoint to retrieve events
 */
async function getEventsFromEmulator(baseUrl) {
    try {
        const response = await axios.get(`${baseUrl}/api/events`, {
            timeout: 5000
        });
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // No events yet
            return [];
        }
        console.error('Error getting events from emulator:', error.message);
        return [];
    }
}

/**
 * Clear events from the Event Grid emulator
 */
async function clearEventsFromEmulator(baseUrl) {
    try {
        await axios.delete(`${baseUrl}/api/events`, {
            timeout: 5000
        });
        console.log('Cleared events from Event Grid emulator');
    } catch (error) {
        console.warn('Could not clear events from emulator:', error.message);
    }
}

describe('EventGrid Template Reaction E2E Test', () => {
    let pgClient;
    let pgPortForward;
    let eventGridPortForward;
    let eventGridBaseUrl;

    const k8sResources = loadYaml(K8S_RESOURCES_FILE);
    const sourceResources = loadYaml(SOURCES_FILE);
    const queryResources = loadYaml(QUERIES_FILE);
    const reactionResources = loadYaml(REACTIONS_FILE);

    const allResourceDefinitions = [
        ...k8sResources,
        ...sourceResources,
        ...queryResources,
        ...reactionResources,
    ];

    beforeAll(async () => {
        console.log("Starting E2E test setup for EventGrid Template Reaction...");
        try {
            // 1. Deploy all k8s resources first
            console.log("Deploying K8s resources...");
            await deployResources(k8sResources);

            // 2. Wait for resources to stabilize
            console.log("Waiting for K8s resources to stabilize...");
            await waitFor({ timeoutMs: 15000, description: "K8s resources to stabilize" });

            // 3. Deploy sources
            console.log("Deploying Drasi Source resources...");
            await deployResources(sourceResources);

            // 4. Deploy queries
            console.log("Deploying Drasi Query resources...");
            await deployResources(queryResources);

            // 5. Deploy reaction
            console.log("Deploying Drasi Reaction resources...");
            await deployResources(reactionResources);
            console.log("All Drasi resources deployed.");

            // Setup PostgreSQL port forward
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

            // Setup Event Grid emulator port forward
            eventGridPortForward = new PortForward(EVENTGRID_SERVICE_NAME, EVENTGRID_PORT, EVENTGRID_NAMESPACE);
            const localEventGridPort = await eventGridPortForward.start();
            eventGridBaseUrl = `http://localhost:${localEventGridPort}`;
            console.log(`Event Grid emulator accessible at ${eventGridBaseUrl}`);

            console.log("Waiting for system to stabilize...");
            await waitFor({ timeoutMs: 20000, description: "system to stabilize" });

        } catch (error) {
            console.error("Error during beforeAll setup:", error);
            if (pgPortForward) pgPortForward.stop();
            if (eventGridPortForward) eventGridPortForward.stop();
            if (pgClient) await pgClient.end().catch(console.error);
            await deleteResources(allResourceDefinitions).catch(err => console.error("Cleanup failed during error handling:", err));
            throw error;
        }
    }, 300000); // 5 minutes timeout for setup

    afterAll(async () => {
        console.log("Starting E2E test teardown...");
        if (pgClient) await pgClient.end().catch(err => console.error("Error closing PG client:", err));
        
        if (pgPortForward) pgPortForward.stop();
        if (eventGridPortForward) eventGridPortForward.stop();
        
        console.log("Attempting to delete Drasi and K8s resources...");
        await deleteResources(allResourceDefinitions).catch(err => console.error("Error during deleteResources:", err)); 
        console.log("Teardown complete.");
    }, 300000); // 5 minutes timeout for teardown

    test('TEMPLATE: should publish templated event on INSERT', async () => {
        await clearEventsFromEmulator(eventGridBaseUrl);

        const newProductName = `Test Product ${Date.now()}`;
        const newProductPrice = 99.99;
        await pgClient.query(
            "INSERT INTO product (name, description, price) VALUES ($1, 'Template Test Desc', $2)",
            [newProductName, newProductPrice]
        );

        const events = await waitFor({
            actionFn: () => getEventsFromEmulator(eventGridBaseUrl),
            predicateFn: (events) => events && events.length >= 1,
            timeoutMs: 15000,
            pollIntervalMs: 1000,
            description: `templated event for product "${newProductName}" to appear in Event Grid emulator`
        });

        expect(events).toBeDefined();
        expect(events.length).toBeGreaterThanOrEqual(1);

        // Find the event for our product
        const cloudEvent = events.find(e => 
            e.data && 
            e.data.eventType === 'ProductAdded' && 
            e.data.name === newProductName
        );

        expect(cloudEvent).toBeDefined();
        expect(cloudEvent.type).toBe('Drasi.ChangeEvent');
        expect(cloudEvent.source).toBe('product-updates-template');
        
        const eventData = cloudEvent.data;
        expect(eventData.eventType).toBe('ProductAdded');
        expect(eventData.name).toBe(newProductName);
        expect(eventData.description).toBe('Template Test Desc');
        expect(parseFloat(eventData.price)).toBe(newProductPrice);
        expect(eventData.productId).toBeDefined();
    }, 30000);

    test('TEMPLATE: should publish templated event on UPDATE', async () => {
        // Insert a product first
        const productName = `Product To Update ${Date.now()}`;
        const initialPrice = 50.00;
        const updatedPrice = 75.00;
        
        await pgClient.query(
            "INSERT INTO product (name, description, price) VALUES ($1, 'Initial Desc', $2)",
            [productName, initialPrice]
        );

        // Wait for insert event to propagate
        await waitFor({
            actionFn: () => getEventsFromEmulator(eventGridBaseUrl),
            predicateFn: (events) => events && events.some(e => 
                e.data && e.data.eventType === 'ProductAdded' && e.data.name === productName
            ),
            timeoutMs: 15000,
            pollIntervalMs: 1000,
            description: `insert event for product "${productName}"`
        });

        await clearEventsFromEmulator(eventGridBaseUrl);

        // Update the product
        await pgClient.query(
            "UPDATE product SET price = $1 WHERE name = $2",
            [updatedPrice, productName]
        );

        const events = await waitFor({
            actionFn: () => getEventsFromEmulator(eventGridBaseUrl),
            predicateFn: (events) => events && events.some(e => 
                e.data && e.data.eventType === 'ProductUpdated' && e.data.name === productName
            ),
            timeoutMs: 15000,
            pollIntervalMs: 1000,
            description: `templated update event for product "${productName}"`
        });

        expect(events).toBeDefined();
        
        const updateEvent = events.find(e => 
            e.data && 
            e.data.eventType === 'ProductUpdated' && 
            e.data.name === productName
        );

        expect(updateEvent).toBeDefined();
        expect(updateEvent.type).toBe('Drasi.ChangeEvent');
        expect(updateEvent.source).toBe('product-updates-template');
        
        const eventData = updateEvent.data;
        expect(eventData.eventType).toBe('ProductUpdated');
        expect(eventData.name).toBe(productName);
        expect(parseFloat(eventData.price)).toBe(updatedPrice);
        expect(parseFloat(eventData.previousPrice)).toBe(initialPrice);
    }, 30000);

    test('TEMPLATE: should publish templated event on DELETE', async () => {
        // Insert a product first
        const productName = `Product To Delete ${Date.now()}`;
        
        await pgClient.query(
            "INSERT INTO product (name, description, price) VALUES ($1, 'To Be Deleted', 100.00)",
            [productName]
        );

        // Wait for insert event to propagate
        await waitFor({
            actionFn: () => getEventsFromEmulator(eventGridBaseUrl),
            predicateFn: (events) => events && events.some(e => 
                e.data && e.data.eventType === 'ProductAdded' && e.data.name === productName
            ),
            timeoutMs: 15000,
            pollIntervalMs: 1000,
            description: `insert event for product "${productName}"`
        });

        await clearEventsFromEmulator(eventGridBaseUrl);

        // Delete the product
        await pgClient.query(
            "DELETE FROM product WHERE name = $1",
            [productName]
        );

        const events = await waitFor({
            actionFn: () => getEventsFromEmulator(eventGridBaseUrl),
            predicateFn: (events) => events && events.some(e => 
                e.data && e.data.eventType === 'ProductDeleted' && e.data.name === productName
            ),
            timeoutMs: 15000,
            pollIntervalMs: 1000,
            description: `templated delete event for product "${productName}"`
        });

        expect(events).toBeDefined();
        
        const deleteEvent = events.find(e => 
            e.data && 
            e.data.eventType === 'ProductDeleted' && 
            e.data.name === productName
        );

        expect(deleteEvent).toBeDefined();
        expect(deleteEvent.type).toBe('Drasi.ChangeEvent');
        expect(deleteEvent.source).toBe('product-updates-template');
        
        const eventData = deleteEvent.data;
        expect(eventData.eventType).toBe('ProductDeleted');
        expect(eventData.name).toBe(productName);
        expect(eventData.productId).toBeDefined();
    }, 30000);
});
