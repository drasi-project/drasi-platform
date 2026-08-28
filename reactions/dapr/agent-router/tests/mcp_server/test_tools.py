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

"""Tests for MCP tool wiring and behavior, including registration and the
subscription/query helper calls exposed to agents."""

from unittest.mock import AsyncMock, Mock

import pytest
from fastmcp.exceptions import ToolError
from pydantic import ValidationError

from agent_router.mcp_server.tools import AgentRouterToolset
from agent_router.subscription import SubscriptionRegistry
from agent_router.utils.types import EventType, QuerySubscription


DEFAULT_QUERY_CONFIGS: dict[str, dict[str, str]] = {
    "query-1": {
        "title": "Query 1",
        "description": "The first test query",
    },
    "query-2": {
        "title": "Query 2",
        "description": "The second test query",
    },
}


class FakeMCP:
    """Capture tool registration calls without bringing up a real MCP server."""

    def __init__(self) -> None:
        self.registered_tools: list[object] = []

    def tool(self, fn):
        self.registered_tools.append(fn)
        return fn


def _make_subscription_registry() -> Mock:
    """Build a subscription registry mock with the async methods the toolset uses."""
    registry = Mock(spec=SubscriptionRegistry)
    registry.upsert_subscription = AsyncMock()
    registry.get_subscription = AsyncMock()
    registry.delete_subscription = AsyncMock()
    return registry


@pytest.fixture
def toolset_factory():
    """Create toolsets wired to fake MCP and subscription registry dependencies."""
    def _make(
        *,
        query_configs: dict[str, dict[str, str]] | None = None,
        registry: Mock | None = None,
    ) -> tuple[AgentRouterToolset, FakeMCP, Mock]:
        fake_mcp = FakeMCP()
        subscription_registry = registry if registry is not None else _make_subscription_registry()
        toolset = AgentRouterToolset(
            mcp=fake_mcp,
            subscription_registry=subscription_registry,
            query_configs=query_configs if query_configs is not None else DEFAULT_QUERY_CONFIGS,
        )
        return toolset, fake_mcp, subscription_registry

    return _make


def test_agent_router_toolset_registers_all_tools(toolset_factory) -> None:
    """Verify the toolset registers the expected MCP tool callables."""
    toolset, fake_mcp, _ = toolset_factory()

    assert len(fake_mcp.registered_tools) == 3
    assert fake_mcp.registered_tools[0].__name__ == "subscribe_drasi_query"
    assert fake_mcp.registered_tools[1].__name__ == "unsubscribe_drasi_query"
    assert fake_mcp.registered_tools[2].__name__ == "list_drasi_queries"

    # The toolset should still be usable after registration.
    assert toolset._query_configs == DEFAULT_QUERY_CONFIGS


@pytest.mark.asyncio
async def test_subscribe_drasi_query_registers_qualified_subscription_and_deduplicates_event_types(
    toolset_factory,
) -> None:
    """Verify subscription deduplicates event types and upserts a qualified subscription."""
    toolset, _, registry = toolset_factory()

    result = await toolset.subscribe_drasi_query(
        query_id="query-1",
        event_types=[
            EventType.ADDED,
            EventType.UPDATED,
            EventType.ADDED,
            EventType.DELETED,
            EventType.UPDATED,
        ],
        agent_id="agent-1",
        subscription_id="sub-1",
        topic="topic-a",
    )

    registry.upsert_subscription.assert_awaited_once_with(
        query_id="query-1",
        subscription_id="agent-1:sub-1",
        topic="topic-a",
        event_types=[EventType.ADDED, EventType.UPDATED, EventType.DELETED],
    )
    assert result.agent_id == "agent-1"
    assert result.query_id == "query-1"
    assert result.subscription_id == "sub-1"
    assert result.topic == "topic-a"
    assert result.event_types == [EventType.ADDED, EventType.UPDATED, EventType.DELETED]


@pytest.mark.asyncio
async def test_subscribe_drasi_query_rejects_unknown_query_id(toolset_factory) -> None:
    """Verify subscription rejects a query ID that is not configured."""
    toolset, _, registry = toolset_factory(query_configs={"query-1": DEFAULT_QUERY_CONFIGS["query-1"]})

    with pytest.raises(ToolError, match="Unknown query_id 'missing-query'"):
        await toolset.subscribe_drasi_query(
            query_id="missing-query",
            event_types=[EventType.ADDED],
            agent_id="agent-1",
            subscription_id="sub-1",
            topic="topic-a",
        )

    registry.upsert_subscription.assert_not_called()


