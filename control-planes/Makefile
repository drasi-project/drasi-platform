.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest

default: docker-build

docker-build:
	$(MAKE) -C mgmt_api $(MAKECMDGOALS)
	$(MAKE) -C kubernetes_provider $(MAKECMDGOALS)

kind-load:
	$(MAKE) -C mgmt_api $(MAKECMDGOALS)
	$(MAKE) -C kubernetes_provider $(MAKECMDGOALS)

k3d-load: CLUSTER_NAME=k3s-default
k3d-load:
	$(MAKE) -C mgmt_api $(MAKECMDGOALS)
	$(MAKE) -C kubernetes_provider $(MAKECMDGOALS)

test:
	$(MAKE) -C mgmt_api $(MAKECMDGOALS)
	$(MAKE) -C kubernetes_provider $(MAKECMDGOALS)

lint-check:
	$(MAKE) -C mgmt_api $(MAKECMDGOALS)
	$(MAKE) -C kubernetes_provider $(MAKECMDGOALS)
