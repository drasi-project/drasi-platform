# Sources
docker build ../sources/cosmosdb/cosmosdb-ffcf-reactivator -t drasi-project/source-cosmosdb-reactivator
docker build ../sources/relational/debezium-reactivator -t drasi-project/source-debezium-reactivator
docker build ../sources/kubernetes/kubernetes-reactivator -t drasi-project/source-kubernetes-reactivator
docker build ../sources/open-telemetry/otel-reactivator -t drasi-project/source-otel-reactivator
docker build ../sources/onedrive/m365-reactivator -t drasi-project/source-m365-reactivator
docker build ../ -f ../sources/shared/change-dispatcher/Dockerfile -t drasi-project/source-change-dispatcher
docker build ../ -f ../sources/shared/change-svc/Dockerfile -t drasi-project/source-change-svc
docker build ../sources/shared/query-api -t drasi-project/source-query-api
docker build ../sources/cosmosdb/gremlin-source-proxy -t drasi-project/source-gremlin-proxy
docker build ../sources/relational/sql-proxy -t drasi-project/source-sql-proxy
docker build ../sources/kubernetes/passthru-proxy -t drasi-project/source-passthru-proxy
docker build ../sources/eventhub/eventhub-reactivator -t drasi-project/source-eventhub-reactivator
docker build ../sources/eventhub/eventhub-proxy -t drasi-project/source-eventhub-proxy
docker build ../sources/dataverse/dataverse-reactivator -t drasi-project/source-dataverse-reactivator
docker build ../sources/dataverse/dataverse-proxy -t drasi-project/source-dataverse-proxy

# Query Container
docker build ../query-container/publish-api -t drasi-project/query-container-publish-api
docker build ../query-container/query-host -t drasi-project/query-container-query-host
docker build ../query-container/view-svc -t drasi-project/query-container-view-svc

# Reactions
docker build ../reactions/debug-reaction -t drasi-project/reaction-debug
docker build ../reactions/signalr-reaction -t drasi-project/reaction-signalr
docker build ../reactions/eventgrid-reaction -t drasi-project/reaction-eventgrid
docker build ../reactions/performance-reaction -t drasi-project/reaction-performance
docker build ../reactions/graphql-reaction -t drasi-project/reaction-graphql
docker build ../reactions/storedproc-reaction -t drasi-project/reaction-storedproc
docker build ../reactions/gremlin-reaction -t drasi-project/reaction-gremlin
docker build ../reactions/debezium-reaction -t drasi-project/reaction-debezium
docker build ../reactions/result-reaction -t drasi-project/reaction-result
docker build ../reactions/dataverse-reaction -t drasi-project/reaction-dataverse

# Control plane
docker build ../control-planes -f ../control-planes/mgmt_api/Dockerfile  -t drasi-project/api
docker build ../control-planes -f ../control-planes/kubernetes_provider/Dockerfile  -t drasi-project/kubernetes-provider

