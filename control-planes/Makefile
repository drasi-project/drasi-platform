.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION?=latest

default: docker-build

docker-build:
	docker build . -f ../control-planes/mgmt_api/Dockerfile  -t $(IMAGE_PREFIX)/api:$(DOCKER_TAG_VERSION)
	docker build . -f ../control-planes/kubernetes_provider/Dockerfile  -t $(IMAGE_PREFIX)/kubernetes-provider:$(DOCKER_TAG_VERSION)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/api:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/kubernetes-provider:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	cargo test --manifest-path ./mgmt_api/Cargo.toml
	cargo test --manifest-path ./kubernetes_provider/Cargo.toml
