# AGENTS.md: `cli/installers/resources` Directory

This directory contains the raw YAML manifest files that are embedded into the CLI binary and used by the `KubernetesInstaller` to deploy a Drasi environment. These files define all the necessary Kubernetes and Drasi resources for a standard installation.

The installer templates these files, replacing placeholders like `%TAG%` and `%ACR%` with the correct values at installation time.

## Kubernetes Resource Manifests

### `infra.yaml`

-   **Purpose**: Defines the core stateful infrastructure and Dapr components required by Drasi.
-   **Key Components**:
    -   `StatefulSet` for `drasi-redis`: Deploys a Redis instance for pub/sub messaging and caching.
    -   `StatefulSet` for `drasi-mongo`: Deploys a MongoDB instance, primarily used for storing query results and actor state.
    -   `PriorityClass` (`drasi-infrastructure`): Ensures that these core infrastructure pods are scheduled with high priority.
    -   Dapr `Component` (`drasi-state`): Configures the MongoDB instance as the state store for Dapr actors.
    -   Dapr `Component` (`drasi-pubsub`): Configures the Redis instance as the message bus for Dapr pub/sub.
    -   Dapr `Configuration` (`dapr-config`): Provides default Dapr configuration, including enabling tracing.

### `control-plane.yaml`

-   **Purpose**: Defines the core Drasi control plane services.
-   **Key Components**:
    -   `Deployment` for `drasi-resource-provider`: The service responsible for managing and reconciling Drasi resources (Sources, Reactions, etc.) within the Kubernetes cluster.
    -   `Deployment` for `drasi-api`: The main management API that the Drasi CLI interacts with to manage the environment.
    -   `Service` for `drasi-api`: Exposes the management API internally within the cluster.

### `service-account.yaml`

-   **Purpose**: Defines the Kubernetes RBAC (Role-Based Access Control) permissions required for the Drasi control plane to function.
-   **Key Components**:
    -   `ServiceAccount` (`drasi-resource-provider`): The identity used by the resource provider pod.
    -   `Role` (`drasi-resource-provider-role`): Grants necessary permissions to create, delete, list, and update Kubernetes resources like Deployments, Services, ConfigMaps, and Dapr Components.
    -   `RoleBinding`: Binds the `Role` to the `ServiceAccount`.

### `observability/`

-   **Purpose**: This subdirectory contains manifests for deploying optional observability tools.
-   **Files**:
    -   `tracing.yaml`: Deploys Grafana Tempo for distributed tracing.
    -   `metrics.yaml`: Deploys Prometheus for metrics collection.
    -   `full-observability.yaml`: Deploys both Tempo and Prometheus.
    -   `otel-collector.yaml`: Deploys the OpenTelemetry Collector to receive and forward telemetry data.

## Drasi Resource Manifests

These files define the default Drasi resources that are created during a fresh installation.

### `default-container.yaml`

-   **Purpose**: Defines the default `QueryContainer` resource.
-   **Details**: This sets up the initial environment where continuous queries will run. It configures Redis as the default store and MongoDB for storing query results.

### `default-source-providers.yaml`

-   **Purpose**: Defines the built-in `SourceProvider` resources.
-   **Details**: This multi-document YAML file registers all the out-of-the-box source types that Drasi supports, such as `PostgreSQL`, `SQLServer`, `CosmosGremlin`, `Kubernetes`, etc. Each provider definition includes the necessary configuration schema and specifies the container images for its proxy and reactivator services.

### `default-reaction-providers.yaml`

-   **Purpose**: Defines the built-in `ReactionProvider` resources.
-   **Details**: This multi-document YAML file registers all the out-of-the-box reaction types, such as `EventGrid`, `SignalR`, `Gremlin`, `StoredProc`, `Http`, etc. It defines their configuration schemas and the container images for their services.
