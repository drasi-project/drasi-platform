# drasi-platform REST API reference

The in-cluster `drasi-api` Service (default `drasi-api.drasi-system.svc:8080`)
exposes a management API for Drasi resources. This page lists the HTTP endpoints
implemented by the control plane (`mgmt_api`).

For the separate **drasi-server** query API (`/api/v1/*`), see the
[drasi-server documentation](https://github.com/drasi-project/drasi-platform).

## Base URL

| Environment | URL |
|-------------|-----|
| In-cluster | `http://drasi-api.drasi-system.svc:8080` |
| Local port-forward | `http://127.0.0.1:8080` |

All paths below are relative to the base URL.

## Sources

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/v1/sources/{id}` | Create or update a Source |
| `GET` | `/v1/sources/{id}` | Get a Source by ID |
| `DELETE` | `/v1/sources/{id}` | Delete a Source |
| `GET` | `/v1/sources` | List all Sources |
| `GET` | `/v1/sources/{id}/ready-wait` | Block until Source is ready |

**Request body (`PUT`):** `SourceSpecDto` — source provider configuration and properties.

**Response:** `SourceDto` with `id`, `spec`, and `status` fields.

## Continuous Queries

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/v1/continuousQueries/{id}` | Create a Continuous Query (immutable after creation) |
| `GET` | `/v1/continuousQueries/{id}` | Get a Continuous Query |
| `DELETE` | `/v1/continuousQueries/{id}` | Delete a Continuous Query |
| `GET` | `/v1/continuousQueries` | List all Continuous Queries |
| `GET` | `/v1/continuousQueries/{id}/ready-wait` | Block until query is ready |
| `GET` | `/v1/continuousQueries/{id}/watch` | Server-sent stream of query result events |

**Request body (`PUT`):** `QuerySpecDto` — query language, sources, views, and subscription config.

**Response:** `ContinuousQueryDto` with `id`, `spec`, and `status`.

**Notes:**
- Continuous queries are **immutable**; `PUT` on an existing ID returns `409 Conflict`.
- The `watch` endpoint streams `ResultEventDto` objects (change and control events).

## Reactions

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/v1/reactions/{id}` | Create or update a Reaction |
| `GET` | `/v1/reactions/{id}` | Get a Reaction |
| `DELETE` | `/v1/reactions/{id}` | Delete a Reaction |
| `GET` | `/v1/reactions` | List all Reactions |
| `GET` | `/v1/reactions/{id}/ready-wait` | Block until Reaction is ready |

**Request body (`PUT`):** `ReactionSpecDto` — reaction provider, query bindings, and config.

**Response:** `ReactionDto` with `id`, `spec`, and `status`.

## Query Containers

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/v1/queryContainers/{id}` | Create or update a Query Container |
| `GET` | `/v1/queryContainers/{id}` | Get a Query Container |
| `DELETE` | `/v1/queryContainers/{id}` | Delete a Query Container |
| `GET` | `/v1/queryContainers` | List all Query Containers |
| `GET` | `/v1/queryContainers/{id}/ready-wait` | Block until container is ready |

**Request body (`PUT`):** `QueryContainerSpecDto` — storage and compute pool configuration.

**Response:** `QueryContainerDto` with `id`, `spec`, and `status`.

## Source Providers

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/v1/sourceProviders/{id}` | Register or update a Source Provider |
| `GET` | `/v1/sourceProviders/{id}` | Get a Source Provider |
| `DELETE` | `/v1/sourceProviders/{id}` | Delete a Source Provider |
| `GET` | `/v1/sourceProviders` | List installed Source Providers |

**Request body (`PUT`):** `ProviderSpecDto` — service endpoints and JSON schema.

**Response:** `SourceProviderDto`.

## Reaction Providers

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/v1/reactionProviders/{id}` | Register or update a Reaction Provider |
| `GET` | `/v1/reactionProviders/{id}` | Get a Reaction Provider |
| `DELETE` | `/v1/reactionProviders/{id}` | Delete a Reaction Provider |
| `GET` | `/v1/reactionProviders` | List installed Reaction Providers |

**Request body (`PUT`):** `ProviderSpecDto`.

**Response:** `ReactionProviderDto`.

## Debug

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/debug` | WebSocket debug endpoint for live query inspection |

## Differences from drasi-server

| Aspect | drasi-platform (`drasi-api`) | drasi-server |
|--------|------------------------------|--------------|
| Path prefix | `/v1/*` | `/api/v1/*` |
| Query resource name | `/v1/continuousQueries` | `/api/v1/queries` (or similar) |
| Purpose | Control-plane resource management | Query execution and result access |
| Typical caller | Operators, integrators, CI/CD | Application clients |

Integrators building on Kubernetes should target `drasi-api` for lifecycle
operations (create/delete sources, queries, reactions) and consult drasi-server
docs for query-result consumption patterns.

## OpenAPI

The `mgmt_api` crate publishes an OpenAPI spec via `utoipa`. When running
locally, the generated schema is available from the `ApiDoc` module in
`control-planes/mgmt_api/src/api/v1/openapi.rs`.

## Related

- Issue [#427](https://github.com/drasi-project/drasi-platform/issues/427) — this documentation
- Issue [#426](https://github.com/drasi-project/drasi-platform/issues/426) — broader API comparison
