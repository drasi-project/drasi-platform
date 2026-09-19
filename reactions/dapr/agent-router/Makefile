.PHONY: install-dependencies generate-types check-types test package

install-dependencies:
	uv sync --locked --group dev --group test
	npm ci --prefix ../../../typespec

generate-types:
	uv run --locked --group dev --group test python ../../../typespec/dapr-agent-router/generate.py

check-types:
	uv run --locked --group dev --group test python ../../../typespec/dapr-agent-router/generate.py --check

test:
	uv run --locked --group dev --group test pytest tests

package:
	uv build
