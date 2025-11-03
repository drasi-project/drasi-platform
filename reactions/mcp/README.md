# Drasi MCP Reaction

This is a Drasi reaction that provides a Model Context Protocol (MCP) server. MCP clients can connect using HTTP transport and use the resource subscription feature to subscribe to one or more queries for real-time updates.

## Features

- **MCP Server**: Provides an HTTP-based MCP server using Server-Sent Events (SSE)
- **Resource Subscriptions**: Clients can subscribe to specific query resources for real-time updates
- **Real-time Notifications**: When Drasi query results change, subscribed clients receive notifications
- **Template Support**: Uses Handlebars templates to format notification payloads
- **Multiple Change Types**: Supports `added`, `updated`, and `deleted` notifications

## Architecture

The reaction integrates two main components:
1. **Drasi Reaction SDK**: Receives change events from Drasi queries
2. **MCP SDK**: Provides the MCP server and resource subscription functionality

When Drasi sends change events, the reaction processes them through Handlebars templates and sends notifications to subscribed MCP clients.

## Configuration

### Environment Variables

- `port`: HTTP server port (default: 3000)

### Query Configuration

Each query can be configured with templates for different change types:

```yaml
# Example query configuration
added:
  template: '{"type": "item_added", "data": {{json after}}}'
updated:
  template: '{"type": "item_updated", "before": {{json before}}, "after": {{json after}}}'
deleted:
  template: '{"type": "item_deleted", "data": {{json before}}}'
```

## Usage

### Running the Reaction

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### MCP Client Connection

MCP clients can connect to the server using Streamable HTTP transport:

```
HTTP Endpoint: http://localhost:3000/
Transport: Streamable HTTP (preferred) with SSE fallback
Protocol Version: 2025-03-26 (with 2024-11-05 compatibility)
```

#### Connection Process:
1. **Initialization**: POST to `/` with MCP initialization request
2. **Session Management**: Server generates session ID and tracks transport
3. **Message Exchange**: POST requests for client-to-server messages
4. **Notifications**: GET requests establish SSE streams for server-to-client messages

### Resource URIs

Query resources are accessible via URIs in the format:
```
drasi://query/{queryId}
```

### Subscription Workflow

1. Client connects to the MCP server via SSE
2. Client subscribes to specific query resources using `resources/subscribe`
3. When Drasi sends change events for subscribed queries, the server sends standardized `notifications/resources/updated` notifications with the resource URI, operation type, and data

## Development

### Project Structure

```
src/
  index.ts        # Main application entry point
package.json      # Node.js dependencies
tsconfig.json     # TypeScript configuration
Dockerfile.*      # Docker build files
Makefile         # Build automation
```

### Key Dependencies

- `@drasi/reaction-sdk`: Core Drasi reaction functionality
- `@modelcontextprotocol/sdk`: Official MCP SDK for TypeScript
- `handlebars`: Template engine for formatting notifications

## Protocol Support

This implementation follows the MCP specification and supports:
- **Modern Streamable HTTP Transport** (2025-03-26): Primary transport method
- **Legacy SSE Transport** (2024-11-05): Backward compatibility support
- **Session Management**: Proper session ID generation and tracking
- **Resource Management**: Dynamic resource registration and subscription
- **Real-time Notifications**: Standard MCP `notifications/resources/updated` with structured payload containing URI, operation, and data
- **Error Handling**: Comprehensive error responses with proper JSON-RPC format