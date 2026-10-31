.PHONY: install-dependencies generate-types check-types test package

install-dependencies:
	uv sync --project python --locked --group dev --group test
	npm ci --prefix ..

generate-types:
	cd python && uv run --locked --group dev --group test python ../generate.py

check-types:
	cd python && uv run --locked --group dev --group test python ../generate.py --check

test:
	cd python && uv run --locked --group dev --group test pytest tests

package:
	cd python && uv build
