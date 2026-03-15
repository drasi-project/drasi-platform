# Plan: Drasi + Dapr Agents Integration Layer

## Context

Current AI agents wait for user input. "Ambient Agents" should wake up autonomously when real-world data conditions change. Drasi detects database changes via continuous queries and publishes them to Dapr Pub/Sub. Dapr Agents provides a durable, workflow-based agent runtime. This plan connects them: Drasi change events flow into Dapr Agents, so agents wake up only when specific data conditions are met (scale-to-zero).

**Data flow:**
```
Database --> Drasi CQ Engine --> [drasi-pubsub: {queryId}-results] --> Router Reaction --> [agent-pubsub: configurable-topic] --> Dapr Agent
```

Three deliverables (build order):
1. **Router Reaction** (standalone Python microservice in **drasi-platform** repo) - bridges Drasi events to agent pub/sub topics + hosts MCP server. **Build first** - produces the CloudEvent contract.
2. **SDK Extension** (`dapr_agents.ext.drasi` in **dapr-agents** repo) - Pydantic models + `@drasi_trigger` decorator. **Build second** - consumes the contract defined by the router.
3. **Demo** - end-to-end "Proactive Support Agent" in **dapr-agents** repo. **Build last** - wires everything together.

## CloudEvent Contract (defined by Router, consumed by SDK)

- Packed event type: `drasi.change.packed`
- Unpacked insert type: `drasi.change.insert`
- Unpacked update type: `drasi.change.update`
- Unpacked delete type: `drasi.change.delete`
- Control event type: `drasi.control.{signalKind}`
- CloudEvent source: `drasi/query/{queryId}`

## Deliverable 1: Router Reaction
Location: `drasi-platform/reactions/dapr-agents-router/`

## Deliverable 2: SDK Extension
Location: `dapr-agents/dapr_agents/ext/drasi/`
Key change: `dapr_agents/workflow/runners/agent.py` lines 273-305 (`_build_pubsub_specs`)

## Deliverable 3: Demo
Location: `dapr-agents/examples/09-drasi-ambient-agent/`
