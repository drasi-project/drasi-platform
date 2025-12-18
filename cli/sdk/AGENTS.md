# AGENTS.md: `cli/sdk` Directory

This directory contains the Software Development Kit (SDK) for the Drasi CLI. Its primary role is to provide a clean abstraction layer between the CLI commands (`cmd/` directory) and the underlying Drasi platform. It handles the details of communicating with the Drasi Management API and managing different platform environments (like Kubernetes or Docker).

## Core Abstractions

### `platform_client.go`

-   **Purpose**: Defines the `PlatformClient` interface, which abstracts away the specifics of the hosting environment. This allows the CLI commands to work seamlessly whether Drasi is running in Kubernetes or a local Docker container.
-   **Key Components**:
    -   `PlatformClient` (interface): A contract for platform-specific operations. Key methods include:
        -   `CreateDrasiClient()`: Returns an `ApiClient` for communicating with the Drasi Management API.
        -   `CreateTunnel(...)`: Establishes a port-forwarding tunnel to a resource.
        -   `SetSecret(...)` / `DeleteSecret(...)`: Manages secrets in the platform's native secret store.
    -   `KubernetesPlatformClient` (struct): The concrete implementation for Kubernetes. It uses the `k8s.io/client-go` library to interact with the Kubernetes API, manage port-forwarding, and handle secrets.
    -   `NewPlatformClient(...)` (factory function): A factory that inspects the current environment configuration (from the `registry`) and returns the appropriate `PlatformClient` implementation.

### `api_client.go`

-   **Purpose**: Provides a high-level client for interacting with the Drasi Management API. It wraps a generated OpenAPI client and provides methods for CLI commands.
-   **Key Components**:
    -   `ApiClient` (struct): The client that communicates with the Drasi API, typically over a port-forward tunnel established by the `PlatformClient`. It wraps a generated client from the `generated/` subdirectory.
    -   **Methods**: It provides methods that map directly to the CLI commands and API capabilities:
        -   `Apply(...)`: Creates or updates resources (`drasi apply`).
        -   `Delete(...)`: Deletes resources (`drasi delete`).
        -   `GetResource(...)`: Fetches details for a single resource (`drasi describe`).
        -   `ListResources(...)`: Lists all resources of a given kind (`drasi list`).
        -   `ReadyWait(...)`: Blocks until a resource is ready (`drasi wait`).
        -   `Watch(...)`: Streams real-time results from a query (`drasi watch`).

### `generated/`

-   **Purpose**: Contains Go client code generated from the Management API's OpenAPI specification using `oapi-codegen`.
-   **Key Files**:
    -   `api.gen.go`: Auto-generated types and client methods. Do not edit manually; regenerate with `make generate-api-client`.
    -   `types_extra.go`: Manually defined types for schemas that couldn't be auto-generated due to OpenAPI discriminator limitations.

## Subdirectories

### `registry/`

-   **Purpose**: This subdirectory is responsible for managing the configuration of different Drasi environments that the CLI can connect to. It handles saving, loading, and switching between connection profiles (e.g., different Kubernetes contexts or local Docker instances). For more details, see the `AGENTS.md` file within this directory.
