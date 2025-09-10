# AGENTS.md: `cli/config` Directory

This directory contains global configuration for the Drasi CLI application.

## Files

### `config.go`

-   **Purpose**: Defines and initializes global, package-level variables for the CLI. These variables are typically set at build time to inject versioning and other important information into the binary.
-   **Key Components**:
    -   `Version` (string): Stores the version of the Drasi CLI. It defaults to `"latest"` if not set during the build process. This is the version displayed by the `drasi version` command and used by default in `drasi init`.
    -   `Registry` (string): Stores the default container registry path to pull Drasi images from. It defaults to `"ghcr.io"` if not set during the build. This is used by the `drasi init` command.
