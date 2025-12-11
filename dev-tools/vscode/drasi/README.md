# Drasi - Visual Studio Code Extension

The **Drasi** extension provides powerful tools for managing and debugging Drasi resources directly within Visual Studio Code. It simplifies workflows for developers working with YAML-based configurations, continuous queries, sources, reactions, and more.

## Features

- **Workspace Explorer**: Browse and manage YAML files containing Drasi resources like Continuous Queries, Sources, and Reactions.
- **Drasi Explorer**: View and interact with live Drasi resources in your Kubernetes cluster.
- **CodeLens Support**: Apply or debug resources directly from YAML files using inline actions.
- **Query Debugger**: Debug Continuous Queries with real-time results displayed in a webview.
- **Resource Management**: Apply, delete, or watch resources with ease.
- **YAML Intellisense**: Get auto-completion, validation, and documentation for Drasi YAML resources.

## YAML Intellisense and Validation

The extension provides comprehensive YAML intellisense based on JSON schemas derived from the Drasi Management API specification:

### Auto-completion
- Type `kind:` to see available resource types (ContinuousQuery, Source, Reaction)
- Get field suggestions as you type
- Auto-complete for enum values like `queryLanguage`, `mode`, `identity` kinds

### Validation
- Real-time validation against the Drasi API schema
- Red squiggles for invalid configurations
- Required field warnings
- Pattern validation for resource names (Kubernetes-style)

### Hover Documentation
- Hover over any field to see its description
- View allowed values for enums
- Get inline help for complex configurations

### Syntax Highlighting
- Standard YAML syntax highlighting maintained
- Intellisense provides validation and auto-completion for Cypher queries

### Supported Resource Types

**ContinuousQuery**:
- Full schema support for query specifications
- Cypher and GQL query language support
- Source subscriptions with middleware pipelines
- Cross-source joins configuration
- Materialized view settings with retention policies

**Source**:
- Provider-specific configurations
- Multiple identity types (ConnectionString, Entra ID, AWS IAM, etc.)
- Service configurations and endpoints

**Reaction**:
- Query subscriptions
- Provider configurations
- Identity and authentication settings

## Getting Started

### Installation

1. Install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).
2. Install the [Red Hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) (recommended as a dependency).
3. Ensure you have the following prerequisites:
   - Kubernetes CLI (`kubectl`) installed and configured.
   - Access to a Kubernetes cluster running Drasi.

### Usage

1. Open a workspace containing YAML files with Drasi resources.
2. Use the **Workspace Explorer** to browse and manage your YAML files.
3. Use the **Drasi Explorer** to interact with live resources in your Kubernetes cluster.
4. Right-click on resources in the explorer or use CodeLens actions to apply, debug, or validate resources.
5. Start typing in a YAML file - intellisense will automatically activate for Drasi resources.

### Example YAML File

See `example-drasi-resources.yaml` in the extension directory for a complete example demonstrating:
- ContinuousQuery with Cypher query, joins, and middleware
- Source with identity configuration
- Reaction with webhook settings

## Development

To build and test the extension locally:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Use the `Run Extension` launch configuration in Visual Studio Code to start a development instance.

## Feedback and Contributions

We welcome feedback and contributions! Please open issues or submit pull requests on our [GitHub repository](https://github.com/drasi-project/drasi-platform).

## License

This extension is licensed under the [Apache License 2.0](LICENSE).