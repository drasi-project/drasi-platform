# AGENTS.md: `control-planes/kubernetes_provider/src/actors` Directory

This directory contains the Dapr actor implementations. These actors are the primary entry point for commands sent from the `mgmt_api` to the `kubernetes_provider`.

## Architectural Context

-   **Role**: Command and Control Layer.
-   **Purpose**: To receive `configure` and `deprovision` commands for a specific resource instance. Each resource (e.g., a Source with ID `my-db`) is represented by a unique Dapr actor instance. The actor is responsible for managing the state and lifecycle of that resource.
-   **Technology**: Dapr Actors (via the `dapr-rs` crate).

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Defines the generic `ResourceActor` struct, which contains the common logic for all resource actors.
    -   **Key Components**:
        -   `ResourceActor<TSpec, TStatus>` (struct): A generic actor implementation.
        -   `on_activate()`: When an actor activates, it reads its saved `KubernetesSpec` from the Dapr state store and starts the `ResourceController` to reconcile its state.
        -   `configure()`: This is the main method called by the `mgmt_api`. It receives a resource specification, uses the `spec_builder` to translate it into a `KubernetesSpec`, saves this spec to the Dapr state store, and triggers the `ResourceController` to reconcile.
        -   `deprovision()`: Marks the resource's spec as "removed", saves it, and triggers the `ResourceController` to delete the associated Kubernetes objects.

-   **`source_actor.rs`**:
    -   **Purpose**: Defines the concrete `SourceActor`.
    -   **Implementation**: Uses the `#[actor]` macro to create a concrete type alias for `ResourceActor<SourceSpec, SourceStatus>`. It injects the `SourceSpecBuilder` to handle the spec translation. It also provides a `get_status` method to report the current state of the source's Kubernetes objects.

-   **`reaction_actor.rs`**:
    -   **Purpose**: Defines the concrete `ReactionActor`.
    -   **Implementation**: Similar to the `SourceActor`, it creates a type alias for `ResourceActor<ReactionSpec, ReactionStatus>` and injects the `ReactionSpecBuilder`.

-   **`querycontainer_actor.rs`**:
    -   **Purpose**: Defines the concrete `QueryContainerActor`.
    -   **Implementation**: Similar to the other actors, it creates a type alias for `ResourceActor<QueryContainerSpec, QueryContainerStatus>` and injects the `QueryContainerSpecBuilder`.
