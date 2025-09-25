# AGENTS.md: `control-planes/mgmt_api/src/api/v1/mappings` Directory

This directory contains the translation logic for converting between API Data Transfer Objects (DTOs) and the internal Domain Model objects.

## Architectural Context

-   **Role**: Data structure mapping layer.
-   **Purpose**: To decouple the public-facing API data structures from the internal business logic structures. This allows the internal domain model to evolve without breaking the public v1 API contract.
-   **Mechanism**: Implements Rust's `From` trait for bidirectional conversions.

## File Structure

The directory is organized by resource type, with each file responsible for the mappings of a specific resource.

-   **`mod.rs`**: Declares the other files as modules and provides generic mapping implementations for the base `Resource` and `ConfigValue` types that are shared across all resources.
-   **`providers.rs`**: Handles mappings for `SourceProvider` and `ReactionProvider` resources, including their complex nested structures like `ProviderSpec` and `JsonSchema`.
-   **`query.rs`**: Handles mappings for `ContinuousQuery` resources (`QuerySpec`, `QueryStatus`, etc.).
-   **`query_container.rs`**: Handles mappings for `QueryContainer` resources.
-   **`reaction.rs`**: Handles mappings for `Reaction` resources.
-   **`source.rs`**: Handles mappings for `Source` resources.
