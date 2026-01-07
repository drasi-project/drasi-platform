# AGENTS.md: `control-planes/mgmt_api/src/api/v1` Directory

This directory implements the version 1 (`v1`) HTTP API. It is the "Routing Layer" of the service, responsible for mapping incoming HTTP requests to the correct business logic in the `domain` layer.

## Architectural Context

-   **Role**: API Routing and Handling Layer.
-   **Purpose**: To define the web service endpoints, handle request/response serialization, and orchestrate calls to the domain services. This is where the HTTP protocol is translated into internal function calls.
-   **Framework**: Actix Web with utoipa for OpenAPI documentation.
-   **Key Pattern**: Each resource has its own explicit handler module with endpoint functions annotated with `#[utoipa::path]` for automatic OpenAPI documentation generation.

## File Structure

-   **`mod.rs`**: Module declaration and organization for the v1 API.

-   **Resource Handler Files** : Explicit handler implementations for each resource type.

-   **`openapi.rs`**: Central OpenAPI documentation configuration.

-   **`debug.rs`**: OpenAPI documentation placeholder for the WebSocket debug endpoint.

## Subdirectories

-   **`models/`**:
    -   **Purpose**: Defines the public Data Transfer Objects (DTOs) for the v1 API. These are the Rust structs that map directly to the API's JSON bodies.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`mappings/`**:
    -   **Purpose**: Contains the translation logic to convert between the public v1 DTOs (`models/`) and the internal `domain` models.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**
