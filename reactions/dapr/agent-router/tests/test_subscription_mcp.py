# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

import asyncio
import json
from typing import TypeVar

import httpx
import pytest
from drasi_agent_router_contracts import (
    SubscribeResponse,
    ToolError,
    UnsubscribeResponse,
    agent_inbox_topic,
    parse,
    to_wire,
)
from drasi_agent_router_contracts.models.Operation import Operation
from drasi_agent_router_contracts.models.SubscribeResponse import Status
from drasi_agent_router_contracts.models.ToolError import Code
from grpc import RpcError
from jsonschema import Draft202012Validator
from mcp import types
from pydantic import BaseModel

from conftest import (
    cloud_event,
    mcp_session,
    removal_request,
    subscription_request,
)

CATALOG = {"orders.v1": "title: Orders\ndescription: Newly matching orders.\n"}
ModelT = TypeVar("ModelT", bound=BaseModel)


def success(result: types.CallToolResult, model: type[ModelT]) -> ModelT:
    assert result.isError is False
    assert result.structuredContent is not None
    assert len(result.content) == 1
    assert isinstance(result.content[0], types.TextContent)
    assert json.loads(result.content[0].text) == result.structuredContent
    return parse(model, result.structuredContent)


def error(result: types.CallToolResult, code: Code) -> ToolError:
    assert result.isError is True
    assert result.structuredContent is None
    assert len(result.content) == 1
    assert isinstance(result.content[0], types.TextContent)
    value = parse(ToolError, json.loads(result.content[0].text))
    assert value.code == code
    return value


def test_subscription_roundtrips_and_shared_schemas(app_factory):
    app = app_factory(CATALOG)

    async def exercise():
        request = subscription_request(operations=("u", "i"))
        async with mcp_session(app) as (session, get_session_id):
            tools = {tool.name: tool for tool in (await session.list_tools()).tools}
            for name in ("subscribe", "unsubscribe"):
                tool = tools[name]
                assert tool.inputSchema["additionalProperties"] is False
                assert tool.outputSchema is not None
                Draft202012Validator.check_schema(tool.inputSchema)
                Draft202012Validator.check_schema(tool.outputSchema)
                assert '"$ref"' not in json.dumps(tool.inputSchema)
                assert '"$ref"' not in json.dumps(tool.outputSchema)

            created = await session.call_tool("subscribe", to_wire(request))
            response = success(created, SubscribeResponse)
            assert response.status == Status.created
            assert response.query_id == request.query_id
            assert response.subscription_incarnation == request.subscription_incarnation
            assert set(response.operations) == {Operation.i, Operation.u}
            assert response.topic_name == agent_inbox_topic(
                "drasi-system/router-app", request.subscriber
            )
            Draft202012Validator(tools["subscribe"].outputSchema).validate(
                created.structuredContent
            )
            updated = success(
                await session.call_tool(
                    "subscribe", to_wire(subscription_request(operations=("d",)))
                ),
                SubscribeResponse,
            )
            assert updated.status == Status.updated
            assert updated.operations == [Operation.d]
            assert updated.topic_name == response.topic_name
            assert get_session_id() is None

            async with httpx.AsyncClient(
                transport=httpx.ASGITransport(app=app), base_url="http://router.test"
            ) as http:
                delivery = await http.post(
                    "/_drasi/events/orders.v1", json=cloud_event("orders.v1")
                )
                assert delivery.json() == {"status": "RETRY"}

            removal = to_wire(removal_request(request))
            deleted = await session.call_tool("unsubscribe", removal)
            assert success(deleted, UnsubscribeResponse).removed is True
            Draft202012Validator(tools["unsubscribe"].outputSchema).validate(
                deleted.structuredContent
            )
            absent = await session.call_tool("unsubscribe", removal)
            assert success(absent, UnsubscribeResponse).removed is False

    asyncio.run(exercise())


