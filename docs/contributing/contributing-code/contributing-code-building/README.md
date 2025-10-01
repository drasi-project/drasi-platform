# Building the code

Drasi uses several Makefile to build the repository and automate most common repository tasks.


## Building the components

### CLI

The CLI tool will be required in your development workflow to manage a Drasi instance that you may want to test against. You can either [build it from source](../../../../cli/) or [download a pre-built binary](https://github.com/drasi-project/drasi-platform/releases).

### Services

All the services in Drasi are distributed as container images.  The Makefile in the root directory of the repo will build all of the services, or you can build the `Control Plane`, `Query Container`, `Sources` and `Reactions` separately using the Makefile in each subdirectory. 

#### Steps to build

You can use the `docker-build` target to build the container images.

```sh
make docker-build
```

If you wish to override the default (latest) image tag, you can use the `DOCKER_TAG_VERSION` parameter as follows:

```sh
make docker-build DOCKER_TAG_VERSION="v1"
```

If you wish to build images that support opening a terminal, you can use the `docker-build BUILD_CONFIG=debug` target to build the images.
```sh
make docker-build BUILD_CONFIG=debug
```

If you are using Kind in your development workflow, you can load the built images to your kind cluster using the `kind-load` target:

```sh
make kind-load
```

If you are using a different cluster name from the default (kind), you can override it with the `CLUSTER_NAME` parameter as follows:

```sh
make kind-load CLUSTER_NAME="my-cluster"
```

If you are using k3d in your development workflow, you can load the built images to your k3d cluster using the `k3d-load` target:

```sh
make k3d-load
```

If you are using a different cluster name from the default (k3s-default), you can override it with the `CLUSTER_NAME` parameter as follows:

```sh
make k3d-load CLUSTER_NAME="my-cluster"
```

#### Steps to run

To run Drasi with the container images you've built and loaded locally, use the following command. Replace `--version latest` with your `--version DOCKER_TAG_VERSION` if you used one when building the images.

```sh
drasi init --local --version latest
```

All components for Drasi live in the `drasi-system` namespace.

```sh
kubectl get pods --namespace drasi-system
```

To uninstall any previous version of Drasi using the following command.

```sh
drasi uninstall
```

To do a force cleanup, you can also manually remove all entities deployed in the `drasi-system` namespace of your cluster.

```sh
kubectl delete namespace drasi-system --force
```

#### Control Plane

The control plane consists of 
- The Management API, which is the backend with which the CLI communicates.
- The Resource Provider, which is responsible for managing all the resources (Sources, Reactions & Continuous Queries) within the Drasi instance.

The [Control Planes folder](../../../../control-planes/) contains a Makefile for building these container images.


#### Query Container

The Query Container consists of the various services that host continuous queries.  These are all distributed as container images.

The [Query Container folder](../../../../query-container/) contains a Makefile for building these container images.

#### Sources

The [Sources folder](../../../../sources/) contains a Makefile for building the container images of all the Sources that ship with Drasi.

#### Reactions

The [Reactions folder](../../../../reactions/) contains a Makefile for building the container images of all the Reactions that ship with Drasi.



## Troubleshooting and getting help

You might encounter error messages while running various `make` commands due to missing dependencies. Review the [prerequisites](./../contributing-code-prerequisites/) page for installation instructions.
