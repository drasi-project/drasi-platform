az acr login --name $1

az acr build --registry $1 --file Dockerfile --image reactive-graph/source-change-svc:$2 ../..


