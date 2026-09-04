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

"""Tests for AgentRouter behavior, including event classification, unpacking,
and pub/sub dispatch wiring."""

from json import loads
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

from agent_router.router.agent import AgentRouter
from agent_router.utils.types import EventType, PubSubConfig, QuerySubscription


class _FakeRecord:
    """Minimal record object that exposes the model_dump API used by the router."""

    def __init__(self, payload: dict[str, object], *, before=None, after=None) -> None:
        self._payload = payload
        self.before = before
        self.after = after

    def model_dump(self) -> dict[str, object]:
        return self._payload


def _make_event(
    *,
    query_id: str = "query-1",
    source_time_ms: int = 123,
    sequence: int = 42,
    added_results: list[object] | None = None,
    updated_results: list[object] | None = None,
    deleted_results: list[object] | None = None,
) -> SimpleNamespace:
    """Create a packed change event with the attributes the router reads."""
    return SimpleNamespace(
        queryId=query_id,
        sourceTimeMs=source_time_ms,
        sequence=sequence,
        addedResults=added_results if added_results is not None else [],
        updatedResults=updated_results if updated_results is not None else [],
        deletedResults=deleted_results if deleted_results is not None else [],
    )


def _make_subscription(
    *,
    subscription_id: str,
    topic: str,
    query_id: str = "query-1",
    event_types: list[EventType] | None = None,
) -> QuerySubscription:
    """Create a subscription that can be fanned out to by the router."""
    return QuerySubscription(
        id=subscription_id,
        query_id=query_id,
        topic=topic,
        event_types=event_types if event_types is not None else [EventType.ADDED],
    )


def _make_router(mocker) -> tuple[AgentRouter, Mock, Mock, Mock]:
    """Build an AgentRouter instance backed by mocks for all external dependencies."""
    reaction = Mock(name="reaction")
    reaction.query_configs = {"query-1": {"title": "Query 1", "description": "The first test query"}}
    reaction.start = Mock(name="reaction.start")
    reaction.shutdown = Mock(name="reaction.shutdown")
    mocker.patch("agent_router.router.agent.DrasiReaction", return_value=reaction)

    dapr_client = Mock(name="dapr_client")
    subscription_registry = Mock(name="subscription_registry")
    subscription_registry.get_subscriptions = AsyncMock(return_value=[])

    router = AgentRouter(
        dapr_client=dapr_client,
        app=SimpleNamespace(),
        pubsub_config=PubSubConfig(pubsub_name="test-pubsub"),
        subscription_registry=subscription_registry,
    )

    return router, reaction, dapr_client, subscription_registry


def test_get_event_type_added_returns_added(mocker) -> None:
    """Verify added events are classified as EventType.ADDED."""
    router, _, _, _ = _make_router(mocker)

    assert router._get_event_type(_make_event(added_results=[_FakeRecord({"id": "row-1"})])) == EventType.ADDED


def test_get_event_type_updated_returns_updated(mocker) -> None:
    """Verify updated events are classified as EventType.UPDATED."""
    router, _, _, _ = _make_router(mocker)

    assert (
        router._get_event_type(
            _make_event(
                updated_results=[
                    _FakeRecord(
                        {"id": "row-1"},
                        before=_FakeRecord({"id": "row-1", "state": "old"}),
                        after=_FakeRecord({"id": "row-1", "state": "new"}),
                    )
                ]
            )
        )
        == EventType.UPDATED
    )


def test_get_event_type_deleted_returns_deleted(mocker) -> None:
    """Verify deleted events are classified as EventType.DELETED."""
    router, _, _, _ = _make_router(mocker)

    assert router._get_event_type(_make_event(deleted_results=[_FakeRecord({"id": "row-1"})])) == EventType.DELETED


def test_get_event_type_unknown_returns_none(mocker) -> None:
    """Verify empty events do not produce a classified event type."""
    router, _, _, _ = _make_router(mocker)

    assert router._get_event_type(_make_event()) is None


def test_to_unpacked_events_added_records_become_change_notifications_in_order(mocker) -> None:
    """Verify added records are unpacked into ordered ChangeNotification items."""
    router, _, _, _ = _make_router(mocker)

    unpacked = router._to_unpacked_events(
        _make_event(
            source_time_ms=100,
            added_results=[
                _FakeRecord({"id": "added-1", "value": "a"}),
                _FakeRecord({"id": "added-2", "value": "b"}),
            ],
        )
    )

    # We only assert the fields the router controls here; metadata is supplied by the SDK model.
    assert [
        {
            "op": event.model_dump(mode="json")["op"],
            "ts_ms": event.model_dump(mode="json")["ts_ms"],
            "seq": event.model_dump(mode="json")["seq"],
            "payload": event.model_dump(mode="json")["payload"],
        }
        for event in unpacked
    ] == [
        {
            "op": "i",
            "ts_ms": 100,
            "seq": 0,
            "payload": {
                "source": {"queryId": "query-1", "ts_ms": 100},
                "before": None,
                "after": {"id": "added-1", "value": "a"},
            },
        },
        {
            "op": "i",
            "ts_ms": 100,
            "seq": 0,
            "payload": {
                "source": {"queryId": "query-1", "ts_ms": 100},
                "before": None,
                "after": {"id": "added-2", "value": "b"},
            },
        },
    ]


