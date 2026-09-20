.PHONY: default docker-build kind-load k3d-load install-dependencies test lint-check test-state-integration package image-test delivery-test

IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
TAG_SUFFIX ?=
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max
BUILD_CONFIG ?= default
PYTHON_VERSION ?= 3.12

ifneq ($(BUILD_CONFIG), default)
	override DOCKER_TAG_VERSION := $(DOCKER_TAG_VERSION)-$(BUILD_CONFIG)
endif

ifneq ($(TAG_SUFFIX),)
	override DOCKER_TAG_VERSION := $(DOCKER_TAG_VERSION)$(TAG_SUFFIX)
endif

IMAGE := $(IMAGE_PREFIX)/reaction-dapr-agent-router:$(DOCKER_TAG_VERSION)

default: docker-build

docker-build:
	docker buildx build . --build-context reaction_sdk=../../sdk/python -f Dockerfile.$(BUILD_CONFIG) -t $(IMAGE) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE) --name $(if $(CLUSTER_NAME),$(CLUSTER_NAME),kind)

k3d-load:
	k3d image import $(IMAGE) -c $(if $(CLUSTER_NAME),$(CLUSTER_NAME),k3s-default)

install-dependencies:
	uv sync --locked --python $(PYTHON_VERSION) --group dev --group test

test:
	uv run --locked --python $(PYTHON_VERSION) --group test pytest

lint-check:
	uv run --locked --python $(PYTHON_VERSION) --group dev ruff check src tests

test-state-integration:
	@set -eu; \
	project="drasi-router-state-$$(date +%s)-$$$$"; \
	trap 'docker compose -p "$$project" -f tests/state-runtime/compose.yaml down --volumes' EXIT; \
	trap 'exit 130' INT; \
	trap 'exit 143' TERM; \
	docker compose -p "$$project" -f tests/state-runtime/compose.yaml up --wait --wait-timeout 90 --quiet-pull; \
	export DAPR_HTTP_ENDPOINT="http://$$(docker compose -p "$$project" -f tests/state-runtime/compose.yaml port dapr 3500)"; \
	export DAPR_GRPC_ENDPOINT="$$(docker compose -p "$$project" -f tests/state-runtime/compose.yaml port dapr 50001)"; \
	export DRASI_ROUTER_TEST_STATE_STORE=router-state; \
	uv run --locked --python $(PYTHON_VERSION) --group test pytest -q tests/test_state_integration.py

package:
	uv build

image-test:
	python3 tests/smoke_image.py '$(IMAGE)'

delivery-test:
	python3 tests/smoke_delivery.py '$(IMAGE)'
