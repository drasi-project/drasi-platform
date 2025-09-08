.PHONY: default docker-build kind-load

default: docker-build

docker-build:
	docker build . -t my-proxy

kind-load:
	kind load docker-image my-proxy --name $(if $(CLUSTER_NAME),$(CLUSTER_NAME),kind)

k3d-load:
	k3d image import my-proxy -c $(if $(CLUSTER_NAME),$(CLUSTER_NAME),k3s-default)
