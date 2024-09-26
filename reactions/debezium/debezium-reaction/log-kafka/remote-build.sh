#!/bin/bash

# usage: ./remote-build.sh <acr> <tag>
# example: ./remote-build.sh drasitest latest

az acr login --name $1

az acr build --registry $1 --image reactive-graph/log-kafka-topic:$2 .
