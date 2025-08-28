# Drasi CLI - GitHub Copilot Instructions

## Project Overview

The Drasi CLI is a command-line interface tool written in Go that allows users to interact with Drasi instances. It provides commands for managing sources, continuous queries, reactions, and Drasi deployments.

## Technology Stack

- **Language**: Go 1.22+
- **CLI Framework**: Cobra (spf13/cobra)
- **UI Components**: Bubble Tea for interactive elements
- **Dependencies**: Kubernetes client libraries, Helm SDK, Docker client

## Project Structure

```
cli/
├── main.go              # Entry point
├── cmd/                 # Cobra command definitions
├── api/                 # API client implementations
├── config/              # Configuration management
├── installers/          # Deployment logic (Kind, Docker, K8s)
├── output/              # Output formatting utilities
├── sdk/                 # Drasi SDK for Go
└── Makefile            # Build configuration
```

## Key Components

### Commands (`cmd/`)
- Source management (create, delete, list, describe)
- Continuous query operations
- Reaction management
- Environment deployment (install, uninstall)

### Installers (`installers/`)
- **DockerizedDeployer**: Kind-based local development
- **KubernetesDeployer**: Production Kubernetes deployment
- **AzureDeployer**: Azure-specific deployment

### SDK (`sdk/`)
- Go SDK for interacting with Drasi APIs
- Resource definitions and client libraries

## Build and Development

### Building
```bash
# Build for current platform
make build

# Build for all platforms
make all

# Format and vet
make fmt
make vet
```

### Testing
```bash
# Run tests
go test ./...

# Run specific package tests
go test ./cmd/...
```

## Development Guidelines

### Code Style
- Follow standard Go conventions (gofmt, go vet)
- Use cobra.Command for all CLI commands
- Implement proper error handling with user-friendly messages
- Use the output package for consistent formatting

### CLI Patterns
- Commands should be hierarchical (drasi source create, drasi query list)
- Use flags for optional parameters, arguments for required ones
- Provide help text and examples for all commands
- Support both interactive and non-interactive modes

### Error Handling
```go
// Good: User-friendly error messages
if err != nil {
    return fmt.Errorf("failed to create source %s: %w", name, err)
}

// Use output package for consistent formatting
output.Error("Failed to connect to cluster")
output.Success("Source created successfully")
```

### Configuration
- Use the config package for persistent settings
- Support multiple contexts/environments
- Store kubeconfig and connection details securely

## Common Tasks

### Adding a New Command
1. Create command file in `cmd/` directory
2. Implement cobra.Command with proper flags and args
3. Add to parent command in init() function
4. Implement business logic with proper error handling
5. Use output package for user feedback

### Working with Kubernetes
```go
// Use existing patterns from installers/
clientset, err := kubernetes.NewForConfig(config)
if err != nil {
    return fmt.Errorf("failed to create kubernetes client: %w", err)
}
```

### API Integration
- Use the SDK for Drasi API operations
- Handle authentication and connection management
- Implement proper retry logic for network operations

## External Dependencies

- **Kubernetes API**: Cluster management and resource operations
- **Helm**: Chart management and deployment
- **Docker**: Container operations for local development
- **Dapr**: Service mesh communication

## Testing Approach

- Unit tests for business logic
- Integration tests with test clusters
- Use test files (test-*.yaml) for sample resources
- Mock external dependencies where appropriate

## Build Configuration

The Makefile supports:
- Cross-platform builds (Windows, macOS, Linux)
- Multiple architectures (amd64, arm64)
- Version injection during build
- Development vs release builds