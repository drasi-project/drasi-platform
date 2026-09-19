.PHONY: install-dependencies test test-state-integration package

install-dependencies:
	uv sync --locked --group test

test:
	uv run --locked --group test pytest

test-state-integration:
	@set -eu; \
	project="drasi-router-state-$$(date +%s)-$$$$"; \
	trap 'docker compose -p "$$project" -f tests/state-runtime/compose.yaml down --volumes' EXIT; \
	trap 'exit 130' INT; \
	trap 'exit 143' TERM; \
	docker compose -p "$$project" -f tests/state-runtime/compose.yaml up --wait --wait-timeout 90 --quiet-pull; \
	export DAPR_HTTP_ENDPOINT="http://$$(docker compose -p "$$project" -f tests/state-runtime/compose.yaml port dapr 3500)"; \
	export DAPR_GRPC_ENDPOINT="$$(docker compose -p "$$project" -f tests/state-runtime/compose.yaml port dapr 50001)"; \
	export DRASI_ROUTER_TEST_STATE_STORE=router-state; \
	uv run --locked --group test pytest -q tests/test_state_integration.py

package:
	uv build
