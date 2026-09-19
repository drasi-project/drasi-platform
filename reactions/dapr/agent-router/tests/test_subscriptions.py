# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

import asyncio
import json
from contextlib import asynccontextmanager
from dataclasses import FrozenInstanceError

import pytest
from dapr.clients.exceptions import DaprInternalError
from drasi_agent_router_contracts import agent_inbox_topic
from drasi_agent_router_contracts.models.Operation import Operation
from drasi_agent_router_contracts.models.SubscribeResponse import Status
from drasi_agent_router_contracts.models.ToolError import Code
from grpc import RpcError

import agent_router.subscriptions as subscriptions_module
from agent_router.subscriptions import SubscriptionError, SubscriptionRegistry
from conftest import removal_request, subscription_request
from fakes import FakeStateStore, StoredState


@pytest.fixture
def registry(state_store: FakeStateStore) -> SubscriptionRegistry:
    return SubscriptionRegistry("drasi-system/router-app", "router-state")


@asynccontextmanager
async def running(registry: SubscriptionRegistry):
    try:
        await registry.initialize()
        yield registry
    finally:
        await registry.close()


def stored_document(store: FakeStateStore, registry: SubscriptionRegistry):
    return json.loads(store.records[registry.state_store_name, registry.state_key].data)


def test_bootstrap_restart_and_empty_registry_are_durable(registry, state_store):
    async def exercise():
        request = subscription_request()
        async with running(registry):
            assert registry.snapshot(request.query_id) == ()
            assert stored_document(state_store, registry) == {
                "format_version": 1,
                "router_id": registry.router_id,
                "rules": [],
            }
            created = await registry.subscribe(request)
            assert created.status == Status.created
            snapshot = registry.snapshot(request.query_id)
        writes = len(state_store.writes)
        async with running(registry):
            assert registry.snapshot(request.query_id) == snapshot
            assert len(state_store.writes) == writes
            updated = await registry.subscribe(subscription_request(operations=("u", "i")))
            assert updated.status == Status.updated
            assert set(updated.operations) == {Operation.i, Operation.u}
            assert updated.topic_name == created.topic_name
            assert len(registry.snapshot(request.query_id)) == 1
            assert (await registry.unsubscribe(removal_request(request))).removed is True
            writes = len(state_store.writes)
            assert (await registry.unsubscribe(removal_request(request))).removed is False
            assert len(state_store.writes) == writes
            assert stored_document(state_store, registry)["rules"] == []
        async with running(registry):
            assert registry.snapshot(request.query_id) == ()
            recreated = await registry.subscribe(subscription_request(incarnation="new"))
            assert recreated.status == Status.created
            assert recreated.topic_name == created.topic_name
        assert all(client.closed for client in state_store.clients)
        assert state_store.writes[0].etag is None
        assert all(write.etag for write in state_store.writes[1:])

    asyncio.run(exercise())


def test_rules_use_all_subscriber_fields_and_share_one_inbox(registry, state_store):
    async def exercise():
        requests = [
            subscription_request(),
            subscription_request(namespace="other"),
            subscription_request(app_id="other"),
            subscription_request(agent_name="OtherAgent"),
            subscription_request(query_id="rollouts"),
        ]
        async with running(registry):
            responses = [await registry.subscribe(request) for request in requests]
            assert len(registry.snapshot("orders.v1")) == 4
            assert len(registry.snapshot("rollouts")) == 1
            assert len({result.topic_name for result in responses[:4]}) == 4
            assert responses[0].topic_name == responses[4].topic_name
            assert len(stored_document(state_store, registry)["rules"]) == 5
        async with running(registry):
            assert len(registry.snapshot("orders.v1")) == 4
            assert len(registry.snapshot("rollouts")) == 1

    asyncio.run(exercise())


