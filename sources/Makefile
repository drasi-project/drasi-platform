.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION?=latest

default: docker-build

docker-build:
	docker build cosmosdb/cosmosdb-ffcf-reactivator -t $(IMAGE_PREFIX)/source-cosmosdb-reactivator:$(DOCKER_TAG_VERSION)
	docker build relational/debezium-reactivator -t $(IMAGE_PREFIX)/source-debezium-reactivator:$(DOCKER_TAG_VERSION)
	docker build ../ -f shared/change-dispatcher/Dockerfile -t $(IMAGE_PREFIX)/source-change-dispatcher:$(DOCKER_TAG_VERSION)
	docker build ../ -f shared/change-router/Dockerfile -t $(IMAGE_PREFIX)/source-change-router:$(DOCKER_TAG_VERSION)
	docker build shared/query-api -t $(IMAGE_PREFIX)/source-query-api:$(DOCKER_TAG_VERSION)
	docker build cosmosdb/gremlin-proxy -t $(IMAGE_PREFIX)/source-gremlin-proxy:$(DOCKER_TAG_VERSION)
	docker build relational/sql-proxy -t $(IMAGE_PREFIX)/source-sql-proxy:$(DOCKER_TAG_VERSION)
	docker build eventhub/eventhub-reactivator -t $(IMAGE_PREFIX)/source-eventhub-reactivator:$(DOCKER_TAG_VERSION)
	docker build eventhub/eventhub-proxy -t $(IMAGE_PREFIX)/source-eventhub-proxy:$(DOCKER_TAG_VERSION)
	docker build dataverse/dataverse-reactivator -t $(IMAGE_PREFIX)/source-dataverse-reactivator:$(DOCKER_TAG_VERSION)
	docker build dataverse/dataverse-proxy -t $(IMAGE_PREFIX)/source-dataverse-proxy:$(DOCKER_TAG_VERSION)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/source-cosmosdb-reactivator:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-debezium-reactivator:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-change-dispatcher:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-change-router:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-query-api:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-gremlin-proxy:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-sql-proxy:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-eventhub-reactivator:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-eventhub-proxy:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-dataverse-reactivator:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)
	kind load docker-image $(IMAGE_PREFIX)/source-dataverse-proxy:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	echo "No tests to run yet"
