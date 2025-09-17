# AGENTS.md: `query-host`

## 1. Purpose & Architectural Intent

This directory contains the `query-host` service, the central component of the `query-container`.

**Core Intent**: To act as a robust, Dapr-enabled host for the `drasi-core` continuous query engine. It is responsible for managing the complete lifecycle of individual queries, making each query a stateful, addressable, and resilient entity.

**Architectural Strategy**:
-   **Dapr Actor Model**: Each continuous query is instantiated as a Dapr `QueryActor`. This pattern manages the state of each query (e.g., status, configuration) and provides a reliable endpoint for lifecycle operations (configure, deprovision).
-   **Decoupled Worker Logic**: The `QueryActor` spawns a `QueryWorker` which contains the actual data processing loop. This separates the actor's lifecycle management from the heavy lifting of running the query.

## 2. Core Dependencies & Data Flow

-   **`drasi-core` (Git Submodule)**: The high-performance, embeddable Rust library that performs the actual continuous query evaluation. `query-host` provides the runtime environment.
-   **Redis Streams**: The `QueryWorker` consumes from a **shared** Redis Stream (populated by `publish-api` or `FutureConsumer`) using a **dedicated Consumer Group** per query. This ensures ordered processing.
-   **Dapr Pub/Sub**: The `QueryWorker` publishes resulting diffs to a separate Dapr pub/sub topic for consumption by downstream services.

```mermaid
graph TD
    subgraph Dapr Sidecar
        A[Dapr Runtime]
    end

    subgraph Query Host Container
        B[DaprHttpServer]
        C[QueryActor]
        subgraph QueryWorker Thread
            D[QueryWorker]
            E{drasi-core Engine}
            F[ResultPublisher]
            G[FutureQueue]
        end
    end

    H[Shared Redis Stream]
    I[Output Dapr Pub/Sub]
    J[Query API (Sources)]

    A <--> B
    B -- "Manages Lifecycle" --> C
    C -- "Spawns & Supervises" --> D
    D -- "Consumes (Consumer Group)" --> H
    D -- "Drives" --> E
    D -- "Bootstraps From" --> J
    E -- "Returns Results" --> D
    D -- "Publishes via" --> F
    F -- "To Topic" --> I
    E -- "Schedules Futures" --> G
    G -.->|Publishes Event| H
```

## 3. Key Abstractions & Files

-   **`QueryActor`** (`query_actor.rs`): Dapr actor for state management and lifecycle.
-   **`QueryWorker`** (`query_worker.rs`): The core processing loop. Bootstraps data, consumes the change stream, and drives the engine.
-   **`IndexFactory`** (`index_factory.rs`): Provides pluggable storage backends for `drasi-core`:
    -   *InMemory*: Volatile, fast (testing).
    -   *Garnet*: Redis-compatible persistence.
    -   *RocksDB*: Local disk persistence.
-   **`ResultPublisher`** (`result_publisher.rs`): Handles publishing results to Dapr Pub/Sub.
-   **`RedisChangeStream`** (`redis_change_stream.rs`): Implements the `SequentialChangeStream` trait for consuming Redis streams.
-   **`FutureConsumer`** (`future_consumer.rs`): Consumes scheduled futures from `drasi-core` and publishes them back to the Redis input stream for processing at the correct time.
-   **`MiddlewareTypeRegistry`**: Enables extensible data transformation pipelines (map, filter, relabel) before the query engine.
