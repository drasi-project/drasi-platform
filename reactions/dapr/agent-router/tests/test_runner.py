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

"""Tests for runner lifecycle behavior, including startup ordering and shutdown
cleanup across the router, MCP server, and Dapr client."""

from types import SimpleNamespace

import pytest

from agent_router.runner import AgentRouterRunner
from agent_router.utils.types import PubSubConfig, StateConfig


def _make_runner(mocker, events: list[str]) -> AgentRouterRunner:
    """Build a runner wired to mocks that record startup and shutdown order."""
    metadata = SimpleNamespace(
        registered_components=[
            SimpleNamespace(type="pubsub", name="inventory-agent-pubsub"),
            SimpleNamespace(type="state", name="drasi-agent-router-dapr-store"),
        ]
    )

    dapr_client = mocker.Mock()
    dapr_client.get_metadata.return_value = metadata
    dapr_client.close.side_effect = lambda: events.append("dapr_client.close")
    mocker.patch("agent_router.runner.DaprClient", return_value=dapr_client)

    subscription_registry = mocker.Mock(name="subscription_registry")
    mocker.patch("agent_router.runner.SubscriptionRegistry", return_value=subscription_registry)

    router = mocker.Mock(name="router")
    router.query_configs = {
        "query-1": {
            "title": "Query 1",
            "description": "The first test query",
        }
    }
    router.start.side_effect = lambda: events.append("router.start")
    def _router_shutdown() -> None:
        events.append("router.shutdown")
        raise RuntimeError("router shutdown failed")

    router.shutdown.side_effect = _router_shutdown
    mocker.patch("agent_router.runner.AgentRouter", return_value=router)

    mcp_app = SimpleNamespace(routes=[], lifespan="mcp-lifespan")
    mcp = mocker.Mock(name="mcp")
    mcp.http_app.return_value = mcp_app
    mocker.patch("agent_router.runner.FastMCP", return_value=mcp)

    mcp_server = mocker.Mock(name="mcp_server")
    mcp_server.start.side_effect = lambda: events.append("mcp_server.start")
    def _mcp_server_shutdown() -> None:
        events.append("mcp_server.shutdown")
        raise RuntimeError("mcp server shutdown failed")

    mcp_server.shutdown.side_effect = _mcp_server_shutdown
    mocker.patch("agent_router.runner.MCPServer", return_value=mcp_server)

    mocker.patch("agent_router.runner.combine_lifespans", return_value="combined-lifespan")

    return AgentRouterRunner(
        pubsub_config=PubSubConfig(pubsub_name="inventory-agent-pubsub"),
        state_config=StateConfig(state_store_name="drasi-agent-router-dapr-store"),
    )


@pytest.fixture
def start_runner(mocker):
    """Start a runner before the test so teardown exercises a live instance."""
    events: list[str] = []
    runner = _make_runner(mocker, events)

    try:
        runner.start()
    except Exception:
        # Runner failed to start — ensure the runner is shut down to avoid resource leaks.
        runner.shutdown()
        raise

    try:
        yield runner, events
    finally:
        # Test failed — ensure the runner is shut down to avoid resource leaks.
        runner.shutdown()


@pytest.fixture
def failing_runner(mocker):
    """Build a runner whose start path simulates termination during startup."""
    events: list[str] = []
    runner = _make_runner(mocker, events)

    def _router_start() -> None:
        events.append("router.start")
        raise SystemExit("runner terminated during startup")

    runner._router.start.side_effect = _router_start

    return runner, events


def test_agent_router_runner_start_order(start_runner) -> None:
    """Verify start brings up the MCP server before the router."""
    _, events = start_runner

    assert events == ["mcp_server.start", "router.start"]


def test_agent_router_runner_shutdown_cleans_up_components(failing_runner) -> None:
    """Verify shutdown cleans up the router, MCP server, and Dapr client."""
    runner, events = failing_runner

    try:
        runner.start()
    except SystemExit:
        pass
    finally:
        runner.shutdown()

    assert events == [
        "mcp_server.start",
        "router.start",
        "router.shutdown",
        "mcp_server.shutdown",
        "dapr_client.close",
    ]
    assert runner._router is None
    assert runner._mcp_server is None
    assert runner._dapr_client is None


def test_agent_router_runner_shutdown_is_idempotent(failing_runner) -> None:
    """Verify a second shutdown call does not perform cleanup again."""
    runner, events = failing_runner

    try:
        runner.start()
    except SystemExit:
        pass
    finally:
        runner.shutdown()
        runner.shutdown()

    assert events == [
        "mcp_server.start",
        "router.start",
        "router.shutdown",
        "mcp_server.shutdown",
        "dapr_client.close",
    ]
    assert runner._router is None
    assert runner._mcp_server is None
    assert runner._dapr_client is None


def test_agent_router_runner_shutdown_without_start_is_noop(mocker) -> None:
    """Verify shutdown does nothing if the runner was never started."""
    events: list[str] = []
    runner = _make_runner(mocker, events)

    runner.shutdown()

    assert events == []
    assert runner._router is not None
    assert runner._mcp_server is not None
    assert runner._dapr_client is not None
