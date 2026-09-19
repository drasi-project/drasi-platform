# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

import asyncio
import json
import logging
from contextlib import asynccontextmanager

import httpx
import pytest
from dapr.clients.exceptions import DaprInternalError
from drasi_agent_router_contracts import AgentDelivery, parse
from grpc import RpcError

import agent_router.forwarding as forwarding_module
from conftest import cloud_event, removal_request, subscription_request

CATALOG = {
    "orders.v1": "title: Orders\ndescription: Order result changes.\n",
    "other-query": "title: Other\ndescription: Another result stream.\n",
}
ROUTE = "/_drasi/events/orders.v1"


@asynccontextmanager
async def running(app):
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://router.test"
        ) as client:
            yield client


def event(**changes):
    document = cloud_event("orders.v1", secret="private-row")
    document["data"]["sequence"] = 42
    document["data"].update(changes)
    return document


def deliveries(pubsub):
    return [parse(AgentDelivery, json.loads(item.data)) for item in pubsub.published]


def test_mixed_batch_uses_one_snapshot_and_conversion_before_filtering(
    app_factory, pubsub, state_store, monkeypatch, caplog
):
    app = app_factory(CATALOG)
    registry = app.state.subscriptions
    snapshots, conversions = [], []
    snapshot = registry.snapshot
    unpack = forwarding_module.unpack_change

    def take_snapshot(query_id):
        snapshots.append(query_id)
        return snapshot(query_id)

    def convert(change, *, unpacked_at_ms):
        conversions.append(change)
        return unpack(change, unpacked_at_ms=unpacked_at_ms)

    monkeypatch.setattr(registry, "snapshot", take_snapshot)
    monkeypatch.setattr(forwarding_module, "unpack_change", convert)
    monkeypatch.setattr(forwarding_module, "time_ns", lambda: 2_000_000_000)
    caplog.set_level(logging.INFO)

    async def exercise():
        async with running(app) as client:
            first = await registry.subscribe(
                subscription_request(
                    operations=("i", "d"), agent_name="First", incarnation="first"
                )
            )
            second = await registry.subscribe(
                subscription_request(
                    operations=("u", "d"), agent_name="Second", incarnation="second"
                )
            )
            await registry.subscribe(subscription_request(query_id="other-query"))
            reads = len(state_store.reads)
            state_store.read_error = DaprInternalError("private-state-outage")
            response = await client.post(
                ROUTE,
                json=event(
                    addedResults=[{"id": "a", "secret": "private-row"}, {}],
                    updatedResults=[
                        {"before": {"id": "b"}, "after": {"id": "b", "v": 2}}
                    ],
                    deletedResults=[{"id": "c"}],
                ),
            )
            assert response.json() == {"status": "SUCCESS"}
            assert len(state_store.reads) == reads
            assert snapshots == ["orders.v1"]
            assert len(conversions) == 1
            assert [item.topic_name for item in pubsub.published] == [
                first.topic_name,
                first.topic_name,
                second.topic_name,
                first.topic_name,
                second.topic_name,
            ]
        assert all(client.closed for client in pubsub.clients)

    asyncio.run(exercise())
    received = deliveries(pubsub)
    assert [item.eventId for item in received] == [
        "drasi:v1:orders.v1:42:i:0",
        "drasi:v1:orders.v1:42:i:1",
        "drasi:v1:orders.v1:42:u:0",
        "drasi:v1:orders.v1:42:d:0",
        "drasi:v1:orders.v1:42:d:0",
    ]
    assert [item.subscriptionIncarnation for item in received] == [
        "first",
        "first",
        "second",
        "first",
        "second",
    ]
    assert all(item.routerId == "drasi-system/router-app" for item in received)
    assert all(item.event.ts_ms == 2000 for item in received)
    assert all(item.event.payload.source.ts_ms == 1000 for item in received)
    assert received[-1].event == received[-2].event
    assert all(item.pubsub_name == "router-egress" for item in pubsub.published)
    assert all(
        item.data_content_type == "application/json" for item in pubsub.published
    )
    assert all("metadata" not in json.loads(item.data) for item in pubsub.published)
    assert "private-row" not in caplog.text
    assert "private-state-outage" not in caplog.text


