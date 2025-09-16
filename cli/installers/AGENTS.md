# AGENTS.md: `cli/installers` Directory

This directory contains the logic for installing, uninstalling, and managing Drasi environments on different platforms (primarily Kubernetes). It abstracts the platform-specific details of deployment behind a set of interfaces. The `drasi init` and `drasi uninstall` commands delegate their core work to the components in this directory.

## Core Interfaces

### `installer.go`

-   **Purpose**: Defines the main `Installer` interface. This provides a generic contract for installing Drasi, regardless of the target platform.
-   **Key Components**:
    -   `Installer` (interface): The core interface with the `Install(...)` method.
    -   `MakeInstaller(...)` (factory function): A factory function that takes a `registry.Registration` (which defines the target environment) and returns the appropriate concrete `Installer` implementation (e.g., `KubernetesInstaller`).

### `uninstaller.go`

-   **Purpose**: Defines the `Uninstaller` interface for removing Drasi from an environment.
-   **Key Components**:
    -   `Uninstaller` (interface): The core interface with the `Uninstall(...)` method.
    -   `MakeUninstaller(...)` (factory function): A factory that returns the correct `Uninstaller` implementation based on the target environment.

## Kubernetes Implementation

### `kubernetes_installer.go`

-   **Purpose**: Provides the concrete implementation of the `Installer` interface for Kubernetes. This is a complex file that handles the multi-step process of deploying Drasi.
-   **Key Responsibilities**:
    -   Checking for and installing Dapr using a Helm chart.
    -   Creating the target Kubernetes namespace.
    -   Applying Kubernetes manifests for core infrastructure (Redis, Mongo), observability tools (Tempo, Prometheus, Grafana), and the Drasi control plane services.
    -   Templating manifest files with correct image tags and registry paths.
    -   Waiting for deployments and statefulsets to become ready.
    -   Using the Drasi client (`sdk`) to apply the default Drasi resources (QueryContainer, SourceProviders, etc.) after the control plane is up.
    -   Contains embedded YAML files for all necessary resources in the `resources` directory.

### `kubernetes_uninstaller.go`

-   **Purpose**: Implements the `Uninstaller` interface for Kubernetes.
-   **Key Responsibilities**:
    -   Deleting the entire Kubernetes namespace where Drasi is installed.
    -   Waiting for the namespace to be fully terminated.
    -   Optionally deleting the `dapr-system` namespace if requested.

### `kubernetes_manifest_installer.go`

-   **Purpose**: Implements the `Installer` interface for the `--manifest` flag of the `drasi init` command. Instead of deploying directly to a cluster, it generates the necessary Kubernetes and Drasi YAML files.
-   **Key Responsibilities**:
    -   Generating YAML strings for all required resources (Namespace, ConfigMap, Control Plane, etc.).
    -   Writing the generated Kubernetes resources to `kubernetes-resources.yaml`.
    -   Writing the generated Drasi resources (QueryContainer, Providers) to `drasi-resources.yaml`.

## Docker Implementation

### `dockerized_deployer.go`

-   **Purpose**: Handles the logic for creating and managing a self-contained Drasi environment running inside a local Docker container. This is used by the `drasi init --docker` command.
-   **Key Responsibilities**:
    -   Building a Docker container with a K3d (Kubernetes in Docker) cluster inside.
    -   Loading local Drasi container images into the K3d cluster.
    -   Running the `drasi init` process within the container to set up Drasi.
    -   Deleting the Docker container when the environment is removed.

## Supporting Files

-   **`install-drasi-cli.sh` / `install-drasi-cli.ps1`**: Helper scripts for users to easily download and install the Drasi CLI binary.
-   **`resources/`**: An embedded directory containing all the default YAML manifests required for a Drasi installation, defining everything from Kubernetes infrastructure (Redis, Mongo) to the default Drasi providers. For a detailed breakdown of these manifests, see the `AGENTS.md` file within this directory.
