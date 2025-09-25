# AGENTS.md: `control-planes/mgmt_api/src/change_stream` Directory

This directory provides an abstraction for a reliable, sequential message stream, with a concrete implementation using Redis Streams.

## Architectural Context

-   **Role**: Sequential Message Stream Abstraction.
-   **Purpose**: To provide a guaranteed, in-order message processing mechanism. This is critical for scenarios where the order of events matters, such as processing a series of updates to a single resource. It ensures that messages are processed one at a time and only the next message is delivered after the previous one has been acknowledged (`ack`).
-   **Technology**: Redis Streams (via the `redis-rs` crate).

## File Structure

-   **`mod.rs`**:
    -   **Purpose**: Defines the core abstractions for the change stream.
    -   **Key Components**:
        -   `SequentialChangeStream` (trait): The main interface. It defines the core methods `recv` (receive a message) and `ack` (acknowledge a message). This ensures "at-least-once" and in-order delivery semantics.
        -   `Message<T>` (struct): A wrapper for deserialized message data that also carries distributed tracing information (`trace_parent`, `trace_state`).
        -   `ChangeStreamError` (enum): Defines the possible error types.

-   **`redis_change_stream.rs`**:
    -   **Purpose**: Provides the concrete implementation of the `SequentialChangeStream` trait using Redis Streams.
    -   **Key Components**:
        -   `RedisChangeStream` (struct): The implementation struct.
        -   **Functionality**: It uses a Redis Consumer Group to read from a stream. A background `tokio` task fetches messages in batches and puts them into a buffer. The `recv` method pulls one message from the buffer, and it will not pull the next one until the current message is acknowledged via the `ack` method. This enforces the sequential processing guarantee.

-   **`tests.rs`**: Contains unit and integration tests for the Redis change stream implementation.
