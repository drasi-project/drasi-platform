az acr login --name $1

az acr build --registry $1 --image reactive-graph/query-container-publish-api:$2 .


