kind load docker-image project-drasi/source-cosmosdb-reactivator
kind load docker-image project-drasi/source-debezium-reactivator
kind load docker-image project-drasi/source-kubernetes-reactivator
kind load docker-image project-drasi/source-otel-reactivator
kind load docker-image project-drasi/source-m365-reactivator
kind load docker-image project-drasi/source-change-dispatcher
kind load docker-image project-drasi/source-change-svc
kind load docker-image project-drasi/source-query-api
kind load docker-image project-drasi/source-gremlin-proxy
kind load docker-image project-drasi/source-sql-proxy
kind load docker-image project-drasi/source-passthru-proxy
kind load docker-image project-drasi/source-eventhub-reactivator
kind load docker-image project-drasi/source-eventhub-proxy
kind load docker-image project-drasi/source-dataverse-reactivator
kind load docker-image project-drasi/source-dataverse-proxy

@REM # Query Container
kind load docker-image project-drasi/query-container-publish-api
kind load docker-image project-drasi/query-container-query-host
kind load docker-image project-drasi/query-container-view-svc

@REM # Reactions
kind load docker-image project-drasi/reaction-debug
kind load docker-image project-drasi/reaction-signalr
kind load docker-image project-drasi/reaction-eventgrid
kind load docker-image project-drasi/reaction-performance
kind load docker-image project-drasi/reaction-graphql
kind load docker-image project-drasi/reaction-storedproc
kind load docker-image project-drasi/reaction-gremlin
kind load docker-image project-drasi/reaction-debezium
kind load docker-image project-drasi/reaction-result
kind load docker-image project-drasi/reaction-dataverse

@REM # Control plane
kind load docker-image project-drasi/api
kind load docker-image project-drasi/kubernetes-provider

