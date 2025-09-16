# AGENTS.md: `control-planes/kubernetes_provider/src/spec_builder` Directory

This directory contains the logic for translating abstract Drasi resource specifications into concrete Kubernetes object specifications.

## Architectural Context

-   **Role**: Kubernetes Spec Translation Layer.
-   **Purpose**: To take a high-level Drasi resource definition (e.g., a `SourceSpec` from the `resource_provider_api`) and build the corresponding detailed Kubernetes manifests (`Deployment`, `Service`, `ConfigMap`, etc.) required to run that resource in the cluster. This is the "translation engine" of the Kubernetes provider.

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Defines the generic `SpecBuilder` trait and provides the central `build_deployment_spec` function.
    -   **Key Components**:
        -   `SpecBuilder<TSpec>` (trait): A generic contract for any struct that can build a `KubernetesSpec`.
        -   `build_deployment_spec(...)`: A powerful, generic function that constructs a `k8s_openapi::api::apps::v1::DeploymentSpec`. It is responsible for populating the spec with the correct container image, environment variables, Dapr annotations, labels, ports, and volumes. This function is the core of all spec building.

-   **`source.rs`**:
    -   **Purpose**: Implements the `SpecBuilder` for `SourceSpec`.
    -   **Functionality**: Builds the multiple `KubernetesSpec` objects required for a Drasi Source, including deployments for the `change-router`, `change-dispatcher`, `query-api`, and any provider-specific services (like a `proxy`).

-   **`reaction.rs`**:
    -   **Purpose**: Implements the `SpecBuilder` for `ReactionSpec`.
    -   **Functionality**: Builds the `KubernetesSpec` for a Drasi Reaction. It handles creating `ConfigMap`s for query configurations and setting up the Dapr pub/sub component for receiving query results.

-   **`query_container.rs`**:
    -   **Purpose**: Implements the `SpecBuilder` for `QueryContainerSpec`.
    -   **Functionality**: Builds the `KubernetesSpec` objects for a Query Container, including deployments for the `query-host`, `publish-api`, and `view-svc`. It also handles the creation of `PersistentVolumeClaim`s for storage profiles like RocksDB.

-   **`identity.rs`**:
    -   **Purpose**: A utility module for handling identity configurations.
    -   **Functionality**: The `apply_identity` function takes a `KubernetesSpec` and a `ServiceIdentity` model and injects the necessary configuration. This can include adding environment variables (for secrets) or annotating `ServiceAccount`s (for workload identity).