@pytest.mark.parametrize(
    "case", ["no-rules", "filtered", "other-query", "empty", "control"]
)
def test_intentional_no_publication_is_success(app_factory, pubsub, case):
    app = app_factory(CATALOG)

    async def exercise():
        async with running(app) as client:
            document = event()
            if case == "filtered":
                await app.state.subscriptions.subscribe(
                    subscription_request(operations=("u", "d"))
                )
            elif case == "other-query":
                await app.state.subscriptions.subscribe(
                    subscription_request(query_id="other-query")
                )
            elif case in ("empty", "control"):
                await app.state.subscriptions.subscribe(subscription_request())
                if case == "empty":
                    document["data"]["addedResults"] = []
                else:
                    document = cloud_event("orders.v1", kind="control")
            assert (await client.post(ROUTE, json=document)).json() == {
                "status": "SUCCESS"
            }
            assert pubsub.attempts == []

    asyncio.run(exercise())


@pytest.mark.parametrize("subscribed", [False, True])
@pytest.mark.parametrize(
    "changes",
    [
        {"addedResults": [None]},
        {"updatedResults": [{"before": {}, "after": None}]},
        {"deletedResults": [None]},
        {"sequence": -1},
    ],
)
def test_unsupported_batch_drops_before_any_publication(
    app_factory, pubsub, subscribed, changes, caplog
):
    app = app_factory(CATALOG)

    async def exercise():
        async with running(app) as client:
            if subscribed:
                await app.state.subscriptions.subscribe(
                    subscription_request(operations=("i", "u", "d"))
                )
            result = await client.post(ROUTE, json=event(**changes))
            assert result.json() == {"status": "DROP"}
            assert pubsub.attempts == []

    asyncio.run(exercise())
    assert "private-row" not in caplog.text
    records = [
        record
        for record in caplog.records
        if record.getMessage() == "router_invalid_packed_change"
    ]
    assert len(records) == 1
    assert records[0].outcome == "DROP"


@pytest.mark.parametrize(
    "error_type", [RpcError, DaprInternalError, asyncio.TimeoutError]
)
def test_publication_failure_retries_without_logging_payload_or_transport_details(
    app_factory, pubsub, error_type, caplog
):
    app = app_factory(CATALOG)
    pubsub.error = error_type("private-transport-details")

    async def exercise():
        async with running(app) as client:
            await app.state.subscriptions.subscribe(subscription_request())
            response = await client.post(
                ROUTE, json=event(addedResults=[{"value": "private-row"}, {}])
            )
            assert response.json() == {"status": "RETRY"}
            assert len(pubsub.attempts) == 1
            assert pubsub.published == []

    asyncio.run(exercise())
    assert "private-row" not in caplog.text
    assert "private-transport-details" not in caplog.text
    records = [
        record
        for record in caplog.records
        if record.getMessage() == "router_publication_failed"
    ]
    assert len(records) == 1
    assert records[0].accepted_publications == 0
    assert records[0].outcome == "RETRY"


def test_partial_failure_repeats_successes_and_uses_current_rules_on_retry(
    app_factory, pubsub, monkeypatch
):
    app = app_factory(CATALOG)
    registry = app.state.subscriptions
    first_request = subscription_request(agent_name="First", incarnation="first")
    failed_request = subscription_request(agent_name="Second", incarnation="failed")
    later_request = subscription_request(agent_name="Later", incarnation="later")
    document = event(addedResults=[{"id": "a"}, {"id": "b"}])
    monkeypatch.setattr(forwarding_module, "time_ns", lambda: 2_000_000_000)

    async def fail_second(_publication):
        if len(pubsub.attempts) == 2:
            raise RpcError("unavailable")

    async def exercise():
        async with running(app) as client:
            first = await registry.subscribe(first_request)
            failed = await registry.subscribe(failed_request)
            pubsub.before_publish = fail_second
            assert (await client.post(ROUTE, json=document)).json() == {
                "status": "RETRY"
            }
            assert [item.topic_name for item in pubsub.attempts] == [
                first.topic_name,
                failed.topic_name,
            ]
            assert len(pubsub.published) == 1

            await registry.unsubscribe(removal_request(failed_request))
            later = await registry.subscribe(later_request)
            pubsub.before_publish = None
            monkeypatch.setattr(forwarding_module, "time_ns", lambda: 3_000_000_000)
            assert (await client.post(ROUTE, json=document)).json() == {
                "status": "SUCCESS"
            }
            assert [item.topic_name for item in pubsub.published] == [
                first.topic_name,
                first.topic_name,
                later.topic_name,
                first.topic_name,
                later.topic_name,
            ]

    asyncio.run(exercise())
    received = deliveries(pubsub)
    assert received[0].eventId == received[1].eventId
    assert received[0].event.ts_ms == 2000
    assert all(item.event.ts_ms == 3000 for item in received[1:])
    assert [item.subscriptionIncarnation for item in received] == [
        "first",
        "first",
        "later",
        "first",
        "later",
    ]


