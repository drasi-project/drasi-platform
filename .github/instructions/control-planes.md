---
applyTo: "control-planes/**/*"
---

# Control Planes - GitHub Copilot Instructions

## Project Overview

The control planes contain the core management components of Drasi written in Rust. This includes the Management API and Resource Provider services that handle the lifecycle of Sources, Continuous Queries, and Reactions.

## Technology Stack

- **Language**: Rust (edition 2021)
- **Web Framework**: Actix Web
- **Database**: MongoDB 
- **Cache**: Redis
- **Communication**: Dapr HTTP/gRPC
- **Observability**: OpenTelemetry, tracing

## Project Structure

```
control-planes/
├── mgmt_api/               # Management API service
│   ├── src/
│   │   ├── main.rs        # Application entry point
│   │   ├── api/           # REST API handlers
│   │   └── domain/        # Business logic
│   ├── Cargo.toml
│   └── Makefile
├── resource_provider_api/  # Resource provider definitions
├── kubernetes_provider/    # Kubernetes-specific provider
└── Makefile               # Root makefile
```

## Key Components

### Management API (`mgmt_api/`)
- **REST API**: Actix Web-based HTTP API
- **Domain Services**: Business logic for resource management
- **Repository Layer**: MongoDB data access
- **Communication**: Dapr integration for service-to-service calls

### API Structure
- `/v1/sources` - Source management endpoints
- `/v1/continuousQueries` - Query lifecycle management  
- `/v1/reactions` - Reaction configuration
- `/v1/queryContainers` - Query container management
- `/v1/sourceProviders` - Source provider schemas
- `/v1/reactionProviders` - Reaction provider schemas

## Build and Development

### Building
```bash
# Build all control plane services
make docker-build

# Debug builds with shell access
make docker-build-debug

# Build specific component
make -C mgmt_api docker-build
```

### Testing
```bash
# Run all tests
make test

# Run specific service tests
cd mgmt_api && cargo test

# Run with coverage
cargo test --all-features
```

### Linting
```bash
# Check formatting and clippy lints
make lint-check

# Fix formatting
cargo fmt

# Run clippy
cargo clippy
```

## Development Guidelines

### Code Organization
- Use domain-driven design principles
- Separate API handlers from business logic
- Implement repository pattern for data access
- Use dependency injection for testability

### Error Handling
```rust
// Use thiserror for structured error types
#[derive(thiserror::Error, Debug)]
pub enum DomainError {
    #[error("Resource not found: {id}")]
    NotFound { id: String },
    #[error("Validation failed: {message}")]
    Validation { message: String },
}

// Return Results consistently
pub async fn create_source(&self, source: Source) -> Result<Source, DomainError> {
    // Implementation
}
```

### Async Patterns
```rust
// Use async/await throughout
pub async fn handle_request(req: HttpRequest) -> Result<HttpResponse, Error> {
    let result = service.process(req).await?;
    Ok(HttpResponse::Ok().json(result))
}

// Use Arc<> for shared state
let service = Arc::new(SourceService::new(repo));
```

### Actix Web Patterns
```rust
// Configure routes using scopes
pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/sources")
            .route("", web::post().to(create_source))
            .route("/{id}", web::get().to(get_source))
            .route("/{id}", web::delete().to(delete_source))
    );
}

// Use extractors for request data
pub async fn create_source(
    source: web::Json<CreateSourceRequest>,
    service: web::Data<Arc<SourceService>>,
) -> Result<HttpResponse, Error> {
    // Implementation
}
```

### Database Integration
```rust
// Use MongoDB async driver
use mongodb::{Client, Database, Collection};

// Repository pattern
pub struct SourceRepository {
    collection: Collection<Source>,
}

impl SourceRepository {
    pub async fn create(&self, source: &Source) -> Result<(), Error> {
        self.collection.insert_one(source, None).await?;
        Ok(())
    }
}
```

### Dapr Integration
```rust
// Use Dapr client for service communication
use dapr::Client;

let dapr_client = Client::<dapr::client::TonicClient>::connect(addr).await?;
let response = dapr_client
    .invoke_service("query-container", "process", data)
    .await?;
```

## Configuration

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `MONGO_DB`: Database name
- `REDIS_URL`: Redis connection URL
- `DAPR_HTTP_PORT`: Dapr HTTP port
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OpenTelemetry endpoint

### Docker Configuration
- Base images use Azure Linux for production
- Debug images include shell access
- Health checks and proper signal handling

## Testing Approach

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use faux::Faux; // For mocking

    #[tokio::test]
    async fn test_create_source() {
        let mut mock_repo = MockSourceRepository::faux();
        faux::when!(mock_repo.create).then(|_| Ok(()));
        
        let service = SourceService::new(Arc::new(mock_repo));
        let result = service.create_source(source).await;
        
        assert!(result.is_ok());
    }
}
```

### Integration Tests
- Test with real MongoDB instances
- Use Docker Compose for test dependencies
- Test Dapr integration scenarios

## Common Tasks

### Adding a New API Endpoint
1. Define request/response types in `api/models`
2. Implement handler function in `api/handlers`
3. Add route configuration
4. Implement business logic in domain service
5. Add repository methods if needed
6. Write unit and integration tests

### Adding a New Domain Service
1. Create service struct with dependencies
2. Implement business logic methods
3. Define error types with thiserror
4. Add to dependency injection in main.rs
5. Write comprehensive tests

## External Dependencies

- **MongoDB**: Primary data store
- **Redis**: Caching and session management
- **Dapr**: Service mesh and state management
- **Kubernetes API**: Resource management
- **OpenTelemetry**: Observability and tracing