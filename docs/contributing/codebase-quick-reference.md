# Drasi Platform - Codebase Quick Reference

This document provides a quick reference guide for developers working on the Drasi platform.

## Project Overview

**Drasi** is a data processing platform that simplifies detecting changes in data and taking immediate action. It provides real-time actionable insights without traditional data processing overhead.

- **Website**: https://drasi.io
- **License**: Apache 2.0
- **Status**: CNCF Sandbox Project

## Architecture Components

### 1. Sources
Monitor data repositories for changes without copying data to a central data lake.

**Location**: `/sources/`

**Available Sources**:
- CosmosDB
- Dataverse
- EventHub
- Kubernetes
- Relational (Debezium-based)

**Technology**: Mixed (language depends on source type)

### 2. Continuous Queries
Evaluate incoming data changes using Cypher Query Language to identify significant changes.

**Location**: `/query-container/`

**Sub-components**:
- `query-host/` - Core query evaluation engine
- `view-svc/` - View service managing result sets
- `publish-api/` - API for publishing changes

**Technology**: Rust (Cargo workspace)

### 3. Reactions
Trigger meaningful responses based on continuous query result updates.

**Location**: `/reactions/`

**Available Reactions**:
- AWS
- Azure
- Dapr
- Debezium
- Gremlin
- HTTP
- MCP (Model Context Protocol)
- Platform
- Power Platform
- SignalR
- SQL
- Sync-VectorStore

**Technology**: Primarily .NET/C# with some Go

### 4. CLI
Command-line tool for managing Drasi resources.

**Location**: `/cli/`

**Technology**: Go 1.22+

**Key Libraries**:
- Cobra (CLI framework)
- Bubble Tea (TUI framework)
- Helm v3 (Kubernetes deployments)
- Kubernetes client-go

### 5. Control Planes
Management API and control plane implementations.

**Location**: `/control-planes/`

**Technology**: Mixed

## Technology Stack

### Languages
- **Rust**: Query container components
- **Go**: CLI, some infrastructure
- **C#/.NET**: Most reactions, some sources
- **TypeScript**: Some tooling and SDKs

### Infrastructure
- **Kubernetes**: Primary deployment platform
- **Docker**: Containerization
- **Helm**: Package management

### Key Dependencies
- Cypher Query Language support
- Kubernetes API
- Helm charts
- Various database connectors

## Build System

### Root Makefile Targets

```bash
make docker-build    # Build all Docker images
make kind-load       # Load images into Kind cluster
make k3d-load        # Load images into K3D cluster
make test            # Run all tests
make lint-check      # Run linters on all components
```

### Component-Level Builds

Each major component has its own Makefile:
```bash
cd <component-directory>
make build           # Build the component
make test            # Run tests
make docker-build    # Build Docker image
```

### Go Components

```bash
go build ./...       # Build
go test ./...        # Test
go fmt ./...         # Format
go vet ./...         # Lint
```

### Rust Components

```bash
cargo build          # Build
cargo test           # Test
cargo fmt            # Format
cargo clippy         # Lint
```

### .NET Components

```bash
dotnet build         # Build
dotnet test          # Test
dotnet format        # Format
```

## Testing

### Test Organization

- **Unit Tests**: Within component directories
- **Integration Tests**: Component-specific
- **E2E Tests**: `/e2e-tests/` directory
- **Kind Cluster**: E2E tests run in sandboxed Kind cluster

### Running Tests

```bash
# All tests
make test

# Component-specific
cd <component>
make test

# E2E tests
cd e2e-tests
# Follow component-specific instructions
```

## Documentation Structure

### Local Documentation
- `/docs/contributing/` - Contribution guides
- `/docs/README.md` - Documentation overview
- Component READMEs - Component-specific docs

### External Documentation
- https://drasi.io - Main documentation site
- https://github.com/drasi-project/docs - Documentation repo
- https://github.com/drasi-project/community - Community resources

## Development Workflow

### Prerequisites
See: `/docs/contributing/contributing-code/contributing-code-prerequisites/`

### Building the Repo
See: `/docs/contributing/contributing-code/contributing-code-building/`

