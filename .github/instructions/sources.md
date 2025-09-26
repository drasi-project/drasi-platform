---
applyTo: "sources/**/*"
---

# Sources - GitHub Copilot Instructions

## Project Overview

Sources are connectors that monitor various data systems for changes and feed those changes into the Drasi platform. This directory contains multiple source implementations across different technology stacks, each designed to integrate with specific types of data systems.
Each technology stack has it's own SDK, in the "sdk" folder, and this should be used to implement new sources in that stack. Each SDK also contains example directories.

## Source Structure

Each source implementation provides 2 unique services:
- Reactivator: For listening to the changes of the source system
- Proxy: For getting the current state of the data in a source system

In addition, every source will also run these standard services under the "shared" folder:
- change-router: Receives changes from the reactivator and routes them to specific query containers by publishing them to the change-dispatcher
- change-dispatcher: Invokes the publish API on the query container with the incoming change
- query-api: Exposes an API to get the current data set

## Common Tasks

### Adding a New Source Type
1. Choose appropriate technology stack
2. Create project structure following existing patterns
   1. reactivator service
   2. proxy service
3. Implement change detection logic in the reactivator
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

### Azure Managed Identity
For Azure based services, implement the managed identity using the "Azure.Identity" library and "DefaultAzureCredential". Reference the EventGrid reaction for an example.

### AWS IRSA
For AWS based services, use the EventBridge reaction as an example of how to support AWS auth.

### Database Sources
- Require proper permissions for change data capture
- May need database-specific configuration
- Consider replication lag and transaction boundaries

