---
applyTo: "e2e-tests/**/*"
---

# E2E Tests - GitHub Copilot Instructions

## Project Overview

The e2e-tests directory contains end-to-end test scenarios that validate the complete Drasi platform functionality. These tests create realistic user scenarios by spinning up Kind clusters, deploying Drasi components, and testing the full data flow from sources through continuous queries to reactions.

## Technology Stack

- **Language**: JavaScript/TypeScript with Node.js
- **Testing Framework**: Jest
- **Cluster Management**: Kind (Kubernetes in Docker)
- **Database Testing**: PostgreSQL, Redis
- **API Testing**: HTTP clients, database drivers
- **Build System**: NPM

## Project Structure

```
e2e-tests/
├── package.json                    # NPM configuration
├── jest.config.js                 # Jest test configuration
├── recreate-test-cluster.js       # Cluster setup utility
├── fixtures/                      # Test data and configurations
├── 01-simple-scenario/            # Basic source -> query -> reaction test
├── 02-storedproc-scenario/        # Stored procedure testing
├── 03-gremlin-reaction-scenario/  # Graph database testing
├── 04-kubernetes-scenario/        # Kubernetes resource monitoring
├── 05-sync-statestore-scenario/   # State synchronization testing
└── 06-post-dapr-pubsub-scenario/  # Dapr pub/sub testing
```

## Key Test Scenarios

### Simple Scenario (`01-simple-scenario/`)
- PostgreSQL database source
- Basic continuous query
- SignalR reaction
- Full data flow validation

### Stored Procedure Scenario (`02-storedproc-scenario/`)
- Database stored procedure triggers
- Complex query processing
- Multiple reaction types

### Kubernetes Scenario (`04-kubernetes-scenario/`)
- Kubernetes API source
- Resource monitoring queries
- Platform reaction integration

## Build and Development

### Setup
```bash
# Install dependencies
npm install

# Install test cluster dependencies
node recreate-test-cluster.js
```

### Running Tests
```bash
# Run all test scenarios
npm test

# Run specific scenario
npm test -- --testPathPattern=01-simple-scenario

# Run with coverage
npm test -- --coverage

# CI mode with JUnit output
npm run test:ci
```

### Test Development
```bash
# Run tests in watch mode
npm test -- --watch

# Run with verbose output
npm test -- --verbose

# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand --testPathPattern=scenario
```

## Development Guidelines

### Test Structure Pattern
```javascript
// Standard test file structure
describe('Scenario Name', () => {
    let testCluster;
    let database;
    
    beforeAll(async () => {
        // Setup test infrastructure
        testCluster = await setupTestCluster();
        database = await setupTestDatabase();
    });
    
    afterAll(async () => {
        // Cleanup resources
        await cleanupDatabase(database);
        await cleanupTestCluster(testCluster);
    });
    
    test('should process data changes end-to-end', async () => {
        // Test implementation
    });
});
```

### Database Testing Patterns
```javascript
const { Client } = require('pg');

// Database setup utility
async function setupPostgreSQL() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        user: 'testuser',
        password: 'testpass'
    });
    
    await client.connect();
    
    // Create test schema
    await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER,
            status VARCHAR(50),
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    
    return client;
}

// Data manipulation in tests
async function insertTestData(client) {
    const result = await client.query(`
        INSERT INTO orders (customer_id, status) 
        VALUES ($1, $2) 
        RETURNING id
    `, [123, 'pending']);
    
    return result.rows[0].id;
}
```

### Kubernetes Testing Patterns
```javascript
const k8s = require('@kubernetes/client-node');
const yaml = require('js-yaml');
const fs = require('fs');

// Kubernetes client setup
function getKubernetesClient() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    return kc.makeApiClient(k8s.CoreV1Api);
}

// Apply Kubernetes resources
async function applyKubernetesResource(resourcePath) {
    const resourceYaml = fs.readFileSync(resourcePath, 'utf8');
    const resource = yaml.load(resourceYaml);
    
    const k8sApi = getKubernetesClient();
    
    if (resource.kind === 'Pod') {
        return await k8sApi.createNamespacedPod('default', resource);
    }
    // Handle other resource types
}
```

### Drasi Resource Management
```javascript
// Drasi resource utilities
async function createDrasiSource(sourceConfig) {
    const yaml = `
apiVersion: v1
kind: Source
metadata:
  name: ${sourceConfig.name}
spec:
  kind: ${sourceConfig.kind}
  properties:
    ${Object.entries(sourceConfig.properties)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n    ')}
`;
    
    return await applyKubernetesResource(yaml);
}

async function createContinuousQuery(queryConfig) {
    const yaml = `
apiVersion: v1
kind: ContinuousQuery
metadata:
  name: ${queryConfig.name}
spec:
  mode: query
  sources:
    ${queryConfig.sources.map(s => `- ${s}`).join('\n    ')}
  query: |
    ${queryConfig.cypherQuery}
`;
    
    return await applyKubernetesResource(yaml);
}
```

### SignalR Testing
```javascript
const signalR = require('@microsoft/signalr');

// SignalR connection testing
async function testSignalRConnection() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:8080/hubs/queryresult')
        .build();
    
    // Setup event handlers
    connection.on('QueryResultUpdate', (result) => {
        console.log('Received query result:', result);
    });
    
    await connection.start();
    
    // Join query group
    await connection.invoke('JoinQueryGroup', 'test-query');
    
    return connection;
}

// Wait for SignalR notifications
function waitForSignalRNotification(connection, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Timeout waiting for notification'));
        }, timeout);
        
        connection.on('QueryResultUpdate', (result) => {
            clearTimeout(timer);
            resolve(result);
        });
    });
}
```

### HTTP API Testing
```javascript
// HTTP client utilities
async function makeAPIRequest(method, path, data = null) {
    const response = await fetch(`http://localhost:8080/api/v1${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
}

