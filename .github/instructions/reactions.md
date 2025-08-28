---
applyTo: "reactions/**/*"
---

# Reactions - GitHub Copilot Instructions

## Project Overview

Reactions are components that respond to changes in continuous query results. They take action when query result sets are updated, such as sending notifications, updating external systems, or triggering workflows. This directory contains multiple reaction implementations across different technology stacks. Each technology stack has it's own SDK, in the "sdk" folder, and this should be used to implement new reactions in that stack. Each SDK also contains example directories.

## Project Structure

```
reactions/
├── signalr/                  # Real-time web notifications
│   └── signalr-reaction/     # C#/.NET SignalR implementation
├── http/                     # HTTP webhook reactions
├── azure/                    # Azure-specific reactions
├── aws/                      # AWS-specific reactions
├── power-platform/           # Microsoft Power Platform
├── platform/                 # Platform-specific reactions
├── sql/                      # Database update reactions
├── debezium/                 # Database integration
├── gremlin/                  # Graph database reactions
├── dapr/                     # Dapr-based reactions
├── sdk/                      # Shared SDK components
└── Makefile                  # Root build configuration
```

## Development Guidelines

### C#/.NET Reactions (SignalR)

#### Project Structure
```
signalr-reaction/
├── signalr-reaction.sln      # Solution file
├── Drasi.Reactions.SignalR/  # Main project
│   ├── Program.cs           # Entry point
│   ├── Services/           # Business logic
│   ├── Models/             # Data models
│   └── *.csproj           # Project file
└── Drasi.Reactions.SignalR.Tests/  # Unit tests
```


### TypeScript/Node.js Reactions

#### Project Structure
```
web-reaction/
├── package.json            # NPM configuration
├── tsconfig.json          # TypeScript config
├── src/
│   ├── index.ts           # Entry point
│   ├── handlers/          # Event handlers
│   ├── services/          # Business logic
│   └── types/             # Type definitions
└── Dockerfile.default    # Container build
```


## Common Tasks

### Adding a New Reaction Type
1. Choose appropriate technology stack
2. Create project structure following existing patterns
3. Implement QueryReaction interface
4. Add configuration and environment handling
5. Implement error handling and retry logic
6. Add comprehensive tests
7. Update build configuration
8. Document setup and usage

### Integrating with External Systems
1. Research target system API and authentication
2. Implement client libraries or use existing SDKs
3. Handle rate limiting and throttling
4. Implement proper error handling
5. Add configuration for connection details
6. Test with real target system

### Azure Managed Identity
For Azure based services, implement the managed identity using the "Azure.Identity" library and "DefaultAzureCredential". Reference the EventGrid reaction for an example.

### AWS IRSA
For AWS based services, use the EventBridge reaction as an example of how to support AWS auth.

### Debugging Reaction Issues
1. Check reaction logs for processing errors
2. Validate configuration and credentials
3. Test external system connectivity
4. Verify query result format compliance
5. Check authentication and permissions

