# DaprAgentRouter reaction

This package provides the DaprAgentRouter image and built-in ReactionProvider, including the application host and static query catalog from [drasi-project/drasi-platform#456](https://github.com/drasi-project/drasi-platform/issues/456), durable subscription management from [drasi-project/drasi-platform#459](https://github.com/drasi-project/drasi-platform/issues/459), row conversion from [drasi-project/drasi-platform#462](https://github.com/drasi-project/drasi-platform/issues/462), and fanout from [drasi-project/drasi-platform#458](https://github.com/drasi-project/drasi-platform/issues/458). It composes the Python Reaction SDK and a stateless streamable HTTP MCP endpoint in one FastAPI application.

The earlier runner, catalog, and subscription registry prototype is in [drasi-project/drasi-platform#443](https://github.com/drasi-project/drasi-platform/pull/443). This application adapts its same-port architecture and store-first registry approach to the current SDK lifecycle and shared protocol, without lazy cache loading or failure-to-empty/success fallbacks.

`list_queries`, `subscribe`, and `unsubscribe` manage which ordinary query-result rows are forwarded to stable agent inboxes. The internal operator API provides rule inspection and durable cleanup. Publication uses the explicitly configured application-facing Dapr Pub/Sub component. Configure inbound retries and dead-letter handling before consuming live streams; delivery is non-transactional and can duplicate or lose messages under the failure conditions below.

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

An empty-catalog Reaction can be used to inspect the host before adding query streams:

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
| `GET /admin/rules` | Inspect the confirmed routing snapshot, with optional query/subscriber filters. |
| `POST /admin/rules/remove` | Durably remove one exact query/subscriber rule. |
| `POST /admin/subscribers/remove-rules` | Durably remove every rule for one explicitly identified subscriber. |
| `GET /healthz` | Application liveness, without checking dependencies. |
| `GET /readyz` | SDK lifecycle readiness, without a new storage or broker probe. |

`/mcp` is the exact endpoint, without an additional path segment or trailing-slash redirect. MCP requests must use the normal protocol headers, including `Accept: application/json, text/event-stream`. Successful tool results contain identical JSON data in `structuredContent` and a text content block. Argument errors have `isError: true` and a JSON `ToolError` text block, with no success-shaped `structuredContent`.

No MCP session ID or long-lived SSE connection is required. GET/SSE and session deletion are unsupported. Cross-namespace Dapr HTTP invocation uses:

```text
http://localhost:<dapr-http-port>/v1.0/invoke/<router-app-id>.<router-namespace>/method/mcp
```

The MCP session manager starts before the SDK marks the reaction ready. Dapr discovery, SDK delivery, and MCP admission reject work until the full state load and publication-client initialization complete. Startup failures unwind lifespan resources; shutdown clears readiness and closes the publication and state clients before stopping the MCP manager. Shutdown never removes rules. Valid query control events are acknowledged by the SDK without forwarding.

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
| Agent permanently removed | Explicit operator cleanup is required; shutdown is not unsubscribe. Use the internal administration endpoints below. |

The agent's durable intent is separate state containing its instructions and pending/active status. It must preserve pending operations across failures and reconcile them after restart. The router cannot reconstruct missing agent instructions. Query recreation, backing-store restoration, and decommissioning require coordinated operator action; deleting a Dapr Component is not a purge of its backing data. There are no leases, heartbeats, automatic expiry, replay, or permanent tombstones.

## Administration

The operator API shares the app port with MCP but is not exposed as agent tools. It assumes the same private, trusted deployment; it does not add authentication, authorization, public ingress, or a dashboard. Use private Dapr service invocation, for example:

```sh
router_url='http://localhost:3500/v1.0/invoke/sre-router-reaction.drasi-system/method'
curl --fail-with-body "$router_url/admin/rules"
```

`GET /admin/rules` returns `router_id`, `view: "routing_snapshot"`, and `rules`. Each rule contains its query ID, full subscriber identity, operations, incarnation, and derived inbox topic. Results are sorted by query and subscriber identity. Rules for queries no longer in the catalog remain visible and removable.

This is the last confirmed in-memory routing view, not a fresh backing-store inspection or a storage-health assertion. Listing remains available during a runtime store outage and does not read storage. An unconfirmed write can have committed without updating this view; retry the complete mutation to resolve that uncertainty. Before initialization or after shutdown, inspection and cleanup return HTTP 503 rather than an empty registry.

Filter by `query_id`, by all three subscriber fields together, or both:

```sh
curl --fail-with-body --get "$router_url/admin/rules" \
  --data-urlencode 'query_id=checkout-server-errors' \
  --data-urlencode 'namespace=applications' \
  --data-urlencode 'app_id=checkout-sre' \
  --data-urlencode 'agent_name=CheckoutSRE'
```

Omitting all filters lists all rules. Partial subscriber filters, empty/invalid identities, and unknown parameters are rejected. Identities are exact, case-sensitive values; neither filters nor cleanup interpret wildcards.

To remove one rule, supply its query and complete subscriber identity:

```sh
curl --fail-with-body "$router_url/admin/rules/remove" \
  -H 'Content-Type: application/json' \
  --data '{"query_id":"checkout-server-errors","subscriber":{"namespace":"applications","app_id":"checkout-sre","agent_name":"CheckoutSRE"}}'
```

The response is `{"removed":true}`, or `{"removed":false}` if the rule was already absent. Unlike agent-facing unsubscribe, operator cleanup does not require the incarnation token. It removes the current rule for the exact key; it does not weaken MCP's incarnation checks.

To remove every rule for one logical agent:

```sh
curl --fail-with-body "$router_url/admin/subscribers/remove-rules" \
  -H 'Content-Type: application/json' \
  --data '{"subscriber":{"namespace":"applications","app_id":"checkout-sre","agent_name":"CheckoutSRE"}}'
```

The response contains `removed_count`, which can be zero. The complete subscriber object is required. There is no default, wildcard, namespace-wide, or all-subscriber cleanup operation; extra body fields are rejected.

Both removals use the same lock, durable reread, ETag-conditional write, and store-before-memory ordering as subscription operations. Subscriber-wide cleanup is one document mutation, not a sequence of partially successful deletes. Removing the last rule retains an empty registry document. A storage error, conflict, or timeout returns HTTP 503 with `code: "state_unavailable"`; even an apparently absent rule must be confirmed by a successful durable read. Invalid arguments return HTTP 422 with `code: "invalid_arguments"`. Error bodies contain a sanitized `message`, not the submitted body or backend exception.

**Cleanup is not permanent suspension.** A live agent can recreate a removed rule when it subscribes or reconciles its durable intent. Disable that intent or stop/decommission the application before removing its obsolete rules. Router cleanup does not delete agent intent, purge queued messages, cancel in-flight work, or revoke access.

## Health and logging

When the HTTP application is serving, `GET /healthz` returns HTTP 200 with `{"status":"alive"}`. `GET /readyz` returns HTTP 200 with `{"status":"ready"}` only while the Reaction SDK reports initialization complete; otherwise it returns HTTP 503 with `{"status":"not_ready"}`. The server may not yet accept HTTP connections while ASGI startup is still running.

Readiness uses the same lifecycle as MCP and SDK admission: the MCP manager, complete subscription state load, and publication-client initialization must finish successfully, and readiness clears before cleanup. Neither health endpoint queries storage, checks broker connectivity, or proves that events have reached agents. A runtime store outage does not clear lifecycle readiness or force restarts; inspection/catalog access remains available while required durable operations return errors. Exposing these routes does not automatically configure Kubernetes probes or Dapr app-health annotations.

The application configures JSON output on standard output for the `agent_router` and `drasi.reaction` loggers. Initialization, mutation, delivery, cleanup, and shutdown records include stable event names, UTC timestamps, levels, and allowlisted context. Depending on the operation, context includes router/query/subscriber identities, component/topic names, row event IDs and positions, accepted-publication counts, operation, outcome, removal count, or a sanitized error type/code/reason.

Integration-owned records do not contain rows, handling instructions, credentials, request bodies, or raw exception details. Unknown contextual fields are omitted, and subscriber context includes only `namespace`, `app_id`, and `agent_name`. This is not a universal redaction guarantee for third-party/runtime logging or additional handlers configured by the host. Normal health polling does not emit an application log record for every request.

## Row conversion

The conversion helpers perform no subscription lookup, publication, or workflow activation. The forwarding handler uses them with the SDK's `ReactionMessage.event`:

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

The forwarding callback catches this specific exception, logs identifiers and an outcome without event data, and returns `DeliveryOutcome.DROP` with the configured dead-letter path. Other exceptions are not classified as bad input: invalid caller-supplied processing time or recipient configuration is a caller/configuration error, and publication failures require retry handling.

Eager conversion prevents a malformed later row from exposing partial conversion output. It is not a transactional-fanout, deduplication, or exactly-once guarantee.

## Fanout and delivery outcomes

Each SDK change callback takes one immutable subscription snapshot for its query, converts the entire packed batch once, and filters each resulting row against each rule's operation set. Inserts, updates, and deletes may coexist in one batch; the router does not classify a whole batch by its first non-empty array. Conversion also validates batches with no subscribers, so unsupported input is not silently accepted.

Rows are traversed in insert/update/delete array order, with each selected publication awaited sequentially. Each recipient receives a normal Dapr CloudEvent whose `data` is the shared delivery envelope. The same semantic row and row event ID are reused across recipients; the incarnation comes from each rule. Publication uses `egressPubsubName` and the rule's derived inbox, never Drasi's internal component or a caller-chosen destination.

Routing reads only the in-memory snapshot, not the state store. Subscription mutations can proceed while a publication is awaiting Dapr, but they do not change the current attempt's snapshot.

| Situation | Reaction SDK outcome |
| --- | --- |
| Supported input with no matching rows/rules, or all selected publications accepted | `SUCCESS` |
| Valid control event intentionally ignored | `SUCCESS` |
| Not initialized, publication failure, or publication deadline exceeded | `RETRY` |
| Malformed SDK input or unsupported packed-row content | `DROP` |

The router stops on the first publication failure and makes no custom retry attempts. Individual publication calls have a 30-second deadline. A timeout or error does not prove that the broker failed to accept the message. Earlier successful publications are not rolled back, and there is no per-recipient checkpoint or event outbox.

Dapr retries the original packed event according to the configured inbound policy. Each callback takes a fresh rule snapshot, so a retry may duplicate successful deliveries or reach a subscriber added after the first attempt. An unsubscribe cannot retract messages already published or remove a rule from an in-flight snapshot. Subscription boundaries are processing-time decisions, not strict source-event-time cutoffs.

A successful publication means Dapr's component accepted the message, not that an agent is online or that a workflow completed. The router neither checks agent availability nor waits for agent execution. Deterministic row traversal is not a guarantee of globally ordered broker delivery or workflow completion. Downstream actions must tolerate duplicate execution.

### Configure bounded retries and dead letters

The router already declares its derived inbound `deadLetterTopic` in `GET /dapr/subscribe`. The DLT belongs to `PubsubName`, not the agent-facing egress component. It receives the original packed event, not a per-recipient failure record, and is not an automatic replay service.

Apply the standalone [Resiliency example](examples/resiliency.yaml) before starting or restarting the example `sre-router` Reaction:

```sh
kubectl apply -f examples/resiliency.yaml
```

The example retries five times at one-second intervals after the initial attempt. Adjust the namespace, app scope (`sre-router-reaction`), and inbound component target (`drasi-pubsub-sre-router`) together when changing the Reaction identity. The policy supplies finite inbound retry/backoff without modifying Drasi's internal `drasi-pubsub` Component. It is an operator-managed Dapr resource, not part of the ReactionProvider schema or the Reaction's managed lifecycle; remove it explicitly when retiring the router:

```sh
kubectl delete -f examples/resiliency.yaml
```

`SUCCESS` intentionally consumes input, including a no-subscriber discard. `DROP` sends poison input to the configured DLT without retrying it. Retry exhaustion can also send input there. Dapr policy retry counts do not establish universal broker retention guarantees, and broker-level redelivery may add another layer of attempts.

The reference runtime is Dapr 1.14.5 with Redis Streams. In that runtime, a failed DLT publication on the drop or exhausted-retry path can still consume the original input. Egress persistence also depends on broker configuration. Do not describe this as loss-free delivery, guaranteed eventual delivery, permanent deduplication, or exactly-once execution. Inspect runtime errors and broker backlog/DLTs; replaying retained input can repeat already successful work.

## Shared contract and development

The Python Reaction SDK uses a local `uv` source at `../../sdk/python`. `uv sync` installs it as an editable dependency for development, so SDK and router changes are exercised together from the same checkout. Distributable package metadata separately pins a compatible public SDK commit for installations that do not use the local override. `drasi-agent-router-contracts` remains pinned to an immutable public commit and supplies generated models, JSON Schemas, validation, and identity helpers. This application does not vendor those definitions.

`list_queries` returns `protocol_version`, `router_id`, and `queries`. It does not implement the obsolete capability/delivery-version handshake from earlier proposals. All three implemented tools advertise the shared request and success-response schemas.

```sh
make lint-check test package
```

`make package` builds the wheel and source distribution, then installs the wheel into a fresh environment outside the checkout and imports the application. This checks the distributable dependency references without relying on `tool.uv.sources`.

The focused suite exercises configuration, static catalog validation, shared MCP schemas/results, startup readiness, restart recovery, conditional-write conflicts, ambiguous outcomes, concurrent mutations, storage failures, coexistence with the SDK routes, row conversion against the shared protocol fixtures, provider registration, and image build/release wiring.

For real state-component coverage, Docker and Docker Compose are sufficient; no Dapr CLI, Kubernetes cluster, broker, or agent application is needed:

```sh
make test-state-integration
```

This target starts an isolated Compose project with Dapr 1.14.5 (the CLI's current default) and MongoDB 6, uses dynamically assigned loopback ports, and removes its containers and volumes on exit. It exercises durable restoration, actual ETag rejection, unsupported-record handling, and state-component errors. The fixture does not enable actors or require MongoDB multi-document transactions. The ordinary suite skips these cases unless `DRASI_ROUTER_TEST_STATE_STORE` and the Dapr endpoints are supplied.

## Container builds

From this directory, plain `make` builds the default image. Docker Buildx is required:

```sh
make docker-build
make image-test
make delivery-test

make docker-build BUILD_CONFIG=azure-linux
make image-test BUILD_CONFIG=azure-linux
make delivery-test BUILD_CONFIG=azure-linux
```

Both variants use Python 3.12, uv 0.11.27, and the committed dependency lockfile. The Makefile supplies the checkout's Python SDK through the `reaction_sdk` build context. The builder installs the application and SDK without editable links and uses the Git-pinned contract package. The SDK is rebuilt during the final sync so cached wheels cannot hide SDK source changes. The runtime contains the installed environment, not a source checkout or startup dependency installer.

| Build configuration | Default local image |
| --- | --- |
| `default` | `drasi-project/reaction-dapr-agent-router:latest` |
| `azure-linux` | `drasi-project/reaction-dapr-agent-router:latest-azure-linux` |

The Makefile supports the repository's `IMAGE_PREFIX`, `DOCKER_TAG_VERSION`, `BUILD_CONFIG`, `TAG_SUFFIX`, and `DOCKERX_OPTS` conventions. Release workflows publish both Linux `amd64` and `arm64` variants. For example, `DOCKER_TAG_VERSION=vX.Y.Z BUILD_CONFIG=azure-linux TAG_SUFFIX=-arm64` selects the tag `vX.Y.Z-azure-linux-arm64`.

`make image-test` needs Docker, Docker Compose, and Python 3.10 or later on the host. It starts an isolated copy of the Dapr/MongoDB state fixture and connects the actual router image to that private network. It mounts a synthetic catalog, exercises MCP, SDK delivery, administration, and health on the same temporary loopback port, checks JSON log output and the non-root/single-worker configuration, and verifies subscription and cleanup persistence across clean router restarts. It removes its containers, volumes, network, and temporary query files. No installed Dapr CLI, broker, model, or credentials are needed.

`make delivery-test` uses the same host tools and selected image, with an isolated Dapr 1.14.5/MongoDB 6 fixture and separate Redis 7 inbound and egress brokers. It sends packed input through real Dapr Pub/Sub, inspects output/DLT streams, and waits for the input consumer cursor and acknowledgments. Dapr topic-scoping supplies a deterministic publication failure after earlier success. The fixture covers operation filtering, no-match/control acknowledgments, poison drops before publication, successful retry, changed rules between attempts, duplicate deliveries, and bounded retry exhaustion preserving the original DLT payload. CI runs both image checks for both build configurations. Fixture containers, volumes, networks, and temporary files are removed on exit.

Load a locally built image into an existing development cluster using matching build/tag options:

```sh
make kind-load CLUSTER_NAME=kind
make k3d-load CLUSTER_NAME=k3s-default
```

Build, load, and deploy with consistent registry/tag settings; registering the provider alone does not build or load its image. The top-level reaction Makefile includes this component in its standard build, load, test, and lint targets.
