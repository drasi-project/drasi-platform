# AGENTS.md: `control-planes/mgmt_api/src/api/v1/models` Directory

This directory defines the public Data Transfer Objects (DTOs) for the `v1` API. These are the Rust structs that directly map to the JSON request and response bodies of the management API.

## Architectural Context

-   **Role**: API Data Model / DTO Layer.
-   **Purpose**: To define the stable, versioned, public contract of the management API. These structs are what clients of the API (like the `drasi` CLI) will serialize and deserialize.
-   **Technology**: Uses `serde` for JSON serialization/deserialization. Field attributes like `#[serde(rename_all = "camelCase")]` are used to ensure the JSON representation matches common web API conventions.

## File Structure

The directory is organized by resource type, with each file defining the DTOs for a specific resource.

-   **`mod.rs`**: Declares the other files as modules and defines the generic `ResourceDto` and `ResourceProviderDto` wrappers. It also contains the complex but crucial definition for `ConfigValueDto`, which allows API clients to provide values either inline or as references to Kubernetes secrets.
-   **`providers.rs`**: Defines DTOs for `SourceProvider` and `ReactionProvider` resources, including `ProviderSpecDto` and the highly detailed `JsonSchemaDto` used for configuration validation.
-   **`query.rs`**: Defines DTOs for `ContinuousQuery` resources, such as `QuerySpecDto` and `QueryStatusDto`.
-   **`query_container.rs`**: Defines DTOs for `QueryContainer` resources, including `QueryContainerSpecDto` and `StorageSpecDto`.
-   **`reaction.rs`**: Defines DTOs for `Reaction` resources (`ReactionSpecDto`, `ReactionStatusDto`).
-   **`source.rs`**: Defines DTOs for `Source` resources (`SourceSpecDto`, `SourceStatusDto`).
