.PHONY: default docker-build kind-load

CLUSTER_NAME ?= kind
IMAGE_PREFIX ?= drasi-project
DOCKER_TAG_VERSION ?= latest
DOCKERX_OPTS ?= --load --cache-to type=inline
CARGO_DEBUG ?= 0 # if set to 1, it will build with --debug flag, which uses the `dev` profile (LTO set to thin) instead of the `release` profile

default: docker-build

docker-build:
	docker buildx build ../../.. --build-arg CARGO_DEBUG=$(CARGO_DEBUG) -f ./Dockerfile -t $(IMAGE_PREFIX)/source-query-api:$(DOCKER_TAG_VERSION) $(DOCKERX_OPTS)

kind-load:
	kind load docker-image $(IMAGE_PREFIX)/source-query-api:$(DOCKER_TAG_VERSION) --name $(CLUSTER_NAME)

test:
	@echo "No tests to run yet"

lint-check:
	cargo fmt -- --check
	cargo clippy --all-targets --all-features -- -D warnings -W clippy::print_stdout -A unused -A clippy::module_inception -A clippy::ptr_arg -A clippy::type_complexity
