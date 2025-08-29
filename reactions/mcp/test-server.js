// Simple test server to verify MCP session handling without Drasi dependencies
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { 
    isInitializeRequest,
    SubscribeRequestSchema,
    UnsubscribeRequestSchema 
} = require('@modelcontextprotocol/sdk/types.js');
const express = require('express');
const { randomUUID } = require('node:crypto');
const { AsyncLocalStorage } = require('node:async_hooks');

const reactionConfig = {
    port: 3001,
    endpoint: "/mcp"
};

// Create an MCP server with implementation details
const server = new McpServer({
    name: 'test-drasi-mcp-reaction',
    version: '1.0.0',
}, {
    capabilities: {
        resources: {
            subscribe: true,
            listChanged: true
        },
        logging: {}
    }
});

// Store transports by session ID to send notifications
const transports = {};

// AsyncLocalStorage to track current session ID in request context
const sessionContext = new AsyncLocalStorage();

// Track resource subscriptions by session ID and URI
const subscriptions = new Map(); // sessionId -> Set of URIs
const subscribersByUri = new Map(); // URI -> Set of sessionIds

// Add a subscription for a session to a resource URI
function addSubscription(sessionId, uri) {
    // Add to session -> URIs mapping
    if (!subscriptions.has(sessionId)) {
        subscriptions.set(sessionId, new Set());
    }
    subscriptions.get(sessionId).add(uri);

    // Add to URI -> sessions mapping
    if (!subscribersByUri.has(uri)) {
        subscribersByUri.set(uri, new Set());
    }
    subscribersByUri.get(uri).add(sessionId);

    console.log(`Session ${sessionId} subscribed to ${uri}`);
}

// Remove a subscription for a session from a resource URI
function removeSubscription(sessionId, uri) {
    // Remove from session -> URIs mapping
    const sessionUris = subscriptions.get(sessionId);
    if (sessionUris) {
        sessionUris.delete(uri);
        if (sessionUris.size === 0) {
            subscriptions.delete(sessionId);
        }
    }

    // Remove from URI -> sessions mapping
    const uriSubscribers = subscribersByUri.get(uri);
    if (uriSubscribers) {
        uriSubscribers.delete(sessionId);
        if (uriSubscribers.size === 0) {
            subscribersByUri.delete(uri);
        }
    }

    console.log(`Session ${sessionId} unsubscribed from ${uri}`);
}

// Clean up all subscriptions for a session (when disconnected)
function cleanupSessionSubscriptions(sessionId) {
    const sessionUris = subscriptions.get(sessionId);
    if (sessionUris) {
        // Remove this session from all URI subscriber lists
        for (const uri of sessionUris) {
            const uriSubscribers = subscribersByUri.get(uri);
            if (uriSubscribers) {
                uriSubscribers.delete(sessionId);
                if (uriSubscribers.size === 0) {
                    subscribersByUri.delete(uri);
                }
            }
        }
        // Remove the session's subscription list
        subscriptions.delete(sessionId);
        console.log(`Cleaned up subscriptions for disconnected session ${sessionId}`);
    }
}

// Add subscription and unsubscription handlers
server.server.setRequestHandler(SubscribeRequestSchema, async (request, extra) => {
    const uri = request.params?.uri;
    if (!uri) {
        throw new Error("URI is required for subscription");
    }
    
    const sessionId = sessionContext.getStore();
    if (sessionId) {
        addSubscription(sessionId, uri);
    } else {
        console.warn("No session ID available for subscription request");
    }
    
    return {};
});

server.server.setRequestHandler(UnsubscribeRequestSchema, async (request, extra) => {
    const uri = request.params?.uri;
    if (!uri) {
        throw new Error("URI is required for unsubscription");
    }
    
    const sessionId = sessionContext.getStore();
    if (sessionId) {
        removeSubscription(sessionId, uri);
    } else {
        console.warn("No session ID available for unsubscription request");
    }
    
    return {};
});

// Create Express app
const app = express();
app.use(express.json());

// Handle MCP POST requests
app.post(reactionConfig.endpoint, async (req, res) => {
    console.log('Received MCP request:', JSON.stringify(req.body, null, 2));
    try {
        // Check for existing session ID
        const sessionId = req.headers['mcp-session-id'];
        let transport;

        if (sessionId && transports[sessionId]) {
            // Reuse existing transport
            transport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(req.body)) {
            // New initialization request
            let initSessionId;
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => {
                    initSessionId = randomUUID();
                    return initSessionId;
                },
                onsessioninitialized: (sessionId) => {
                    console.log(`Session initialized with ID: ${sessionId}`);
                    transports[sessionId] = transport;
                    
                    // Set up cleanup on transport close
                    transport.onclose = () => {
                        console.log(`Transport closed for session ${sessionId}`);
                        cleanupSessionSubscriptions(sessionId);
                        delete transports[sessionId];
                    };
                }
            });
            // Connect the transport to the MCP server
            await server.connect(transport);
            // Handle the request wrapped in session context using the generated session ID
            await sessionContext.run(initSessionId, async () => {
                await transport.handleRequest(req, res, req.body);
            });
            return; // Already handled
        } else {
            // Invalid request - no session ID or not initialization request
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Bad Request: No valid session ID provided',
                },
                id: null,
            });
            return;
        }

        // Handle the request with existing transport, wrapping in session context
        await sessionContext.run(sessionId, async () => {
            await transport.handleRequest(req, res, req.body);
        });
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

// Handle GET requests for SSE streams
app.get(reactionConfig.endpoint, async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }
    console.log(`Establishing SSE stream for session ${sessionId}`);
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
});

// Start the server
const PORT = reactionConfig.port;
app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`Test MCP HTTP server listening on port ${PORT}`);
    console.log(`MCP endpoint: http://localhost:${PORT}${reactionConfig.endpoint}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await server.close();
    process.exit(0);
});

console.log("Test Drasi MCP Reaction started");
console.log(`Connect MCP clients to: http://localhost:${reactionConfig.port}${reactionConfig.endpoint}`);