def test_to_unpacked_events_updated_records_preserve_before_and_after(mocker) -> None:
    """Verify updated records retain both before and after payloads."""
    router, _, _, _ = _make_router(mocker)

    unpacked = router._to_unpacked_events(
        _make_event(
            source_time_ms=101,
            updated_results=[
                _FakeRecord(
                    {"id": "updated-1"},
                    before=_FakeRecord({"id": "updated-1", "state": "old"}),
                    after=_FakeRecord({"id": "updated-1", "state": "new"}),
                )
            ],
        )
    )

    # We only assert the fields the router controls here; metadata is supplied by the SDK model.
    assert [
        {
            "op": event.model_dump(mode="json")["op"],
            "ts_ms": event.model_dump(mode="json")["ts_ms"],
            "seq": event.model_dump(mode="json")["seq"],
            "payload": event.model_dump(mode="json")["payload"],
        }
        for event in unpacked
    ] == [
        {
            "op": "u",
            "ts_ms": 101,
            "seq": 0,
            "payload": {
                "source": {"queryId": "query-1", "ts_ms": 101},
                "before": {"id": "updated-1", "state": "old"},
                "after": {"id": "updated-1", "state": "new"},
            },
        }
    ]


def test_to_unpacked_events_deleted_records_preserve_before_and_set_after_none(mocker) -> None:
    """Verify deleted records keep before data and clear after data."""
    router, _, _, _ = _make_router(mocker)

    unpacked = router._to_unpacked_events(
        _make_event(
            source_time_ms=102,
            deleted_results=[_FakeRecord({"id": "deleted-1", "state": "gone"})],
        )
    )

    # We only assert the fields the router controls here; metadata is supplied by the SDK model.
    assert [
        {
            "op": event.model_dump(mode="json")["op"],
            "ts_ms": event.model_dump(mode="json")["ts_ms"],
            "seq": event.model_dump(mode="json")["seq"],
            "payload": event.model_dump(mode="json")["payload"],
        }
        for event in unpacked
    ] == [
        {
            "op": "d",
            "ts_ms": 102,
            "seq": 0,
            "payload": {
                "source": {"queryId": "query-1", "ts_ms": 102},
                "before": {"id": "deleted-1", "state": "gone"},
                "after": None,
            },
        }
    ]


def test_to_unpacked_events_mixed_batches_keep_record_order_stable(mocker) -> None:
    """Verify mixed batches are unpacked in the same category order as the implementation."""
    router, _, _, _ = _make_router(mocker)

    unpacked = router._to_unpacked_events(
        _make_event(
            source_time_ms=103,
            added_results=[_FakeRecord({"id": "added-1"})],
            updated_results=[
                _FakeRecord(
                    {"id": "updated-1"},
                    before=_FakeRecord({"id": "updated-1", "state": "old"}),
                    after=_FakeRecord({"id": "updated-1", "state": "new"}),
                )
            ],
            deleted_results=[_FakeRecord({"id": "deleted-1"})],
        )
    )

    assert [event.model_dump(mode="json")["op"] for event in unpacked] == ["i", "u", "d"]
    assert [event.model_dump(mode="json")["payload"]["after"] for event in unpacked] == [
        {"id": "added-1"},
        {"id": "updated-1", "state": "new"},
        None,
    ]


@pytest.mark.asyncio
async def test_make_on_change_event_returns_early_when_query_config_is_none(mocker) -> None:
    """Verify missing query config short-circuits the change handler."""
    router, _, _, subscription_registry = _make_router(mocker)
    publish_spy = mocker.spy(router, "_publish_event")
    on_change_event = router._make_on_change_event()

    await on_change_event(_make_event(added_results=[_FakeRecord({"id": "row-1"})]), None)

    subscription_registry.get_subscriptions.assert_not_awaited()
    publish_spy.assert_not_called()


