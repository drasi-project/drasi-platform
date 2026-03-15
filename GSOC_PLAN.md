# Reactive Ambient Agents: Drasi + Dapr Integration
## Complete Build Reference — GSoC 2026

---

## What This Project Does (One Paragraph)

Current AI agents are passive — they sit idle waiting for a user to type something. This project makes "Ambient Agents" that **wake up only when a real database condition is met** (e.g., a support ticket is 24+ hours overdue), do their work (call an LLM, send a notification), and go back to sleep. No polling. No persistent connections. Pure event-driven, scale-to-zero.

The bridge: **Drasi** (detects database changes via continuous SQL queries) → **Router Reaction** (our microservice that translates Drasi events to Dapr CloudEvents) → **Dapr Agents** (durable AI agent runtime that wakes up, runs workflows, calls LLMs).

---

## Data Flow (End to End)

```
Real Database (Postgres / CosmosDB / etc.)
    │
    │  row inserted / updated / deleted
    ▼
Drasi Continuous Query Engine
    │
    │  publishes ChangeEvent JSON to:
    │  [drasi-pubsub]  topic: {queryId}-results
    ▼
OUR Router Reaction  ◄── reads per-query YAML config from /etc/queries/
    │                     (which agent-pubsub topic to forward to, packed vs unpacked)
    │  publishes CloudEvent to:
    │  [agent-pubsub]  topic: {configured topic e.g. support.sla-breach}
    ▼
OUR Dapr Agent  ◄── @drasi_trigger decorator wires the subscription
    │
    │  Dapr Workflow starts
    │  calls LLM (OpenAI / any)
    │  produces output (draft email, alert, action)
    │
    ▼
Agent goes back to sleep (scale to zero)
```

---

## Repository Structure

### Repo 1: `github.com/1Ninad/drasi-platform`  branch: `gsoc-v1`

```
reactions/dapr-agents-router/
    src/
        config.py        # Per-query routing config (RouterQueryConfig Pydantic model)
        formatter.py     # Transforms Drasi ChangeEvent → CloudEvent payloads
        router.py        # DrasiAgentRouter — the core microservice class
        mcp_server.py    # Embedded MCP server on port 3001 (query discovery)
        main.py          # Entrypoint: wires router + MCP server
    tests/
        test_formatter.py   # 6 unit tests (no Dapr needed)
        test_router.py      # 3 unit tests (mocked DaprClient)
    pyproject.toml
    Dockerfile
GSOC_PLAN.md             ← this file (copy) in drasi-platform root
```

### Repo 2: `github.com/1Ninad/dapr-agents`  branch: `gsoc-v1`

```
dapr_agents/ext/drasi/
    __init__.py          # Public API exports
    models.py            # Pydantic v2 models for Drasi events (vendored)
    decorator.py         # @drasi_trigger decorator
    config.py            # DrasiSubscriptionConfig dataclass

dapr_agents/workflow/runners/agent.py   ← MODIFIED (lines ~280-314)
    # Added _is_drasi_trigger check in _build_pubsub_specs()
    # Without this fix, AgentRunner overwrites the decorator's topic

examples/09-drasi-ambient-agent/
    agent.py             # Proactive Support Agent (the demo)
    components/
        agent-pubsub.yaml   # Dapr Redis pub/sub component
        statestore.yaml     # Dapr Redis state store

tests/ext/drasi/
    test_models.py       # 6 unit tests for Pydantic models
    test_decorator.py    # 6 unit tests for @drasi_trigger

GSOC_PLAN.md             ← this file in dapr-agents root
```

---

## Deliverable 1: Router Reaction (drasi-platform repo)

### What it does
A standalone Python microservice (Docker container). Runs inside Kubernetes next to Drasi.
- Subscribes to Drasi's pub/sub output (`{queryId}-results` topics on `drasi-pubsub`)
- Reads per-query YAML config from `/etc/queries/{queryId}` to know where to forward events
- Transforms events to CloudEvents and publishes to the agent's pub/sub topic
- Hosts an MCP server (port 3001) so agents can discover available queries at runtime

### Key file: `src/config.py`
```python
class RouterQueryConfig(BaseModel):
    pubsub_name: str   # alias: pubsubName  — which Dapr pubsub to publish to
    topic_name: str    # alias: topicName   — which topic agents subscribe to
    format: OutputFormat = OutputFormat.PACKED   # "packed" or "unpacked"
    skip_control_signals: bool = True            # alias: skipControlSignals
```

