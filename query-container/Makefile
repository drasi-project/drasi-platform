.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION?=latest

default: docker-build

docker-build:
	$(MAKE) -C publish-api $(MAKECMDGOALS)
	$(MAKE) -C query-host $(MAKECMDGOALS)
	$(MAKE) -C view-svc $(MAKECMDGOALS)

kind-load:
	$(MAKE) -C publish-api $(MAKECMDGOALS)
	$(MAKE) -C query-host $(MAKECMDGOALS)
	$(MAKE) -C view-svc $(MAKECMDGOALS)

k3d-load:
	$(MAKE) -C publish-api $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C query-host $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C view-svc $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}

test:
	$(MAKE) -C publish-api $(MAKECMDGOALS)
	$(MAKE) -C query-host $(MAKECMDGOALS)
	$(MAKE) -C view-svc $(MAKECMDGOALS)

lint-check:
	$(MAKE) -C publish-api $(MAKECMDGOALS)
	$(MAKE) -C query-host $(MAKECMDGOALS)
	$(MAKE) -C view-svc $(MAKECMDGOALS)