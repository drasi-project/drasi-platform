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

test:
	$(MAKE) -C publish-api $(MAKECMDGOALS)
	$(MAKE) -C query-host $(MAKECMDGOALS)
	$(MAKE) -C view-svc $(MAKECMDGOALS)
