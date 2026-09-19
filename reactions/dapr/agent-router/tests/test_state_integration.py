# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

import asyncio
import json
import os
import uuid
from contextlib import asynccontextmanager

import pytest
from dapr.aio.clients import DaprClient
from dapr.clients.exceptions import DaprInternalError
from dapr.clients.grpc._state import Concurrency, Consistency, StateOptions
from drasi_agent_router_contracts.models.SubscribeResponse import Status
from drasi_agent_router_contracts.models.ToolError import Code

from agent_router.subscriptions import SubscriptionError, SubscriptionRegistry
from conftest import removal_request, subscription_request

pytestmark = [
    pytest.mark.integration,
    pytest.mark.skipif(
        not os.getenv("DRASI_ROUTER_TEST_STATE_STORE"),
        reason="Run make test-state-integration with Docker and Docker Compose",
    ),
]


@asynccontextmanager
async def live_state():
    registry = SubscriptionRegistry(
        f"state-tests/router-{uuid.uuid4().hex}",
        os.environ["DRASI_ROUTER_TEST_STATE_STORE"],
    )
    async with DaprClient() as client:
        try:
            await registry.initialize()
            yield registry, client
        finally:
            await registry.close()
            state = await client.get_state(
                store_name=registry.state_store_name, key=registry.state_key
            )
            if state.data:
                await client.delete_state(
                    store_name=registry.state_store_name,
                    key=registry.state_key,
                    etag=state.etag,
                    options=StateOptions(concurrency=Concurrency.first_write),
                )


def test_real_state_restores_rules_after_registry_replacement():
    async def exercise():
        async with live_state() as (registry, _):
            request = subscription_request()
            result = await registry.subscribe(request)
            assert result.status == Status.created
            expected = registry.snapshot(request.query_id)
            await registry.close()
            replacement = SubscriptionRegistry(registry.router_id, registry.state_store_name)
            try:
                await replacement.initialize()
                assert replacement.snapshot(request.query_id) == expected
                repeated = await replacement.subscribe(request)
                assert repeated.status == Status.updated
                assert (await replacement.unsubscribe(removal_request(request))).removed is True
                assert (await replacement.unsubscribe(removal_request(request))).removed is False
                assert replacement.snapshot(request.query_id) == ()
            finally:
                await replacement.close()

    asyncio.run(exercise())


def test_real_state_rejects_a_stale_etag_without_losing_rules():
    async def exercise():
        async with live_state() as (registry, client):
            stale = await client.get_state(
                store_name=registry.state_store_name, key=registry.state_key
            )
            assert stale.etag
            request = subscription_request()
            await registry.subscribe(request)
            with pytest.raises(DaprInternalError):
                await client.save_state(
                    store_name=registry.state_store_name,
                    key=registry.state_key,
                    value=stale.data,
                    etag=stale.etag,
                    options=StateOptions(
                        concurrency=Concurrency.first_write,
                        consistency=Consistency.strong,
                    ),
                )
            await registry.close()
            await registry.initialize()
            assert len(registry.snapshot(request.query_id)) == 1

    asyncio.run(exercise())


def test_real_state_rejects_unsupported_format_without_repairing_it():
    async def exercise():
        async with live_state() as (registry, client):
            state = await client.get_state(
                store_name=registry.state_store_name, key=registry.state_key
            )
            document = json.loads(state.data)
            document["format_version"] = 2
            await client.save_state(
                store_name=registry.state_store_name,
                key=registry.state_key,
                value=json.dumps(document),
                etag=state.etag,
                options=StateOptions(concurrency=Concurrency.first_write),
            )
            await registry.close()
            with pytest.raises(SubscriptionError, match="format_version 1"):
                await registry.initialize()
            remaining = await client.get_state(
                store_name=registry.state_store_name, key=registry.state_key
            )
            assert json.loads(remaining.data)["format_version"] == 2

    asyncio.run(exercise())


def test_real_missing_component_reports_state_unavailable():
    async def exercise():
        unavailable = SubscriptionRegistry(
            f"state-tests/router-{uuid.uuid4().hex}", f"missing-{uuid.uuid4().hex}"
        )
        try:
            with pytest.raises(SubscriptionError) as error:
                await unavailable.initialize()
            assert error.value.code == Code.state_unavailable
        finally:
            await unavailable.close()

    asyncio.run(exercise())


def test_real_operator_cleanup_is_scoped_and_survives_restart():
    async def exercise():
        async with live_state() as (registry, _):
            request = subscription_request()
            other = subscription_request(app_id="another-app")
            for item in (
                request,
                subscription_request(query_id="retired-query", incarnation="other-life"),
                other,
            ):
                await registry.subscribe(item)
            assert await registry.remove_rule(request.query_id, request.subscriber) is True
            assert await registry.remove_rule(request.query_id, request.subscriber) is False
            await registry.close()
            await registry.initialize()
            assert len(registry.list_rules()) == 2
            assert await registry.remove_subscriber_rules(request.subscriber) == 1
            assert await registry.remove_subscriber_rules(request.subscriber) == 0
            await registry.close()
            await registry.initialize()
            assert len(registry.list_rules()) == 1
            assert registry.list_rules()[0].subscriber.app_id == "another-app"
            assert await registry.remove_subscriber_rules(other.subscriber) == 1
            await registry.close()
            await registry.initialize()
            assert registry.list_rules() == ()

    asyncio.run(exercise())