### Key file: `src/formatter.py`
Two output formats:
- **packed**: entire ChangeEvent as one message. CloudEvent type = `drasi.change.packed`
- **unpacked**: one message per row. Types = `drasi.change.insert` / `drasi.change.update` / `drasi.change.delete`

### Key file: `src/router.py`
- `DrasiAgentRouter` composes `DrasiReaction` from the Drasi Python SDK
- `_handle_change()`: receives ChangeEvent → formats → publishes via `DaprClient.publish_event()`
- `_handle_control()`: receives lifecycle signals (bootstrapStarted, running, etc.) → forwards if configured
- **Critical**: uses synchronous `with DaprClient()` — NOT async (DaprClient does not support `async with`)

### Key file: `src/mcp_server.py`
- Uses `mcp` library with StreamableHTTP transport on port 3001
- Exposes `drasi://query/{queryId}` as MCP resources
- `list_resources()` → all configured queries
- `read_resource(uri)` → query config (topic, format, description)

### Per-query config YAML (deployed to `/etc/queries/{queryId}`)
```yaml
pubsubName: agent-pubsub
topicName: support.sla-breach
format: packed
skipControlSignals: true
```

---

## Deliverable 2: SDK Extension (dapr-agents repo)

### What it does
A Python module (`dapr_agents.ext.drasi`) that makes subscribing to Drasi events one line of code.

