.PHONY: default docker-build kind-load generate-types

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max

default: docker-build

docker-build:
	docker buildx build . -t $(IMAGE_PREFIX)/reaction-eventbridge:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/reaction-eventbridge:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

k3d-load: CLUSTER_NAME=k3s-default
k3d-load:
	k3d image import $(IMAGE_PREFIX)/reaction-eventbridge:$(DOCKER_TAG_VERSION) -c $(CLUSTER_NAME)

test:
	@echo "No tests to run yet"

lint-check:
	@echo "No lint checks to run yet"

generate-types:
	npm run clean --prefix ../../../typespec
	npm run build ./output-unpacked --prefix ../../../typespec
	quicktype --src-lang schema -l cs -o Models/Unpacked.generated.cs ../../../typespec/output-unpacked/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reactions.EventBridge.Models.Unpacked