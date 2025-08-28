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
├── publish-api/            # API for publishing query results
├── view-svc/              # Service for managing query views
├── query-host/            # Core query execution engine
└── Makefile               # Build configuration
```

## Key Components

### Publish API (`publish-api/`)
- Exposes HTTP API for query result publication
- Handles result streaming and subscriptions
- Manages client connections and notifications

### View Service (`view-svc/`)
- Manages query result views and materialization
- Handles incremental updates to result sets
- Provides query result caching and optimization

### Query Host (`query-host/`)
- Core Cypher query execution engine
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

### Service Architecture
```rust
// Common service pattern
pub struct QueryService {
    processor: Arc<QueryProcessor>,
    publisher: Arc<ResultPublisher>,
}

impl QueryService {
    pub async fn process_change(&self, change: DataChange) -> Result<(), Error> {
        let results = self.processor.evaluate(change).await?;
        self.publisher.publish_results(results).await?;
        Ok(())
    }
}
```

### HTTP API Patterns
```rust
// Use actix-web or similar for HTTP services
use actix_web::{web, App, HttpServer, HttpResponse, Result};

pub async fn publish_results(
    query_id: web::Path<String>,
    results: web::Json<QueryResults>,
) -> Result<HttpResponse> {
    // Process and publish results
    Ok(HttpResponse::Ok().json("Success"))
}
```

### Stream Processing
```rust
// Handle data streams asynchronously
use tokio_stream::{Stream, StreamExt};

pub async fn process_change_stream<S>(mut stream: S) -> Result<(), Error>
where
    S: Stream<Item = DataChange> + Unpin,
{
    while let Some(change) = stream.next().await {
        process_change(change).await?;
    }
    Ok(())
}
```

### Query Processing
```rust
// Cypher query evaluation patterns
pub struct CypherProcessor {
    query: ParsedQuery,
    state: QueryState,
}

impl CypherProcessor {
    pub fn evaluate(&mut self, change: &DataChange) -> QueryResult {
        // Apply change to query state
        // Compute result set updates
        // Return incremental results
    }
}
```

## Configuration

### Environment Variables
- `QUERY_ENGINE_PORT`: HTTP port for query API
- `DAPR_HTTP_PORT`: Dapr HTTP port  
- `DAPR_GRPC_PORT`: Dapr gRPC port
- `LOG_LEVEL`: Logging level configuration
- `OTEL_ENDPOINT`: OpenTelemetry export endpoint

### Service Communication
```rust
// Dapr service invocation
use dapr::Client;

let client = Client::<dapr::client::TonicClient>::connect(addr).await?;
let response = client
    .invoke_service("publish-api", "publish", data)
    .await?;
```

## Testing Approach

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use tokio_test;

    #[tokio::test]
    async fn test_query_evaluation() {
        let processor = CypherProcessor::new(test_query());
        let change = DataChange::new(/* test data */);
        
        let result = processor.evaluate(&change);
        assert!(result.has_changes());
    }
}
```

### Integration Tests
- Test service-to-service communication
- Validate query execution with real data
- Test result streaming and subscriptions

### Performance Tests
- Benchmark query execution performance
- Test with large result sets
- Validate memory usage and cleanup

## Common Patterns

### Error Handling
```rust
#[derive(thiserror::Error, Debug)]
pub enum QueryError {
    #[error("Invalid query syntax: {message}")]
    Syntax { message: String },
    #[error("Query execution failed: {source}")]
    Execution { source: Box<dyn std::error::Error> },
}
```

### Async State Management
```rust
use tokio::sync::RwLock;
use std::collections::HashMap;

pub struct QueryRegistry {
    queries: RwLock<HashMap<String, ActiveQuery>>,
}

impl QueryRegistry {
    pub async fn register_query(&self, id: String, query: ActiveQuery) {
        let mut queries = self.queries.write().await;
        queries.insert(id, query);
    }
}
```

### Result Publishing
```rust
// Publisher trait for result distribution
#[async_trait]
pub trait ResultPublisher {
    async fn publish(&self, query_id: &str, results: &QueryResults) -> Result<(), Error>;
    async fn subscribe(&self, query_id: &str) -> Result<ResultStream, Error>;
}
```

## Common Tasks

### Adding a New Query Operation
1. Define operation in query engine
2. Update Cypher parser if needed
3. Implement evaluation logic
4. Add result computation
5. Update API endpoints
6. Write comprehensive tests

### Adding a New API Endpoint
1. Define in appropriate service (publish-api, view-svc)
2. Implement handler function
3. Add route configuration
4. Update API documentation
5. Add integration tests

### Performance Optimization
1. Profile query execution
2. Identify bottlenecks
3. Optimize data structures
4. Implement caching where appropriate
5. Add performance benchmarks

## External Dependencies

- **Dapr**: Service communication and state
- **Data Sources**: Via source connectors
- **Result Consumers**: Reactions and external systems
- **Monitoring**: OpenTelemetry and metrics systems