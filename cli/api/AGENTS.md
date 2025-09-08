# AGENTS.md: `cli/api` Directory

This directory contains the core Go data structures that represent Drasi resources and manifests. These types are used by the CLI to parse resource definition files and to serialize/deserialize data when communicating with the Drasi Management API.

## Files

### `manifest.go`

-   **Purpose**: Defines the structure for a Drasi resource manifest, which is how resources are defined in YAML files. It provides a utility function to read and parse one or more YAML documents from a byte slice.
-   **Key Components**:
    -   `Manifest` (struct): Represents a single resource definition from a YAML file. It includes fields like `Kind`, `ApiVersion`, `Name`, and `Spec`. This is the primary structure used when parsing files for `drasi apply` or `drasi delete`.
    -   `ReadManifests([]byte)` (function): A parser that takes raw byte data (from a YAML file) and decodes it into a slice of `Manifest` structs, correctly handling multi-document YAML files.

### `resource.go`

-   **Purpose**: Defines the generic structure for a Drasi resource as it is represented by the Drasi Management API.
-   **Key Components**:
    -   `Resource` (struct): A generic representation of any Drasi resource (Source, Reaction, Query, etc.). It contains the `Id`, the configuration (`Spec`), and the current operational state (`Status`) of the resource. This struct is used for handling responses from the management API, such as for the `drasi describe` command.
