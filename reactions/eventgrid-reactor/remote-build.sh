#!/bin/bash

# usage: ./remote-build.sh <acr> <tag>
# example: ./remote-build.sh reactivegraphtest latest

az acr login --name $1

docker buildx create --name drasi-builder --bootstrap
docker buildx use drasi-builder

docker buildx build --platform linux/amd64,linux/arm64 -t $1.azurecr.io/reactive-graph/reaction-eventgrid:$2 . --push