def test_query_and_incarnation_errors_do_not_mutate_rules(app_factory, state_store):
    app = app_factory(CATALOG)

    async def exercise():
        request = subscription_request()
        async with mcp_session(app) as (session, _):
            success(
                await session.call_tool("subscribe", to_wire(request)),
                SubscribeResponse,
            )
            writes = len(state_store.writes)
            conflict = subscription_request(incarnation="another-lifecycle")
            error(
                await session.call_tool("subscribe", to_wire(conflict)),
                Code.incarnation_conflict,
            )
            error(
                await session.call_tool("unsubscribe", to_wire(removal_request(conflict))),
                Code.incarnation_conflict,
            )
            error(
                await session.call_tool(
                    "subscribe", to_wire(subscription_request(query_id="unknown"))
                ),
                Code.unknown_query,
            )
            absent = await session.call_tool(
                "unsubscribe",
                to_wire(removal_request(subscription_request(query_id="unknown"))),
            )
            assert success(absent, UnsubscribeResponse).removed is False
            assert len(state_store.writes) == writes
            assert len(app.state.subscriptions.snapshot(request.query_id)) == 1

    asyncio.run(exercise())


@pytest.mark.parametrize(
    "invalid",
    [
        {"operations": []},
        {"operations": ["i", "i"]},
        {"operations": ["invalid"]},
        {"subscription_incarnation": ""},
        {"subscriber": {"namespace": "bad/name", "app_id": "app", "agent_name": "agent"}},
        {"instructions": "private-instructions"},
        {"topic_name": "private-topic"},
        {"ttl": 300},
        {"pubsub_name": "private-broker"},
    ],
)
def test_invalid_arguments_use_sanitized_tool_errors(
    app_factory, state_store, invalid, caplog
):
    app = app_factory(CATALOG)

    async def exercise():
        async with mcp_session(app) as (session, _):
            writes = len(state_store.writes)
            value = error(
                await session.call_tool(
                    "subscribe", {**to_wire(subscription_request()), **invalid}
                ),
                Code.invalid_arguments,
            )
            assert len(state_store.writes) == writes
            assert app.state.subscriptions.snapshot("orders.v1") == ()
            for secret in ("private-instructions", "private-topic", "private-broker"):
                assert secret not in value.message
                assert secret not in caplog.text

    asyncio.run(exercise())


@pytest.mark.parametrize("operation", ["subscribe", "unsubscribe"])
def test_storage_failure_is_an_error_not_a_success_or_empty_default(
    app_factory, state_store, operation, caplog
):
    app = app_factory(CATALOG)

    async def exercise():
        request = subscription_request()
        async with mcp_session(app) as (session, _):
            success(
                await session.call_tool("subscribe", to_wire(request)),
                SubscribeResponse,
            )
            snapshot = app.state.subscriptions.snapshot(request.query_id)
            state_store.read_error = RpcError("private-store-response")
            arguments = to_wire(request if operation == "subscribe" else removal_request(request))
            result = await session.call_tool(operation, arguments)
            value = error(result, Code.state_unavailable)
            assert "private-store-response" not in value.message
            assert "private-store-response" not in caplog.text
            assert app.state.subscriptions.snapshot(request.query_id) == snapshot
            assert app.state.reaction.is_ready is True
            assert (await session.call_tool("list_queries", {})).isError is False

    asyncio.run(exercise())


def test_retired_query_rules_survive_restart_and_can_be_unsubscribed(
    app_factory, query_directory
):
    async def exercise():
        request = subscription_request()
        app = app_factory(CATALOG)
        async with mcp_session(app) as (session, _):
            await session.call_tool("subscribe", to_wire(request))

        (query_directory / request.query_id).unlink()
        restarted = app_factory()
        async with mcp_session(restarted) as (session, _):
            assert len(restarted.state.subscriptions.snapshot(request.query_id)) == 1
            catalog = await session.call_tool("list_queries", {})
            assert catalog.structuredContent["queries"] == []
            error(
                await session.call_tool("subscribe", to_wire(request)),
                Code.unknown_query,
            )
            removed = await session.call_tool("unsubscribe", to_wire(removal_request(request)))
            assert success(removed, UnsubscribeResponse).removed is True

    asyncio.run(exercise())
