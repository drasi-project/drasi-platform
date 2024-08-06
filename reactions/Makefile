.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION?=latest

default: docker-build

docker-build:
	docker build platform/debug-reaction -t $(IMAGE_PREFIX)/reaction-debug:$(DOCKER_TAG_VERSION)
	docker build signalr/signalr-reaction -t $(IMAGE_PREFIX)/reaction-signalr:$(DOCKER_TAG_VERSION)
	docker build azure/eventgrid-reaction -t $(IMAGE_PREFIX)/reaction-eventgrid:$(DOCKER_TAG_VERSION)
	docker build azure/storagequeue-reaction -t $(IMAGE_PREFIX)/reaction-storagequeue:$(DOCKER_TAG_VERSION)
	docker build sql/storedproc-reaction -t $(IMAGE_PREFIX)/reaction-storedproc:$(DOCKER_TAG_VERSION)
	docker build gremlin/gremlin-reaction -t $(IMAGE_PREFIX)/reaction-gremlin:$(DOCKER_TAG_VERSION)
	docker build debezium/debezium-reaction -t $(IMAGE_PREFIX)/reaction-debezium:$(DOCKER_TAG_VERSION)
	docker build platform/result-reaction -t $(IMAGE_PREFIX)/reaction-result:$(DOCKER_TAG_VERSION)
	docker build power-platform/dataverse/dataverse-reaction -t $(IMAGE_PREFIX)/reaction-dataverse:$(DOCKER_TAG_VERSION)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/reaction-debug:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-signalr:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-eventgrid:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-storagequeue:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-storedproc:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-gremlin:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-debezium:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-result:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/reaction-dataverse:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	echo "No tests to run"
