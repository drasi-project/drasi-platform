# Drasi Platform - GitHub Copilot Instructions

## Repository Overview

Drasi is a data processing platform that simplifies detecting changes in data and taking immediate action. This is a monorepo containing multiple projects across different technology stacks.

## Architecture

Drasi operates through three main components:
- **Sources**: Connect to data repositories to monitor logs and feeds for changing data
- **Continuous Queries**: Apply criteria and conditions using graph queries to identify significant changes
- **Reactions**: Trigger meaningful responses based on query result updates

## Repository Structure

```
drasi-platform/
├── cli/                    # Go - Command line interface tool
├── control-planes/         # Rust - Management API and resource providers  
├── query-container/        # Rust - Services for hosting continuous queries
├── sources/               # Mixed - Data connectors (Java, Rust, Go)
├── reactions/             # Mixed - Response mechanisms (C#, TypeScript, Go)
├── infrastructure/        # Rust - Shared communication libraries
├── e2e-tests/            # JavaScript - End-to-end test scenarios
└── docs/                 # Documentation
```

## Technology Stacks

- **Go**: CLI, some sources and reactions
- **Rust**: Control planes, query container, infrastructure components
- **Java**: Debezium-based database sources
- **C#/.NET**: SignalR and other reactions
- **JavaScript/TypeScript**: E2E tests, some reactions

## Build System

The repository uses Make as the primary build system:

```bash
# Build all components
make docker-build

# Run all tests
make test

# Lint all code
make lint-check

# Load images to Kind cluster
make kind-load
```

Each subdirectory has its own Makefile that gets called by the root Makefile.

## Development Guidelines

### Project-Specific Instructions
Each major project area has its own `copilot-instructions.md` file with detailed guidance:
- `cli/copilot-instructions.md` - Go CLI development
- `control-planes/copilot-instructions.md` - Rust API development
- `query-container/copilot-instructions.md` - Rust query services
- `sources/copilot-instructions.md` - Multi-language source connectors
- `reactions/copilot-instructions.md` - Multi-language reaction handlers
- `infrastructure/copilot-instructions.md` - Rust shared libraries
- `e2e-tests/copilot-instructions.md` - JavaScript testing

### General Principles
- Follow the existing patterns and conventions in each project
- Use Docker for consistent development environments
- Write tests for new functionality
- Follow the technology-specific style guides for each language
- Ensure compatibility with Kubernetes deployment model

### Documentation
- API documentation lives in `docs/`
- Each component should have a README.md
- Use inline code comments for complex business logic
- Document any external dependencies or setup requirements

## Common Commands

```bash
# Development workflow
make docker-build          # Build all container images
make test                  # Run all tests
make lint-check           # Check code style and lint
make kind-load            # Load images to local Kind cluster

# Working with specific components
make -C cli docker-build  # Build only CLI
make -C sources test      # Test only sources
```

## External Dependencies

- **Kubernetes**: Deployment target
- **Docker**: Container runtime
- **MongoDB**: API data storage
- **Redis**: Caching and pub/sub
- **Dapr**: Service communication
- Various database systems (PostgreSQL, CosmosDB, etc.) for sources