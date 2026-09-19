# DaprAgentRouter protocol v1

This is the public contract between a `DaprAgentRouter` Reaction and the Drasi extension in Dapr Agents. `main.tsp` owns the wire models. This document owns the transport, lifecycle, identity algorithms, and contextual requirements that a schema cannot express. The independent [Python contract package](python/) contains generated JSON Schemas, Pydantic v2 models, validation/identity helpers, and shared fixtures. Both applications consume that package; neither owns a separate copy of the protocol. None of this belongs to the general-purpose Reaction SDK.

Protocol version 1 identifies the current dynamic integration introduced in Milestone 2. It is not a milestone number or a Drasi/Dapr package version. There is one current contract, shared by control and delivery messages, with no capability negotiation or alternative schema versions. Drasi is pre-release with no users: change the contract and its consumers together, without backward-compatibility adapters or schema/data migrations.

This contract addresses [drasi-project/drasi-platform#457](https://github.com/drasi-project/drasi-platform/issues/457). It does not implement the router service, persistence, packed-event conversion, agent workflows, or deployment. Changes to unrelated reactions are unnecessary for this contract. [drasi-project/drasi-platform#443](https://github.com/drasi-project/drasi-platform/pull/443) is prior work, not an interface to preserve.

## Deployment and identity

The supported environment is a private, trusted Dapr deployment with one active router instance per Reaction and one Drasi-enabled logical agent per application. Multiple agent applications may share a router. The application operator supplies a broker reachable by the router and agents through namespace-local Pub/Sub Components.

| Identity | Representation |
| --- | --- |
| Router | `<namespace>/<dapr-app-id>`, for example `drasi-system/sre-router-reaction` |
| Subscriber | Object containing `namespace`, `app_id`, and stable `agent_name` |
| Subscription key | Router identity, query ID, and all three subscriber fields |
| Incarnation | Opaque, non-empty string identifying one subscribe/unsubscribe lifecycle |

Namespace and app ID components are non-empty and contain neither whitespace nor `/`. The logical agent name is a non-empty string, not a pod name. Values are compared exactly, without case folding, trimming, or Unicode normalization. Strings used in identities must encode as valid UTF-8.

The schemas exclude whitespace independently of end anchors, so regex engines that let `$` match before a final newline still reject trailing line breaks in namespace/app identities.

The extension injects subscriber identity and incarnation from trusted configuration/state. They are not language-model arguments. Topic names are derived, not caller-selected. These conventions do not authenticate callers, provide authorization, or create multi-tenant isolation.

## MCP transport

Expose exactly three agent-protocol tools on `/mcp`: `list_queries`, `subscribe`, and `unsubscribe`. Use stateless streamable HTTP request/response over Dapr service invocation. For cross-namespace HTTP invocation, the address is:

```text
http://localhost:<dapr-http-port>/v1.0/invoke/<router-app-id>.<router-namespace>/method/mcp
```

Use the normal MCP initialization and request headers, including an `Accept` header supporting JSON and event-stream responses. No open SSE connection, client session, or MCP session ID owns the durable subscription.

The request and response models below are tool argument/result objects, not JSON-RPC envelopes. Successful `CallToolResult` responses contain the result object in `structuredContent` and its JSON representation in a text content block for clients that read `content`. Set `isError: false`. Advertise the corresponding request and response JSON Schemas as the tool's input and output schemas, resolving their local references when embedding them in MCP.

Tool-domain errors set `isError: true` and include a `ToolError` object serialized as JSON in a text content block. Omit `structuredContent` on errors: it is governed by the advertised success `outputSchema`, which a `ToolError` does not satisfy. Clients inspect `isError` before parsing success data and may parse the error text as `ToolError`. Do not return a success-shaped object with an error message. Malformed JSON-RPC, unknown methods, and transport failures retain normal MCP/HTTP error behavior.

| Error code | Meaning |
| --- | --- |
| `invalid_arguments` | Tool arguments violate this contract. |
| `unknown_query` | Subscribe refers to a query outside the configured catalog. |
| `incarnation_conflict` | The key has a different current incarnation. No mutation occurred. |
| `state_unavailable` | A required durable read/write failed. The caller must preserve pending intent; a failure or timeout can leave the mutation's outcome uncertain. |

Error messages must be readable without echoing prompts, handling instructions, or event rows.

## Control API

### `list_queries`

Accept `ListQueriesRequest`, exactly `{}`, and return `ListQueriesResponse`. The response contains:

| Field | Meaning |
| --- | --- |
| `protocol_version` | Integer `1`, identifying the current control and delivery contract. |
| `router_id` | This router's namespace/app ID. |
| `queries` | The complete catalog, with unique `query_id` values. An empty catalog is valid. |

Each catalog query has a non-empty `query_id`, `title`, and `description`, and optional non-empty `usage`. Metadata comes from the operator's per-query Reaction configuration, not query-text lookup or result-schema inference. The query ID is the key in `Reaction.spec.queries`; its value supplies the metadata fields. Load the whole catalog before readiness and fail initialization on invalid entries.

The extension obtains the catalog once before admitting work. It validates the current response shape, its protocol marker, and the configured router identity using `parse_catalog(document, expected_router_id)`. There is no feature-negotiation step or separate delivery-version handshake. The application protocol marker is independent of package versions and the MCP transport protocol version.

The catalog is a deployment-time menu, not a search API or current-result snapshot. Changes require coordinated router/agent restarts. The extension generates query-specific subscription tools from it; it does not expose router discovery directly to the language model.

### `subscribe`

`SubscribeRequest` requires `query_id`, `operations`, `subscriber`, and `subscription_incarnation`. `operations` is a non-empty array of distinct `i`, `u`, or `d` values. Input order is irrelevant; successful responses return the effective set in `i`, `u`, `d` order.

The router constructs that canonical response order. It is a semantic requirement enforced by `parse(SubscribeResponse, ...)` and `to_wire`, not just the structural schema. For example, request operations `["u", "i"]` are valid, but the response must contain `["i", "u"]`. Boundary helpers reject an out-of-order response rather than silently sorting it.

The router validates the catalog entry and derives the inbox. Its rule has no handling instructions, arbitrary topic, broker override, TTL, replay option, or caller-selected subscription ID.

| Existing rule | Required behavior |
| --- | --- |
| Absent | Persist a new rule, then return `status: "created"`. |
| Same incarnation | Replace the entire operation filter durably, then return `status: "updated"`. Do not create another continuation. |
| Different incarnation | Return `incarnation_conflict`; do not replace a newer or unrelated lifecycle. |

`SubscribeResponse` contains `query_id`, `operations`, `subscription_incarnation`, derived `topic_name`, and `status`. Persist before updating the runtime routing view or reporting success. A repeat call may return `updated` after a previous `created`; idempotency concerns the effective rule, not identical response bytes.

The extension must compare the returned query, incarnation, effective operation set, and topic with its request and locally derived inbox before marking intent active. Handling instructions are stored only with agent intent.

### `unsubscribe`

`UnsubscribeRequest` requires `query_id`, `subscriber`, and `subscription_incarnation`. Return `UnsubscribeResponse` containing `query_id` and `removed`.

| Existing rule | Required behavior |
| --- | --- |
| Absent | Return `removed: false`, an idempotent success. |
| Matching incarnation | Delete durably, then return `removed: true`. |
| Different incarnation | Return `incarnation_conflict`; do not delete that rule. |

Unsubscribe does not require a query to remain in the current catalog. It must be possible to remove an old rule. Already published messages and already scheduled workflows are not canceled.

### Lifecycle requirements

The extension generates and persists the incarnation before its first subscribe call. Preserve it across retries, updates, and ordinary restarts. A new subscribe after successful unsubscribe uses a new token, so the extension can discard queued deliveries from the old lifecycle.

Persist pending intent before invoking the router. Serialize conflicting transitions for the same subscription and reconcile unresolved operations before treating a new transition as complete. Do not erase an ambiguous operation or treat a persistence failure as success. The router's rule and the extension's intent are distinct records, not a distributed transaction.

Shutdown preserves rules and intent. There are no leases, automatic expiry, or permanent tombstones. The incarnation conflict check is not distributed fencing: a stale subscribe arriving when the key is absent can recreate a rule. Permanently removed agents require operator cleanup. Tokens cannot detect an unobserved query deletion/recreation under the same name; use fresh query identities at those boundaries.

## Stable inbox and dead-letter names

Both implementations use the following algorithm for the current protocol.

1. Start a SHA-256 input with the ASCII bytes `drasi-agent-router/v1` followed by one zero byte.
2. For each identity component, append its UTF-8 byte length as an unsigned four-byte big-endian integer, then its exact UTF-8 bytes. Do not normalize text or join components with a delimiter.
3. Encode the full 32-byte digest using RFC 4648 base32, lowercase, without `=` padding. The digest text is 52 characters.
4. Prepend the prefix from the table below. Every resulting topic is 62 ASCII characters.

| Topic | Ordered identity components | Prefix |
| --- | --- | --- |
| Agent inbox | Router namespace, router app ID, agent namespace, agent app ID, agent name | `drasi-ai1-` |
| Agent inbox DLT | Same components and digest as the agent inbox | `drasi-ad1-` |
| Router input DLT | Router namespace, router app ID | `drasi-rd1-` |

Query IDs and incarnations do not participate in inbox identity. All queries for a router/logical-agent pair share one stable inbox. Ordinary restarts and subscription updates do not change it. The logical agent's framework inbox must be different; the extension must reject configuration that collides with its derived Drasi inbox or DLT.

The router input DLT belongs to the inbound Drasi Pub/Sub Component. The agent inbox and its DLT belong to the application-facing broker. Component names can differ across namespaces but must reach the same application broker. The router requires an explicit egress component, never its inbound component or `drasi-pubsub`.

These are naming conventions, not permissions. A DLT is a failed-message destination, not another agent inbox or an automatic replay service. [Identity vectors](fixtures/identities.json) fix the encoding, including Unicode and ambiguous-concatenation cases.

## Delivery envelope

Publish a normal Dapr CloudEvent with an `AgentDelivery` object in `data`:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Integer `1`, the same protocol version returned by `list_queries`. Independent of CloudEvents `specversion`. |
| `routerId` | Router namespace/app ID. |
| `subscriptionIncarnation` | The recipient rule's lifecycle token, explicitly inside `data`. |
| `eventId` | Canonical row identity defined below; not the outer CloudEvent ID. |
| `event` | One insert, update, or delete notification using the established Drasi row-field meanings. |

Do not assume arbitrary Dapr publish metadata becomes a portable CloudEvent extension. Do not copy source metadata, handling instructions, or prompts into the envelope.

| Packed array | `event.op` | Snapshots |
| --- | --- | --- |
| `addedResults` | `i` | Required object `after`; `before` must be absent. |
| `updatedResults` | `u` | Required objects `before` and `after`. |
| `deletedResults` | `d` | Required object `before`; `after` must be absent. |

Snapshots are projected query-result rows, not source-record patches. Entering or leaving a result set need not mean a database row was created or deleted. Empty objects and null-valued columns are valid; a null or missing required snapshot is not. This version does not support null-snapshot aggregate updates. Do not fabricate `{}` to make one valid. Query control events are acknowledged without forwarding.

Copy packed `sequence` to `event.seq`, `queryId` to `event.payload.source.queryId`, and `sourceTimeMs` to `event.payload.source.ts_ms`. Set `event.ts_ms` to unpacking time. It can differ across retries and is not a source-time cutoff or an identity field.

Sequences and timestamps are non-negative JSON integers, not numeric strings. The wire schema does not impose a signed machine-integer limit; it preserves the current producer's entire `u64` range. Preserve the producer's integer exactly, including values above JavaScript's safe-integer range. Consumers must use lossless integer parsing; converting a sequence through a floating-point number can corrupt its identity. Zero is valid.

### Row event identity

```text
drasi:v1:<encoded-query-id>:<sequence>:<operation>:<row-position>
```

Encode the query ID as UTF-8 bytes. Leave only ASCII letters, digits, `-`, `.`, `_`, and `~` unescaped; percent-encode every other byte with uppercase hexadecimal digits. Do not normalize Unicode or interpret existing percent escapes.

Sequence and position use unsigned canonical decimal notation: `0` or digits beginning with `1` through `9`, without signs or leading zeros. Position is zero-based within the original array for that operation, before recipient/operation filtering. Traverse inserts, updates, and deletes in their original array order. A packed message may contain all three operations.

All rows in a packed message share its sequence; operation and position distinguish rows. The event ID and semantic row are shared across recipients of a processing attempt, while the incarnation can differ. Do not use fanout indexes, recipient names, current time, payload hashes, or JSON member ordering as identity.

Consumers must ensure the encoded query ID, sequence, and operation agree with the nested event. `parse(AgentDelivery, document)` performs that check. Original array position cannot be independently verified after delivery.

This identity lasts only for a query sequence lifecycle with durable state intact. Gaps are valid. Deletion, recreation, state reset, or restoration from older state breaks continuity. Reprocessing a source change can produce a different publication and is not necessarily deduplicated.

### Admission and failure boundaries

The agent extension must additionally bind the envelope to its configured router and local query intent, current incarnation, operation filter, and lifecycle status. Structurally valid data alone does not authorize or activate a subscription.

Malformed/unsupported messages take the explicit failure/dead-letter path, not ordinary no-subscriber handling. Stale incarnations or absent/inactive intent are intentional discards without model work. State-access and scheduling failures request retry. ACK only after workflow scheduling is accepted, not when the message merely enters a local queue.

At-least-once processing, partial fanout, retries, and duplicate workflows are possible. Rules are evaluated on each processing attempt, not by source-event timestamp. There is no strict "only source changes after subscribe" cutoff, replay service, snapshot, outbox, loss-free guarantee, or exactly-once external action guarantee.

## Generated artifacts and Python use

JSON Schemas use draft 2020-12 and local relative references. Resolve references from the supplied schema set, without network fetching. Protocol requests, responses, metadata, and delivery objects reject undeclared fields rather than silently dropping them or anticipating future formats. Projected rows in `before` and `after` remain arbitrary JSON objects: their columns are query data, not protocol fields.

Generated Pydantic models are typed representations, not complete protocol validators: code generation does not enforce distinct operation lists or the distinction between an absent optional field and an explicit `null`. **Use the shared package's `parse`/`parse_catalog` at input boundaries and `to_wire` before publishing.** They enforce the current generated schemas, canonical response ordering, and semantic identity rules without hand-editing generated files or selecting historical formats.

```python
from drasi_agent_router_contracts import AgentDelivery, parse, to_wire

delivery = parse(AgentDelivery, cloud_event["data"])
wire_data = to_wire(delivery)
```

Each generated event model contains only its applicable snapshots; inserts have no `before` field and deletes have no `after` field. `to_wire` omits unset optional metadata and validates the output, including row-ID consistency.

The reference helpers raise explicit JSON Schema, Pydantic, or `ValueError` exceptions. Boundary implementations must translate them into the MCP/delivery outcomes above. Do not log entire exceptions or documents indiscriminately: validation errors can contain input values.

### Regeneration

From the repository root:

```sh
make -C typespec/dapr-agent-router install-dependencies
make -C typespec/dapr-agent-router generate-types
make -C typespec/dapr-agent-router check-types
make -C typespec/dapr-agent-router test
make -C typespec/dapr-agent-router package
```

Generation uses the repository's locked TypeSpec toolchain and the contract package's `datamodel-code-generator` 0.76.2. It does not change the generic SDK's tooling or dependencies. The focused target compiles only this project and copies the canonical fixtures into the package. `--check` generates into a temporary directory and detects missing, changed, or stale artifacts. Python builds use these checked-in artifacts, so consumers need neither Node.js nor code-generation tools.

### Shared package and consumer development

The distribution is `drasi-agent-router-contracts`, imported as `drasi_agent_router_contracts`. Its build root is `typespec/dapr-agent-router/python`. It has no imports from the router application, Reaction SDK, Dapr, MCP, or the agent framework. Its runtime requirements are Python 3.10+, Pydantic v2, `jsonschema` 4.23+, and `referencing` 0.28.4+. Wheels and source distributions include the schemas, shared fixtures, Python typing marker, and license.

The router reaction and the Drasi extension both declare a dependency on this package and import from it directly. Do not vendor its modules or regenerate a second set of models in the extension. The router service and agent activation remain separate implementation work; neither application is implemented by this package.

During local development, use an editable dependency from each consuming project:

```sh
uv add --editable /path/to/drasi-platform/typespec/dapr-agent-router/python
```

From the Dapr Agents workspace root, target its Drasi extension rather than the framework:

```sh
uv add --package dapr-agents-ext-drasi --editable /path/to/drasi-platform/typespec/dapr-agent-router/python
```

Do not commit machine-specific paths to upstream PRs. For fork CI, pin a public commit and the package subdirectory instead of a moving branch. Replace `<owner>` with the repository owner holding that commit and `<public-commit>` with its full SHA:

```sh
uv add --package dapr-agents-ext-drasi \
  "drasi-agent-router-contracts @ git+https://github.com/<owner>/drasi-platform.git@<public-commit>#subdirectory=typespec/dapr-agent-router/python"
```

For the router application's own project, use the same command without `--package dapr-agents-ext-drasi`. Use a published commit, not a local context-worktree SHA. Update both consumers' dependency references and lockfiles together when the contract changes.

Consumers can load the shared fixtures through `importlib.resources.files("drasi_agent_router_contracts").joinpath("fixtures")`. The fixture files are expectations, not runtime configuration or predefined agents.

### Package releases

`make package` writes a wheel and source distribution to `python/dist/`. This package can be released independently of Drasi Platform containers and Dapr Agents. No registry release is performed by this change, and development does not require publishing every iteration.

When ready for upstream consumption, publish a reviewed prerelease after configuring the package registry's ownership/publishing permissions. Replace local or fork-source overrides with the same exact released version in both consumers, for example `drasi-agent-router-contracts==0.1.0a1` once that version is published. Build identifiers and dependency pins provide reproducibility, not backward-compatibility or migration obligations.

### Shared protocol fixtures

`fixtures/messages.json` contains complete tool argument/result objects and delivery envelopes. Every case names its model, expected protocol validity, and message. `schema_valid`, when present, distinguishes a structurally valid message that fails a semantic rule. Otherwise schema validity equals protocol validity.

`fixtures/mcp-errors.json` shows tool-error results with JSON text content and no `structuredContent`, so errors do not violate the success output schemas.

`fixtures/identities.json` contains exact row-ID and topic vectors. `fixtures/routing.json` pairs a mixed packed event with expected row notifications and two recipients' filtered event IDs. It defines conversion expectations without implementing the converter. None of the fixtures depends on a live broker, an agent framework, or model tool selection.

While the project is pre-release, update both implementations and this shared corpus together when changing the contract. No historical compatibility layer or persisted-data migration is required. A running router and its consumers still need to agree on the current wire format, topic encoding, and row identities; do not silently accept inactive arguments or incompatible peers.
