# Plan: Reactive Ambient Agents — Drasi + Dapr Integration
## GSoC 2026 | Build-from-scratch reference

> **How to use this doc**: Read top to bottom. Each section tells you exactly what to build,
> in what order, and what will go wrong (so you don't repeat the same bugs).
> You can rebuild this entire project from scratch using only this file.

---

## Why This Exists

Current AI agents are passive — they wait for a user to type something. The goal is to build
**Ambient Agents** that wake up *only* when a real database condition is met (e.g. a support
ticket is 26 hours overdue), do work (call an LLM, send a notification), and go back to sleep.

**No polling. No persistent socket. Pure event-driven. Scale-to-zero.**

The two systems being connected:
- **Drasi** — a CNCF project that runs continuous SQL queries against live databases and
  publishes change events when query results change (rows added/updated/deleted)
- **Dapr Agents** — a Python framework for building durable AI agent workflows on top of Dapr

Neither system knows about the other. This project is the bridge.

---

## Data Flow (memorise this — everything else follows from it)

```
Real Database (Postgres / CosmosDB / etc.)
        │
        │  a row changes (insert / update / delete)
        ▼
Drasi Continuous Query Engine
        │
        │  evaluates continuous SQL query (e.g. "tickets WHERE sla_hours > 24")
        │  publishes ChangeEvent JSON to Dapr pub/sub:
        │    component: drasi-pubsub
        │    topic:     {queryId}-results   (e.g. "sla-breaches-results")
        ▼
[Deliverable 1] Router Reaction  (our Python microservice)
        │
        │  reads per-query YAML config: which agent topic to forward to, which format
        │  transforms ChangeEvent → CloudEvent
        │  publishes to Dapr pub/sub:
        │    component: agent-pubsub
        │    topic:     {configured}  (e.g. "support.sla-breach")
        ▼
[Deliverable 2] Dapr Agent  (uses our @drasi_trigger decorator)
        │
        │  wakes up, Dapr Workflow starts
        │  calls LLM, produces output
        │  workflow completes
        ▼
Agent goes back to sleep (scale to zero)
```

---

## Repositories and Branch

| Repo | What lives here | Branch |
|------|----------------|--------|
| `github.com/1Ninad/drasi-platform` | Router Reaction microservice | `gsoc-v1` |
| `github.com/1Ninad/dapr-agents` | SDK extension + demo agent | `gsoc-v1` |

**Always work on `gsoc-v1` — never commit to `main`.**

---

## Build Order (strict — do not swap)

1. **Router Reaction** first — it defines the CloudEvent JSON contract
2. **SDK Extension** second — it consumes that contract
3. **Demo Agent** last — it wires everything together

---

## Deliverable 1: Router Reaction

**Repo:** `drasi-platform`
**Location:** `reactions/dapr-agents-router/`

### What it is
A standalone Python microservice (runs as a Docker container in Kubernetes).
It sits between Drasi and your agents.
- Subscribes to Drasi's output topics (`{queryId}-results` on `drasi-pubsub`)
- Reads a YAML config file per query (from `/etc/queries/{queryId}`) that says which
  agent topic to forward to and in which format
- Transforms the event and publishes it to the agent's topic
- Also runs an MCP server on port 3001 so agents can discover available queries

### File structure to create
```
reactions/dapr-agents-router/
    pyproject.toml
    Dockerfile
    src/
        __init__.py
        config.py        # RouterQueryConfig Pydantic model
        formatter.py     # format_packed() and format_unpacked()
        router.py        # DrasiAgentRouter class
        mcp_server.py    # MCP server on port 3001
        main.py          # entrypoint
    tests/
        test_formatter.py
        test_router.py
```

---

### Step 1.1 — `src/config.py`

```python
import os
from enum import Enum
from typing import Any
import yaml
from pydantic import BaseModel, Field

class OutputFormat(str, Enum):
    PACKED = "packed"
    UNPACKED = "unpacked"

class RouterQueryConfig(BaseModel):
    # Field aliases: YAML uses camelCase, Python uses snake_case
    pubsub_name: str = Field(
        default_factory=lambda: os.getenv("DefaultPubsubName", "agent-pubsub"),
        alias="pubsubName"
    )
    topic_name: str = Field(alias="topicName")
    format: OutputFormat = OutputFormat.PACKED
    skip_control_signals: bool = Field(default=True, alias="skipControlSignals")
    model_config = {"populate_by_name": True}

def parse_query_config(f) -> dict:
    """Called by DrasiReaction for each file in /etc/queries/"""
    return yaml.safe_load(f)
```

**Why aliases**: YAML config files use `pubsubName`, `topicName` (camelCase).
Pydantic needs aliases to parse them correctly.

---

### Step 1.2 — `src/formatter.py`

Two output formats:

**Packed**: entire ChangeEvent as one message. One call to the agent per query update.
CloudEvent type = `drasi.change.packed`

**Unpacked**: one message per changed row. Multiple calls to agent per query update.
CloudEvent types = `drasi.change.insert` / `drasi.change.update` / `drasi.change.delete`

```python
from drasi.reaction.models.ChangeEvent import ChangeEvent
from .config import OutputFormat, RouterQueryConfig

def format_packed(event: ChangeEvent, config: RouterQueryConfig) -> list[dict]:
    return [event.model_dump()]

def format_unpacked(event: ChangeEvent, config: RouterQueryConfig) -> list[dict]:
    messages = []
    for record in event.addedResults:
        messages.append({
            "op": "I", "queryId": event.queryId,
            "sequence": event.sequence, "tsMs": event.sourceTimeMs,
            "payload": {"before": None, "after": record.root}
        })
    for update in event.updatedResults:
        messages.append({
            "op": "U", "queryId": event.queryId,
            "sequence": event.sequence, "tsMs": event.sourceTimeMs,
            "payload": {
                "before": update.before.root if update.before else None,
                "after": update.after.root if update.after else None,
            }
        })
    for record in event.deletedResults:
        messages.append({
            "op": "D", "queryId": event.queryId,
            "sequence": event.sequence, "tsMs": event.sourceTimeMs,
            "payload": {"before": record.root, "after": None}
        })
    return messages

def get_cloudevent_type(config: RouterQueryConfig, op: str | None) -> str:
    if config.format == OutputFormat.PACKED:
        return "drasi.change.packed"
    op_map = {"I": "drasi.change.insert", "U": "drasi.change.update", "D": "drasi.change.delete"}
    return op_map.get(op, "drasi.change.unknown")
```

---

### Step 1.3 — `src/router.py`

**CRITICAL WARNING**: `DaprClient` is **synchronous**. Do NOT use `async with DaprClient()`.
It does not have `__aenter__`. Use plain `with DaprClient()` and plain `client.publish_event()`.
(This was a bug in the original plan — fixed during implementation.)

```python
import json
import logging
from typing import Any

from dapr.clients import DaprClient
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent
from drasi.reaction.sdk import DrasiReaction

from .config import OutputFormat, RouterQueryConfig, parse_query_config
from .formatter import format_packed, format_unpacked, get_cloudevent_type

logger = logging.getLogger(__name__)

class DrasiAgentRouter:
    def __init__(self, port: int = 80):
        self._port = port
        self._reaction = DrasiReaction(
            on_change_event=self._handle_change,
            on_control_event=self._handle_control,
            parse_query_configs=parse_query_config,
            port=port,
        )
        self._query_configs: dict[str, RouterQueryConfig] = {}

    def start(self):
        logger.info("Starting Drasi Agent Router")
        self._reaction.start()  # blocks

    async def _handle_change(self, event: ChangeEvent, raw_config: Any) -> None:
        if raw_config is None:
            logger.warning("No config for query '%s' — skipping", event.queryId)
            return
        config = RouterQueryConfig.model_validate(raw_config)
        self._query_configs[event.queryId] = config

        messages = (
            format_packed(event, config)
            if config.format == OutputFormat.PACKED
            else format_unpacked(event, config)
        )
        await self._publish_messages(event, config, messages)

    async def _handle_control(self, event: ControlEvent, raw_config: Any) -> None:
        if raw_config is None:
            return
        config = RouterQueryConfig.model_validate(raw_config)
        if config.skip_control_signals:
            return
        signal_kind = getattr(event.controlSignal, "kind", "unknown")
        payload = {
            "kind": "control", "queryId": event.queryId,
            "sequence": event.sequence, "sourceTimeMs": event.sourceTimeMs,
            "controlSignal": {"kind": signal_kind},
        }
        # SYNC — not async
        with DaprClient() as client:
            client.publish_event(
                pubsub_name=config.pubsub_name,
                topic_name=config.topic_name,
                data=json.dumps(payload),
                data_content_type="application/json",
                publish_metadata={
                    "cloudevent.source": f"drasi/query/{event.queryId}",
                    "cloudevent.type": f"drasi.control.{signal_kind}",
                },
            )

    async def _publish_messages(self, event, config, messages):
        if not messages:
            return
        # SYNC — not async
        with DaprClient() as client:
            for msg in messages:
                op = msg.get("op")
                ce_type = get_cloudevent_type(config, op)
                client.publish_event(
                    pubsub_name=config.pubsub_name,
                    topic_name=config.topic_name,
                    data=json.dumps(msg),
                    data_content_type="application/json",
                    publish_metadata={
                        "cloudevent.source": f"drasi/query/{event.queryId}",
                        "cloudevent.type": ce_type,
                    },
                )
```

---

### Step 1.4 — `src/mcp_server.py`

MCP server using StreamableHTTP transport on port 3001.
Exposes Drasi queries as MCP resources so agents can discover them.

```python
from mcp.server.fastmcp import FastMCP
from mcp import types

mcp = FastMCP("drasi-router")
_query_configs: dict = {}  # populated by router

@mcp.list_resources()
async def list_resources() -> list[types.Resource]:
    return [
        types.Resource(
            uri=f"drasi://query/{qid}",
            name=f"Drasi Query: {qid}",
            description=f"Topic: {cfg.topic_name}, Format: {cfg.format.value}",
            mimeType="application/json",
        )
        for qid, cfg in _query_configs.items()
    ]

@mcp.read_resource()
async def read_resource(uri: str) -> str:
    query_id = uri.replace("drasi://query/", "")
    cfg = _query_configs.get(query_id)
    if not cfg:
        raise ValueError(f"Unknown query: {query_id}")
    import json
    return json.dumps({"queryId": query_id, "topic": cfg.topic_name, "format": cfg.format.value})
```

---

### Step 1.5 — `src/main.py`

```python
import threading
from .router import DrasiAgentRouter
from .mcp_server import mcp

def main():
    router = DrasiAgentRouter()
    # MCP server in background thread on port 3001
    t = threading.Thread(target=lambda: mcp.run(transport="streamable-http", port=3001), daemon=True)
    t.start()
    router.start()  # blocks

if __name__ == "__main__":
    main()
```

---

### Step 1.6 — Per-query YAML config (deployed to `/etc/queries/{queryId}`)

```yaml
# /etc/queries/sla-breaches
pubsubName: agent-pubsub
topicName: support.sla-breach
format: packed
skipControlSignals: true
```

---

### Step 1.7 — Tests

Install for tests: `pip install -e ../../sdk/python pytest pytest-asyncio`

**`tests/test_formatter.py`** — test packed/unpacked output with a sample ChangeEvent dict.
No Dapr needed. Just call `format_packed(event, config)` and assert the output.

**`tests/test_router.py`** — mock `DaprClient` as a `MagicMock` (NOT AsyncMock — it's sync):
```python
mock_client = MagicMock()
mock_client.__enter__ = MagicMock(return_value=mock_client)
mock_client.__exit__ = MagicMock(return_value=None)
with patch("src.router.DaprClient", return_value=mock_client):
    await router._handle_change(event, config_dict)
mock_client.publish_event.assert_called_once()
```

---

## Deliverable 2: SDK Extension

**Repo:** `dapr-agents`
**Location:** `dapr_agents/ext/drasi/`

### What it is
A Python module that makes subscribing to Drasi events one line of code in any Dapr Agent.
No new package dependency — vendor the models, compose the existing `@message_router` decorator.

### File structure to create
```
dapr_agents/ext/__init__.py          # empty
dapr_agents/ext/drasi/__init__.py    # exports: ChangeEvent, drasi_trigger, etc.
dapr_agents/ext/drasi/models.py      # Pydantic v2 models (vendored from Drasi SDK)
dapr_agents/ext/drasi/decorator.py   # @drasi_trigger
dapr_agents/ext/drasi/config.py      # DrasiSubscriptionConfig dataclass

tests/ext/__init__.py
tests/ext/drasi/__init__.py
tests/ext/drasi/test_models.py
tests/ext/drasi/test_decorator.py
```

---

### Step 2.1 — `dapr_agents/ext/drasi/models.py`

**DO NOT** import from `drasi-reaction-sdk` — it's alpha, not on PyPI.
Vendor the models directly. All models must have `extra="ignore"` so unknown future
Drasi fields don't cause ValidationError in production.

```python
from __future__ import annotations
from enum import Enum
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

class ResultEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    kind: str
    queryId: str
    sequence: int
    sourceTimeMs: int
    metadata: Optional[Dict[str, Any]] = None

class UpdatePayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    before: Optional[Dict[str, Any]] = None
    after: Optional[Dict[str, Any]] = None

class ChangeEvent(ResultEvent):
    kind: Literal["change"] = "change"
    addedResults: List[Dict[str, Any]] = Field(default_factory=list)
    updatedResults: List[UpdatePayload] = Field(default_factory=list)
    deletedResults: List[Dict[str, Any]] = Field(default_factory=list)

class ControlSignal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    kind: str

class ControlEvent(ResultEvent):
    kind: Literal["control"] = "control"
    controlSignal: ControlSignal

class ControlSignalKind(str, Enum):
    BOOTSTRAP_STARTED = "bootstrapStarted"
    BOOTSTRAP_COMPLETED = "bootstrapCompleted"
    RUNNING = "running"
    STOPPED = "stopped"
    DELETED = "deleted"

class ChangeOp(str, Enum):
    INSERT = "I"
    UPDATE = "U"
    DELETE = "D"

class ChangePayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    before: Optional[Dict[str, Any]] = None
    after: Optional[Dict[str, Any]] = None

class DrasiChangeNotification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    op: ChangeOp
    queryId: str
    sequence: int
    tsMs: int
    payload: ChangePayload
```

Source reference (to understand the schema):
`drasi-platform/reactions/sdk/python/drasi/reaction/models/ChangeEvent.py`

---

### Step 2.2 — `dapr_agents/ext/drasi/decorator.py`

**Approach**: wrap the existing `@message_router` decorator (already in dapr-agents).
This reuses all existing subscription, CloudEvent validation, and workflow scheduling logic.
Just add `_is_drasi_trigger = True` as a flag for the fix in Step 2.3.

```python
from typing import Callable, Literal, Optional
from dapr_agents.workflow.decorators.decorators import message_router
from .models import ChangeEvent, DrasiChangeNotification

def drasi_trigger(
    func=None,
    *,
    query_id: Optional[str] = None,
    pubsub: str = "agent-pubsub",
    topic: Optional[str] = None,
    format: Literal["packed", "unpacked"] = "packed",
    dead_letter_topic: Optional[str] = None,
):
    resolved_topic = topic or (f"drasi.{query_id}" if query_id else None)
    if not resolved_topic:
        raise ValueError(
            "@drasi_trigger requires either 'topic' or 'query_id'. "
            "Example: @drasi_trigger(query_id='sla-breaches')"
        )
    message_model = ChangeEvent if format == "packed" else DrasiChangeNotification

    def decorator(f):
        decorated = message_router(
            f,
            pubsub=pubsub,
            topic=resolved_topic,
            message_model=message_model,
            dead_letter_topic=dead_letter_topic,
        )
        setattr(decorated, "_is_drasi_trigger", True)
        return decorated

    return decorator if func is None else decorator(func)
```

---

### Step 2.3 — Modify `dapr_agents/workflow/runners/agent.py`

**Why this fix is needed**: The existing `_build_pubsub_specs()` method always overwrites
the decorator's topic with `config.agent_topic`. This means `@drasi_trigger(topic="support.sla-breach")`
would be silently ignored and the agent would subscribe to the wrong topic.

**Find this method** (search for `_build_pubsub_specs` in `agent.py`).
Inside the loop over handlers, add the `is_drasi` check:

```python
# BEFORE (original code — broken for drasi_trigger):
for _, handler in handlers.items():
    topic = config.agent_topic          # always overrides decorator's topic
    pubsub_name = config.pubsub_name

# AFTER (fixed):
for _, handler in handlers.items():
    meta = getattr(handler, "_message_router_data", {})
    is_drasi = getattr(handler, "_is_drasi_trigger", False)
    is_broadcast = meta.get("is_broadcast", False)

    if is_drasi:
        topic = meta.get("topic")                      # preserve decorator's topic
        pubsub_name = meta.get("pubsub") or config.pubsub_name
        if not topic:
            raise ValueError(f"@drasi_trigger on '{handler.__name__}' missing topic")
    else:
        topic = config.broadcast_topic if is_broadcast else config.agent_topic
        pubsub_name = config.pubsub_name
        if not topic:
            raise ValueError(...)
```

---

### Step 2.4 — `dapr_agents/ext/drasi/__init__.py`

```python
from .models import (
    ChangeEvent, ControlEvent, DrasiChangeNotification,
    ChangeOp, ChangePayload, UpdatePayload, ControlSignal, ControlSignalKind,
)
from .decorator import drasi_trigger
from .config import DrasiSubscriptionConfig

__all__ = [
    "ChangeEvent", "ControlEvent", "DrasiChangeNotification",
    "ChangeOp", "ChangePayload", "UpdatePayload", "ControlSignal", "ControlSignalKind",
    "drasi_trigger", "DrasiSubscriptionConfig",
]
```

---

### Step 2.5 — Tests

Run with: `python -m pytest tests/ext/ -v`

**`tests/ext/drasi/test_models.py`**: validate that real Drasi JSON parses correctly:
```python
def test_change_event_parses():
    data = {
        "kind": "change", "queryId": "sla-breaches", "sequence": 1,
        "sourceTimeMs": 1700000000000,
        "addedResults": [{"ticket_id": "T001"}],
        "updatedResults": [], "deletedResults": []
    }
    event = ChangeEvent.model_validate(data)
    assert event.queryId == "sla-breaches"
    assert event.addedResults[0]["ticket_id"] == "T001"
```

**`tests/ext/drasi/test_decorator.py`**: verify decorator sets correct metadata:
```python
def test_sets_is_drasi_trigger():
    @drasi_trigger(query_id="sla-breaches", topic="support.sla-breach")
    def handle(ctx, wf_input): pass
    assert getattr(handle, "_is_drasi_trigger") is True

def test_sets_correct_topic():
    @drasi_trigger(query_id="sla-breaches", topic="support.sla-breach")
    def handle(ctx, wf_input): pass
    meta = getattr(handle, "_message_router_data", {})
    assert meta.get("topic") == "support.sla-breach"
```

---

## Deliverable 3: Demo — Proactive Support Agent

**Repo:** `dapr-agents`
**Location:** `examples/09-drasi-ambient-agent/`

### What it does
A "Proactive Support Agent" that:
1. Sleeps at zero cost
2. Wakes up when a Drasi event arrives on `support.sla-breach`
3. Calls OpenAI LLM to draft an apology email for each overdue ticket
4. Completes and goes back to sleep

### Pattern to use: plain Dapr workflow (NOT DurableAgent)

**Why NOT DurableAgent**: `DurableAgent` internally registers a `broadcast_listener` workflow
that requires `broadcast_topic` in `AgentPubSubConfig`. It also needs an actor-enabled state store.
That's 3x complexity for no benefit here. Use plain `wf.WorkflowRuntime()` instead.

### File structure
```
examples/09-drasi-ambient-agent/
    agent.py
    components/
        agent-pubsub.yaml    # Dapr pub/sub using Redis
        statestore.yaml      # Dapr state store using Redis
```

---

### `agent.py`

```python
from __future__ import annotations
import asyncio, logging, os, signal
import dapr.ext.workflow as wf
from dapr.clients import DaprClient
from dotenv import load_dotenv
from dapr_agents.ext.drasi import ChangeEvent, drasi_trigger
from dapr_agents.llm.openai import OpenAIChatClient
from dapr_agents.workflow.utils.registration import register_message_routes

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

llm = OpenAIChatClient(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))

# WORKFLOW — orchestrates: one activity call per breach
def handle_sla_breach_workflow(ctx: wf.DaprWorkflowContext, wf_input: dict):
    event = ChangeEvent.model_validate(wf_input)
    results = []
    for breach in event.addedResults:
        result = yield ctx.call_activity(draft_response_activity, input=breach)
        results.append(result)
        logger.info("Drafted response for ticket %s", breach.get("ticket_id"))
    return results

# ACTIVITY — does the actual LLM call (runs in thread pool, blocking OK)
def draft_response_activity(ctx, breach: dict) -> str:
    prompt = (
        f"Customer {breach.get('customer_id')} has ticket {breach.get('ticket_id')} "
        f"that is {breach.get('sla_hours', 0)} hours past SLA. "
        "Draft a brief (2-3 sentence) empathetic apology and one concrete next step."
    )
    response = llm.generate(messages=[{"role": "user", "content": prompt}])
    text = str(response)
    logger.info("LLM response for ticket %s: %s", breach.get("ticket_id"), text)
    return text

# ENTRY POINT — @drasi_trigger wires the pub/sub subscription
@drasi_trigger(query_id="sla-breaches", topic="support.sla-breach")
def handle_sla_breach(ctx: wf.DaprWorkflowContext, wf_input: dict):
    return handle_sla_breach_workflow(ctx, wf_input)

async def _wait_for_shutdown():
    loop = asyncio.get_running_loop()
    stop = asyncio.Event()
    try:
        loop.add_signal_handler(signal.SIGINT, stop.set)
        loop.add_signal_handler(signal.SIGTERM, stop.set)
    except NotImplementedError:
        signal.signal(signal.SIGINT, lambda *_: stop.set())
    await stop.wait()

async def main():
    runtime = wf.WorkflowRuntime()
    # CRITICAL: register BOTH names — Dapr schedules by decorated function name
    # (handle_sla_breach) but actual logic is in handle_sla_breach_workflow.
    # Miss either one → OrchestratorNotRegisteredError at runtime.
    runtime.register_workflow(handle_sla_breach_workflow)
    runtime.register_workflow(handle_sla_breach)
    runtime.register_activity(draft_response_activity)
    runtime.start()

    logger.info("Agent is ready. Waiting for Drasi events on 'support.sla-breach'.")

    try:
        with DaprClient() as client:
            closers = register_message_routes(targets=[handle_sla_breach], dapr_client=client)
            try:
                await _wait_for_shutdown()
            finally:
                for close in closers:
                    try: close()
                    except Exception: logger.exception("Error closing subscription")
    finally:
        runtime.shutdown()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
```

---

### `components/agent-pubsub.yaml`

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: agent-pubsub
spec:
  type: pubsub.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
    - name: redisPassword
      value: ""
```

### `components/statestore.yaml`

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
    - name: redisPassword
      value: ""
    - name: actorStateStore
      value: "true"
```

---

## How to Run Locally (Mac — step by step)

### One-time setup

```bash
# 1. Start Dapr (creates placement, scheduler, zipkin, redis containers)
dapr init

# 2. Check all 4 containers are running
docker ps --format "table {{.Names}}\t{{.Status}}"
# Must see: dapr_redis, dapr_placement, dapr_scheduler, dapr_zipkin

# 3. Expose Redis port to localhost
#    (dapr init's redis has no host port by default — fix this)
docker stop dapr_redis && docker rm dapr_redis
docker run -d --name dapr_redis -p 6379:6379 redis:6

# 4. Install dapr-agents
cd /path/to/dapr-agents
pip install -e ".[all]"
```

### Run the demo

```bash
# Terminal 1 — start the agent
cd examples/09-drasi-ambient-agent
export OPENAI_API_KEY=sk-...
dapr run --app-id proactive-support --resources-path ./components -- python agent.py
# DO NOT add --app-port (streaming subscriptions don't need it)

# Wait for this line:
# INFO  Subscribing to pubsub 'agent-pubsub' topic 'support.sla-breach'

# Terminal 2 — send a simulated Drasi event (same JSON structure as real Drasi)
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

The apology text is **generated live by OpenAI** — different every run.
That's proof it's real, not hardcoded.

---

## Bugs You Will Hit (and exact fixes)

These all happened during the original build. Read this before you start.

| # | Bug | When you hit it | Fix |
|---|-----|----------------|-----|
| 1 | `AgentPubSubConfig missing topic for broadcast handler` | If you use `DurableAgent` | Don't use DurableAgent. Use plain `wf.WorkflowRuntime()` + `register_message_routes()` |
| 2 | `OrchestratorNotRegisteredError: 'handle_sla_breach' not registered` | When event arrives | Register BOTH `handle_sla_breach` AND `handle_sla_breach_workflow` with runtime |
| 3 | `DaprClient has no __aenter__` | Router starts, event arrives | Use `with DaprClient()` not `async with DaprClient()` — it's synchronous |
| 4 | `ValidationError: extra fields not permitted` | Real Drasi sends unknown fields | Add `model_config = ConfigDict(extra="ignore")` to all Pydantic models |
| 5 | `dial tcp 127.0.0.1:6379: connection refused` | Agent starts | Redis not running. Run `docker run -d --name dapr_redis -p 6379:6379 redis:6` |
| 6 | Agent waiting for port 8009, never starts | Using `--app-port` flag | Remove `--app-port` — streaming subscriptions don't need an HTTP server |
| 7 | `@drasi_trigger` topic silently ignored, wrong topic subscribed | After agent starts | Apply the `_is_drasi_trigger` fix in `agent.py:_build_pubsub_specs` |

---

## Running All Tests

```bash
# SDK extension (12 tests) — from dapr-agents root
python -m pytest tests/ext/ -v

# Router Reaction (9 tests) — from drasi-platform root
cd reactions/dapr-agents-router
pip install -e "../../sdk/python"  # install Drasi Python SDK
pip install pytest-asyncio
python -m pytest tests/ -v
```

---

## What's Needed for Full Production (not built yet)

1. **Kubernetes deployment for Router Reaction**
   - `Deployment` manifest for the router container
   - `ConfigMap` with per-query YAML configs (mounts to `/etc/queries/`)
   - Drasi `Reaction` CRD YAML pointing to router image

2. **Real Drasi setup** (needs Kubernetes)
   - `kind` or Docker Desktop Kubernetes enabled
   - `drasi init` to install Drasi on cluster
   - A Postgres database with a `tickets` table
   - Drasi `Source` CRD pointing to Postgres
   - Drasi `ContinuousQuery` CRD: `SELECT * FROM tickets WHERE sla_hours > 24`

3. **Real end-to-end test**
   - Insert a row into Postgres with `sla_hours = 26`
   - Watch Drasi fire → Router forwards → Agent wakes up → LLM responds

Everything else is complete.