def test_incarnation_conflicts_never_write(registry, state_store):
    async def exercise():
        async with running(registry):
            request = subscription_request()
            await registry.subscribe(request)
            original = registry.snapshot(request.query_id)
            writes = len(state_store.writes)
            conflicting = subscription_request(incarnation="another")
            for operation in (
                registry.subscribe(conflicting),
                registry.unsubscribe(removal_request(conflicting)),
            ):
                with pytest.raises(SubscriptionError) as error:
                    await operation
                assert error.value.code == Code.incarnation_conflict
            assert len(state_store.writes) == writes
            assert registry.snapshot(request.query_id) == original

    asyncio.run(exercise())


def test_routing_snapshots_are_isolated_and_do_not_access_storage(registry, state_store):
    async def exercise():
        request = subscription_request()
        async with running(registry):
            response = await registry.subscribe(request)
            snapshot = registry.snapshot(request.query_id)
            reads = len(state_store.reads)
            response.operations.clear()
            request.operations.clear()
            request.subscriber.agent_name = "changed"
            snapshot[0].request().operations.clear()
            with pytest.raises(FrozenInstanceError):
                snapshot[0].topic_name = "changed"
            with pytest.raises(AttributeError):
                snapshot[0].subscriber.agent_name = "changed"
            state_store.read_error = DaprInternalError("unavailable")
            assert registry.snapshot("orders.v1") == snapshot
            assert snapshot[0].operations == frozenset({Operation.i})
            assert len(state_store.reads) == reads

    asyncio.run(exercise())


@pytest.mark.parametrize("failure", ["read", "write"])
def test_outages_preserve_memory_and_durable_rules(registry, state_store, failure, caplog):
    async def exercise():
        async with running(registry):
            request = subscription_request()
            await registry.subscribe(request)
            original = registry.snapshot(request.query_id)
            persisted = dict(state_store.records)
            setattr(
                state_store,
                f"{failure}_error",
                (RpcError if failure == "read" else DaprInternalError)(
                    "private-backend-content"
                ),
            )
            for operation in (
                registry.subscribe(subscription_request(operations=("d",))),
                registry.unsubscribe(removal_request(request)),
            ):
                with pytest.raises(SubscriptionError) as error:
                    await operation
                assert error.value.code == Code.state_unavailable
                assert "private-backend-content" not in str(error.value)
            assert registry.snapshot(request.query_id) == original
            assert state_store.records == persisted
            assert "private-backend-content" not in caplog.text

    asyncio.run(exercise())


def test_absent_unsubscribe_does_not_hide_read_failure(registry, state_store):
    async def exercise():
        async with running(registry):
            state_store.read_error = RpcError("offline")
            with pytest.raises(SubscriptionError) as error:
                await registry.unsubscribe(removal_request(subscription_request()))
            assert error.value.code == Code.state_unavailable

    asyncio.run(exercise())


def test_runtime_missing_or_corrupt_state_is_not_reset(registry, state_store):
    async def exercise():
        async with running(registry):
            request = subscription_request()
            await registry.subscribe(request)
            original = registry.snapshot(request.query_id)
            key = registry.state_store_name, registry.state_key
            writes = len(state_store.writes)
            del state_store.records[key]
            with pytest.raises(SubscriptionError, match="disappeared"):
                await registry.subscribe(request)
            assert registry.snapshot(request.query_id) == original
            state_store.put(key, b"corrupt")
            with pytest.raises(SubscriptionError, match="valid JSON"):
                await registry.unsubscribe(removal_request(request))
            assert state_store.records[key].data == b"corrupt"
            assert len(state_store.writes) == writes
            assert registry.snapshot(request.query_id) == original

    asyncio.run(exercise())


