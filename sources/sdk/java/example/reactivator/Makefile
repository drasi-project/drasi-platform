.PHONY: default docker-build kind-load

default: docker-build

docker-build:
	docker build . -t my-reactivator

kind-load:
	kind load docker-image my-reactivator --name $(if $(CLUSTER_NAME),$(CLUSTER_NAME),kind)

k3d-load:
	k3d image import my-reactivator -c $(if $(CLUSTER_NAME),$(CLUSTER_NAME),k3s-default)
