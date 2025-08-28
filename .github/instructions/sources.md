# Sources - GitHub Copilot Instructions

## Project Overview

Sources are connectors that monitor various data systems for changes and feed those changes into the Drasi platform. This directory contains multiple source implementations across different technology stacks, each designed to integrate with specific types of data systems.

## Technology Stack

- **Java**: Debezium-based relational database sources
- **Rust**: Shared components, some native sources
- **Go**: Kubernetes and other cloud-native sources
- **Mixed**: Various other sources depending on target system

## Project Structure

```
sources/
├── shared/                    # Shared Rust components
│   ├── change-dispatcher/     # Change event routing
│   ├── change-router/         # Change event processing
│   └── query-api/            # Query interface utilities
├── relational/               # Database sources
│   ├── debezium-reactivator/ # Java - Debezium integration
│   └── sql-proxy/           # SQL database proxy
├── cosmosdb/                 # Azure CosmosDB sources
│   ├── cosmosdb-ffcf-reactivator/
│   └── gremlin-proxy/
├── eventhub/                 # Azure Event Hub sources
├── dataverse/                # Microsoft Dataverse sources
├── kubernetes/               # Kubernetes API sources
└── Makefile                  # Root build configuration
```

## Key Source Types

### Relational Database Sources (`relational/`)
- **Debezium Reactivator**: Java-based CDC using Debezium
- **SQL Proxy**: Direct SQL database monitoring
- Supports PostgreSQL, MySQL, SQL Server, Oracle

### Cloud Sources
- **CosmosDB**: Azure Cosmos DB change feed integration
- **EventHub**: Azure Event Hub message streaming
- **Dataverse**: Microsoft Dataverse entity monitoring

### Infrastructure Sources
- **Kubernetes**: Pod, service, and resource monitoring
- Custom resource definitions and operators

## Build and Development

### Building All Sources
```bash
# Build all source containers
make docker-build

# Build debug versions
make docker-build-debug

# Build specific source type
make -C relational docker-build
```

### Testing
```bash
# Run all source tests
make test

# Test specific source
make -C cosmosdb test

# Integration tests (may require external dependencies)
make test-integration
```

### Linting
```bash
# Lint all sources
make lint-check

# Language-specific linting
make -C relational lint-check  # Java (checkstyle, spotbugs)
```

## Development Guidelines

### Java Sources (Debezium-based)

#### Project Structure
```
debezium-reactivator/
├── pom.xml                    # Maven configuration
├── src/main/java/
│   ├── io/drasi/source/      # Main source code
│   └── resources/            # Configuration files
└── Dockerfile.default        # Container build
```

#### Maven Patterns
```xml
<!-- Use Drasi parent POM -->
<parent>
    <groupId>io.drasi</groupId>
    <artifactId>drasi-parent</artifactId>
    <version>1.0</version>
</parent>

<!-- Key dependencies -->
<dependency>
    <groupId>io.debezium</groupId>
    <artifactId>debezium-embedded</artifactId>
</dependency>
```

#### Debezium Integration
```java
// Source connector pattern
public class DrasiSourceConnector extends SourceConnector {
    
    @Override
    public void start(Map<String, String> props) {
        // Initialize Debezium engine
        engine = DebeziumEngine.create(ChangeEventFormat.of(Connect.class))
            .using(props)
            .notifying(this::handleChangeEvent)
            .build();
    }
    
    private void handleChangeEvent(ChangeEvent<SourceRecord> event) {
        // Process change and send to Drasi
        DrasiChangeEvent drasiEvent = convertTodrasi(event);
        publisher.publish(drasiEvent);
    }
}
```

### Rust Sources (Shared Components)

#### Cargo Configuration
```toml
[package]
name = "change-dispatcher"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
drasi-comms-abstractions = { path = "../../infrastructure/comms-abstractions" }
```

#### Change Event Processing
```rust
use drasi_comms_abstractions::{ChangeEvent, Publisher};

#[async_trait]
pub trait ChangeDispatcher {
    async fn dispatch(&self, event: ChangeEvent) -> Result<(), Error>;
}

pub struct DefaultDispatcher {
    publisher: Arc<dyn Publisher>,
}

impl ChangeDispatcher for DefaultDispatcher {
    async fn dispatch(&self, event: ChangeEvent) -> Result<(), Error> {
        self.publisher.publish(&event).await
    }
}
```

