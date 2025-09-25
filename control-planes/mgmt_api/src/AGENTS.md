# AGENTS.md: `control-planes/mgmt_api/src` Directory

This directory contains the complete source code for the Drasi Management API service. It is the top-level entry point for understanding the application's construction and internal architecture.

## Architectural Context

-   **Role**: Application Crate Root.
-   **Purpose**: To define the application's binary entry point (`main.rs`) and declare the top-level modules that make up the service. This is where all architectural layers are wired together.

## Key Files

-   **`main.rs`**:
    -   **Purpose**: The main entry point for the `mgmt_api` binary.
    -   **Key Responsibilities**:
        -   **Initialization**: Reads environment variables for configuration (e.g., `MONGO_URI`, `REDIS_URL`).
        -   **Connection Management**: Establishes connections to external services like Dapr and MongoDB.
        -   **Dependency Injection**: Instantiates all the repositories (from `persistence`) and services (from `domain`). It then injects these dependencies into each other to construct the complete application logic.
        -   **Web Server Configuration**: Configures and launches the Actix `HttpServer`. It registers all the v1 API routes (e.g., `/v1/sources`) and makes the domain service instances available to the Actix request handlers.

## Subdirectories

This service is organized into a clean, layered architecture, with each major component residing in its own subdirectory.

-   **`api/`**:
    -   **Purpose**: The public-facing HTTP API layer. It handles web requests and responses, using the `domain` layer to perform the actual work.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`domain/`**:
    -   **Purpose**: The core business logic layer. It contains the internal data models and services that orchestrate all resource management workflows.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`persistence/`**:
    -   **Purpose**: The data persistence layer. It abstracts all database interactions behind a generic Repository pattern.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`change_stream/`**:
    -   **Purpose**: Provides an abstraction for a reliable, sequential message stream, with a concrete implementation using Redis Streams.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**
