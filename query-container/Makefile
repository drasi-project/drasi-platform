.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION?=latest

default: docker-build

docker-build:
	docker build publish-api -t $(IMAGE_PREFIX)/query-container-publish-api:$(DOCKER_TAG_VERSION)
	docker build query-host -t $(IMAGE_PREFIX)/query-container-query-host:$(DOCKER_TAG_VERSION)
	docker build view-svc -t $(IMAGE_PREFIX)/query-container-view-svc:$(DOCKER_TAG_VERSION)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/query-container-publish-api:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/query-container-query-host:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/query-container-view-svc:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	cargo test --all
