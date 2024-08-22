# Contributing to Drasi code

This guide includes background and tips for working on the Drasi codebase.


## Local development setup

These steps guide you through the process of setting up a self contained local environment to build and test Drasi.

1. The get started, first ensure that you [Install Prerequisites](../contributing-code-prerequisites/)
1. Next, create a Kind cluster to host your local Drasi instance
    ```sh
    kind create cluster
    ```
1. Follow the guide to [Build the code](../contributing-code-building/).  Be sure to load the built images to Kind as described.
1. Use the CLI to install Drasi using the `--local` flag. This sets up a Drasi instance that uses locally cached container images instead of trying to pull them from a registry. This is useful for local development workflows.
    ```sh
    drasi init --local
    ```

Once you have this setup, you are in a position to make code changes to any of the components, [rebuild](../contributing-code-building/) and test them in your local Kind cluster.


## Validating changes

Be sure the read the [testing guide](../contributing-code-tests/) to be confident your changes are not breaking anything.

