# GitHub Actions Workflows

This document describes the GitHub Actions workflows in the `.github/workflows` directory and how to trigger them.

## Workflows

### [automerge.yml](automerge.yml)
- **Purpose**: Automatically merges Renovate-generated pull requests labeled as `automerge-patch-candidate` or `automerge-minor-candidate` after a specified waiting period.
- **Trigger**: Scheduled (weekly on Wednesdays at 12:00 PM Pacific Time), or manually via navigating to the `Actions` tab and selecting the workflow.

### [build-test.yml](build-test.yml)
- **Purpose**: Builds all Drasi components including Query Container, Control Plane, Sources, Reactions, and CLI. Runs the unit tests in the `e2e-tests` directory.
- **Triggers**:
  - Pushes to `main`, `release/*`, and tags starting with `v`.
  - Pull requests targeting `main`, `feature/*`, and `release/*`.

### [devskim.yml](devskim.yml)
- **Purpose**: Runs DevSkim security analysis to detect potential security issues in the codebase.
- **Triggers**:
  - Pushes to `main`.
  - Pull requests targeting `main`.
  - Scheduled weekly (every Sunday at 00:30 UTC).
  - Only runs if the repository is `drasi-project/drasi-platform`.

### [draft-release.yml](draft-release.yml)
- **Purpose**: Builds and publishes the Drasi container images with an image prefix; drafts a GitHub release including CLI binaries and VSCode extension.
- **Triggers**:
  - Manual trigger via `workflow_dispatch` with an required input for the version tag and an optional image prefix (default value: `ghcr.io/drasi-project`).

### [lint.yml](lint.yml)
- **Purpose**: Runs linting checks to ensure code quality and consistency.
- **Triggers**:
  - Pushes and pull requests to the repository.


### [scorecard.yaml](scorecard.yaml)
- **Purpose**: Performs OpenSSF Scorecard analysis to evaluate repository security and best practices.
- **Triggers**:
  - Pushes to `main`.
  - Scheduled weekly (every Monday at 15:15 UTC).

### [vsce.yaml](vsce.yaml)
- **Purpose**: Downloads the Drasi Visual Studio Code extension from a given release and publishes it to the VS Code Marketplace.
- **Triggers**:
  - Manual trigger via `workflow_dispatch` with required inputs for the version.
- **Note**: To execute this workflow, you must set an updated `VSCE_TOKEN` secret in the `drasi-project/drasi-platform` repository.
  1. Generate a new token from the [Azure DevOps](https://dev.azure.com/azure-octo/_usersSettings/tokens). Give it a name and permission to manage `Marketplace`.
  2. Once the token is generated, copy it.
  3. Go to the `drasi-project/drasi-platform` repository settings, navigate to **Secrets and variables** > **Actions**, and update the `VSCE_TOKEN` secret with the copied token.
  4. Due to our organization policy, PATs have the expiration set to 7 days. You will need to update the `VSCE_TOKEN` secret every 7 days with a new token.


## Viewing Workflow Status

Navigate to the **Actions** tab in your repository to view the status, logs, and results of each workflow run.
