# DaprAgentRouter reaction

This package provides the DaprAgentRouter image and built-in ReactionProvider, including the application host and static query catalog from [drasi-project/drasi-platform#456](https://github.com/drasi-project/drasi-platform/issues/456), durable subscription management from [drasi-project/drasi-platform#459](https://github.com/drasi-project/drasi-platform/issues/459), and row conversion from [drasi-project/drasi-platform#462](https://github.com/drasi-project/drasi-platform/issues/462). It composes the Python Reaction SDK and a stateless streamable HTTP MCP endpoint in one FastAPI application.

The earlier runner, catalog, and subscription registry prototype is in [drasi-project/drasi-platform#443](https://github.com/drasi-project/drasi-platform/pull/443). This application adapts its same-port architecture and store-first registry approach to the current SDK lifecycle and shared protocol, without lazy cache loading or failure-to-empty/success fallbacks.

**This is not yet a functioning event router.** `list_queries`, `subscribe`, and `unsubscribe` are implemented. Row conversion is available through the helpers below but is not wired into delivery. Fanout and administration remain separate work. Valid change events deliberately return `RETRY`, rather than acknowledging changes that have not been forwarded. Do not deploy this application against live query streams expecting delivery or retention guarantees: broker retry/dead-letter policies can exhaust retries.

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

Component names must be non-empty and contain no whitespace. Configuration errors fail application creation. Startup connects to the state component and restores all subscription rules before readiness; it does not prove broker connectivity. The application does not provision components or their backing infrastructure; the provider requests platform-managed state as described below. Router namespace/app-ID values are trusted operator configuration, not authenticated caller identities.

## Provider installation and deployment

The CLI embeds this provider in its default installation resources, including `drasi init --manifest` output. Installing the provider only registers the `DaprAgentRouter` kind. It does not create a router Reaction, an application broker, or public ingress.

For an existing installation, register the same provider from this directory:

```sh
drasi apply -f reaction-provider.yaml
```

Use a platform build containing the merged per-reaction state and single-instance deployment support, and build or select an image tag containing this package. An older published platform/image tag does not acquire these capabilities by applying a new provider manifest. The provider uses the platform's configured image registry and tag for `reaction-dapr-agent-router`.

The provider requests a platform-managed state Component with `state_store: true`. This uses the platform's configured backing store, not a separate database. Its reaction service declares `supportsConcurrentInstances: false`, which requests one replica and a stop-before-start `Recreate` rollout on Kubernetes. Brief replacement downtime is expected; this is not distributed fencing.

Both SDK delivery and MCP use HTTP port `8000`. The image runs one non-root Uvicorn worker. No provider endpoint or ingress is needed: clients use private Dapr service invocation. Keep the application and its control path in a trusted deployment.

The operator must provide an agent-facing Pub/Sub Component in the router's namespace. Agent applications in other namespaces use their own Components connected to that same broker; their Component names may differ. Neither this provider nor the image provisions the application broker. Do not point `egressPubsubName` at Drasi's internal broker Component or replace that Component.

An empty-catalog Reaction is sufficient to inspect the currently implemented host without consuming live query changes:

```yaml
apiVersion: v1
kind: Reaction
name: sre-router
spec:
  kind: DaprAgentRouter
  properties:
    routerId: drasi-system/sre-router-reaction
    egressPubsubName: agent-egress
  queries: {}
```

For a Reaction named `sre-router`, the platform assigns the service the Dapr app ID `sre-router-reaction`. Replace `drasi-system` in `routerId` if the platform uses another namespace. Do not substitute `INSTANCE_ID`. The provider requires non-empty `routerId` and `egressPubsubName`; the application additionally validates identity format, whitespace, and inbound/egress collisions at startup. `PubsubName` and `StateStoreName` are platform-injected, not required Reaction properties.

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

Use Python 3.10-3.13 and uv. Make targets default to Python 3.12; set `PYTHON_VERSION` to select another supported interpreter. From this directory:

```sh
make install-dependencies
mkdir -p local-queries
```

With a Dapr sidecar and the configured state component available, create `local-queries/checkout-server-errors` with the per-query file contents shown above, then run one application worker:

```sh
export routerId=drasi-system/sre-router-reaction
export egressPubsubName=agent-egress
export PubsubName=drasi-pubsub-sre-router
export StateStoreName=drasi-statestore-sre-router
export QueryConfigPath="$PWD/local-queries"
uv run --locked uvicorn agent_router.app:create_app --factory --host 127.0.0.1 --port 8000 --workers 1
```

Even catalog access now requires a running Dapr sidecar and an available state component. The sidecar must expose its outbound APIs before application initialization completes. For non-default sidecar ports, configure the SDK's `DAPR_HTTP_ENDPOINT` and `DAPR_GRPC_ENDPOINT`. For Dapr hosting, use the same application port, one worker, and private service invocation. Configure the actual Dapr app ID and namespace to match `routerId`. Multiple application workers and replicas are unsupported.

The application exposes:

| Endpoint | Behavior |
| --- | --- |
| `POST /mcp` | Stateless MCP initialization, tool discovery, and the three catalog/subscription tools. |
| `GET /dapr/subscribe` | SDK-managed query subscriptions and the derived inbound dead-letter topic. |
| `POST /_drasi/events/{query_id}` | SDK-managed CloudEvent validation and explicit delivery outcomes. |

`/mcp` is the exact endpoint, without an additional path segment or trailing-slash redirect. MCP requests must use the normal protocol headers, including `Accept: application/json, text/event-stream`. Successful tool results contain identical JSON data in `structuredContent` and a text content block. Argument errors have `isError: true` and a JSON `ToolError` text block, with no success-shaped `structuredContent`.

No MCP session ID or long-lived SSE connection is required. GET/SSE and session deletion are unsupported. Cross-namespace Dapr HTTP invocation uses:

```text
http://localhost:<dapr-http-port>/v1.0/invoke/<router-app-id>.<router-namespace>/method/mcp
```

The MCP session manager starts before the SDK marks the reaction ready. Dapr discovery, SDK delivery, and MCP admission reject work until the full state load completes. Startup failures unwind lifespan resources; shutdown clears readiness and closes the state client before stopping the MCP manager. Shutdown never removes rules. Valid query control events are acknowledged by the SDK without forwarding.

## Subscription API

The complete request/response schemas and topic algorithm live in the [shared protocol](../../../typespec/dapr-agent-router/README.md). `subscribe` accepts:

```json
{
  "query_id": "checkout-server-errors",
  "operations": ["i", "u"],
  "subscriber": {
    "namespace": "applications",
    "app_id": "checkout-sre",
    "agent_name": "CheckoutSRE"
  },
  "subscription_incarnation": "one-agent-generated-lifecycle-token"
}
```

The key is the query ID and all three subscriber identity fields, scoped to this router. A new rule returns `status: "created"`; an existing rule with the same incarnation replaces its whole operation filter and returns `status: "updated"`. Operation order has no meaning. The response includes the effective query, operations, incarnation, and derived `topic_name`. Every query for a router/subscriber pair shares that inbox. Arbitrary topics, handling instructions, broker selection, and TTL fields are rejected.

`unsubscribe` takes the same query, subscriber, and incarnation fields without `operations`. It returns the query and `removed: true` after durable removal, or `removed: false` when already absent. It does not require the query to remain in the current catalog. Neither operation may replace or delete a rule with a different current incarnation.

| MCP error code | Behavior |
| --- | --- |
| `invalid_arguments` | Invalid schema, operation set, identity, or undeclared field; no state mutation. |
| `unknown_query` | Subscribe refers to a query outside the startup catalog. |
| `incarnation_conflict` | Another incarnation occupies the key; the existing rule is not changed. |
| `state_unavailable` | A state operation was not confirmed, or persisted state is missing, invalid, or unsupported. Retain pending agent intent and retry the complete operation. |

Errors have `isError: true` and a JSON `ToolError` text block, without `structuredContent`. A timeout or lost response does not prove a write failed to commit. Repeating a subscribe can therefore return `updated` instead of `created`; repeating an unsubscribe can return `removed: false`. These are idempotent outcomes, not lost subscriptions.

## Persistence and lifecycle

The component named by `StateStoreName` owns the durable rules. Current Drasi installs configure `state.mongodb`; the application uses Dapr's state API rather than a MongoDB or Redis client. A component is a connection/reference, not a separate database or an isolation boundary; different components can share backing records. The component must return ETags and enforce first-write concurrency. Its backing data and the Dapr application identity must survive ordinary restarts.

One document stores this router's complete registry. Its logical Dapr state key is `drasi-agent-router:subscriptions:<digest>`, where `digest` is the lowercase SHA-256 hex digest of the exact UTF-8 `routerId`. Dapr/component key prefixes can additionally scope the physical backend key. The document contains:

```json
{
  "format_version": 1,
  "router_id": "drasi-system/sre-router-reaction",
  "rules": []
}
```

Each rule contains the `SubscribeRequest` fields plus the derived `topic_name`, never agent handling instructions. The format marker is internal persistence versioning, not another wire-protocol negotiation. Unknown fields, unsupported versions, duplicate rule keys, invalid operations/identities, and inconsistent topics fail loading rather than being discarded or repaired. There are no historical migrations.

A successful read of an absent key is the only empty-registry bootstrap case. The single supported writer creates the initial document and reads it back with its ETag before becoming ready. This is not distributed create-if-absent fencing. Removing the final rule persists an empty document, preserving the root's conditional-write lifecycle.

All asynchronous mutations run under one process-local lock. Each reads the current document and ETag, constructs a separate candidate, and conditionally saves it before replacing the in-memory view or reporting success. ETag conflicts are explicit errors; the router never refreshes an ETag and blindly overwrites a newer document with an old snapshot. State read/write calls have a 30-second deadline, separate from the SDK's sidecar-health startup wait.

Routing snapshots are immutable and require no state-store calls or evicting cache. This trades whole-document writes and serialized management operations for a small, complete startup snapshot; it is intended for the single-instance POC, not an unbounded or distributed registry.

| Condition | Behavior |
| --- | --- |
| Unavailable or corrupt state at startup | Fail initialization and remain unready. |
| Store outage after startup | Keep the existing in-memory routing view; management operations needing storage return errors. Catalog access remains available. |
| State key disappears during the process lifetime | Reject management operations; do not silently reinitialize or replace known rules with an empty table. |
| Ordinary shutdown/restart | Preserve rules and restore them before accepting work. |
| Query removed from the catalog | Preserve its stored rules so incarnation-checked unsubscribe remains possible. New subscribe calls are rejected. |
| Agent permanently removed | Explicit operator cleanup is required; shutdown is not unsubscribe. Administrative endpoints are a separate issue. |

The agent's durable intent is separate state containing its instructions and pending/active status. It must preserve pending operations across failures and reconcile them after restart. The router cannot reconstruct missing agent instructions. Query recreation, backing-store restoration, and decommissioning require coordinated operator action; deleting a Dapr Component is not a purge of its backing data. There are no leases, heartbeats, automatic expiry, replay, or permanent tombstones.

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

`list_queries` returns `protocol_version`, `router_id`, and `queries`. It does not implement the obsolete capability/delivery-version handshake from earlier proposals. All three implemented tools advertise the shared request and success-response schemas.

```sh
make lint-check test package
```

The focused suite exercises configuration, static catalog validation, shared MCP schemas/results, startup readiness, restart recovery, conditional-write conflicts, ambiguous outcomes, concurrent mutations, storage failures, coexistence with the SDK routes, row conversion against the shared protocol fixtures, provider registration, and image build/release wiring.

For real state-component coverage, Docker and Docker Compose are sufficient; no Dapr CLI, Kubernetes cluster, broker, or agent application is needed:

```sh
make test-state-integration
```

This target starts an isolated Compose project with Dapr 1.14.5 (the CLI's current default) and MongoDB 6, uses dynamically assigned loopback ports, and removes its containers and volumes on exit. It exercises durable restoration, actual ETag rejection, unsupported-record handling, and state-component errors. The fixture does not enable actors or require MongoDB multi-document transactions. The ordinary suite skips these cases unless `DRASI_ROUTER_TEST_STATE_STORE` and the Dapr endpoints are supplied.

Broker policies and health/administrative endpoints remain separate work.

## Container builds

From this directory, plain `make` builds the default image. Docker Buildx is required:

```sh
make docker-build
make image-test

make docker-build BUILD_CONFIG=azure-linux
make image-test BUILD_CONFIG=azure-linux
```

Both variants use Python 3.12, uv 0.11.27, and the committed dependency lockfile. The builder installs the current application and its immutable Git-pinned SDK/contract dependencies without editable links. The runtime contains the installed environment, not a source checkout or startup dependency installer.

| Build configuration | Default local image |
| --- | --- |
| `default` | `drasi-project/reaction-dapr-agent-router:latest` |
| `azure-linux` | `drasi-project/reaction-dapr-agent-router:latest-azure-linux` |

The Makefile supports the repository's `IMAGE_PREFIX`, `DOCKER_TAG_VERSION`, `BUILD_CONFIG`, `TAG_SUFFIX`, and `DOCKERX_OPTS` conventions. Release workflows publish both Linux `amd64` and `arm64` variants. For example, `DOCKER_TAG_VERSION=vX.Y.Z BUILD_CONFIG=azure-linux TAG_SUFFIX=-arm64` selects the tag `vX.Y.Z-azure-linux-arm64`.

`make image-test` needs Docker, Docker Compose, and Python 3.10 or later on the host. It starts an isolated copy of the Dapr/MongoDB state fixture and connects the actual router image to that private network. It mounts a synthetic catalog, exercises MCP and SDK delivery on the same temporary loopback port, checks the non-root/single-worker configuration, and verifies subscription persistence across a clean router restart. It removes its containers, volumes, network, and temporary query files. No installed Dapr CLI, broker, model, or credentials are needed.

Load a locally built image into an existing development cluster using matching build/tag options:

```sh
make kind-load CLUSTER_NAME=kind
make k3d-load CLUSTER_NAME=k3s-default
```

Build, load, and deploy with consistent registry/tag settings; registering the provider alone does not build or load its image. The top-level reaction Makefile includes this component in its standard build, load, test, and lint targets.