### Running Tests
See: `/docs/contributing/contributing-code/contributing-code-tests/`

### Code Organization
See: `/docs/contributing/contributing-code/contributing-code-organization/`

## Common Patterns

### Source Pattern
1. Monitor data source for changes
2. Convert changes to standard format
3. Publish to query containers
4. Handle connection lifecycle

### Query Evaluation Pattern
1. Receive change events
2. Evaluate against Cypher queries
3. Update materialized views
4. Notify subscribed reactions

### Reaction Pattern
1. Subscribe to query results
2. Receive change notifications
3. Transform to target format
4. Execute reaction (send notification, call API, etc.)

## Key Concepts

### Change Events
Standardized format for data changes flowing through the system.

### Continuous Queries
Queries written in Cypher that are continuously evaluated against incoming changes.

### Materialized Views
Cached query results that are incrementally updated.

### Result Sets
Output of continuous queries, updated in real-time.

## Issue Investigation

### Framework
See: `/docs/contributing/technical-investigation-framework.md`

### Example Investigation
See: `/docs/contributing/example-technical-investigation.md`

### Common Issue Types

**Source Issues**:
- Connection failures
- Change detection delays
- Data mapping errors
- Schema evolution

**Query Issues**:
- Incorrect result sets
- Performance problems
- Cypher parsing errors
- Memory issues

**Reaction Issues**:
- Trigger failures
- Output formatting
- Integration errors
- Rate limiting

**CLI Issues**:
- Command errors
- Configuration problems
- API communication
- Deployment issues

## Useful Commands

### Drasi CLI

```bash
drasi apply -f <file>        # Apply resource
drasi list <resource-type>   # List resources
drasi describe <resource>    # Describe resource
drasi logs <resource>        # View logs
drasi delete <resource>      # Delete resource
```

### Kubernetes

```bash
kubectl get pods                    # List pods
kubectl logs <pod>                  # View logs
kubectl describe <resource>         # Describe resource
kubectl port-forward <svc> <port>   # Port forwarding
```

### Docker

```bash
docker build -t <name> .           # Build image
docker run <image>                 # Run container
docker logs <container>            # View logs
docker exec -it <container> sh     # Shell into container
```

## Contributing

### Before Contributing
1. Check existing issues
2. Discuss with maintainers
3. Fork repository
4. Create feature branch

### Pull Request Process
1. Write tests
2. Update documentation
3. Run linters and tests
4. Sign commits (DCO)
5. Submit PR with clear description

### Code Review
- Maintainers review all PRs
- Address feedback
- CI must pass
- Requires approval

## Getting Help

- **Discord**: https://aka.ms/drasidiscord
- **GitHub Issues**: https://github.com/drasi-project/drasi-platform/issues
- **Email**: info@drasi.io

## Security

Report security issues to: security@drasi.io
See: `/SECURITY.md`

## License

Apache 2.0 - See `/LICENSE`

## Code of Conduct

Contributor Covenant - See `/CODE_OF_CONDUCT.md`

## Quick Links

- [Getting Started Tutorial](https://drasi.io/getting-started/)
- [Documentation](https://drasi.io)
- [Good First Issues](https://github.com/drasi-project/drasi-platform/issues?q=is:issue+is:open+label:%22good+first+issue%22)
- [Triaged Issues](https://github.com/drasi-project/drasi-platform/issues?q=is%3Aissue+is%3Aopen+label%3Atriaged)
- [Community Repo](https://github.com/drasi-project/community)
- [Core Libraries](https://github.com/drasi-project/drasi-core)

## Repository Statistics

**Primary Languages**:
- Rust (Query Container)
- Go (CLI, Infrastructure)
- C# (Reactions, Sources)
- TypeScript (Tooling)

**Key Directories**:
- 8 major component areas
- 12+ reaction types
- 5+ source types
- Comprehensive E2E tests

**Development Tools**:
- Makefiles for builds
- Docker for containerization
- Kubernetes for deployment
- Helm for packaging

---

*Last Updated: 2025-11-20*
*For detailed information on specific components, see component-specific READMEs.*
