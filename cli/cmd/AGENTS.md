# AGENTS.md: `cli/cmd` Directory

This directory contains the implementation for each command available in the Drasi CLI (e.g., `apply`, `list`, `init`). It uses the `Cobra` library to structure the commands, arguments, and flags. Each file typically defines a single top-level command and its associated logic.

The general pattern for each command is:
1.  Define the `cobra.Command` struct with its `Use`, `Short`, and `Long` descriptions.
2.  Implement the `RunE` function, which contains the core logic for the command.
3.  Inside `RunE`, parse flags, load the current environment configuration (`registry.LoadCurrentRegistration`), create a platform client (`sdk.NewPlatformClient`), and execute the desired action.

## Files

### `root.go`

-   **Purpose**: This is the entry point for the CLI. It creates the root `drasi` command and attaches all other commands (from the other files in this directory) to it.
-   **Key Components**:
    -   `MakeRootCommand()`: Initializes the main `drasi` command and registers all subcommands. It also defines persistent flags like `--namespace` that are available globally.

### Resource Management Commands

-   **`apply.go`**: Implements the `drasi apply` command. It loads resource manifests from files (`-f` flag) and sends them to the Drasi Management API to be created or updated.
-   **`delete.go`**: Implements the `drasi delete` command. It can delete resources specified by `[kind] [name]` arguments or from manifest files (`-f` flag).
-   **`describe.go`**: Implements the `drasi describe` command. It fetches and displays the detailed configuration (`spec`) and current `status` of a single, specified resource.
-   **`list.go`**: Implements the `drasi list` command. It retrieves a list of resources of a given kind and displays their status in a table format.
-   **`wait.go`**: Implements the `drasi wait` command. It blocks until specified resources become fully operational or a timeout is reached. This is useful for scripting.

### Installation & Environment Commands

-   **`init.go`**: Implements the `drasi init` command. This is a complex command responsible for installing Drasi into a Kubernetes cluster or a local Docker container. It handles various flags for customization (`--local`, `--version`, `--registry`, `--manifest`, etc.).
-   **`uninstall.go`**: Implements the `drasi uninstall` command. It removes a Drasi installation by deleting its Kubernetes namespace and can optionally remove Dapr as well.
-   **`env.go`**: Implements the `drasi env` command and its subcommands (`all`, `current`, `delete`, `kube`, `use`). It manages saved connection configurations for different Drasi environments.
-   **`namespace.go`**: Implements the `drasi namespace` command and its subcommands (`get`, `set`, `list`). It manages the default Kubernetes namespace that the CLI targets.

### Utility & Debugging Commands

-   **`watch.go`**: Implements the `drasi watch` command. It connects to a query's real-time view service and displays a continuously updating table of its result set.
-   **`tunnel.go`**: Implements the `drasi tunnel` command. It creates a local port forward to a service running inside the Kubernetes cluster, enabling local debugging.
-   **`secret.go`**: Implements the `drasi secret` command and its subcommands (`set`, `delete`). It provides a way to manage Kubernetes secrets for storing sensitive data.
-   **`version.go`**: Implements the `drasi version` command. It's a simple command that prints the compiled-in version of the CLI.
-   **`utils.go`**: Contains helper functions used by other commands in this directory, notably `loadManifests`, which is responsible for reading resource definitions from files, URLs, or standard input.
