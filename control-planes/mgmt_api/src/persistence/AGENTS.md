# AGENTS.md: `control-planes/mgmt_api/src/persistence` Directory

This directory is the data persistence layer for the management API. It is responsible for all interactions with the database, abstracting the specific database technology and operations behind a generic Repository pattern.

## Architectural Context

-   **Role**: Persistence / Data Access Layer.
-   **Purpose**: To provide a clean, consistent interface for the `domain` layer to perform CRUD (Create, Read, Update, Delete) operations on resource specifications without needing to know the details of the underlying database.
-   **Technology**: MongoDB (via the `mongodb` crate).
-   **Key Pattern**: Implements the Repository pattern. A generic `ResourceSpecRepositoryImpl` handles the common MongoDB operations (`find_one`, `replace_one`, `delete_one`), and this is used to create concrete repository types for each resource.

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Defines the core generic repository logic.
    -   **Key Components**:
        -   `ResourceSpecRepository<T>` (trait): The public contract for all repositories, defining methods like `get`, `set`, `delete`, and `list`.
        -   `ResourceSpecRepositoryImpl<T>` (struct): The generic implementation of the trait that works with any resource specification type `T`. It takes a MongoDB `Collection` and performs the database operations.

-   **`source_repository.rs`**: Defines the concrete `SourceRepository` type alias and a constructor that points it to the "sources" MongoDB collection.
-   **`reaction_repository.rs`**: Defines the `ReactionRepository` for the "reactions" collection.
-   **`query_repository.rs`**: Defines the `QueryRepository` for the "queries" collection.
-   **`query_container_repository.rs`**: Defines the `QueryContainerRepository` for the "query-containers" collection.
-   **`provider_repository.rs`**: Defines the `ProviderRepository`. Note that this single repository is used for both `SourceProvider` and `ReactionProvider` resources, which are stored in separate collections configured at runtime.