@pytest.mark.asyncio
async def test_make_on_change_event_returns_early_when_event_type_is_none(mocker) -> None:
    """Verify unknown events are ignored before unpacking or publishing."""
    router, _, _, subscription_registry = _make_router(mocker)
    publish_spy = mocker.spy(router, "_publish_event")
    on_change_event = router._make_on_change_event()

    await on_change_event(_make_event(), query_config={})

    subscription_registry.get_subscriptions.assert_not_awaited()
    publish_spy.assert_not_called()


@pytest.mark.asyncio
async def test_make_on_change_event_returns_early_when_there_are_no_unpacked_events(mocker) -> None:
    """Verify empty unpacked batches stop before subscription lookup."""
    router, _, _, subscription_registry = _make_router(mocker)
    publish_spy = mocker.spy(router, "_publish_event")
    mocker.patch.object(router, "_to_unpacked_events", return_value=[])
    on_change_event = router._make_on_change_event()

    await on_change_event(_make_event(added_results=[_FakeRecord({"id": "row-1"})]), query_config={})

    subscription_registry.get_subscriptions.assert_not_awaited()
    publish_spy.assert_not_called()


@pytest.mark.asyncio
async def test_make_on_change_event_calls_subscription_registry_with_query_id_and_single_event_type(mocker) -> None:
    """Verify subscriptions are loaded with the query ID and a single event type."""
    router, _, _, subscription_registry = _make_router(mocker)
    subscription_registry.get_subscriptions = AsyncMock(return_value=[])
    on_change_event = router._make_on_change_event()

    await on_change_event(_make_event(added_results=[_FakeRecord({"id": "row-1"})]), query_config={})

    subscription_registry.get_subscriptions.assert_awaited_once_with(
        query_id="query-1",
        event_types=[EventType.ADDED],
    )


@pytest.mark.asyncio
async def test_make_on_change_event_publishes_one_message_per_subscription_per_record(mocker) -> None:
    """Verify each unpacked record is published to each matching subscription."""
    router, _, _, subscription_registry = _make_router(mocker)
    subscriptions = [
        _make_subscription(subscription_id="sub-a", topic="topic-a"),
        _make_subscription(subscription_id="sub-b", topic="topic-b"),
    ]
    subscription_registry.get_subscriptions = AsyncMock(return_value=subscriptions)
    publish_spy = mocker.spy(router, "_publish_event")
    on_change_event = router._make_on_change_event()

    await on_change_event(
        _make_event(
            sequence=7,
            added_results=[
                _FakeRecord({"id": "added-1", "value": "a"}),
                _FakeRecord({"id": "added-2", "value": "b"}),
            ],
        ),
        query_config={},
    )

    assert publish_spy.call_count == 4
    assert [
        call.kwargs["pubsub_name"]
        for call in publish_spy.call_args_list
    ] == ["test-pubsub", "test-pubsub", "test-pubsub", "test-pubsub"]
    assert [call.kwargs["topic"] for call in publish_spy.call_args_list] == [
        "topic-a",
        "topic-b",
        "topic-a",
        "topic-b",
    ]
    assert [call.kwargs["metadata"]["cloudevent.id"] for call in publish_spy.call_args_list] == [
        "query-1:sub-a:7:0",
        "query-1:sub-b:7:1",
        "query-1:sub-a:7:2",
        "query-1:sub-b:7:3",
    ]
    assert [loads(call.kwargs["event"])["payload"]["after"]["id"] for call in publish_spy.call_args_list] == [
        "added-1",
        "added-1",
        "added-2",
        "added-2",
    ]


def test_publish_event_passes_through_arguments_and_sets_json_content_type(mocker) -> None:
    """Verify publish_event forwards the configured arguments to Dapr."""
    router, _, dapr_client, _ = _make_router(mocker)

    router._publish_event(
        pubsub_name="pubsub-a",
        topic="topic-a",
        event={"hello": "world"},
        metadata={"cloudevent.id": "query-1:sub-1:7:0"},
    )

    dapr_client.publish_event.assert_called_once_with(
        pubsub_name="pubsub-a",
        topic_name="topic-a",
        data={"hello": "world"},
        publish_metadata={"cloudevent.id": "query-1:sub-1:7:0"},
        data_content_type="application/json",
    )


def test_publish_event_uses_empty_metadata_when_none(mocker) -> None:
    """Verify publish_event substitutes an empty metadata map when none is supplied."""
    router, _, dapr_client, _ = _make_router(mocker)

    router._publish_event(
        pubsub_name="pubsub-a",
        topic="topic-a",
        event={"hello": "world"},
        metadata=None,
    )

    dapr_client.publish_event.assert_called_once_with(
        pubsub_name="pubsub-a",
        topic_name="topic-a",
        data={"hello": "world"},
        publish_metadata={},
        data_content_type="application/json",
    )
