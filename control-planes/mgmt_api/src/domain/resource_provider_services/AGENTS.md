# AGENTS.md: `control-planes/mgmt_api/src/domain/resource_provider_services` Directory

This directory contains the domain services responsible for managing the lifecycle of `SourceProvider` and `ReactionProvider` resources.

## Architectural Context

-   **Role**: Domain Service Layer for Providers.
-   **Purpose**: To handle the business logic for provider registration. This includes validating the provider's specification and persisting it to the database.
-   **Key Pattern**: It uses a generic implementation (`ResourceProviderDomainServiceImpl`) parameterized with a marker trait (`TMarker`) to handle the common logic for both source and reaction providers. Concrete types are then created using type aliases.

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Defines the core generic logic for all resource provider services.
    -   **Key Components**:
        -   `ResourceProviderDomainService<TMarker>` (trait): The public contract for the service, defining methods like `set`, `get`, `delete`, and `list`.
        -   `ResourceProviderDomainServiceImpl<TMarker>` (struct): The generic implementation of the service. It orchestrates calls to the persistence layer (`ResourceSpecRepository`) and runs any configured validators.

-   **`source_provider_service.rs`**:
    -   **Purpose**: Defines the concrete service for managing `SourceProvider` resources.
    -   **Key Components**:
        -   `SourceProviderDomainService` (type alias): A type alias for `dyn ResourceProviderDomainService<SourceProviderMarker>`.
        -   `SourceProviderDomainServiceImpl` (type alias): A type alias for `ResourceProviderDomainServiceImpl<SourceProviderMarker>`.
        -   `new()` (function): A constructor to create a new instance of the service, injecting the Dapr client and the persistence repository.

-   **`reaction_provider_service.rs`**:
    -   **Purpose**: Defines the concrete service for managing `ReactionProvider` resources.
    -   **Key Components**:
        -   `ReactionProviderDomainService` (type alias): A type alias for `dyn ResourceProviderDomainService<ReactionProviderMarker>`.
        -   `ReactionProviderDomainServiceImpl` (type alias): A type alias for `ResourceProviderDomainServiceImpl<ReactionProviderMarker>`.
        -   `new()` (function): A constructor for the reaction provider service.
