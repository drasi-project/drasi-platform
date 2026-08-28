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

"""Tests for subscription registry behavior, including cache-aside reads,
write-through updates, and backing state store synchronization."""

import json
from dataclasses import dataclass
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

from agent_router.subscription import SubscriptionRegistry
from agent_router.stores import InMemoryStateStore
from agent_router.utils.types import EventType, QuerySubscription, QuerySubscriptionState, StateConfig


@dataclass
class _FakeDaprStateResponse:
    """Stand in for the Dapr state response object returned by get_state."""

    payload: dict
    etag: str | None = None

    @property
    def data(self) -> bytes:
        return json.dumps(self.payload).encode("utf-8")

    def json(self) -> dict:
        return self.payload


class MockDaprClient:
    """Mock DaprClient supporting context manager usage and state management."""

    def __init__(self) -> None:
        """Initialize the fake client with a simple in-memory state map."""
        self.state: dict[str, dict] = {}

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def get_state(self, *, store_name, key, state_metadata=None, **kwargs):
        payload = self.state.get(key)
        if payload is None:
            return Mock(data=None, etag=None, json=lambda: {})
        return _FakeDaprStateResponse(payload=payload, etag="etag-1")

    def save_state(self, *, store_name, key, value, state_metadata=None, state_options=None, **kwargs):
        if isinstance(value, (bytes, bytearray)):
            payload = json.loads(value.decode("utf-8"))
        elif isinstance(value, str):
            payload = json.loads(value)
        else:
            payload = value

        self.state[key] = payload
        return None

    def delete_state(self, *, store_name, key, etag=None, options=None, state_metadata=None, **kwargs):
        self.state.pop(key, None)
        return None


def _make_registry(
    *,
    initial_store_state: dict[str, QuerySubscriptionState] | None = None,
) -> SubscriptionRegistry:
    """Build a subscription registry backed by the mock Dapr client."""
    registry = SubscriptionRegistry(
        dapr_client=MockDaprClient(),
        state_config=StateConfig(state_store_name="test"),
    )

    if initial_store_state:
        dapr_client = registry._state_store._dapr_client
        for query_id, state in initial_store_state.items():
            dapr_client.state[query_id] = state.model_dump(mode="json")

    return registry


async def _assert_subscription_state(
    registry: SubscriptionRegistry,
    query_id: str,
    expected_root: dict[str, QuerySubscription],
) -> None:
    """Assert that both the cache and backing store contain the same state."""
    cache_state = await registry._cache.get_state(query_id)
    store_state = await registry._state_store.get_state(query_id)

    assert cache_state.root == expected_root
    assert store_state.root == expected_root


@pytest.mark.asyncio
async def test_upsert_subscription_replaces_existing_subscription(mocker) -> None:
    """Verify upserts replace the stored subscription in both caches."""
    registry = _make_registry()
    save_state_spy = mocker.spy(registry._state_store._dapr_client, "save_state")

    await registry.upsert_subscription(
        "query-1",
        "agent-1",
        topic="topic-a",
        event_types=[EventType.ADDED, EventType.UPDATED],
    )
    await registry.upsert_subscription(
        "query-1",
        "agent-1",
        topic="topic-b",
        event_types=[EventType.DELETED],
    )

    await _assert_subscription_state(
        registry,
        "query-1",
        {
            "agent-1": QuerySubscription(
                id="agent-1",
                query_id="query-1",
                topic="topic-b",
                event_types=[EventType.DELETED],
            )
        },
    )

    assert save_state_spy.call_args.kwargs["store_name"] == "test"
    assert save_state_spy.call_args.kwargs["key"] == "query-1"
    assert save_state_spy.call_args.kwargs["value"] == json.dumps(
        QuerySubscriptionState(
            root={
                "agent-1": QuerySubscription(
                    id="agent-1",
                    query_id="query-1",
                    topic="topic-b",
                    event_types=[EventType.DELETED],
                )
            }
        ).model_dump(mode="json")
    )
    assert save_state_spy.call_args.kwargs["state_metadata"] == {
        "contentType": "application/json",
        "partitionKey": "query-1",
    }


@pytest.mark.asyncio
async def test_upsert_subscription_populates_cache_and_avoids_store_read() -> None:
    """Verify a write-through upsert populates the cache and avoids a store read."""
    registry = _make_registry()

    await registry.upsert_subscription(
        "query-1",
        "agent-1",
        topic="topic-a",
        event_types=[EventType.ADDED],
    )

    await _assert_subscription_state(
        registry,
        "query-1",
        {
            "agent-1": QuerySubscription(
                id="agent-1",
                query_id="query-1",
                topic="topic-a",
                event_types=[EventType.ADDED],
            )
        },
    )

    registry._state_store.get_state = AsyncMock(side_effect=AssertionError("store read should not happen"))

    cache_state = await registry._cache.get_state("query-1")
    assert cache_state.root == {
        "agent-1": QuerySubscription(
            id="agent-1",
            query_id="query-1",
            topic="topic-a",
            event_types=[EventType.ADDED],
        )
    }


