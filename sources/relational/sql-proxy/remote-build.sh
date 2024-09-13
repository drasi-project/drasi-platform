#!/bin/bash

# usage: ./remote-build.sh <acr> <tag>
# example: ./remote-build.sh drasitest latest

az acr login --name $1


docker buildx create --name drasi-builder --bootstrap
docker buildx use drasi-builder

docker buildx build --platform linux/amd64,linux/arm64 -t $1.azurecr.io/reactive-graph/source-sql-proxy:$2 . --push