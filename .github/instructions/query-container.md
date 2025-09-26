---
applyTo: "query-container/**/*"
---

# Query Container - GitHub Copilot Instructions

## Project Overview

The query container hosts the services responsible for executing continuous queries in Drasi. This Rust workspace contains multiple services that work together to process data changes and maintain query result sets.

## Technology Stack

- **Language**: Rust (edition 2021)
- **Workspace**: Cargo workspace with multiple crates
- **Communication**: HTTP APIs, gRPC, Dapr
- **Query Language**: Cypher query processing
- **Data Processing**: Stream processing, change detection

## Project Structure

```
query-container/
├── Cargo.toml              # Workspace configuration
├── publish-api/            # API for publishing source changes to the query containers
├── view-svc/              # Service for managing query result-set views
├── query-host/            # Core query execution engine
└── Makefile               # Build configuration
```

## Key Components

### Publish API (`publish-api/`)
- Exposes HTTP API for source change publication

### View Service (`view-svc/`)
- Manages query result views and materialization
- Handles incremental updates to result sets
- Provides query result caching and optimization

### Query Host (`query-host/`)
- Core graph query execution engine
- Processes incoming data changes
- Maintains query state and result computation

## Build and Development

### Building
```bash
# Build all services in workspace
make docker-build

# Build debug versions
make docker-build-debug

# Build specific service
make -C publish-api docker-build
```

### Testing
```bash
# Run all workspace tests
make test

# Run specific crate tests
cd publish-api && cargo test

# Run with all features
cargo test --workspace --all-features
```

### Linting
```bash
# Check all workspace crates
make lint-check

# Format code
cargo fmt --all

# Run clippy
cargo clippy --workspace --all-targets --all-features
```

## Development Guidelines

### Workspace Management
```toml
# Cargo.toml workspace configuration
[workspace]
members = [
    "publish-api",
    "view-svc", 
    "query-host"
]

[workspace.package]
version = "0.2.0"
```

### Shared Dependencies
- Use workspace dependencies for common crates
- Maintain consistent versions across services
- Share common types and utilities