@pytest.mark.asyncio
async def test_update_subscription_can_change_topic_and_event_types() -> None:
    """Verify updates can change topic and event types while preserving the record."""
    registry = _make_registry(
        initial_store_state={
            "query-1": QuerySubscriptionState(
                root={
                    "agent-1": QuerySubscription(
                        id="agent-1",
                        query_id="query-1",
                        topic="topic-a",
                        event_types=[EventType.ADDED, EventType.UPDATED],
                    )
                },
            )
        },
    )

    await registry.update_subscription(
        "query-1",
        "agent-1",
        topic="topic-b",
    )

    await _assert_subscription_state(
        registry,
        "query-1",
        {
            "agent-1": QuerySubscription(
                id="agent-1",
                query_id="query-1",
                topic="topic-b",
                event_types=[EventType.ADDED, EventType.UPDATED],
            )
        },
    )

    await registry.update_subscription(
        "query-1",
        "agent-1",
        event_types=[EventType.DELETED],
    )

    await _assert_subscription_state(
        registry,
        "query-1",
        {
            "agent-1": QuerySubscription(
                id="agent-1",
                query_id="query-1",
                topic="topic-b",
                event_types=[EventType.DELETED],
            )
        },
    )


@pytest.mark.asyncio
async def test_delete_subscription_is_idempotent_when_missing(mocker) -> None:
    """Verify deleting a missing subscription leaves state empty."""
    registry = _make_registry()
    delete_state_spy = mocker.spy(registry._state_store._dapr_client, "delete_state")

    await registry.delete_subscription("query-1", "agent-1")
    await _assert_subscription_state(registry, "query-1", {})
    delete_state_spy.assert_called_once()
    assert delete_state_spy.call_args.kwargs["key"] == "query-1"


@pytest.mark.asyncio
async def test_delete_subscription_updates_cache(mocker) -> None:
    """Verify deleting the last subscription clears both the cache and store state."""
    registry = _make_registry(
        initial_store_state={
            "query-1": QuerySubscriptionState(
                root={
                    "agent-1": QuerySubscription(
                        id="agent-1",
                        query_id="query-1",
                        topic="topic-a",
                        event_types=[EventType.ADDED, EventType.UPDATED],
                    )
                },
            )
        },
    )
    delete_state_spy = mocker.spy(registry._state_store._dapr_client, "delete_state")

    await registry.delete_subscription("query-1", "agent-1")

    await _assert_subscription_state(registry, "query-1", {})

    registry._state_store.get_state = AsyncMock(side_effect=AssertionError("store read should not happen"))

    delete_state_spy.assert_called_once()
    assert delete_state_spy.call_args.kwargs["key"] == "query-1"


@pytest.mark.asyncio
async def test_get_subscriptions_returns_all_subscriptions() -> None:
    """Verify get_subscriptions returns every stored subscription when no filter is provided."""
    registry = _make_registry(
        initial_store_state={
            "query-1": QuerySubscriptionState(
                root={
                    "agent-1": QuerySubscription(
                        id="agent-1",
                        query_id="query-1",
                        topic="topic-a",
                        event_types=[EventType.ADDED],
                    ),
                    "agent-2": QuerySubscription(
                        id="agent-2",
                        query_id="query-1",
                        topic="topic-b",
                        event_types=[EventType.UPDATED],
                    ),
                },
            )
        },
    )

    subscriptions = await registry.get_subscriptions("query-1")

    assert [(sub.id, sub.topic, sub.event_types) for sub in subscriptions] == [
        ("agent-1", "topic-a", [EventType.ADDED]),
        ("agent-2", "topic-b", [EventType.UPDATED]),
    ]


@pytest.mark.asyncio
async def test_get_subscriptions_filters_by_event_types() -> None:
    """Verify subscription listing filters subscriptions by matching event types."""
    registry = _make_registry(
        initial_store_state={
            "query-1": QuerySubscriptionState(
                root={
                    "agent-1": QuerySubscription(
                        id="agent-1",
                        query_id="query-1",
                        topic="topic-a",
                        event_types=[EventType.ADDED],
                    ),
                    "agent-2": QuerySubscription(
                        id="agent-2",
                        query_id="query-1",
                        topic="topic-b",
                        event_types=[EventType.UPDATED],
                    ),
                    "agent-3": QuerySubscription(
                        id="agent-3",
                        query_id="query-1",
                        topic="topic-c",
                        event_types=[EventType.DELETED],
                    ),
                },
            )
        },
    )

    subscriptions = await registry.get_subscriptions("query-1", event_types=[EventType.UPDATED, EventType.DELETED])

    assert [sub.id for sub in subscriptions] == ["agent-2", "agent-3"]


@pytest.mark.asyncio
async def test_get_subscription_populates_cache_on_miss() -> None:
    """Verify a store miss repopulates the cache from the Dapr-backed store."""
    registry = _make_registry()
    registry._state_store = InMemoryStateStore(
        state_model_cls=QuerySubscriptionState,
        name="test",
    )

    await registry._state_store.save_state(
        "query-1",
        QuerySubscriptionState(
            root={
                "agent-1": QuerySubscription(
                    id="agent-1",
                    query_id="query-1",
                    topic="topic-a",
                    event_types=[EventType.ADDED],
                )
            },
        ),
    )

    store_state = await registry._state_store.get_state("query-1")
    assert store_state.root == {
        "agent-1": QuerySubscription(
            id="agent-1",
            query_id="query-1",
            topic="topic-a",
            event_types=[EventType.ADDED],
        )
    }
    cache_state = await registry._cache.get_state("query-1")
    assert cache_state.root == {}

    subscription = await registry.get_subscription("query-1", "agent-1")
    assert subscription is not None
    assert subscription.topic == "topic-a"

    await _assert_subscription_state(
        registry,
        "query-1",
        {
            "agent-1": QuerySubscription(
                id="agent-1",
                query_id="query-1",
                topic="topic-a",
                event_types=[EventType.ADDED],
            )
        },
    )

    registry._state_store.get_state = AsyncMock(side_effect=AssertionError("store read should not happen"))

    subscription = await registry.get_subscription("query-1", "agent-1")
    assert subscription is not None
    assert subscription.topic == "topic-a"
