# Drasi CLI

The Drasi CLI is used to deploy a Drasi instance and manage the various resources, such as Sources, Reactions and Continuous queries within it.

## Prerequisites

- [Go](https://golang.org/doc/install)
- Make

### Editors

You can choose whichever editor you are most comfortable for working on Go code. If you don't have a code editor set up for Go, we recommend VS Code. The experience with VS Code is high-quality and approachable for newcomers.

Alternatively, you can choose whichever editor you are most comfortable for working on Go code. Feel free to skip this section if you want to make another choice.

- [Visual Studio Code](https://code.visualstudio.com/)
- [Go extension](https://marketplace.visualstudio.com/items?itemName=golang.go)

Install both of these and then follow the steps in the *Quick Start* for the Go extension.

The extension will walk you through an automated install of some additional tools that match your installed version of Go.


## Building the CLI

You can use the Makefile to build the CLI for all supported platforms.

```sh
make
```

This will output the following artifacts organized by platform:

```
bin/windows-x64/drasi.exe
bin/linux-x64/drasi
bin/linux-arm64/drasi
bin/darwin-x64/drasi
bin/darwin-arm64/drasi
```

## Installing a local build


### MacOS

You can use the Makefile to install a local build of Drasi. By default this will install to `/usr/local/bin/drasi`. You may also need to specify `sudo` depending on the destination and its permissions.

```sh
sudo make install
```

### Windows

You can use the Makefile to install a local build of Drasi. By default this will install to `Program Files\drasi`. You may also need to run the command in an elavated terminal.

```sh
make install
```

## Documentation

For detailed CLI documentation, including command references and guides, see the [CLI documentation](../docs/cli/README.md).
