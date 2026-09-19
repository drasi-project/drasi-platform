# DaprAgentRouter reaction

This package provides the DaprAgentRouter image and built-in ReactionProvider, including the application host and static query catalog from [drasi-project/drasi-platform#456](https://github.com/drasi-project/drasi-platform/issues/456). It composes the Python Reaction SDK and a stateless streamable HTTP MCP endpoint in one FastAPI application.

The earlier runner and catalog prototype is in [drasi-project/drasi-platform#443](https://github.com/drasi-project/drasi-platform/pull/443). This application adapts that same-port architecture to the current SDK lifecycle and shared protocol.

**This is not yet a functioning event router.** Only `list_queries` is implemented. Durable subscriptions, row conversion, fanout, and administration are separate work. Valid change events deliberately return `RETRY`, rather than acknowledging changes that have not been forwarded. Do not deploy this application against live query streams expecting delivery or retention guarantees: broker retry/dead-letter policies can exhaust retries.

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

## Shared contract and development

Both the SDK and `drasi-agent-router-contracts` dependencies are pinned to the public upstream commit containing the merged prerequisites. The contract package supplies generated models, JSON Schemas, validation, and identity helpers. This application neither vendors those definitions nor changes the generic Reaction SDK.

`list_queries` returns `protocol_version`, `router_id`, and `queries`. It does not implement the obsolete capability/delivery-version handshake from earlier proposals. Only the implemented catalog tool is advertised; `subscribe` and `unsubscribe` will be added with durable rule storage.

```sh
make lint-check test package
```

The focused suite exercises configuration, static catalog validation, shared MCP schemas and results, lifecycle failure handling, SDK route coexistence, provider registration, and image build/release wiring. Broker policies and health/administrative endpoints remain separate work.

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

`make image-test` needs only Docker and Python 3.10 or later on the host. It starts the actual image on a temporary loopback port, mounts a synthetic catalog, exercises MCP and SDK delivery on the same port, checks the non-root/single-worker configuration, and verifies clean shutdown. It removes its container and temporary query files. No Dapr sidecar, broker, model, or credentials are needed for this packaging smoke test.

Load a locally built image into an existing development cluster using matching build/tag options:

```sh
make kind-load CLUSTER_NAME=kind
make k3d-load CLUSTER_NAME=k3s-default
```

Build, load, and deploy with consistent registry/tag settings; registering the provider alone does not build or load its image. The top-level reaction Makefile includes this component in its standard build, load, test, and lint targets.
