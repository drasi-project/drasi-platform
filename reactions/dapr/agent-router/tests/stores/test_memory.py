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

"""Tests for InMemoryStateStore public methods, including key normalization and JSON-backed model round-trips."""

import pytest

from agent_router.stores import InMemoryStateStore
from agent_router.utils.types import EventType, QuerySubscription, QuerySubscriptionState


def _make_subscription(
    *,
    subscription_id: str = "agent-1",
    query_id: str = "query-1",
    topic: str = "topic-a",
    event_types: list[EventType] | None = None,
) -> QuerySubscription:
    """Create a subscription model for state store round-trip assertions."""
    return QuerySubscription(
        id=subscription_id,
        query_id=query_id,
        topic=topic,
        event_types=event_types if event_types is not None else [EventType.ADDED],
    )


def _make_state(
    *,
    subscription_id: str = "agent-1",
    query_id: str = "query-1",
    topic: str = "topic-a",
    event_types: list[EventType] | None = None,
) -> QuerySubscriptionState:
    """Create a query subscription state snapshot for the in-memory store."""
    return QuerySubscriptionState(
        root={
            subscription_id: _make_subscription(
                subscription_id=subscription_id,
                query_id=query_id,
                topic=topic,
                event_types=event_types,
            )
        }
    )


def _seed_store(
    store: InMemoryStateStore[QuerySubscriptionState],
    *,
    key: str,
    value: QuerySubscriptionState,
) -> None:
    """Seed the in-memory backing cache so tests can focus on one public method."""
    store._store[store._normalize_key(key)] = value.model_dump_json()


@pytest.fixture
def memory_store_factory():
    """Create in-memory stores with the requested key prefix."""
    def _make(*, state_key_prefix: str | None = None) -> InMemoryStateStore[QuerySubscriptionState]:
        return InMemoryStateStore(
            state_model_cls=QuerySubscriptionState,
            state_key_prefix=state_key_prefix,
        )

    return _make


@pytest.mark.asyncio
async def test_has_key_returns_false_when_key_is_missing(memory_store_factory) -> None:
    """Verify has_key returns False for a key that has not been stored yet."""
    store = memory_store_factory()

    assert await store.has_key("query-1") is False


@pytest.mark.asyncio
async def test_has_key_returns_true_after_save_state_with_prefix(memory_store_factory) -> None:
    """Verify has_key sees a key saved through the same normalized prefix path."""
    store = memory_store_factory(state_key_prefix="Tenant-")

    _seed_store(store, key="Query-1", value=_make_state(topic="topic-b"))

    assert await store.has_key("query-1") is True


@pytest.mark.asyncio
async def test_get_state_returns_default_model_when_key_is_missing(memory_store_factory) -> None:
    """Verify get_state returns an empty default model when the key is missing."""
    store = memory_store_factory()

    state = await store.get_state("query-1")

    assert state.root == {}


@pytest.mark.asyncio
async def test_get_state_round_trips_saved_state_through_normalized_key(memory_store_factory) -> None:
    """Verify get_state returns the model saved under the normalized key."""
    store = memory_store_factory(state_key_prefix="Tenant-")
    expected = _make_state(
        topic="topic-c",
        event_types=[EventType.ADDED, EventType.UPDATED],
    )

    _seed_store(store, key="Query-1", value=expected)
    state = await store.get_state("query-1")

    assert state == expected


@pytest.mark.asyncio
async def test_save_state_persists_value_for_subsequent_reads(memory_store_factory) -> None:
    """Verify save_state writes a state snapshot that later reads can recover."""
    store = memory_store_factory()
    expected = _make_state(topic="topic-d", event_types=[EventType.DELETED])

    await store.save_state("query-1", expected)

    assert store._store["query-1"] == expected.model_dump_json()


@pytest.mark.asyncio
async def test_purge_state_removes_existing_state(memory_store_factory) -> None:
    """Verify purge_state removes stored data and leaves the default model behind."""
    store = memory_store_factory()

    _seed_store(store, key="query-1", value=_make_state(topic="topic-e"))
    await store.purge_state("query-1")

    assert "query-1" not in store._store


@pytest.mark.asyncio
async def test_purge_state_is_noop_when_key_is_missing(memory_store_factory) -> None:
    """Verify purge_state does not fail when asked to delete a missing key."""
    store = memory_store_factory()

    await store.purge_state("missing-query")

    assert "missing-query" not in store._store
