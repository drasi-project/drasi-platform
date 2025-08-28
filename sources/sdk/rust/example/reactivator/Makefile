.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
default: docker-build

docker-build:
	docker build . -t my-reactivator

kind-load:
	kind load docker-image my-reactivator --name $(CLUSTER_NAME)

k3d-load:
ifeq ($(CLUSTER_NAME),kind)
	k3d image import my-reactivator --name k3s-default
else
	k3d image import my-reactivator --name $(CLUSTER_NAME)
endif
