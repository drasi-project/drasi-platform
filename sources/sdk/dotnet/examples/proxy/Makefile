.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
default: docker-build

docker-build:
	docker build . -t my-proxy

kind-load:
	kind load docker-image my-proxy --name $(CLUSTER_NAME)