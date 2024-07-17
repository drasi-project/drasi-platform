@REM # Sources
docker build ../sources/cosmosdb/cosmosdb-ffcf-reactivator -t project-drasi/source-cosmosdb-reactivator
docker build ../sources/relational/debezium-reactivator -t project-drasi/source-debezium-reactivator
docker build ../ -f ../sources/shared/change-dispatcher/Dockerfile -t project-drasi/source-change-dispatcher
docker build ../ -f ../sources/shared/change-svc/Dockerfile -t project-drasi/source-change-svc
docker build ../sources/shared/query-api -t project-drasi/source-query-api
docker build ../sources/cosmosdb/gremlin-proxy -t project-drasi/source-gremlin-proxy
docker build ../sources/relational/sql-proxy -t project-drasi/source-sql-proxy
docker build ../sources/eventhub/eventhub-reactivator -t project-drasi/source-eventhub-reactivator
docker build ../sources/eventhub/eventhub-proxy -t project-drasi/source-eventhub-proxy
docker build ../sources/dataverse/dataverse-reactivator -t project-drasi/source-dataverse-reactivator
docker build ../sources/dataverse/dataverse-proxy -t project-drasi/source-dataverse-proxy

@REM # Query Container
docker build ../query-container/publish-api -t drasi-project/query-container-publish-api
docker build ../query-container/query-host -t drasi-project/query-container-query-host
docker build ../query-container/view-svc -t drasi-project/query-container-view-svc

@REM # Reactions

docker build ../reactions/platform/debug-reaction -t project-drasi/reaction-debug
docker build ../reactions/signalr/signalr-reaction -t project-drasi/reaction-signalr
docker build ../reactions/azure/eventgrid-reaction -t project-drasi/reaction-eventgrid
docker build ../reactions/azure/storagequeue-reaction -t project-drasi/reaction-storagequeue
docker build ../reactions/sql/storedproc-reaction -t project-drasi/reaction-storedproc
docker build ../reactions/gremlin/gremlin-reaction -t project-drasi/reaction-gremlin
docker build ../reactions/debezium/debezium-reaction -t project-drasi/reaction-debezium
docker build ../reactions/platform/result-reaction -t project-drasi/reaction-result
docker build ../reactions/power-platform/dataverse/dataverse-reaction -t project-drasi/reaction-dataverse

@REM # Control plane
docker build ../control-planes -f ../control-planes/mgmt_api/Dockerfile  -t drasi-project/api
docker build ../control-planes -f ../control-planes/kubernetes_provider/Dockerfile  -t drasi-project/kubernetes-provider

