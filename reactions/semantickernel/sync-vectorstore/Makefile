.PHONY: default docker-build kind-load k3d-load test clean

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load

default: docker-build

# Build the Docker image for the reaction
docker-build:
	docker buildx build . --no-cache -t $(IMAGE_PREFIX)/reaction-sync-semantickernel-vectorstore:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS) -f Dockerfile

# Load the built image into the specified Kind cluster
kind-load:
	kind load docker-image $(IMAGE_PREFIX)/reaction-sync-semantickernel-vectorstore:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

# Load the built image into the specified k3d cluster
k3d-load: CLUSTER_NAME=k3s-default
k3d-load:
	k3d image import $(IMAGE_PREFIX)/reaction-sync-semantickernel-vectorstore:$(DOCKER_TAG_VERSION) -c $(CLUSTER_NAME)

# Run unit tests
test:
	dotnet test sync-semantickernel-vectorstore.sln

lint-check:
	@echo "No lint checks to run yet"

# Clean build artifacts
clean:
	dotnet clean sync-semantickernel-vectorstore.sln
	rm -rf */bin */obj
	rm -rf Drasi.Reactions.SyncSemanticKernelVectorStore.Tests/TestResults