// Test API endpoints
async function testDrasiAPI() {
    // Create source
    const sourceResponse = await makeAPIRequest('POST', '/sources', {
        name: 'test-source',
        kind: 'PostgreSQL',
        properties: {
            host: 'localhost',
            port: 5432,
            database: 'testdb'
        }
    });
    
    // Create query
    const queryResponse = await makeAPIRequest('POST', '/continuousqueries', {
        name: 'test-query',
        sources: ['test-source'],
        query: 'MATCH (o:orders) RETURN o'
    });
    
    return { source: sourceResponse, query: queryResponse };
}
```

## Configuration and Fixtures

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testTimeout: 120000, // 2 minutes for integration tests
    setupFilesAfterEnv: ['<rootDir>/fixtures/jest.setup.js'],
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/fixtures/**'
    ],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: '../pipeline',
            outputName: 'e2e.xml'
        }]
    ]
};
```

### Test Fixtures
```javascript
// fixtures/database.js
module.exports = {
    postgresql: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        database: 'drasitest',
        user: 'testuser',
        password: 'testpass'
    },
    
    sampleData: {
        orders: [
            { customer_id: 1, status: 'pending' },
            { customer_id: 2, status: 'completed' },
            { customer_id: 3, status: 'cancelled' }
        ]
    }
};
```

## Testing Utilities

### Cluster Management
```javascript
// Cluster lifecycle management
class TestCluster {
    constructor(name = 'drasi-test') {
        this.name = name;
    }
    
    async create() {
        // Create Kind cluster
        await exec(`kind create cluster --name ${this.name}`);
        
        // Install Drasi
        await exec(`drasi init -k ${this.name}`);
        
        // Wait for readiness
        await this.waitForReadiness();
    }
    
    async destroy() {
        await exec(`kind delete cluster --name ${this.name}`);
    }
    
    async waitForReadiness() {
        // Wait for all Drasi pods to be ready
        const maxWait = 300000; // 5 minutes
        const start = Date.now();
        
        while (Date.now() - start < maxWait) {
            const result = await exec(`kubectl get pods -n drasi-system --no-headers`);
            const lines = result.stdout.trim().split('\n');
            const allReady = lines.every(line => line.includes('Running') || line.includes('Completed'));
            
            if (allReady) {
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        throw new Error('Cluster not ready within timeout');
    }
}
```

### Assertion Helpers
```javascript
// Custom Jest matchers
expect.extend({
    toHaveReceivedQueryResult(received, expected) {
        const pass = received.some(result => 
            result.queryId === expected.queryId &&
            result.results.length > 0
        );
        
        return {
            message: () => pass 
                ? `Expected not to receive result for query ${expected.queryId}`
                : `Expected to receive result for query ${expected.queryId}`,
            pass
        };
    }
});

// Async assertion utilities
async function waitForCondition(conditionFn, timeout = 30000, interval = 1000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
        if (await conditionFn()) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Condition not met within timeout');
}
```

## Common Tasks

### Adding a New Test Scenario
1. Create new scenario directory (e.g., `07-new-scenario/`)
2. Add test file following naming convention
3. Implement setup and teardown logic
4. Create any required fixtures or configurations
5. Add scenario-specific database setup
6. Implement test assertions
7. Update CI configuration if needed

### Debugging Test Failures
1. Check test cluster state: `kubectl get pods -n drasi-system`
2. Examine logs: `kubectl logs -n drasi-system <pod-name>`
3. Validate database state manually
4. Test API endpoints directly
5. Check SignalR connections and subscriptions

### Performance Testing
1. Add timing measurements to test scenarios
2. Monitor resource usage during tests
3. Test with larger datasets
4. Validate memory and CPU usage
5. Add performance regression detection

## CI/CD Integration

### GitHub Actions
```yaml
# Example workflow step
- name: Run E2E Tests
  run: |
    cd e2e-tests
    npm install
    npm run test:ci
  env:
    NODE_OPTIONS: '--experimental-vm-modules'
```

### Test Reporting
- JUnit XML output for CI systems
- Coverage reports for code quality
- Performance metrics collection
- Screenshot capture for UI tests

## External Dependencies

- **Kind**: Kubernetes cluster for testing
- **Docker**: Container runtime
- **PostgreSQL**: Database testing
- **Redis**: State store testing
- **Drasi CLI**: Platform deployment and management
- **Kubernetes API**: Resource management and monitoring