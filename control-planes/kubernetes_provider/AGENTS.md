# Drasi Kubernetes Provider

This directory contains the Drasi Kubernetes Provider, a Rust-based controller that translates abstract Drasi resources into concrete Kubernetes objects.

## Architectural Context

-   **Type**: Kubernetes Controller / Dapr Actor Service.
-   **Role**: The "hands" of the Drasi control plane. It receives commands from the `mgmt_api` and is responsible for the platform-specific implementation of Drasi resources within a Kubernetes cluster.
-   **Key Technologies**:
    -   Rust
    -   `kube-rs` (Kubernetes client)
    -   `dapr-rs` (Dapr client and actor runtime)
-   **Primary Input**: `ResourceRequest<TSpec>` objects from the `resource_provider_api`.
-   **Primary Output**: Kubernetes objects (`Deployment`, `Service`, `ConfigMap`, etc.).

## Internal Architecture Summary

The provider's source code is located in the `src/` directory and follows a clean, layered architecture.

-   **`src/actors/`**: The command-receiving layer. Dapr actors (`SourceActor`, etc.) receive `configure` and `deprovision` commands.
-   **`src/spec_builder/`**: The translation layer. It converts the abstract Drasi resource spec into a detailed `KubernetesSpec` data structure.
-   **`src/controller/`**: The core reconciliation layer. It takes a `KubernetesSpec` and uses `kube-rs` to apply it to the cluster, ensuring the actual state matches the desired state.
-   **For a complete breakdown, see the `AGENTS.md` file in the `src/` directory.**

## Deployment

-   **Method**: Deployed automatically by the Drasi CLI (`drasi init` command) using an embedded manifest.
-   **Development Manifest**: The `deploy.yaml` file in this directory is for standalone development and testing only.

## Development

This project is a standard Rust application built into a Docker image.

-   **Build Docker Image**:
    ```bash
    make docker-build
    ```
-   **Run Tests**:
    ```bash
    make test
    ```
-   **Check Formatting & Lint**:
    ```bash
    make lint-check
    ```
-   **Load Image to local Kind cluster**:
    ```bash
    make kind-load
    ```
