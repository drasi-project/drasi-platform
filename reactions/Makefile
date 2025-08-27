.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION?=latest

default: docker-build

docker-build:
	$(MAKE) -C platform/debug-reaction $(MAKECMDGOALS)
	$(MAKE) -C signalr/signalr-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/eventgrid-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/storagequeue-reaction $(MAKECMDGOALS)
	$(MAKE) -C dapr/sync-statestore $(MAKECMDGOALS)
	$(MAKE) -C sql/storedproc-reaction $(MAKECMDGOALS)
	$(MAKE) -C gremlin/gremlin-reaction $(MAKECMDGOALS)
	$(MAKE) -C debezium/debezium-reaction $(MAKECMDGOALS)
	$(MAKE) -C platform/result-reaction $(MAKECMDGOALS)
	$(MAKE) -C power-platform/dataverse/dataverse-reaction $(MAKECMDGOALS)

kind-load:
	$(MAKE) -C platform/debug-reaction $(MAKECMDGOALS)
	$(MAKE) -C signalr/signalr-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/eventgrid-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/storagequeue-reaction $(MAKECMDGOALS)
	$(MAKE) -C dapr/sync-statestore $(MAKECMDGOALS)
	$(MAKE) -C sql/storedproc-reaction $(MAKECMDGOALS)
	$(MAKE) -C gremlin/gremlin-reaction $(MAKECMDGOALS)
	$(MAKE) -C debezium/debezium-reaction $(MAKECMDGOALS)
	$(MAKE) -C platform/result-reaction $(MAKECMDGOALS)
	$(MAKE) -C power-platform/dataverse/dataverse-reaction $(MAKECMDGOALS)

k3d-load:
	$(MAKE) -C platform/debug-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C signalr/signalr-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C azure/eventgrid-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C azure/storagequeue-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C dapr/sync-statestore $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C sql/storedproc-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C gremlin/gremlin-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C debezium/debezium-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C platform/result-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C power-platform/dataverse/dataverse-reaction $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}

test:
	$(MAKE) -C platform/debug-reaction $(MAKECMDGOALS)
	$(MAKE) -C signalr/signalr-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/eventgrid-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/storagequeue-reaction $(MAKECMDGOALS)
	$(MAKE) -C dapr/sync-statestore $(MAKECMDGOALS)
	$(MAKE) -C sql/storedproc-reaction $(MAKECMDGOALS)
	$(MAKE) -C gremlin/gremlin-reaction $(MAKECMDGOALS)
	$(MAKE) -C debezium/debezium-reaction $(MAKECMDGOALS)
	$(MAKE) -C platform/result-reaction $(MAKECMDGOALS)
	$(MAKE) -C power-platform/dataverse/dataverse-reaction $(MAKECMDGOALS)

lint-check:
	$(MAKE) -C platform/debug-reaction $(MAKECMDGOALS)
	$(MAKE) -C signalr/signalr-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/eventgrid-reaction $(MAKECMDGOALS)
	$(MAKE) -C azure/storagequeue-reaction $(MAKECMDGOALS)
	$(MAKE) -C dapr/sync-statestore $(MAKECMDGOALS)
	$(MAKE) -C sql/storedproc-reaction $(MAKECMDGOALS)
	$(MAKE) -C gremlin/gremlin-reaction $(MAKECMDGOALS)
	$(MAKE) -C debezium/debezium-reaction $(MAKECMDGOALS)
	$(MAKE) -C platform/result-reaction $(MAKECMDGOALS)
	$(MAKE) -C power-platform/dataverse/dataverse-reaction $(MAKECMDGOALS)