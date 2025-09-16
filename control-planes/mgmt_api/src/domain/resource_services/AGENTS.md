# AGENTS.md: `control-planes/mgmt_api/src/domain/resource_services` Directory

This directory contains the domain services that implement the core business logic for managing all Drasi resources (Sources, Queries, etc.).

## Architectural Context

-   **Role**: Domain Service Layer for Resources.
-   **Purpose**: To orchestrate the lifecycle of a resource. This includes validating its specification, persisting it, and communicating with the resource provider via Dapr actors to actualize the resource in the hosting environment.
-   **Key Pattern**: The services use a generic, trait-based implementation (`ResourceDomainService`) to handle common CRUD and `wait_for_ready` logic. There are two distinct specializations of this pattern, located in the subdirectories.

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Defines the primary `ResourceDomainService<TSpec, TStatus>` trait, which is the public contract for all services in this module. It also re-exports the concrete service types from the subdirectories for easy use by the `api` layer.

## Subdirectories

-   **`standard/`**:
    -   **Purpose**: Contains services for managing "standard" Drasi resources that have a fixed, built-in implementation and do not depend on external providers.
    -   **Resources Managed**: `ContinuousQuery`, `QueryContainer`.
    -   **Implementation**: Uses a `StandardResourceDomainServiceImpl` that handles validation and persistence before invoking a corresponding Dapr actor (e.g., `QueryContainerResource`).
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`extensible/`**:
    -   **Purpose**: Contains services for managing "extensible" resources. These resources are defined by `Provider` definitions and their behavior is not built-in.
    -   **Resources Managed**: `Source`, `Reaction`.
    -   **Implementation**: Uses an `ExtensibleResourceDomainServiceImpl`. Before persisting the resource, this service first loads the corresponding `SourceProvider` or `ReactionProvider` to validate the resource's `spec` against the provider's `config_schema`. It also populates default values from the provider definition.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**
