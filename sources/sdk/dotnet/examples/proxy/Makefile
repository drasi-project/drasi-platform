.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
default: docker-build

docker-build:
	docker build . -t my-proxy

kind-load:
	kind load docker-image my-proxy --name $(CLUSTER_NAME)

k3d-load: CLUSTER_NAME=k3s-default
k3d-load:
	k3d image import my-proxy -c $(CLUSTER_NAME)