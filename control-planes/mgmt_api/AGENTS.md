# Drasi Management API

## Project Overview

-   **Purpose**: Central management API for the Drasi platform.
-   **Framework**: Actix (Rust).
-   **Key Technologies**:
    -   MongoDB (Persistence)
    -   Redis (Change Streams)
    -   Dapr (Inter-service Communication)
-   **API Version**: `v1`

## Architectural Context

-   **Role**: Control plane orchestrator.
-   **Client**: Receives commands from the `drasi` CLI.
-   **State Management**: Persists desired resource state to MongoDB.
-   **Delegation**: Delegates implementation tasks to resource providers (e.g., `kubernetes_provider`) via Dapr pub/sub.

## Internal Architecture Summary

The service is built on a clean, layered architecture:

-   **`src/api/`**: The HTTP layer (Actix Web). Handles routing, request deserialization, and response serialization. Delegates logic to the domain layer.
-   **`src/domain/`**: The core business logic layer. Contains internal models and services that orchestrate all resource management workflows.
-   **`src/persistence/`**: The data access layer (MongoDB). Abstracts database operations behind a generic Repository pattern.
-   **`src/change_stream/`**: A utility layer for reliable, sequential messaging using Redis Streams.

## Deployment

-   **Method**: Deployed automatically by the Drasi CLI (`drasi init` command) using an embedded manifest.
-   **Development Manifest**: The `deploy.yaml` file in this directory is for standalone development and testing only.

## API Endpoint Summary

| Endpoint | Resource | Operations |
| :--- | :--- | :--- |
| `/v1/sources` | Sources | `GET`, `PUT`, `DELETE`, `LIST`, `READY_WAIT` |
| `/v1/queryContainers` | Query Containers | `GET`, `PUT`, `DELETE`, `LIST`, `READY_WAIT` |
| `/v1/reactions` | Reactions | `GET`, `PUT`, `DELETE`, `LIST`, `READY_WAIT` |
| `/v1/continuousQueries`| Continuous Queries | `GET`, `PUT`, `DELETE`, `LIST`, `READY_WAIT`, `WATCH` |
| `/v1/sourceProviders` | Source Providers | `GET`, `PUT`, `DELETE`, `LIST` |
| `/v1/reactionProviders`| Reaction Providers | `GET`, `PUT`, `DELETE`, `LIST` |
| `/v/debug` | Debug | WebSocket |

---

## API Endpoint Details

All standard resource endpoints (`sources`, `queryContainers`, `reactions`, `continuousQueries`) follow a consistent CRUD pattern.

### Standard Resource Operations

These operations apply to `sources`, `queryContainers`, `reactions`, and `continuousQueries`.

*   **`PUT /{id}`**: Creates or updates a resource.
    *   **Request Body**: A JSON object representing the resource's `spec`. The specific fields depend on the resource type (e.g., `SourceSpecDto`, `QueryContainerSpecDto`).
    *   **Response Body**: The full resource object, including `id`, `spec`, and `status`.

*   **`GET /{id}`**: Retrieves a single resource.
    *   **Response Body**: The full resource object.

*   **`GET /`**: Lists all resources of a given type.
    *   **Response Body**: A JSON array of full resource objects.

*   **`DELETE /{id}`**: Deletes a resource.
    *   **Response**: `204 No Content` on success.

*   **`GET /{id}/ready-wait`**: Blocks until the resource's status is "Ready" or a timeout occurs.
    *   **Query Parameters**: `timeout` (integer, seconds, default: 60, max: 300).
    *   **Response**: `200 OK` if ready, `503 Service Unavailable` if timeout is reached.

### Provider Operations

These operations apply to `sourceProviders` and `reactionProviders`.

*   **`PUT /{id}`**: Creates or updates a provider.
    *   **Request Body**: A `ProviderSpecDto` JSON object.
    *   **Response Body**: The provider resource object.

*   **`GET /{id}`**: Retrieves a provider.
    *   **Response Body**: The provider resource object.

*   **`GET /`**: Lists all providers.
    *   **Response Body**: A JSON array of provider resource objects.

*   **`DELETE /{id}`**: Deletes a provider.
    *   **Response**: `204 No Content` on success.

### Special Endpoints

*   **`GET /v1/continuousQueries/{id}/watch`**:
    *   **Description**: Establishes a persistent connection to stream the results of a continuous query.
    *   **Response**: A streaming JSON array of result objects. The connection remains open as new results are available.

*   **`/v1/debug`**:
    *   **Description**: A WebSocket endpoint for interactively debugging a query without persisting it.
    *   **Initial Message (Client -> Server)**: A `QuerySpecDto` JSON object sent as a text message to start the debug session.
    *   **Stream (Server -> Client)**: A stream of JSON objects representing debug events and results, or an error message.

---

## Development

### Testing and Linting

*   **Run tests**: `make test`
*   **Check formatting and style**: `make lint-check`

---

## Development Conventions

*   Follows standard Rust conventions (`cargo fmt`, `cargo clippy`).
*   The API is versioned under `/v1/`.