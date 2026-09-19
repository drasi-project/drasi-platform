# DaprAgentRouter application, catalog, and row conversion

This package implements the application host and static query catalog for [drasi-project/drasi-platform#456](https://github.com/drasi-project/drasi-platform/issues/456), and row conversion for [drasi-project/drasi-platform#462](https://github.com/drasi-project/drasi-platform/issues/462). It composes the Python Reaction SDK and a stateless streamable HTTP MCP endpoint in one FastAPI application.

The earlier runner and catalog prototype is in [drasi-project/drasi-platform#443](https://github.com/drasi-project/drasi-platform/pull/443). This application adapts that same-port architecture to the current SDK lifecycle and shared protocol.

**This is not yet a functioning event router.** Only `list_queries` is implemented on the MCP surface. Durable subscriptions, fanout, administration, and built-in provider packaging are separate work. Row conversion is available through the helpers below but is not wired into delivery. Valid change events deliberately return `RETRY`, rather than acknowledging changes that have not been forwarded. Do not deploy this application against live query streams expecting delivery or retention guarantees: broker retry/dead-letter policies can exhaust retries.

## Configuration

The application reads the following environment variables. Reaction properties become environment variables when deployed by Drasi.

| Variable | Meaning |
| --- | --- |
| `routerId` | Required stable `<namespace>/<dapr-app-id>` identity, such as `drasi-system/sre-router-reaction`. |
| `egressPubsubName` | Required application-facing Pub/Sub component. Must not equal `drasi-pubsub` or `PubsubName`. |
| `PubsubName` | Required inbound Pub/Sub component, normally injected by the platform. |
| `StateStoreName` | Required state component, injected for a provider declaring `state_store: true`. |
| `QueryConfigPath` | SDK query configuration directory, defaulting to `/etc/queries`. |

`routerId` must match the actual Dapr application identity and namespace. It is explicit configuration, not inferred from the pod name or `INSTANCE_ID`; the latter is a separate generated Drasi resource UUID. Router identity determines the inbound dead-letter topic through the shared contract's naming helper.

Component names must be non-empty and contain no whitespace. Configuration errors fail application creation. This slice validates component names but does not connect to the state store or prove broker connectivity. It does not provision either component or its backing infrastructure. Router namespace/app-ID values are trusted operator configuration, not authenticated caller identities.

## Query catalog

The platform mounts each `Reaction.spec.queries` value as `/etc/queries/<query-id>`. The following is a manifest excerpt to place under `Reaction.spec`, not the contents of a per-query file:

```yaml
queries:
  checkout-server-errors: |
    title: Checkout server errors
    description: Individual checkout HTTP 5xx errors with errorId, service, statusCode, and message fields.
    usage: Use inserts to react to newly matching errors.
  checkout-rollout-status: |
    title: Checkout rollout status
    description: Individual checkout rollout rows with rolloutId, service, status, and message fields.
```

The resulting `/etc/queries/checkout-server-errors` file contains only the metadata, without a `queries:` wrapper:

```yaml
title: Checkout server errors
description: Individual checkout HTTP 5xx errors with errorId, service, statusCode, and message fields.
usage: Use inserts to react to newly matching errors.
```

`title` and `description` are required non-blank strings. `usage` is optional, but must be a non-blank string when present. Unknown fields, explicit null metadata, and an embedded `query_id` are rejected. Query identity comes from the entire filename, including dots, not a metadata field or filename stem.

The SDK scans the directory once while installing its routes. The application validates every entry and constructs the MCP catalog from that same registration snapshot. Missing directories and invalid entries fail startup; an existing empty directory is valid. Changes require restart. There is no query-text lookup, query creation, schema inference, or live catalog refresh.

## Run locally

Use Python 3.10-3.13 and uv. From this directory:

```sh
make install-dependencies
mkdir -p local-queries
```

Create `local-queries/checkout-server-errors` with the per-query file contents shown above, then run one application worker:

```sh
export routerId=drasi-system/sre-router-reaction
export egressPubsubName=agent-egress
export PubsubName=drasi-pubsub-sre-router
export StateStoreName=drasi-statestore-sre-router
export QueryConfigPath="$PWD/local-queries"
uv run --locked uvicorn agent_router.app:create_app --factory --host 127.0.0.1 --port 8000 --workers 1
```

Catalog access does not require a running Dapr sidecar or database. For Dapr hosting, use the same application port, one worker, and private service invocation. Configure the actual Dapr app ID and namespace to match `routerId`. Multiple application workers and replicas are unsupported.

The application exposes:

| Endpoint | Behavior |
| --- | --- |
| `POST /mcp` | Stateless MCP initialization, tool discovery, and `list_queries` calls. |
| `GET /dapr/subscribe` | SDK-managed query subscriptions and the derived inbound dead-letter topic. |
| `POST /_drasi/events/{query_id}` | SDK-managed CloudEvent validation and explicit delivery outcomes. |

`/mcp` is the exact endpoint, without an additional path segment or trailing-slash redirect. MCP requests must use the normal protocol headers, including `Accept: application/json, text/event-stream`. Successful tool results contain identical JSON data in `structuredContent` and a text content block. Argument errors have `isError: true` and a JSON `ToolError` text block, with no success-shaped `structuredContent`.

No MCP session ID or long-lived SSE connection is required. GET/SSE and session deletion are unsupported. Cross-namespace Dapr HTTP invocation uses:

```text
http://localhost:<dapr-http-port>/v1.0/invoke/<router-app-id>.<router-namespace>/method/mcp
```

The MCP session manager starts before the SDK marks the reaction ready. Dapr discovery and both delivery paths reject work until initialization completes. Startup failures unwind lifespan resources; shutdown clears readiness before stopping the MCP manager. Valid query control events are acknowledged by the SDK without forwarding.

## Row conversion

The conversion helpers perform no subscription lookup, publication, or workflow activation. A future forwarding handler can use them with the SDK's `ReactionMessage.event`:

```python
from time import time_ns

from agent_router import build_delivery, unpack_change

rows = unpack_change(message.event, unpacked_at_ms=time_ns() // 1_000_000)
deliveries = [
    build_delivery(
        row,
        router_id="drasi-system/sre-router-reaction",
        subscription_incarnation="recipient-lifecycle",
    )
    for row in rows
]
```

`unpack_change` accepts a typed SDK `ChangeEvent` and eagerly returns an ordered list of `ConvertedRow` values, each containing a generated row `event` and its `event_id`. It reads no clock or state and does not mutate the input. Query controls are not converter inputs.

| Packed array | Operation | Required snapshots |
| --- | --- | --- |
| `addedResults` | `i` | `after` |
| `updatedResults` | `u` | `before` and `after` |
| `deletedResults` | `d` | `before` |

All three arrays may occur in one batch. Conversion traverses them in the order above, preserving each array's order. Operations describe membership and changes in the query result, not necessarily database record creation or deletion. Snapshots are projected result rows, not partial source-record patches.

The real sequence is copied without rounding or a signed-integer limit. Source query ID and timestamp are preserved. `event.ts_ms` is the caller-supplied unpacking time, not the source timestamp.

The shared `row_event_id` helper derives identity from query ID, sequence, operation, and the original zero-based position in that operation's array. Convert once before applying recipient filters. A retry can use a different unpacking time without changing row identity; recipient order and count do not participate in identity.

`build_delivery` adds the configured router ID and recipient incarnation, then validates through the shared package's `to_wire` boundary. It returns a JSON-compatible dictionary for the normal Dapr CloudEvent's `data`, not an outer CloudEvent. The semantic row and row ID are shared across recipients; incarnation is recipient-specific.

Only the declared delivery fields and projected row data are copied. Packed metadata and handling instructions are not forwarded. Arbitrary projected columns, including nested values and null-valued columns, remain intact. Inserts omit `before`; deletes omit `after`.

### Conversion failures

Empty objects are valid snapshots. Null required snapshots, including null-snapshot aggregate updates, are unsupported. Projected values must be JSON-compatible, with string object keys and finite numbers. Nested `NaN`/infinity, cyclic structures, and non-JSON Python values are rejected before serialization can silently change them.

Unsupported snapshots or invalid packed sequence/source metadata raise `InvalidPackedChangeError` before any rows are returned. Missing fields and malformed array entries rejected by the SDK do not reach the converter. The exception carries `query_id`, `operation`, and `position` for diagnostics; its message does not include row content.

The forwarding callback must catch this specific exception, log identifiers and an outcome without event data, and return `DeliveryOutcome.DROP` with the configured dead-letter path. Letting it escape would cause the SDK to request `RETRY`. Do not classify every exception as bad input: invalid caller-supplied processing time or recipient configuration is a caller/configuration error, and transient publication failures require retry handling.

Eager conversion prevents a malformed later row from exposing partial conversion output. It is not a transactional-fanout, deduplication, or exactly-once guarantee. The future publication loop owns partial-failure handling and explicit SDK delivery outcomes.

## Shared contract and development

Both the SDK and `drasi-agent-router-contracts` dependencies are pinned to the public upstream commit containing the merged prerequisites. The contract package supplies generated models, JSON Schemas, validation, and identity helpers. This application neither vendors those definitions nor changes the generic Reaction SDK.

`list_queries` returns `protocol_version`, `router_id`, and `queries`. It does not implement the obsolete capability/delivery-version handshake from earlier proposals. Only the implemented catalog tool is advertised; `subscribe` and `unsubscribe` will be added with durable rule storage.

```sh
make test
make package
```

The focused suite exercises configuration, static catalog validation, shared MCP schemas and results, lifecycle failure handling, coexistence with the SDK routes, and row conversion against the shared protocol fixtures. Container images, broker policies, health/administrative endpoints, and default provider registration are not supplied by this application slice.