def test_mid_attempt_mutations_do_not_change_the_snapshot(app_factory, pubsub):
    app = app_factory(CATALOG)
    registry = app.state.subscriptions
    first_request = subscription_request(agent_name="First")
    document = event(addedResults=[{"id": "a"}, {"id": "b"}])

    async def exercise():
        started, release = asyncio.Event(), asyncio.Event()

        async def hold_first_publication(_publication):
            if len(pubsub.attempts) == 1:
                started.set()
                await release.wait()

        async with running(app) as client:
            first = await registry.subscribe(first_request)
            pubsub.before_publish = hold_first_publication
            pending = asyncio.create_task(client.post(ROUTE, json=document))
            try:
                await asyncio.wait_for(started.wait(), timeout=1)
                await asyncio.wait_for(
                    registry.unsubscribe(removal_request(first_request)), timeout=1
                )
                later = await asyncio.wait_for(
                    registry.subscribe(subscription_request(agent_name="Later")),
                    timeout=1,
                )
                assert not pending.done()
            finally:
                release.set()
                response = await pending
            assert response.json() == {"status": "SUCCESS"}
            assert [item.topic_name for item in pubsub.published] == [
                first.topic_name,
                first.topic_name,
            ]
            assert (await client.post(ROUTE, json=document)).json() == {
                "status": "SUCCESS"
            }
            assert [item.topic_name for item in pubsub.published[2:]] == [
                later.topic_name,
                later.topic_name,
            ]

    asyncio.run(exercise())


def test_publication_deadline_is_retryable(app_factory, pubsub, monkeypatch):
    app = app_factory(CATALOG)
    monkeypatch.setattr(forwarding_module, "_PUBLISH_TIMEOUT_SECONDS", 0.01)

    async def never_complete(_publication):
        await asyncio.Event().wait()

    async def exercise():
        async with running(app) as client:
            await app.state.subscriptions.subscribe(subscription_request())
            pubsub.before_publish = never_complete
            response = await asyncio.wait_for(
                client.post(ROUTE, json=event()), timeout=1
            )
            assert response.json() == {"status": "RETRY"}
            assert len(pubsub.attempts) == 1
            assert pubsub.published == []

    asyncio.run(exercise())


@pytest.mark.parametrize("unavailable", ["publisher", "subscriptions"])
def test_uninitialized_dependencies_do_not_acknowledge(
    app_factory, pubsub, unavailable
):
    app = app_factory(CATALOG)

    async def exercise():
        async with running(app) as client:
            await app.state.subscriptions.subscribe(subscription_request())
            dependency = (
                app.state.forwarder
                if unavailable == "publisher"
                else app.state.subscriptions
            )
            await dependency.close()
            assert (await client.post(ROUTE, json=event())).json() == {
                "status": "RETRY"
            }
            assert pubsub.attempts == []

    asyncio.run(exercise())


def test_internal_conversion_error_is_not_classified_as_poison(
    app_factory, pubsub, monkeypatch
):
    app = app_factory(CATALOG)

    def fail_conversion(*_args, **_kwargs):
        raise ValueError("invalid caller configuration")

    monkeypatch.setattr(forwarding_module, "unpack_change", fail_conversion)

    async def exercise():
        async with running(app) as client:
            await app.state.subscriptions.subscribe(subscription_request())
            assert (await client.post(ROUTE, json=event())).json() == {
                "status": "RETRY"
            }
            assert pubsub.attempts == []

    asyncio.run(exercise())