@pytest.mark.parametrize(
    "document",
    [
        None,
        [],
        {},
        {"format_version": True, "router_id": "drasi-system/router-app", "rules": []},
        {"format_version": 1.0, "router_id": "drasi-system/router-app", "rules": []},
        {"format_version": 2, "router_id": "drasi-system/router-app", "rules": []},
        {"format_version": 1, "router_id": "another/router", "rules": []},
        {"format_version": 1, "router_id": "drasi-system/router-app", "rules": {}},
        {"format_version": 1, "router_id": "drasi-system/router-app", "rules": [None]},
        {"format_version": 1, "router_id": "drasi-system/router-app", "rules": [{}]},
        {
            "format_version": 1,
            "router_id": "drasi-system/router-app",
            "rules": [],
            "instructions": "private-state",
        },
    ],
)
def test_invalid_persisted_documents_fail_initialization(registry, state_store, document):
    async def exercise():
        key = registry.state_store_name, registry.state_key
        state_store.put(key, json.dumps(document).encode())
        original = dict(state_store.records)
        with pytest.raises(SubscriptionError) as error:
            async with running(registry):
                pytest.fail("invalid persisted state became ready")
        assert error.value.code == Code.state_unavailable
        assert state_store.records == original
        assert state_store.writes == []
        assert all(client.closed for client in state_store.clients)

    asyncio.run(exercise())


@pytest.mark.parametrize(
    "state",
    [StoredState(b"invalid-json", "1"), StoredState(b"\xff", "1"), StoredState(b"", "1")],
)
def test_invalid_persisted_bytes_are_not_missing_state(registry, state_store, state):
    async def exercise():
        state_store.records[registry.state_store_name, registry.state_key] = state
        with pytest.raises(SubscriptionError):
            async with running(registry):
                pytest.fail("invalid persisted bytes became ready")
        assert state_store.writes == []

    asyncio.run(exercise())


@pytest.mark.parametrize("change", ["duplicate", "topic", "operations", "instructions", "incarnation"])
def test_corrupt_rules_are_not_dropped_or_repaired(registry, state_store, change):
    async def exercise():
        async with running(registry):
            await registry.subscribe(subscription_request())
        document = stored_document(state_store, registry)
        rule = document["rules"][0]
        if change == "duplicate":
            document["rules"].append(dict(rule))
        elif change == "topic":
            rule["topic_name"] = "caller-selected-topic"
        elif change == "operations":
            rule["operations"] = ["i", "i"]
        elif change == "instructions":
            rule["instructions"] = "private-state"
        else:
            rule["subscription_incarnation"] = ""
        state_store.put(
            (registry.state_store_name, registry.state_key),
            json.dumps(document).encode(),
        )
        writes = len(state_store.writes)
        with pytest.raises(SubscriptionError, match="invalid or duplicate"):
            async with running(registry):
                pytest.fail("corrupt rule became ready")
        assert len(state_store.writes) == writes
        assert stored_document(state_store, registry) == document

    asyncio.run(exercise())


def test_etag_support_is_required(registry, state_store):
    async def exercise():
        async with running(registry):
            pass
        key = registry.state_store_name, registry.state_key
        state_store.records[key] = StoredState(state_store.records[key].data, "")
        writes = len(state_store.writes)
        with pytest.raises(SubscriptionError, match="ETags"):
            async with running(registry):
                pytest.fail("state store without ETags became ready")
        assert len(state_store.writes) == writes

    asyncio.run(exercise())


@pytest.mark.parametrize("operation", ["subscribe", "unsubscribe"])
def test_ambiguous_committed_write_is_resolved_by_next_request(
    registry, state_store, operation
):
    async def exercise():
        request = subscription_request()
        async with running(registry):
            if operation == "unsubscribe":
                await registry.subscribe(request)
            original = registry.snapshot(request.query_id)
            state_store.after_write_error = DaprInternalError("response lost")
            with pytest.raises(SubscriptionError):
                if operation == "subscribe":
                    await registry.subscribe(request)
                else:
                    await registry.unsubscribe(removal_request(request))
            assert registry.snapshot(request.query_id) == original
            state_store.after_write_error = None
            if operation == "subscribe":
                response = await registry.subscribe(request)
                assert response.status == Status.updated
                assert len(registry.snapshot(request.query_id)) == 1
            else:
                response = await registry.unsubscribe(removal_request(request))
                assert response.removed is False
                assert registry.snapshot(request.query_id) == ()

    asyncio.run(exercise())


