# AGENTS.md: `control-planes/kubernetes_provider/src` Directory

This directory contains the complete source code for the Drasi Kubernetes Provider. It is the top-level entry point for understanding the controller's construction and internal architecture.

## Architectural Context

-   **Role**: Application Crate Root.
-   **Purpose**: To define the application's binary entry point (`main.rs`) and declare the top-level modules that make up the controller. This is where all the components are wired together.

## Key Files

-   **`main.rs`**:
    -   **Purpose**: The main entry point for the `kubernetes_provider` binary.
    -   **Key Responsibilities**:
        -   **Initialization**: Connects to the Kubernetes cluster and the Dapr sidecar.
        -   **Dapr Server Setup**: Initializes the Dapr HTTP server.
        -   **Actor Registration**: Registers the concrete actor types (`SourceActor`, `ReactionActor`, `QueryContainerActor`) with the Dapr runtime. This involves providing factory functions that create new actor instances, injecting dependencies like the `RuntimeConfig` and the Kubernetes client configuration.
        -   **Monitor**: Starts a background monitoring task.
        -   **Server Start**: Starts the Dapr server to begin listening for actor invocations.

-   **`models.rs`**:
    -   **Purpose**: Defines the core internal data structures for the provider.
    -   **Key Components**:
        -   `KubernetesSpec` (struct): **This is the most important data structure in the provider.** It represents the complete desired state of all Kubernetes objects for a single Drasi resource service. It is created by the `spec_builder` and consumed by the `controller`.
        -   `RuntimeConfig` (struct): A struct that holds runtime configuration, loaded from environment variables, such as the container image registry, tags, and Dapr settings.

## Subdirectories

The controller is organized into a clean, layered architecture.

-   **`actors/`**:
    -   **Purpose**: The command-receiving layer. Contains the Dapr actor implementations that receive `configure` and `deprovision` commands from the `mgmt_api`.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`spec_builder/`**:
    -   **Purpose**: The translation layer. Takes an abstract Drasi resource spec and builds the detailed, concrete `KubernetesSpec`.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`controller/`**:
    -   **Purpose**: The core reconciliation layer. Takes a `KubernetesSpec` and applies it to the cluster, ensuring the actual state matches the desired state.
    -   **For more details, see the `AGENTS.md` file within this subdirectory.**

-   **`monitor/`**:
    -   **Purpose**: A background task that monitors the health and status of Drasi-managed pods and reports updates.