### Go Sources (Kubernetes)

#### Project Structure
```
kubernetes-reactivator/
├── main.go                   # Entry point
├── go.mod                   # Go modules
├── internal/
│   ├── controller/          # Kubernetes controller logic
│   ├── watcher/            # Resource watching
│   └── transformer/        # Event transformation
└── Dockerfile.default      # Container build
```

#### Kubernetes Client Patterns
```go
// Use controller-runtime for Kubernetes integration
import (
    "sigs.k8s.io/controller-runtime/pkg/client"
    "sigs.k8s.io/controller-runtime/pkg/controller"
    "sigs.k8s.io/controller-runtime/pkg/source"
)

func (r *PodReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // Get the pod
    pod := &corev1.Pod{}
    err := r.Get(ctx, req.NamespacedName, pod)
    
    // Transform to Drasi change event
    changeEvent := transformPodToChangeEvent(pod)
    
    // Publish to Drasi
    return ctrl.Result{}, r.publisher.Publish(changeEvent)
}
```

## Configuration Patterns

### Environment Variables
```bash
# Common source configuration
SOURCE_NAME=my-source
SOURCE_TYPE=postgresql
CONNECTION_STRING=postgresql://user:pass@host:5432/db

# Debezium-specific
DEBEZIUM_CONNECTOR_CLASS=io.debezium.connector.postgresql.PostgresConnector
DEBEZIUM_OFFSET_STORAGE=io.debezium.storage.file.FileOffsetStorage

# Kubernetes-specific  
NAMESPACE=default
RESOURCE_TYPES=pods,services,deployments
```

### Docker Configuration
```dockerfile
# Multi-stage builds for optimization
FROM maven:3.8-openjdk-17 AS build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim
COPY --from=build target/app.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Testing Approach

### Unit Tests
```java
// Java testing with JUnit
@Test
public void testChangeEventConversion() {
    SourceRecord record = createTestRecord();
    DrasiChangeEvent event = converter.convert(record);
    
    assertThat(event.getEventType()).isEqualTo(EventType.INSERT);
    assertThat(event.getData()).containsKey("id");
}
```

```rust
// Rust testing
#[tokio::test]
async fn test_change_dispatch() {
    let mock_publisher = MockPublisher::new();
    let dispatcher = DefaultDispatcher::new(Arc::new(mock_publisher));
    
    let event = ChangeEvent::new(/* test data */);
    let result = dispatcher.dispatch(event).await;
    
    assert!(result.is_ok());
}
```

### Integration Tests
- Test with real database instances
- Use Docker Compose for dependencies
- Validate end-to-end change flow
- Test connection resilience and retry logic

## Common Tasks

### Adding a New Source Type
1. Choose appropriate technology stack
2. Create project structure following existing patterns
3. Implement change detection logic
4. Add configuration and environment handling
5. Implement Drasi change event transformation
6. Add comprehensive tests
7. Update build configuration
8. Document connection requirements

### Debugging Source Issues
1. Check source logs for connection errors
2. Validate configuration and credentials
3. Test change detection in isolation
4. Verify Drasi event format compliance
5. Check network connectivity and permissions

### Performance Optimization
1. Optimize change event batching
2. Implement proper connection pooling
3. Add metrics and monitoring
4. Tune polling intervals and buffer sizes

## External Dependencies

- **Target Systems**: Databases, message queues, APIs being monitored
- **Drasi Platform**: Query containers and change processing pipeline
- **Infrastructure**: Kubernetes, Docker, networking
- **Monitoring**: Metrics collection and alerting systems

## Source-Specific Notes

### Database Sources
- Require proper permissions for change data capture
- May need database-specific configuration
- Consider replication lag and transaction boundaries

### Cloud Sources
- Handle authentication and token refresh
- Implement proper rate limiting
- Consider regional availability and failover

### Kubernetes Sources
- Require appropriate RBAC permissions
- Handle cluster upgrades and API changes
- Consider resource filtering and performance impact