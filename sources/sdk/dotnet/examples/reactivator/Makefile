.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
default: docker-build

docker-build:
	docker build . -t my-reactivator

kind-load:
	kind load docker-image my-reactivator --name $(CLUSTER_NAME)