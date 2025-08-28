.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
default: docker-build

docker-build:
	docker build . -t my-proxy

kind-load:
	kind load docker-image my-proxy --name $(CLUSTER_NAME)

k3d-load:
ifeq ($(CLUSTER_NAME),kind)
	k3d image import my-proxy --name k3s-default
else
	k3d image import my-proxy --name $(CLUSTER_NAME)
endif
