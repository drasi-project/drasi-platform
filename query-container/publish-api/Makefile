.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load --cache-to type=inline,mode=max

default: docker-build

docker-build:
	docker buildx build . -t $(IMAGE_PREFIX)/query-container-publish-api:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

docker-build-debug:
	docker buildx build . -f Dockerfile.debug -t $(IMAGE_PREFIX)/query-container-publish-api:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/query-container-publish-api:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	cargo test

lint-check:
	cargo fmt -- --check
	cargo clippy --all-targets --all-features -- -D warnings -W clippy::print_stdout -A unused -A clippy::module_inception -A clippy::ptr_arg -A clippy::type_complexity
