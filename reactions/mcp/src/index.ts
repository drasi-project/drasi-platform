import { DrasiReaction, ChangeEvent, parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { 
    isInitializeRequest,
    SubscribeRequestSchema,
    UnsubscribeRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import Handlebars from 'handlebars';

class QueryConfig {
    added?: NotificationTemplate;
    updated?: NotificationTemplate;
    deleted?: NotificationTemplate;
}

class NotificationTemplate {
    template: string = '';
}

class ReactionConfig {
    port: number = 3000;
    endpoint: string = "/mcp";
}

const reactionConfig: ReactionConfig = {
    port: parseInt(getConfigValue("port") || "3000"),
    endpoint: getConfigValue("endpoint") || "/mcp"
};

// Create an MCP server with implementation details
const server = new McpServer({
    name: 'drasi-mcp-reaction',
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

// Add subscription and unsubscription handlers
server.server.setRequestHandler(SubscribeRequestSchema, async (request, extra) => {
    const uri = request.params?.uri;
    if (!uri) {
        throw new Error("URI is required for subscription");
    }

    if (extra.sessionId) {
        addSubscription(extra.sessionId, uri);
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

    if (extra.sessionId) {
        removeSubscription(extra.sessionId, uri);
    } else {
        console.warn("No session ID available for unsubscription request");
    }
    
    return {};
});

// Store transports by session ID to send notifications
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Track resource subscriptions by session ID and URI
const subscriptions = new Map<string, Set<string>>(); // sessionId -> Set of URIs
const subscribersByUri = new Map<string, Set<string>>(); // URI -> Set of sessionIds

// Add a subscription for a session to a resource URI
function addSubscription(sessionId: string, uri: string) {
    // Add to session -> URIs mapping
    if (!subscriptions.has(sessionId)) {
        subscriptions.set(sessionId, new Set());
    }
    subscriptions.get(sessionId)!.add(uri);

    // Add to URI -> sessions mapping
    if (!subscribersByUri.has(uri)) {
        subscribersByUri.set(uri, new Set());
    }
    subscribersByUri.get(uri)!.add(sessionId);

    console.log(`Session ${sessionId} subscribed to ${uri}`);
}

// Remove a subscription for a session from a resource URI
function removeSubscription(sessionId: string, uri: string) {
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
function cleanupSessionSubscriptions(sessionId: string) {
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

// Send resource updated notifications to subscribed clients only
async function notifyResourceUpdated(queryId: string, type: 'added' | 'updated' | 'deleted', data: any) {
    const uri = `drasi://query/${queryId}`;
    const subscribedSessions = subscribersByUri.get(uri);
    
    if (!subscribedSessions || subscribedSessions.size === 0) {
        console.log(`No subscribers for ${uri}, skipping notification`);
        return;
    }

    console.log(`Sending ${type} notification for ${uri} to ${subscribedSessions.size} subscribers`);
    
    for (const sessionId of subscribedSessions) {
        const transport = transports[sessionId];
        if (transport) {
            try {
                // Send notification through the MCP server
                await server.server.notification({
                    method: `notifications/${queryId}/${type}`,
                    params: data
                });
                console.log(`Sent ${type} notification for query ${queryId} to session ${sessionId}`);
            } catch (error) {
                console.error(`Failed to send notification to session ${sessionId}:`, error);
                // If transport is broken, clean up the session
                cleanupSessionSubscriptions(sessionId);
                delete transports[sessionId];
            }
        } else {
            console.warn(`No transport found for subscribed session ${sessionId}, cleaning up`);
            cleanupSessionSubscriptions(sessionId);
        }
    }
}

// Process Drasi change events
async function onChangeEvent(event: ChangeEvent, queryConfig?: QueryConfig): Promise<void> {
    console.log(`Received change sequence: ${event.sequence} for query ${event.queryId}`);

    // Process added results
    if (queryConfig?.added && event.addedResults.length > 0) {
        const template = Handlebars.compile(queryConfig.added.template);
        
        for (const added of event.addedResults) {
            try {
                const templateData = template({ after: added, queryId: event.queryId });
                const notificationData = JSON.parse(templateData);
                await notifyResourceUpdated(event.queryId, 'added', notificationData);
            } catch (error) {
                console.error('Error processing added template:', error);
            }
        }
    }

    // Process updated results
    if (queryConfig?.updated && event.updatedResults.length > 0) {
        const template = Handlebars.compile(queryConfig.updated.template);
        
        for (const updated of event.updatedResults) {
            try {
                const templateData = template({ 
                    before: updated.before, 
                    after: updated.after, 
                    queryId: event.queryId 
                });
                const notificationData = JSON.parse(templateData);
                await notifyResourceUpdated(event.queryId, 'updated', notificationData);
            } catch (error) {
                console.error('Error processing updated template:', error);
            }
        }
    }

    // Process deleted results
    if (queryConfig?.deleted && event.deletedResults.length > 0) {
        const template = Handlebars.compile(queryConfig.deleted.template);
        
        for (const deleted of event.deletedResults) {
            try {
                const templateData = template({ before: deleted, queryId: event.queryId });
                const notificationData = JSON.parse(templateData);
                await notifyResourceUpdated(event.queryId, 'deleted', notificationData);
            } catch (error) {
                console.error('Error processing deleted template:', error);
            }
        }
    }
}

async function onControlEvent(event: ControlEvent): Promise<void> {
    console.log(`Received control signal: ${JSON.stringify(event.controlSignal)} for query ${event.queryId}`);
}

// Create Express app
const app = express();
app.use(express.json());

// Handle MCP POST requests
app.post(reactionConfig.endpoint, async (req, res) => {
    console.log('Received MCP request:', req.body);
    try {
        // Check for existing session ID
        const sessionId = req.headers['Mcp-Session-Id'] as string;
        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
            // Reuse existing transport
            transport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(req.body)) {
            // New initialization request
            let initSessionId: string;
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => {
                    initSessionId = randomUUID();
                    return initSessionId;
                },
                onsessioninitialized: (sessionId: string) => {
                    // Store the transport by session ID when session is initialized
                    // This avoids race conditions where requests might come in before the session is stored
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
            await transport.handleRequest(req, res, req.body);
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
        await transport.handleRequest(req, res, req.body);
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

// Handle GET requests for SSE streams (now using built-in support from StreamableHTTP)
app.get(reactionConfig.endpoint, async (req, res) => {
    const sessionId = req.headers['Mcp-Session-Id'] as string;
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
app.listen(PORT, (error?: Error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`MCP HTTP server listening on port ${PORT}`);
    console.log(`MCP endpoint: http://localhost:${PORT}${reactionConfig.endpoint}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await server.close();
    process.exit(0);
});

// Start Drasi reaction
// const myReaction = new DrasiReaction<QueryConfig>(onChangeEvent, {
//     parseQueryConfig: parseYaml,
//     onControlEvent: onControlEvent
// });

// myReaction.start();

setInterval(async () => {
    console.log("Drasi MCP Reaction heartbeat");
    await onChangeEvent({
        kind: "change",
        queryId: "query1",
        sequence: "1",
        sourceTimeMs: "0",
        addedResults: [
            { id: "1", data: "hello" }
        ],
        updatedResults: [],
        deletedResults: []
    }, {
        added: { template: '{"id": "{{after.id}}", "data": "{{after.data}}"}' },
    });
}, 10000);

console.log("Drasi MCP Reaction started");
console.log(`Connect MCP clients to: http://localhost:${reactionConfig.port}${reactionConfig.endpoint}`);