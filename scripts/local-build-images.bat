@REM # Sources
docker build ../sources/cosmosdb/cosmosdb-ffcf-reactivator -t drasi-project/source-cosmosdb-reactivator
docker build ../sources/debezium/debezium-reactivator -t drasi-project/source-debezium-reactivator
docker build ../sources/kubernetes/kubernetes-reactivator -t drasi-project/source-kubernetes-reactivator
docker build ../sources/open-telemetry/otel-reactivator -t drasi-project/source-otel-reactivator
docker build ../sources/onedrive/m365-reactivator -t drasi-project/source-m365-reactivator
docker build ../ -f ../sources/shared/change-dispatcher/Dockerfile -t drasi-project/source-change-dispatcher
docker build ../ -f ../sources/shared/change-router/Dockerfile -t drasi-project/source-change-router
docker build ../sources/shared/query-api -t drasi-project/source-query-api
docker build ../sources/cosmosdb/gremlin-proxy -t drasi-project/source-gremlin-proxy
docker build ../sources/generic/sql-proxy -t drasi-project/source-sql-proxy
docker build ../sources/kubernetes/passthru-proxy -t drasi-project/source-passthru-proxy
docker build ../sources/eventhub/eventhub-reactivator -t drasi-project/source-eventhub-reactivator
docker build ../sources/eventhub/eventhub-proxy -t drasi-project/source-eventhub-proxy
docker build ../sources/dataverse/dataverse-reactivator -t drasi-project/source-dataverse-reactivator
docker build ../sources/dataverse/dataverse-proxy -t drasi-project/source-dataverse-proxy

@REM # Query Container
docker build ../query-container/publish-api -t drasi-project/query-container-publish-api
docker build ../query-container/query-host -t drasi-project/query-container-query-host
docker build ../query-container/view-svc -t drasi-project/query-container-view-svc

@REM # Reactions
docker build ../reactions/debug/debug-reaction -t drasi-project/reaction-debug
docker build ../reactions/signalr/signalr-reaction -t drasi-project/reaction-signalr
docker build ../reactions/eventgrid/eventgrid-reaction -t drasi-project/reaction-eventgrid
docker build ../reactions/storedproc/storedproc-reaction -t drasi-project/reaction-storedproc
docker build ../reactions/gremlin/gremlin-reaction -t drasi-project/reaction-gremlin
docker build ../reactions/debezium/debezium-reaction -t drasi-project/reaction-debezium
docker build ../reactions/result/result-reaction -t drasi-project/reaction-result
docker build ../reactions/dataverse/dataverse-reaction -t drasi-project/reaction-dataverse

@REM # Control plane
docker build ../control-planes -f ../control-planes/mgmt_api/Dockerfile  -t drasi-project/api
docker build ../control-planes -f ../control-planes/kubernetes_provider/Dockerfile  -t drasi-project/kubernetes-provider