@pytest.mark.asyncio
async def test_subscribe_drasi_query_rejects_empty_event_types(toolset_factory) -> None:
    """Verify subscription rejects an empty event type list."""
    toolset, _, registry = toolset_factory()

    with pytest.raises(ToolError, match="event_types must contain at least one value"):
        await toolset.subscribe_drasi_query(
            query_id="query-1",
            event_types=[],
            agent_id="agent-1",
            subscription_id="sub-1",
            topic="topic-a",
        )

    registry.upsert_subscription.assert_not_called()


@pytest.mark.asyncio
async def test_unsubscribe_drasi_query_deletes_qualified_subscription_when_found(
    toolset_factory,
) -> None:
    """Verify unsubscription removes an existing qualified subscription."""
    toolset, _, registry = toolset_factory()
    registry.get_subscription.return_value = QuerySubscription(
        id="agent-1:sub-1",
        query_id="query-1",
        topic="topic-a",
        event_types=[EventType.ADDED, EventType.UPDATED],
    )

    result = await toolset.unsubscribe_drasi_query(
        query_id="query-1",
        agent_id="agent-1",
        subscription_id="sub-1",
    )

    registry.get_subscription.assert_awaited_once_with(
        query_id="query-1",
        subscription_id="agent-1:sub-1",
    )
    registry.delete_subscription.assert_awaited_once_with(
        query_id="query-1",
        subscription_id="agent-1:sub-1",
    )
    assert result.agent_id == "agent-1"
    assert result.query_id == "query-1"
    assert result.subscription_id == "sub-1"


@pytest.mark.asyncio
async def test_unsubscribe_drasi_query_returns_message_when_subscription_missing(toolset_factory) -> None:
    """Verify unsubscription returns the no-op message when nothing exists."""
    toolset, _, registry = toolset_factory()
    registry.get_subscription.return_value = None

    result = await toolset.unsubscribe_drasi_query(
        query_id="query-1",
        agent_id="agent-1",
        subscription_id="sub-1",
    )

    registry.get_subscription.assert_awaited_once_with(
        query_id="query-1",
        subscription_id="agent-1:sub-1",
    )
    registry.delete_subscription.assert_not_awaited()
    assert result == (
        "Agent 'agent-1' successfully unsubscribed from query 'query-1', "
        "subscription_id='sub-1'(no existing subscription found)"
    )


@pytest.mark.asyncio
async def test_unsubscribe_drasi_query_rejects_unknown_query_id(toolset_factory) -> None:
    """Verify unsubscription rejects a query ID that is not configured."""
    toolset, _, registry = toolset_factory(query_configs={"query-1": DEFAULT_QUERY_CONFIGS["query-1"]})

    with pytest.raises(ToolError, match="Unknown query_id 'missing-query'"):
        await toolset.unsubscribe_drasi_query(
            query_id="missing-query",
            agent_id="agent-1",
            subscription_id="sub-1",
        )

    registry.get_subscription.assert_not_called()
    registry.delete_subscription.assert_not_called()


@pytest.mark.asyncio
async def test_list_drasi_queries_returns_all_queries_in_input_order(toolset_factory) -> None:
    """Verify query listing returns every configured query in order."""
    query_configs = {
        "query-a": {
            "title": "Alpha",
            "description": "First query",
        },
        "query-b": {
            "title": "Beta",
            "description": "Second query",
        },
        "query-c": {
            "title": "Gamma",
            "description": "Third query",
        },
    }
    toolset, _, _ = toolset_factory(query_configs=query_configs)

    result = await toolset.list_drasi_queries()

    assert [(query.query_id, query.title, query.description) for query in result.queries] == [
        ("query-a", "Alpha", "First query"),
        ("query-b", "Beta", "Second query"),
        ("query-c", "Gamma", "Third query"),
    ]


@pytest.mark.asyncio
async def test_list_drasi_queries_returns_empty_list_when_no_queries(toolset_factory) -> None:
    """Verify query listing returns an empty list when no queries exist."""
    toolset, _, _ = toolset_factory(query_configs={})

    result = await toolset.list_drasi_queries()

    assert result.queries == []


def test_list_drasi_queries_rejects_invalid_query_config(toolset_factory) -> None:
    """Verify invalid query config data fails validation."""
    toolset, _, _ = toolset_factory()

    with pytest.raises(ValidationError):
        toolset._make_query_result("query-bad", {"title": "Missing description"})
