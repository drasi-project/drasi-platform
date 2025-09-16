# AGENTS.md: `control-planes/kubernetes_provider/src/controller` Directory

This directory contains the core logic of the Kubernetes controller. It is responsible for the reconciliation loop that ensures the actual state of resources in the cluster matches the desired state defined by a `KubernetesSpec`.

## Architectural Context

-   **Role**: Kubernetes Controller / Reconciliation Loop.
-   **Purpose**: To take a `KubernetesSpec` (built by the `spec_builder`) and use the `kube-rs` client to create, update, or delete the corresponding Kubernetes objects (`Deployment`, `Service`, `ConfigMap`, etc.). This is the "engine room" of the provider.

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Provides a high-level `ResourceController` abstraction that manages the lifecycle of a reconciliation task.
    -   **Key Components**:
        -   `ResourceController` (struct): A handle to a running reconciliation task. It spawns a `tokio` task to run the reconciler and provides an MPSC channel (`commander`) to send commands (`Reconcile`, `Deprovision`) to it. This allows the Dapr actors to safely interact with the reconciler in a concurrent environment.

-   **`reconciler.rs`**:
    -   **Purpose**: This is the most critical file in the provider. It contains the `ResourceReconciler` struct, which implements the actual reconciliation logic.
    -   **Key Components**:
        -   `ResourceReconciler` (struct): Holds the `KubernetesSpec` (the desired state) and `kube-rs` API clients for various Kubernetes object types.
        -   `reconcile()` (method): The main entry point for the reconciliation loop. It calls a series of `reconcile_*` methods (e.g., `reconcile_deployment`, `reconcile_config_maps`) for each object type.
        -   **Reconciliation Logic**: Each `reconcile_*` method typically follows this pattern:
            1.  Attempt to `get` the object from the Kubernetes API.
            2.  If it **exists**, compare its `drasi/spechash` annotation with a newly calculated hash of the desired spec.
            3.  If the hashes differ, `patch` or `replace` the existing object.
            4.  If it **does not exist** (404 error), `create` the new object.
        -   **Hashing**: A hash of the resource's specification is stored in the `drasi/spechash` annotation on the Kubernetes object. This is a key optimization that allows the reconciler to quickly and efficiently determine if an object is up-to-date without needing to perform a deep comparison of all its fields.
