# AGENTS.md: `control-planes/resource_provider_api` Directory

## Architectural Context

-   **Type**: Rust Library Crate.
-   **Role**: Shared communication contract between the `mgmt_api` and resource providers (e.g., `kubernetes_provider`).
-   **Purpose**: Defines the stable, shared data structures (`models`) for inter-service communication, enabling a pluggable provider architecture.
-   **Consumers**: `mgmt_api`, `kubernetes_provider`.

## Code Structure

-   **`Cargo.toml`**: Defines crate metadata and dependencies (`serde`).
-   **`src/lib.rs`**: Crate root. Exposes the `models` module.
-   **`src/models.rs`**: **Primary file.** Defines all shared data structures (e.g., `SourceSpec`, `ReactionSpec`) used for API calls between control plane components.

## Development

-   **Build**: `cargo build`
-   **Test**: `cargo test`
-   **Check**: `cargo check`
