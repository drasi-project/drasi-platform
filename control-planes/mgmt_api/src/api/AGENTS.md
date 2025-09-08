# AGENTS.md: `control-planes/mgmt_api/src/api` Directory

This directory defines the public-facing HTTP API layer for the Drasi management service. It is responsible for exposing the service's capabilities to the outside world, primarily to the `drasi` CLI.

## Architectural Context

-   **Role**: Web Service / API Endpoint Layer.
-   **Purpose**: To handle incoming HTTP requests, deserialize them into Data Transfer Objects (DTOs), delegate the work to the `domain` layer, and serialize the results back into HTTP responses.
-   **Framework**: Actix Web.

## File Structure

-   **`mod.rs`**: The root of the API module. Its primary function here is to define the mapping from internal `DomainError` types to the appropriate `actix_web::HttpResponse` status codes (e.g., `DomainError::NotFound` becomes a `404 Not Found` response).

## Subdirectories

-   **`v1/`**: Contains the complete implementation of the version 1 API. This is the most important subdirectory.
    -   **Purpose**: It defines all the Actix route handlers for the resource endpoints (e.g., `/v1/sources`, `/v1/continuousQueries`). It orchestrates the flow of data from the web request, through the DTO and mapping layers, to the domain services, and back.
    -   **Key Subdirectories**:
        -   `models/`: Defines the public DTOs for the v1 API.
        -   `mappings/`: Provides the translation logic between the v1 DTOs and the internal domain models.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**
