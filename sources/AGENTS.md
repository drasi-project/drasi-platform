# AGENTS.md: Drasi Sources

> For conceptual overview, YAML examples, and identity types, see [README.md](./README.md).

## 1. Deployment Orchestration Flow

Applying a `Source` manifest triggers this flow:

1.  **Submission**: CLI sends manifest to Management API (`PUT /v1/sources/{id}`).
2.  **Validation**: API validates `spec.properties` against the `SourceProvider.config_schema`.
3.  **Delegation**: API invokes the Dapr Actor `SourceResource/{id}/configure` on the `kubernetes_provider`.
4.  **Resource Generation**: Provider creates Kubernetes resources for the five-component architecture:
    -   `Deployment` x5: Reactivator, Proxy, Query API, Change Router, Change Dispatcher.
    -   `Service`: Internal cluster networking for each component.

## 2. The Five-Component Architecture

Every Source deploys five microservices. Developers implement two; the platform provides three.

| Component | Location | Role |
|-----------|----------|------|
| **Reactivator** | Developer-implemented | Detects changes in source system (follows change-log using techniques like CDC). |
| **Proxy** | Developer-implemented | Provides full data snapshot for bootstrapping. |
| **Query API** | `sources/shared/query-api/` | Handles subscriptions, orchestrates bootstrap. |
| **Change Router** | `sources/shared/change-router/` | Routes changes by label to subscribers. |
| **Change Dispatcher** | `sources/shared/change-dispatcher/` | Delivers filtered events to query containers. |

See the [README.md](./README.md#source-runtime-data-flow) for the component interaction diagram.

## 3. Development

-   **SDKs**: Located in `sources/sdk/`.
-   **Build Commands** (from `sources/` directory):
    -   `make docker-build`: Build Docker images for all sources.
    -   `make kind-load`: Load images into local Kind cluster.
    -   `make test`: Run unit tests.
    -   `make lint-check`: Run linting checks.
