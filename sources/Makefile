.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest

default: docker-build

docker-build:
	$(MAKE) -C cosmosdb/cosmosdb-ffcf-reactivator $(MAKECMDGOALS)
	$(MAKE) -C cosmosdb/gremlin-proxy $(MAKECMDGOALS)
	$(MAKE) -C relational/debezium-reactivator $(MAKECMDGOALS)
	$(MAKE) -C relational/sql-proxy $(MAKECMDGOALS)
	$(MAKE) -C shared/change-dispatcher $(MAKECMDGOALS)
	$(MAKE) -C shared/change-router $(MAKECMDGOALS)
	$(MAKE) -C shared/query-api $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-reactivator $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-proxy $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-reactivator $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-proxy $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-reactivator $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-proxy $(MAKECMDGOALS)

kind-load:
	$(MAKE) -C cosmosdb/cosmosdb-ffcf-reactivator $(MAKECMDGOALS)
	$(MAKE) -C cosmosdb/gremlin-proxy $(MAKECMDGOALS)
	$(MAKE) -C relational/debezium-reactivator $(MAKECMDGOALS)
	$(MAKE) -C relational/sql-proxy $(MAKECMDGOALS)
	$(MAKE) -C shared/change-dispatcher $(MAKECMDGOALS)
	$(MAKE) -C shared/change-router $(MAKECMDGOALS)
	$(MAKE) -C shared/query-api $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-reactivator $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-proxy $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-reactivator $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-proxy $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-reactivator $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-proxy $(MAKECMDGOALS)

k3d-load:
	$(MAKE) -C cosmosdb/cosmosdb-ffcf-reactivator $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C cosmosdb/gremlin-proxy $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C relational/debezium-reactivator $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C relational/sql-proxy $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C shared/change-dispatcher $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C shared/change-router $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C shared/query-api $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C eventhub/eventhub-reactivator $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C eventhub/eventhub-proxy $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C dataverse/dataverse-reactivator $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C dataverse/dataverse-proxy $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C kubernetes/kubernetes-reactivator $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}
	$(MAKE) -C kubernetes/kubernetes-proxy $(MAKECMDGOALS) CLUSTER_NAME=$${CLUSTER_NAME:-k3s-default}

test:
	$(MAKE) -C cosmosdb/cosmosdb-ffcf-reactivator $(MAKECMDGOALS)
	$(MAKE) -C cosmosdb/gremlin-proxy $(MAKECMDGOALS)
	$(MAKE) -C relational/debezium-reactivator $(MAKECMDGOALS)
	$(MAKE) -C relational/sql-proxy $(MAKECMDGOALS)
	$(MAKE) -C shared/change-dispatcher $(MAKECMDGOALS)
	$(MAKE) -C shared/change-router $(MAKECMDGOALS)
	$(MAKE) -C shared/query-api $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-reactivator $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-proxy $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-reactivator $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-proxy $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-reactivator $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-proxy $(MAKECMDGOALS)

lint-check:
	$(MAKE) -C cosmosdb/cosmosdb-ffcf-reactivator $(MAKECMDGOALS)
	$(MAKE) -C cosmosdb/gremlin-proxy $(MAKECMDGOALS)
	$(MAKE) -C relational/debezium-reactivator $(MAKECMDGOALS)
	$(MAKE) -C relational/sql-proxy $(MAKECMDGOALS)
	$(MAKE) -C shared/change-dispatcher $(MAKECMDGOALS)
	$(MAKE) -C shared/change-router $(MAKECMDGOALS)
	$(MAKE) -C shared/query-api $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-reactivator $(MAKECMDGOALS)
	$(MAKE) -C eventhub/eventhub-proxy $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-reactivator $(MAKECMDGOALS)
	$(MAKE) -C dataverse/dataverse-proxy $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-reactivator $(MAKECMDGOALS)
	$(MAKE) -C kubernetes/kubernetes-proxy $(MAKECMDGOALS)
