#
# Copyright 2026 The Drasi Authors.
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
#

.PHONY: default docker-build kind-load

IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
TAG_SUFFIX ?=
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max
BUILD_CONFIG ?= default

ifneq ($(BUILD_CONFIG), default)
	DOCKER_TAG_VERSION := ${DOCKER_TAG_VERSION}-$(BUILD_CONFIG)
endif

ifneq ($(TAG_SUFFIX),)
	DOCKER_TAG_VERSION := ${DOCKER_TAG_VERSION}$(TAG_SUFFIX)
endif

default: docker-build

# Need build context at reactions root since we are using local install
docker-build:
	docker buildx build ../../ -f Dockerfile.$(BUILD_CONFIG) -t $(IMAGE_PREFIX)/reaction-dapr-agent-router:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/reaction-dapr-agent-router:$(DOCKER_TAG_VERSION) --name $(if $(CLUSTER_NAME),$(CLUSTER_NAME),kind)

k3d-load:
	k3d image import $(IMAGE_PREFIX)/reaction-dapr-agent-router:$(DOCKER_TAG_VERSION) -c $(if $(CLUSTER_NAME),$(CLUSTER_NAME),k3s-default)

test:
	@echo "No tests to run yet"

lint-check:
	@echo "No lint checks to run yet"
