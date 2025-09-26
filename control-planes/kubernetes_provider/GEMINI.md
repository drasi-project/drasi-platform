# Project Overview

This project is a Kubernetes provider for the Drasi platform, implemented as a Rust-based controller. It leverages the `kube-rs` library for Kubernetes API interaction and the Dapr actor model for managing custom resources.

The provider is responsible for reconciling the state of various Drasi resources within a Kubernetes cluster. It manages the lifecycle of Deployments, Services, ConfigMaps, ServiceAccounts, and other Kubernetes objects based on custom specifications.

## Core Components

-   **`main.rs`**: The application's entry point. It initializes the Dapr server, registers the resource actors, and sets up the Kubernetes client.
-   **`controller/reconciler.rs`**: Contains the core reconciliation logic. It continuously monitors the state of managed resources and performs create, update, or delete operations to match the desired state defined in the `KubernetesSpec`.
-   **`models.rs`**: Defines the primary data structures, including `KubernetesSpec`, which encapsulates the desired state for a managed resource, and `ResourceType` (Source, Reaction, QueryContainer).
-   **`actors/*.rs`**: Implements the Dapr actor logic for different resource types (`SourceActor`, `ReactionActor`, `QueryContainerActor`). These actors receive configuration and lifecycle commands to manage their corresponding Kubernetes resources via the reconciler.
-   **`spec_builder/*.rs`**: Contains logic for constructing the detailed `KubernetesSpec` from higher-level configuration.

The system is designed to be deployed on Kubernetes, as indicated by the `deploy.yaml` manifest and various Dockerfiles.

# Building and Running

The `Makefile` provides several scripts for building, testing, and deploying the provider.

-   **Build the Docker image:**
    ```bash
    make docker-build
    ```

-   **Run tests:**
    ```bash
    make test
    ```

-   **Check formatting and lint:**
    ```bash
    make lint-check
    ```

-   **Load the Docker image into a local Kind or K3d cluster:**
    ```bash
    # For Kind
    make kind-load

    # For K3d
    make k3d-load
    ```

-   **Deploy to Kubernetes:**
    The `deploy.yaml` file contains the necessary manifests for deploying the provider and its associated RBAC rules.
    ```bash
    kubectl apply -f deploy.yaml
    ```

# Development Conventions

-   **Language:** The project is written in idiomatic Rust.
-   **Formatting & Linting:** Code is formatted with `cargo fmt` and linted with `cargo clippy`. The CI checks in the `Makefile` enforce these standards.
-   **Kubernetes Controller Pattern:** The reconciler follows the standard Kubernetes controller pattern. It uses a hash of the resource specification (`drasi/spechash` annotation) to efficiently check for changes and determine whether to update a resource.
-   **Dapr Integration:** The application is tightly integrated with Dapr, using it for the actor model and as a sidecar in the Kubernetes deployment.
-   **Configuration:** Runtime configuration is managed through environment variables and a `RuntimeConfig` struct, as seen in `models.rs`.
