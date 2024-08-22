# Understanding the drasi-platform repo code organization

This document describes the high-level organization of code for the `drasi-platform` repository. The goal of this document is to capture most of the important details, not every single thing will be described here.

In general you should ask for guidance before creating a new top-level folder in the repo. There is usually a better place to put something.

## Root folders

| Folder     | Description                                                                           |
| ---------- | --------------------------------------------------------------------------------------|
| `cli/`   | The Drasi CLI tool |
| `control-planes/` | The Drasi Management API and control planes |
| `dev-tools/`      | Dev tools and IDE extensions |
| `e2e-tests/`      | End to end test scenarios that run within a sand-boxed Kind cluster |
| `infrastructure/` | Shared libraries | 
| `query-container/` | The services that make up a query container | 
| `reactions/` | The Reactions that ship by default with Drasi | 
| `sources/` | The Sources that ship by default with Drasi | 