def test_inflight_writes_do_not_change_snapshots_and_requests_are_serialized(
    registry, state_store
):
    async def exercise():
        async with running(registry):
            started, release = asyncio.Event(), asyncio.Event()

            async def block_write():
                started.set()
                await release.wait()

            state_store.before_write = block_write
            first = asyncio.create_task(registry.subscribe(subscription_request()))
            second = None
            try:
                await asyncio.wait_for(started.wait(), timeout=1)
                second = asyncio.create_task(
                    registry.subscribe(subscription_request(query_id="rollouts"))
                )
                await asyncio.sleep(0)
                assert registry.snapshot("orders.v1") == ()
                assert registry.snapshot("rollouts") == ()
                assert not first.done()
                assert not second.done()
            finally:
                release.set()
                await first
                if second is not None:
                    await second
            assert len(registry.snapshot("orders.v1")) == 1
            assert len(registry.snapshot("rollouts")) == 1
            assert len(stored_document(state_store, registry)["rules"]) == 2

    asyncio.run(exercise())


def test_cas_conflict_does_not_overwrite_a_newer_snapshot(registry, state_store):
    async def exercise():
        request = subscription_request()
        async with running(registry):
            async def competing_write():
                state_store.before_write = None
                other = SubscriptionRegistry(registry.router_id, registry.state_store_name)
                async with running(other):
                    await other.subscribe(subscription_request(query_id="rollouts"))

            state_store.before_write = competing_write
            with pytest.raises(SubscriptionError) as error:
                await registry.subscribe(request)
            assert error.value.code == Code.state_unavailable
            assert registry.snapshot(request.query_id) == ()
            assert [rule["query_id"] for rule in stored_document(state_store, registry)["rules"]] == [
                "rollouts"
            ]
            await registry.subscribe(request)
            assert len(registry.snapshot(request.query_id)) == 1
            assert len(registry.snapshot("rollouts")) == 1
            assert len(stored_document(state_store, registry)["rules"]) == 2

    asyncio.run(exercise())


def test_request_timeout_leaves_the_previous_view(registry, state_store, monkeypatch):
    async def exercise():
        async with running(registry):
            async def never_complete():
                await asyncio.Event().wait()

            state_store.before_write = never_complete
            monkeypatch.setattr(subscriptions_module, "_STATE_TIMEOUT_SECONDS", 0.01)
            with pytest.raises(SubscriptionError) as error:
                await registry.subscribe(subscription_request())
            assert error.value.code == Code.state_unavailable
            assert registry.snapshot("orders.v1") == ()
            assert stored_document(state_store, registry)["rules"] == []

    asyncio.run(exercise())


def test_router_identity_and_configured_component_select_state(registry, state_store):
    async def exercise():
        request = subscription_request(agent_name="Agent \u03b1")
        async with running(registry):
            first = await registry.subscribe(request)
        for router_id, component in (
            ("another/router-app", registry.state_store_name),
            (registry.router_id, "another-state-component"),
        ):
            other = SubscriptionRegistry(router_id, component)
            async with running(other):
                assert other.snapshot(request.query_id) == ()
                result = await other.subscribe(request)
                assert result.topic_name == agent_inbox_topic(router_id, request.subscriber)
                if router_id != registry.router_id:
                    assert other.state_key != registry.state_key
                    assert result.topic_name != first.topic_name
        assert len(state_store.records) == 3

    asyncio.run(exercise())


@pytest.mark.parametrize("field", ["query_id", "subscription_incarnation", "agent_name"])
def test_non_utf8_identity_is_rejected_before_state_access(registry, state_store, field):
    async def exercise():
        async with running(registry):
            request = subscription_request()
            removal = removal_request(request)
            if field == "agent_name":
                request.subscriber.agent_name = "\ud800"
                removal.subscriber.agent_name = "\ud800"
            else:
                setattr(request, field, "\ud800")
                setattr(removal, field, "\ud800")
            reads, writes = len(state_store.reads), len(state_store.writes)
            with pytest.raises(ValueError):
                await registry.subscribe(request)
            with pytest.raises(ValueError):
                await registry.unsubscribe(removal)
            assert len(state_store.reads) == reads
            assert len(state_store.writes) == writes

    asyncio.run(exercise())
