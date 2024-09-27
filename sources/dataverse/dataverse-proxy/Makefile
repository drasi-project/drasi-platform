.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load --cache-to type=inline

default: docker-build

docker-build:
	docker buildx build . -t $(IMAGE_PREFIX)/source-dataverse-proxy:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/source-dataverse-proxy:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	@echo "No tests to run yet"

lint-check:
	@echo "No lint checks to run yet"