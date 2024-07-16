kind load docker-image project-drasi/source-cosmosdb-reactivator
kind load docker-image project-drasi/source-debezium-reactivator
kind load docker-image project-drasi/source-kubernetes-reactivator
kind load docker-image project-drasi/source-change-dispatcher
kind load docker-image project-drasi/source-change-svc
kind load docker-image project-drasi/source-query-api
kind load docker-image project-drasi/source-gremlin-proxy
kind load docker-image project-drasi/source-sql-proxy
kind load docker-image project-drasi/source-eventhub-reactivator
kind load docker-image project-drasi/source-eventhub-proxy
kind load docker-image project-drasi/source-dataverse-reactivator
kind load docker-image project-drasi/source-dataverse-proxy


# Query Container
kind load docker-image drasi-project/query-container-publish-api
kind load docker-image drasi-project/query-container-query-host
kind load docker-image drasi-project/query-container-view-svc

# Reactions

kind load docker-image project-drasi/reaction-debug
kind load docker-image project-drasi/reaction-signalr
kind load docker-image project-drasi/reaction-eventgrid
kind load docker-image project-drasi/reaction-storedproc
kind load docker-image project-drasi/reaction-gremlin
kind load docker-image project-drasi/reaction-debezium
kind load docker-image project-drasi/reaction-result
kind load docker-image project-drasi/reaction-dataverse


# Control plane
kind load docker-image drasi-project/api
kind load docker-image drasi-project/kubernetes-provider

