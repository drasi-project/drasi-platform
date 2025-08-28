# Infrastructure - GitHub Copilot Instructions

## Project Overview

The infrastructure directory contains shared Rust libraries that provide common functionality across the Drasi platform. These libraries handle communication abstractions, service integration patterns, and common utilities used by sources, reactions, and core services.

## Technology Stack

- **Language**: Rust (edition 2021)
- **Architecture**: Library crates with trait-based abstractions
- **Communication**: HTTP, gRPC, Dapr integration
- **Async Runtime**: Tokio-based async/await patterns

## Project Structure

```
infrastructure/
├── Cargo.toml                    # Workspace configuration
├── comms-abstractions/           # Communication trait definitions
│   ├── src/
│   │   ├── lib.rs               # Library entry point
│   │   ├── publisher.rs         # Publishing abstractions
│   │   ├── subscriber.rs        # Subscription abstractions
│   │   └── types.rs             # Common types
│   └── Cargo.toml
├── comms-dapr/                   # Dapr communication implementation
│   ├── src/
│   │   ├── lib.rs
│   │   ├── publisher.rs
│   │   └── subscriber.rs
│   └── Cargo.toml
└── comms-http/                   # HTTP communication implementation
    ├── src/
    └── Cargo.toml
```

## Key Components

### Communication Abstractions (`comms-abstractions/`)
- Defines traits for platform communication patterns
- Provides common types for events and messages
- Abstracts away transport implementation details

### Dapr Integration (`comms-dapr/`)
- Implements communication traits using Dapr
- Handles service invocation and pub/sub patterns
- Manages state store and secret store access

### HTTP Communication (`comms-http/`)
- Direct HTTP-based communication implementation
- Alternative to Dapr for simpler deployments
- REST API client and server utilities

## Build and Development

### Building
```bash
# Build all infrastructure libraries
cargo build --workspace

# Build specific library
cargo build -p drasi-comms-abstractions

# Build with all features
cargo build --workspace --all-features
```

### Testing
```bash
# Run all tests
cargo test --workspace

# Test specific library
cargo test -p drasi-comms-dapr

# Run with coverage
cargo test --workspace --all-features
```

### Linting
```bash
# Format all code
cargo fmt --all

# Run clippy
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

## Development Guidelines

### Library Design Principles
- Use trait-based abstractions for flexibility
- Implement async/await patterns consistently
- Provide clear error types and handling
- Maintain backward compatibility in public APIs

### Workspace Configuration
```toml
# Cargo.toml workspace setup
[workspace]
members = [
    "comms-abstractions",
    "comms-dapr", 
    "comms-http"
]

[workspace.dependencies]
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
async-trait = "0.1"
thiserror = "1.0"
```

### Trait Design Patterns
```rust
// Publisher trait for sending events
#[async_trait]
pub trait Publisher: Send + Sync {
    type Error: std::error::Error + Send + Sync + 'static;
    
    async fn publish(&self, event: &Event) -> Result<(), Self::Error>;
    async fn publish_batch(&self, events: &[Event]) -> Result<(), Self::Error>;
}

// Subscriber trait for receiving events
#[async_trait]
pub trait Subscriber: Send + Sync {
    type Error: std::error::Error + Send + Sync + 'static;
    
    async fn subscribe(&self, topic: &str) -> Result<EventStream, Self::Error>;
    async fn unsubscribe(&self, topic: &str) -> Result<(), Self::Error>;
}
```

### Event Types
```rust
// Common event structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: String,
    pub source: String,
    pub event_type: EventType,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub data: serde_json::Value,
    pub metadata: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EventType {
    DataChange,
    QueryResult,
    SystemEvent,
    Custom(String),
}
```

### Error Handling
```rust
// Structured error types
#[derive(thiserror::Error, Debug)]
pub enum CommunicationError {
    #[error("Connection failed: {message}")]
    Connection { message: String },
    #[error("Serialization failed: {source}")]
    Serialization { source: serde_json::Error },
    #[error("Timeout occurred")]
    Timeout,
    #[error("Authentication failed")]
    Authentication,
}
```

## Implementation Patterns

### Dapr Integration
```rust
// Dapr publisher implementation
pub struct DaprPublisher {
    client: dapr::Client<dapr::client::TonicClient>,
    pubsub_name: String,
}

#[async_trait]
impl Publisher for DaprPublisher {
    type Error = DaprError;
    
    async fn publish(&self, event: &Event) -> Result<(), Self::Error> {
        let data = serde_json::to_vec(event)?;
        
        self.client
            .publish_event(&self.pubsub_name, &event.event_type.to_string(), data)
            .await
            .map_err(DaprError::from)
    }
    
    async fn publish_batch(&self, events: &[Event]) -> Result<(), Self::Error> {
        // Implement batch publishing
        for event in events {
            self.publish(event).await?;
        }
        Ok(())
    }
}
```

### HTTP Implementation
```rust
// HTTP publisher using reqwest
pub struct HttpPublisher {
    client: reqwest::Client,
    endpoint: String,
    headers: reqwest::header::HeaderMap,
}

#[async_trait]
impl Publisher for HttpPublisher {
    type Error = HttpError;
    
    async fn publish(&self, event: &Event) -> Result<(), Self::Error> {
        let response = self.client
            .post(&self.endpoint)
            .headers(self.headers.clone())
            .json(event)
            .send()
            .await?;
            
        if !response.status().is_success() {
            return Err(HttpError::BadResponse(response.status()));
        }
        
        Ok(())
    }
}
```

### Stream Processing
```rust
use tokio_stream::{Stream, StreamExt};

// Event stream type alias
pub type EventStream = Pin<Box<dyn Stream<Item = Result<Event, Box<dyn std::error::Error + Send + Sync>>> + Send>>;

