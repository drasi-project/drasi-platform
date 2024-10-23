#!/bin/bash
# Copyright 2024 The Drasi Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# usage: ./remote-build.sh <acr> <tag>
# example: ./remote-build.sh drasitest latest

az acr login --name $1


docker buildx create --name drasi-builder --bootstrap
docker buildx use drasi-builder

docker buildx build --platform linux/amd64,linux/arm64 -t $1.azurecr.io/reactive-graph/source-sql-proxy:$2 . --push