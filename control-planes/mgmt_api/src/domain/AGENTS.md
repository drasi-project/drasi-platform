# AGENTS.md: `control-planes/mgmt_api/src/domain` Directory

This directory contains the core business logic and internal models for the Drasi management API. It acts as the intermediary between the public-facing `api` layer and the `persistence` layer.

## Architectural Context

-   **Role**: Domain Logic / Business Logic Layer.
-   **Purpose**: To define the internal representation of Drasi resources and implement the workflows for managing them. This layer is responsible for validation, orchestration, and ensuring the integrity of the platform's state. It is completely decoupled from the web framework (`api` layer) and the database implementation (`persistence` layer).

## Key Files

-   **`models.rs`**:
    -   **Purpose**: Defines the internal, canonical data structures for all Drasi resources (e.g., `SourceSpec`, `QuerySpec`, `ProviderSpec`). These are the "true" representations of the resources, distinct from the versioned DTOs in the `api` layer. Also defines the `DomainError` enum for internal error handling.

-   **`mappings.rs`**:
    -   **Purpose**: Provides the translation logic for converting internal `domain` models into the models required by the `resource_provider_api`. This is crucial for communicating with the `kubernetes_provider`.

-   **`query_actor_service.rs`**:
    -   **Purpose**: A dedicated service that encapsulates the logic for communicating with `ContinuousQuery` Dapr actors. It handles `configure`, `deprovision`, and `wait_for_ready_or_error` actor invocations.

-   **`result_service.rs`**:
    -   **Purpose**: Provides logic for streaming the results of a query. It can get a snapshot of current results from the view service and then stream subsequent real-time changes from the Redis results stream. Used by the `watch` and `debug` API endpoints.

-   **`debug_service.rs`**:
    -   **Purpose**: Implements the logic for the interactive query debugging WebSocket. It creates a temporary, "transient" query, streams its results back to the client, and ensures the query is deprovisioned when the session ends.

## Subdirectories

-   **`resource_services/`**:
    -   **Purpose**: Contains the primary domain services for managing the lifecycle of all Drasi resources (Sources, Queries, etc.). It handles validation, persistence, and invoking Dapr actors on the resource provider.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`resource_provider_services/`**:
    -   **Purpose**: Contains the domain services specifically for managing `SourceProvider` and `ReactionProvider` registrations.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**
