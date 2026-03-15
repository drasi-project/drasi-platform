# Drasi Agent Router Reaction

A Drasi Reaction that bridges Drasi continuous query results to Dapr Agents via Dapr Pub/Sub.

## What it does

When a Drasi continuous query detects a database change (e.g., an SLA breach, a new high-value order, a stuck shipment), this reaction:

1. Receives the change event from Drasi
2. Transforms it into a CloudEvent
3. Publishes it to a Dapr Pub/Sub topic that your AI agent subscribes to
4. The agent wakes up and processes the change

This enables **Scale-to-Zero Ambient Agents** — agents that are completely idle until something meaningful happens in your data.

## Data Flow

```
Database change
    --> Drasi detects it via Continuous Query
    --> Publishes to [drasi-pubsub: {queryId}-results]
    --> This Router Reaction receives it
    --> Publishes to [agent-pubsub: your-configured-topic]
    --> Your Dapr Agent wakes up and handles it
```

## Configuration

Each query you want to route needs a config entry in your reaction manifest:

```yaml
kind: Reaction
apiVersion: v1
name: agent-router
spec:
  kind: DaprAgentsRouter
  queries:
    your-query-name: |
      pubsubName: agent-pubsub      # Dapr pubsub component your agents use
      topicName: your.agent.topic   # Topic your agent subscribes to
      format: packed                # packed (one message) or unpacked (one per record)
      skipControlSignals: true      # Skip bootstrap/running/stopped signals
```

### Format Options

- **packed**: The entire change event (all adds, updates, deletes) arrives as one message. Use this when your agent needs to see all changes atomically.
- **unpacked**: Each individual add, update, or delete arrives as a separate message. Use this when your agent processes changes one record at a time.

## MCP Server

This reaction also hosts an MCP server at port 3001 (`/mcp`). Your agents can connect to it to discover available queries dynamically.

## Running Locally (for development)

```bash
# Install dependencies
pip install -e .

# Set environment variables
export PubsubName=drasi-pubsub
export DefaultPubsubName=agent-pubsub

# Create a test query config
mkdir -p /etc/queries
echo "pubsubName: agent-pubsub
topicName: test.topic
format: packed" > /etc/queries/my-test-query

# Run with Dapr sidecar
dapr run \
  --app-id drasi-agent-router \
  --app-port 80 \
  --resources-path ./components \
  -- python -m src.main
```
