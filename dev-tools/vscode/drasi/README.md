# Drasi Dev Tools - VSCode Extension

## Building the extension from source

```bash
vsce package
code --install-extension drasi-0.0.3.vsix
```

## Installing

Download the VS Code extension from https://drasi.blob.core.windows.net/installs/drasi-0.0.3.vsix
Open the VS Code command palette and run the `Extensions: Install from VSIX` command and select the `drasi-0.0.3.vsix` from your download location.

## Usage

Once the extension is installed, the `Drasi Explorer` view should be visible in the Activity Bar.  This will scan your workspace for YAML files that contain continuous queries and enable you to execute them once off against your Drasi instance.  You will need to manually deploy any source(s) the your queries depend upon.
