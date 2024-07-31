# Building the code

Drasi uses several Makefile to build the repository and automate most common repository tasks.


## Building the components

### CLI

The CLI tool will be required in your development workflow to manage a Drasi instance that you may want to test against. You can either [build it from source](../../../cli/) or [download a pre-built binary](https://github.com/drasi-project/drasi-platform/releases).

### Services

All the services in Drasi are distributed as container images.  The Makefile in the root directory of the repo will build all of the services, or you can build the `Control Plane`, `Query Container`, `Sources` and `Reactions` separately using the Makefile in each subdirectory. 

You can use the `docker-build` target to build the container images.

```sh
make docker-build
```

If you wish to override the default (latest) image tag, you can use the `DOCKER_TAG_VERSION` parameter as follows:

```sh
make docker-build DOCKER_TAG_VERSION="v1"
```

If you are using Kind in your development workflow, you can load the built images to your kind cluster using the `kind-load` target:

```sh
make kind-load
```

If you are using a different cluster name from the default (kind), you can override it with the `CLUSTER_NAME` parameter as follows:

```sh
make kind-load CLUSTER_NAME="my-cluster"
```

#### Control Plane

The control plane consists of 
- The Management API, which is the backend with which the CLI communicates.
- The Resource Provider, which is responsible for managing all the resources (Sources, Reactions & Continuous Queries) within the Drasi instance.

The [Control Planes folder](../../../control-planes/) contains a Makefile for building these container images.


#### Query Container

The Query Container consists of the various services that host continuous queries.  These are all distributed as container images.

The [Query Container folder](../../../query-container/) contains a Makefile for building these container images.

#### Sources

The [Sources folder](../../../sources/) contains a Makefile for building the container images of all the Sources that ship with Drasi.

#### Reactions

The [Reactions folder](../../../reactions/) contains a Makefile for building the container images of all the Reactions that ship with Drasi.



## Troubleshooting and getting help

You might encounter error messages while running various `make` commands due to missing dependencies. Review the [prerequisites](./../contributing-code-prerequisites/) page for installation instructions.