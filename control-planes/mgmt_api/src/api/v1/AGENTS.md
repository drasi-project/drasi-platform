# AGENTS.md: `control-planes/mgmt_api/src/api/v1` Directory

This directory implements the version 1 (`v1`) HTTP API. It is the "Routing Layer" of the service, responsible for mapping incoming HTTP requests to the correct business logic in the `domain` layer.

## Architectural Context

-   **Role**: API Routing and Handling Layer.
-   **Purpose**: To define the web service endpoints, handle request/response serialization, and orchestrate calls to the domain services. This is where the HTTP protocol is translated into internal function calls.
-   **Framework**: Actix Web.
-   **Key Pattern**: The `mod.rs` file uses a Rust macro (`v1_crud_api!`) to generate the standard set of CRUDL (Create, Read, Update, Delete, List) and `ready-wait` endpoints for each resource. This avoids repetitive boilerplate code for common operations.

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: The core of the v1 API. It defines the Actix Web route handlers and configures the routing for all resources.
    -   **Implementation**:
        -   It defines handler modules for each resource type (e.g., `source_handlers`, `query_handlers`).
        -   Each handler module uses the `v1_crud_api!` macro to generate its standard endpoints.
        -   Resource-specific handlers, like `watch` for queries or the WebSocket `debug` endpoint, are defined as separate functions and added to the routing configuration.
        -   The handler functions are responsible for deserializing request bodies into DTOs, calling the appropriate `domain` service, and serializing the result back into an `HttpResponse`.

## Subdirectories

-   **`models/`**:
    -   **Purpose**: Defines the public Data Transfer Objects (DTOs) for the v1 API. These are the Rust structs that map directly to the API's JSON bodies.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`mappings/`**:
    -   **Purpose**: Contains the translation logic to convert between the public v1 DTOs (`models/`) and the internal `domain` models.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**
