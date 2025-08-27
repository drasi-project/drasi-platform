.PHONY: default docker-build kind-load test

default: docker-build

docker-build:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

kind-load:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

k3d-load:
	$(MAKE) -C control-planes $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C query-container $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C sources $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C reactions $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}

test:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)

lint-check:
	$(MAKE) -C control-planes $(MAKECMDGOALS)
	$(MAKE) -C query-container $(MAKECMDGOALS)
	$(MAKE) -C sources $(MAKECMDGOALS)
	$(MAKE) -C reactions $(MAKECMDGOALS)