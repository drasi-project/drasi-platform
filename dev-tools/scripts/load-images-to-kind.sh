kind load docker-image drasi-project/source-cosmosdb-reactivator
kind load docker-image drasi-project/source-debezium-reactivator
kind load docker-image drasi-project/source-kubernetes-reactivator
kind load docker-image drasi-project/source-otel-reactivator
kind load docker-image drasi-project/source-m365-reactivator
kind load docker-image drasi-project/source-change-dispatcher
kind load docker-image drasi-project/source-change-svc
kind load docker-image drasi-project/source-query-api
kind load docker-image drasi-project/source-gremlin-proxy
kind load docker-image drasi-project/source-sql-proxy
kind load docker-image drasi-project/source-passthru-proxy
kind load docker-image drasi-project/source-eventhub-reactivator
kind load docker-image drasi-project/source-eventhub-proxy
kind load docker-image drasi-project/source-dataverse-reactivator
kind load docker-image drasi-project/source-dataverse-proxy

# Query Container
kind load docker-image drasi-project/query-container-publish-api
kind load docker-image drasi-project/query-container-query-host
kind load docker-image drasi-project/query-container-view-svc

# Reactions
kind load docker-image drasi-project/reaction-debug
kind load docker-image drasi-project/reaction-signalr
kind load docker-image drasi-project/reaction-eventgrid
kind load docker-image drasi-project/reaction-performance
kind load docker-image drasi-project/reaction-graphql
kind load docker-image drasi-project/reaction-storedproc
kind load docker-image drasi-project/reaction-gremlin
kind load docker-image drasi-project/reaction-debezium
kind load docker-image drasi-project/reaction-result
kind load docker-image drasi-project/reaction-dataverse

# Control plane
kind load docker-image drasi-project/api
kind load docker-image drasi-project/kubernetes-provider

