# Repository Prerequisites

This page lists the prerequisites for working with the repository. The core components of Drasi are written in Rust, the CLI tool is written in Go and several Source/Reaction implementations are written in various other languages.  Specific instructions for each Source or Reaction can be found in the local readme files.

Depending on the task you need to perform, you may need to install more tools, but basic prerequisites should be sufficient for most contributors to get started.

## Operating system

We support developing on macOS, Linux and Windows with [WSL](https://docs.microsoft.com/windows/wsl/install).

## Development environment

Contributing to Drasi requires several tools to get started.

### Local installation

This is the list of core dependencies to install for the most common tasks. In general we expect all contributors to have all of these tools present:

- [Git](https://git-scm.com/downloads)
- [Rust](https://www.rust-lang.org/tools/install)
- [Go](https://golang.org/doc/install)
- [Node.js](https://nodejs.org/en/)
- [Docker](https://docs.docker.com/engine/install/)
- Make

For `make` we advice the following installation steps depending on you OS.
  
#### Linux

Install the `build-essential` package:

```bash
sudo apt-get install build-essential
```

#### Mac

Using Xcode:

```bash  
xcode-select --install
```

Using Homebrew:

```bash  
brew install make
```

### Enable Git Hooks

We use pre-commit hooks to catch some issues early, enable the local git hooks using the following commands

```
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

### Additional tools

The following tools are required depending on the task at hand.

#### Kubernetes

Currently, the only way to run Drasi is on Kubernetes. To run Drasi you will need the ability to create a Kubernetes cluster as well as to install `kubectl` to control that cluster. There are many ways to create a Kubernetes cluster that you can use for development and testing. If you don't have a preference we recommend `kind`.

- [Install kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Install Kind](https://kubernetes.io/docs/tasks/tools/#kind)

#### Troubleshooting kubernetes

You might want tools that can help debug Kubernetes problems and understand what's going on in the cluster. Here are some recommendations from the team:

- [Lens (UI for Kubernetes)](https://k8slens.dev/)
- [VS Code Kubernetes Tools](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)
- [Stern (console logging tool)](https://github.com/stern/stern#installation)


### Editors

You can choose whichever editor you are most comfortable for working on Rust code. If you don't have a code editor set up for Rust, we recommend VS Code.

Alternatively, you can choose whichever editor you are most comfortable for working on Rust code. Feel free to skip this section if you want to make another choice.

- [Visual Studio Code](https://code.visualstudio.com/)
- [Rust Analyzer extension](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)


### Drasi CLI

The Drasi CLI tool will be required in your development workflow to manage a Drasi instance that you may want to test against. You can either [build it from source](../../../cli/) or download a pre-built binary.

Download the CLI for your platform, and add it to your system path:
- [MacOS arm64](https://github.com/drasi-project/drasi-platform/releases/download/v0.1.0/drasi-darwin-arm64)
- [MacOS x64](https://github.com/drasi-project/drasi-platform/releases/download/v0.1.0/drasi-darwin-x64)
- [Windows x64](https://github.com/drasi-project/drasi-platform/releases/download/v0.1.0/drasi-windows-x64.exe)
- [Linux x64](https://github.com/drasi-project/drasi-platform/releases/download/v0.1.0/drasi-linux-x64)
- [Linux arm64](https://github.com/drasi-project/drasi-platform/releases/download/v0.1.0/drasi-linux-arm64)
