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