// Stream processing utilities
pub struct EventProcessor<P: Publisher> {
    publisher: P,
}

impl<P: Publisher> EventProcessor<P> {
    pub async fn process_stream<S>(&self, mut stream: S) -> Result<(), P::Error>
    where
        S: Stream<Item = Event> + Unpin,
    {
        while let Some(event) = stream.next().await {
            self.publisher.publish(&event).await?;
        }
        Ok(())
    }
}
```

## Configuration Management

### Environment-based Configuration
```rust
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct DaprConfig {
    pub grpc_endpoint: String,
    pub http_endpoint: String,
    pub pubsub_name: String,
    pub state_store_name: String,
}

impl DaprConfig {
    pub fn from_env() -> Result<Self, ConfigError> {
        envy::from_env().map_err(ConfigError::from)
    }
}
```

### Builder Patterns
```rust
// Publisher builder for configuration
pub struct DaprPublisherBuilder {
    grpc_endpoint: Option<String>,
    pubsub_name: Option<String>,
    timeout: Option<Duration>,
}

impl DaprPublisherBuilder {
    pub fn new() -> Self {
        Self {
            grpc_endpoint: None,
            pubsub_name: None,
            timeout: Some(Duration::from_secs(30)),
        }
    }
    
    pub fn grpc_endpoint<S: Into<String>>(mut self, endpoint: S) -> Self {
        self.grpc_endpoint = Some(endpoint.into());
        self
    }
    
    pub async fn build(self) -> Result<DaprPublisher, BuildError> {
        let endpoint = self.grpc_endpoint.ok_or(BuildError::MissingEndpoint)?;
        let pubsub_name = self.pubsub_name.ok_or(BuildError::MissingPubsubName)?;
        
        let client = dapr::Client::<dapr::client::TonicClient>::connect(endpoint).await?;
        
        Ok(DaprPublisher {
            client,
            pubsub_name,
        })
    }
}
```

## Testing Patterns

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use tokio_test;
    
    #[tokio::test]
    async fn test_event_serialization() {
        let event = Event {
            id: "test-id".to_string(),
            source: "test-source".to_string(),
            event_type: EventType::DataChange,
            timestamp: chrono::Utc::now(),
            data: serde_json::json!({"key": "value"}),
            metadata: HashMap::new(),
        };
        
        let serialized = serde_json::to_string(&event).unwrap();
        let deserialized: Event = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(event.id, deserialized.id);
    }
}
```

### Mock Implementations
```rust
// Mock publisher for testing
pub struct MockPublisher {
    published_events: Arc<Mutex<Vec<Event>>>,
}

impl MockPublisher {
    pub fn new() -> Self {
        Self {
            published_events: Arc::new(Mutex::new(Vec::new())),
        }
    }
    
    pub fn get_published_events(&self) -> Vec<Event> {
        self.published_events.lock().unwrap().clone()
    }
}

#[async_trait]
impl Publisher for MockPublisher {
    type Error = MockError;
    
    async fn publish(&self, event: &Event) -> Result<(), Self::Error> {
        self.published_events.lock().unwrap().push(event.clone());
        Ok(())
    }
}
```

### Integration Tests
```rust
// Test with real Dapr instance
#[tokio::test]
#[ignore] // Requires Dapr runtime
async fn test_dapr_publisher_integration() {
    let publisher = DaprPublisherBuilder::new()
        .grpc_endpoint("http://localhost:50001")
        .pubsub_name("pubsub")
        .build()
        .await
        .unwrap();
        
    let event = create_test_event();
    let result = publisher.publish(&event).await;
    
    assert!(result.is_ok());
}
```

## Common Tasks

### Adding a New Communication Backend
1. Create new library crate in infrastructure/
2. Implement Publisher and Subscriber traits
3. Add backend-specific configuration
4. Implement error types
5. Add comprehensive tests
6. Update workspace Cargo.toml
7. Document usage patterns

### Extending Event Types
1. Add new variants to EventType enum
2. Update serialization/deserialization logic
3. Add validation rules if needed
4. Update documentation and examples
5. Consider backward compatibility

### Performance Optimization
1. Profile communication patterns
2. Implement connection pooling
3. Add batching capabilities
4. Optimize serialization
5. Add metrics and monitoring

## Usage Examples

### Using in Sources
```rust
use drasi_comms_abstractions::Publisher;
use drasi_comms_dapr::DaprPublisher;

// In source implementation
pub struct MySource {
    publisher: Box<dyn Publisher>,
}

impl MySource {
    pub async fn send_change(&self, change: DataChange) -> Result<(), Box<dyn std::error::Error>> {
        let event = Event::from_data_change(change);
        self.publisher.publish(&event).await?;
        Ok(())
    }
}
```

### Using in Reactions
```rust
use drasi_comms_abstractions::Subscriber;
use drasi_comms_dapr::DaprSubscriber;

// In reaction implementation
pub struct MyReaction {
    subscriber: Box<dyn Subscriber>,
}

impl MyReaction {
    pub async fn start_listening(&self) -> Result<(), Box<dyn std::error::Error>> {
        let mut stream = self.subscriber.subscribe("query-results").await?;
        
        while let Some(event) = stream.next().await {
            match event {
                Ok(event) => self.process_event(event).await?,
                Err(e) => log::error!("Error receiving event: {}", e),
            }
        }
        
        Ok(())
    }
}
```

## External Dependencies

- **Dapr**: Service mesh and runtime for distributed applications
- **HTTP/gRPC**: Network communication protocols
- **Serialization**: JSON, Protocol Buffers for data exchange
- **Async Runtime**: Tokio for asynchronous execution