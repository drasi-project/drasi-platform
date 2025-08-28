.PHONY: default docker-build kind-load generate-types

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max
BUILD_CONFIG ?= default
TAG_SUFFIX ?=

ifneq ($(BUILD_CONFIG), default)
	DOCKER_TAG_VERSION := ${DOCKER_TAG_VERSION}-$(BUILD_CONFIG)
endif

ifneq ($(TAG_SUFFIX),)
	DOCKER_TAG_VERSION := ${DOCKER_TAG_VERSION}$(TAG_SUFFIX)
endif

default: docker-build

docker-build:
	docker buildx build . -f Dockerfile.$(BUILD_CONFIG) -t $(IMAGE_PREFIX)/reaction-storage-queue:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/reaction-storage-queue:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

k3d-load:
	k3d image import $(IMAGE_PREFIX)/reaction-storage-queue:$(DOCKER_TAG_VERSION) -c ${CLUSTER_NAME:-k3s-default}

test:
	@echo "No tests to run yet"

lint-check:
	@echo "No lint checks to run yet"

generate-types:
	npm run clean --prefix ../../../typespec
	npm run build ./output-unpacked --prefix ../../../typespec
	quicktype --src-lang schema -l cs -o Models/Unpacked.generated.cs ../../../typespec/output-unpacked/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reactions.StorageQueue.Models.Unpacked