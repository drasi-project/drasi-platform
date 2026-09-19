.PHONY: install-dependencies test package

install-dependencies:
	uv sync --locked --group test

test:
	uv run --locked --group test pytest

package:
	uv build