### Key file: `dapr_agents/ext/drasi/models.py`
Vendored Pydantic v2 models (NOT imported from drasi-reaction-sdk — it's alpha, not on PyPI).
All models have `extra="ignore"` so unknown future Drasi fields don't crash validation.

```python
class ChangeEvent(ResultEvent):          # packed delivery
    addedResults: List[Dict]             # new rows matching the query
    updatedResults: List[UpdatePayload]  # changed rows (before + after)
    deletedResults: List[Dict]           # rows no longer matching

class DrasiChangeNotification(BaseModel): # unpacked delivery
    op: ChangeOp                          # "I" insert / "U" update / "D" delete
    queryId: str
    payload: ChangePayload                # before + after
```

### Key file: `dapr_agents/ext/drasi/decorator.py`
```python
@drasi_trigger(query_id="sla-breaches", topic="support.sla-breach")
def handle_breach(ctx, wf_input: dict):
    ...
```
- Wraps `@message_router` internally (existing Dapr Agents decorator)
- Sets `_is_drasi_trigger = True` on the decorated function
- This flag is checked in `AgentRunner._build_pubsub_specs()` to prevent topic override

### Critical fix in `dapr_agents/workflow/runners/agent.py`
**Why needed**: `_build_pubsub_specs()` always replaced the decorator's topic with `config.agent_topic`.
This broke `@drasi_trigger` because every trigger has its own topic.

**Fix (lines ~280-314)**:
```python
is_drasi = getattr(handler, "_is_drasi_trigger", False)
if is_drasi:
    topic = meta.get("topic")          # preserve decorator's own topic
    pubsub_name = meta.get("pubsub")   # preserve decorator's own pubsub
else:
    topic = config.agent_topic         # original behavior for normal handlers
```

### How agents use it
```python
from dapr_agents.ext.drasi import drasi_trigger, ChangeEvent

@drasi_trigger(query_id="sla-breaches", topic="support.sla-breach")
def handle_breach(ctx, wf_input: dict):
    return handle_breach_workflow(ctx, wf_input)
```

---

## Deliverable 3: Demo — Proactive Support Agent (dapr-agents repo)

### File: `examples/09-drasi-ambient-agent/agent.py`

**Pattern used**: plain Dapr workflow (NOT DurableAgent).
Why: DurableAgent requires broadcast_topic + actor state store + registry — 3x complexity for no benefit here.

**Architecture**:
```python
llm = OpenAIChatClient(model="gpt-4o-mini")

# Workflow: orchestrates multiple LLM calls (one per breach)
def handle_sla_breach_workflow(ctx, wf_input):
    event = ChangeEvent.model_validate(wf_input)
    for breach in event.addedResults:
        result = yield ctx.call_activity(draft_response_activity, input=breach)

# Activity: does the actual LLM call (thread-safe, blocking OK)
def draft_response_activity(ctx, breach):
    response = llm.generate(messages=[{"role": "user", "content": prompt}])
    return str(response)

# Entry point: @drasi_trigger wires pub/sub subscription
@drasi_trigger(query_id="sla-breaches", topic="support.sla-breach")
def handle_sla_breach(ctx, wf_input):
    return handle_sla_breach_workflow(ctx, wf_input)

# Startup: register BOTH function names with Dapr runtime
runtime.register_workflow(handle_sla_breach_workflow)
runtime.register_workflow(handle_sla_breach)   # ← critical: matches scheduled name
runtime.register_activity(draft_response_activity)
```

**Why register both**: Dapr schedules a workflow by the decorated function's name (`handle_sla_breach`), but the actual logic is in `handle_sla_breach_workflow`. Both must be registered or you get `OrchestratorNotRegisteredError`.

---

## How to Run Locally (Mac)

### One-time setup
```bash
# 1. Start Dapr infrastructure
dapr init
# Verify: docker ps should show dapr_redis, dapr_placement, dapr_scheduler, dapr_zipkin

# 2. Expose Redis port (dapr init doesn't bind it by default)
docker stop dapr_redis && docker rm dapr_redis
docker run -d --name dapr_redis -p 6379:6379 redis:6

# 3. Install dapr-agents in dev mode
cd /path/to/dapr-agents
pip install -e ".[all]"
```

### Run the demo
```bash
# Terminal 1 — start agent (no --app-port needed, uses streaming subscriptions)
cd examples/09-drasi-ambient-agent
export OPENAI_API_KEY=sk-...
dapr run --app-id proactive-support --resources-path ./components -- python agent.py

# Wait for: "Subscribing to pubsub 'agent-pubsub' topic 'support.sla-breach'"

# Terminal 2 — send a simulated Drasi event
dapr publish --publish-app-id proactive-support \
  --pubsub agent-pubsub --topic support.sla-breach \
  --data '{"kind":"change","queryId":"sla-breaches","sequence":1,"sourceTimeMs":1700000000000,"addedResults":[{"ticket_id":"T001","customer_id":"C123","sla_hours":26}],"updatedResults":[],"deletedResults":[]}'
```

### What success looks like in Terminal 1
```
INFO  Workflow started for SLA breach event
INFO  Processing: queryId=sla-breaches, sequence=1, breaches=1
INFO  LLM response for ticket T001: Dear Customer C123, I sincerely apologize...
INFO  Drafted response for ticket T001
INFO  Orchestration completed with status: COMPLETED
```
The apology text is **generated live by OpenAI** — different every run. That's the proof.

---

## Test Suite

```bash
# SDK extension tests (12 tests)
cd dapr-agents
python -m pytest tests/ext/ -v

# Router reaction tests (9 tests)
cd drasi-platform/reactions/dapr-agents-router
pip install -e "../../sdk/python"   # install Drasi Python SDK
pip install pytest-asyncio
python -m pytest tests/ -v
```

---

## Bugs Fixed During Development

| Bug | Where | Impact | Fix |
|-----|-------|--------|-----|
| `_build_pubsub_specs` overwrote `@drasi_trigger` topic | `agent.py:~285` | Trigger never fires | Added `_is_drasi_trigger` flag check |
| `DurableAgent` requires broadcast_topic + actor state store | Demo | Startup crash | Replaced with plain Dapr workflow pattern |
| `DaprClient` used as `async with` | `router.py` | Runtime crash in production | Changed to synchronous `with DaprClient()` |
| Pydantic models had no `extra="ignore"` | `models.py` | Crash on unknown Drasi fields | Added `ConfigDict(extra="ignore")` to all models |
| Both workflow names must be registered | Demo `main()` | `OrchestratorNotRegisteredError` | Register both `handle_sla_breach` and `handle_sla_breach_workflow` |

---

## What's Left for Full Production

1. **Kubernetes deployment** — Router Reaction needs K8s manifests (Deployment + ConfigMap for query configs)
2. **Real Drasi** — needs `kind` or Docker Desktop K8s + `drasi init` + a Postgres source + a continuous query YAML
3. **Real database** — Postgres with a `tickets` table; insert a row with `sla_hours > 24` to trigger the agent
4. **MCP integration test** — connect an agent to the MCP server at `http://router:3001` and call `list_resources()`

Everything else is complete and tested.
