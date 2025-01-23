.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max

default: docker-build

docker-build:
	docker buildx build . -t $(IMAGE_PREFIX)/reaction-signalr:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

docker-build-debug:
	docker buildx build . -f Dockerfile.debug -t $(IMAGE_PREFIX)/reaction-signalr:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/reaction-signalr:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	dotnet test

lint-check:
	@echo "No lint checks to run yet"

generate-types:
	npm run clean --prefix ../../../typespec
	npm run build ./output-unpacked --prefix ../../../typespec
	quicktype --src-lang schema -l cs -o Drasi.Reactions.SignalR/Models/Unpacked.generated.cs ../../../typespec/output-unpacked/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reactions.SignalR.Models.Unpacked
	quicktype --src-lang schema -l ts -o clients/react/src/unpacked-models.ts ../../../typespec/output-unpacked/_generated/@typespec/json-schema/*.yaml
