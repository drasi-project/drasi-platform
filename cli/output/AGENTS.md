# AGENTS.md: `cli/output` Directory

This directory is responsible for handling all user-facing output from the Drasi CLI, particularly for long-running or multi-step operations like `drasi init`. It provides an abstraction that can produce rich, interactive terminal UIs when run in a TTY environment, and fall back to simple, plain-text logging when the output is being piped or redirected.

## Core Abstraction

### `interface.go`

-   **Purpose**: Defines the core `TaskOutput` interface that all CLI commands use to report progress and status to the user.
-   **Key Components**:
    -   `TaskOutput` (interface): A contract for displaying hierarchical task progress. It includes methods like `AddTask`, `SucceedTask`, `FailTask`, and `GetChildren` to create nested tasks.
    -   `NewTaskOutput()` (factory function): This is the main entry point. It intelligently detects if the CLI is running in an interactive terminal.
        -   If **yes**, it returns the rich `taskOutputBubbleTea` implementation.
        -   If **no** (e.g., in a CI/CD pipeline), it returns the simple `taskOutputNoTerm` implementation.

## Implementations

### `task_output.go`

-   **Purpose**: Provides a rich, interactive terminal UI for displaying task progress. This is the implementation used in a standard terminal session.
-   **Key Components**:
    -   `taskOutputBubbleTea` (struct): The main model that implements the `TaskOutput` interface.
    -   **Technology**: It is built using the `Bubble Tea` TUI (Text-based User Interface) framework.
    -   **Features**:
        -   Displays spinners for tasks that are in progress.
        -   Uses color-coded symbols (✓, ✗, ℹ) to indicate task success, failure, or information.
        -   Supports a hierarchical/nested view for sub-tasks.
        -   Handles asynchronous updates via a message queue (`chan`).

### `task_output_noterm.go`

-   **Purpose**: Provides a simple, plain-text logger for non-interactive environments.
-   **Key Components**:
    -   `taskOutputNoTerm` (struct): A struct that implements the `TaskOutput` interface.
    -   **Functionality**: It simply prints status updates to standard output as single lines prefixed with `[SUCCESS]`, `[FAILED]`, `[INFO]`, etc. This ensures that logs are clean and easily parsable by other tools.

## Subdirectories

### `query_results/`

-   **Purpose**: Contains the specific UI components for the `drasi watch` command, which displays a real-time, continuously updating table of a query's result set. This is also built using the `Bubble Tea` framework.
