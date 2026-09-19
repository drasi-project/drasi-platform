# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

import asyncio
import json
from contextlib import asynccontextmanager

import httpx
import pytest
from dapr.clients.exceptions import DaprInternalError
from drasi_agent_router_contracts import agent_inbox_topic, to_wire
from grpc import RpcError
from starlette.exceptions import HTTPException

from conftest import mcp_session, subscription_request


@asynccontextmanager
async def running_app(app):
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://router.test"
        ) as client:
            yield client


def single_removal(request):
    return {
        "query_id": request.query_id,
        "subscriber": to_wire(request.subscriber),
    }


def test_list_rules_filters_the_complete_confirmed_snapshot(app_factory, state_store):
    app = app_factory()
    requests = [
        subscription_request(query_id="retired-query"),
        subscription_request(),
        subscription_request(namespace="other"),
        subscription_request(app_id="other"),
        subscription_request(agent_name="OtherAgent"),
    ]

    async def exercise():
        async with running_app(app) as client:
            registry = app.state.subscriptions
            for request in requests:
                await registry.subscribe(request)
            reads = len(state_store.reads)
            state_store.read_error = RpcError("backend unavailable")

            response = await client.get("/admin/rules")
            assert response.status_code == 200
            result = response.json()
            assert result["router_id"] == registry.router_id
            assert result["view"] == "routing_snapshot"
            expected = [
                {
                    **to_wire(request),
                    "topic_name": agent_inbox_topic(registry.router_id, request.subscriber),
                }
                for request in sorted(
                    requests,
                    key=lambda item: (
                        item.query_id,
                        item.subscriber.namespace,
                        item.subscriber.app_id,
                        item.subscriber.agent_name,
                    ),
                )
            ]
            assert result["rules"] == expected

            query = await client.get("/admin/rules", params={"query_id": "retired-query"})
            assert query.json()["rules"] == expected[-1:]
            subscriber = to_wire(requests[0].subscriber)
            selected = await client.get("/admin/rules", params=subscriber)
            assert len(selected.json()["rules"]) == 2
            combined = await client.get(
                "/admin/rules", params={**subscriber, "query_id": "retired-query"}
            )
            assert combined.json()["rules"] == expected[-1:]
            absent = await client.get("/admin/rules", params={"query_id": "absent"})
            assert absent.json()["rules"] == []
            assert (await client.get("/readyz")).status_code == 200
            assert len(state_store.reads) == reads

    asyncio.run(exercise())


def test_operator_cleanup_is_durable_scoped_and_not_suspension(app_factory, state_store):
    app = app_factory()
    request = subscription_request()
    same_agent = subscription_request(query_id="retired-query", incarnation="other-life")
    other_agent = subscription_request(app_id="another-app")

    async def exercise():
        async with running_app(app) as client:
            registry = app.state.subscriptions
            for item in (request, same_agent, other_agent):
                await registry.subscribe(item)
            writes = len(state_store.writes)
            deleted = await client.post("/admin/rules/remove", json=single_removal(request))
            assert deleted.json() == {"removed": True}
            assert len(state_store.writes) == writes + 1
            repeated = await client.post(
                "/admin/rules/remove", json=single_removal(request)
            )
            assert repeated.json() == {"removed": False}
            assert len(state_store.writes) == writes + 1
            assert len(registry.list_rules()) == 2

        restarted = app_factory()
        async with running_app(restarted) as client:
            registry = restarted.state.subscriptions
            assert len(registry.list_rules()) == 2
            recreated = await registry.subscribe(request)
            assert recreated.status.value == "created"
            writes = len(state_store.writes)
            body = {"subscriber": to_wire(request.subscriber)}
            removed = await client.post("/admin/subscribers/remove-rules", json=body)
            assert removed.json() == {"removed_count": 2}
            assert len(state_store.writes) == writes + 1
            assert len(registry.list_rules()) == 1
            assert registry.list_rules()[0].subscriber.app_id == "another-app"
            repeated = await client.post("/admin/subscribers/remove-rules", json=body)
            assert repeated.json() == {"removed_count": 0}
            assert len(state_store.writes) == writes + 1
            await client.post(
                "/admin/subscribers/remove-rules",
                json={"subscriber": to_wire(other_agent.subscriber)},
            )
            state = state_store.records[registry.state_store_name, registry.state_key]
            assert json.loads(state.data)["rules"] == []
        async with running_app(app_factory()) as client:
            assert (await client.get("/admin/rules")).json()["rules"] == []

    asyncio.run(exercise())


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"subscriber": None},
        {"subscriber": {}},
        {"subscriber": {"namespace": "applications", "app_id": "agent-app"}},
        {"subscriber": {"namespace": "", "app_id": "agent-app", "agent_name": "Agent"}},
        {"subscriber": {"namespace": "bad/name", "app_id": "agent-app", "agent_name": "Agent"}},
        {"subscriber": {"namespace": "applications\n", "app_id": "agent-app", "agent_name": "Agent"}},
        {"subscriber": {"namespace": "applications", "app_id": "agent-app", "agent_name": ""}},
        {"subscriber": {"namespace": "applications", "app_id": "agent-app", "agent_name": "\ud800"}},
        {"subscriber": {"namespace": "applications", "app_id": "agent-app", "agent_name": 1}},
        {"subscriber": {**to_wire(subscription_request().subscriber), "token": "private-token"}},
        {"subscriber": to_wire(subscription_request().subscriber), "instructions": "private-instructions"},
        {"subscriber": to_wire(subscription_request().subscriber), "all": True},
    ],
)
@pytest.mark.parametrize("path", ["/admin/rules/remove", "/admin/subscribers/remove-rules"])
def test_cleanup_rejects_incomplete_or_extra_arguments(
    app_factory, state_store, caplog, payload, path
):
    app = app_factory()
    request = subscription_request()
    if path == "/admin/rules/remove":
        payload = {"query_id": request.query_id, **payload}

    async def exercise():
        async with running_app(app) as client:
            await app.state.subscriptions.subscribe(request)
            writes = len(state_store.writes)
            response = await client.post(
                path,
                content=json.dumps(payload),
                headers={"content-type": "application/json"},
            )
            assert response.status_code == 422
            assert response.json()["code"] == "invalid_arguments"
            assert len(state_store.writes) == writes
            assert len(app.state.subscriptions.list_rules()) == 1
            assert "private-token" not in response.text + caplog.text
            assert "private-instructions" not in response.text + caplog.text

    asyncio.run(exercise())


@pytest.mark.parametrize("query_id", [None, "", 1, "\ud800"])
def test_single_cleanup_requires_a_valid_query(app_factory, state_store, query_id):
    app = app_factory()

    async def exercise():
        async with running_app(app) as client:
            writes = len(state_store.writes)
            response = await client.post(
                "/admin/rules/remove",
                content=json.dumps({
                    "query_id": query_id,
                    "subscriber": to_wire(subscription_request().subscriber),
                }),
                headers={"content-type": "application/json"},
            )
            assert response.status_code == 422
            assert len(state_store.writes) == writes

    asyncio.run(exercise())


@pytest.mark.parametrize("path", ["/admin/rules/remove", "/admin/subscribers/remove-rules"])
def test_invalid_utf8_body_uses_the_sanitized_error_contract(
    app_factory, state_store, capsys, path
):
    app = app_factory()
    request = subscription_request(agent_name="private-raw-body")
    body = {"subscriber": to_wire(request.subscriber)}
    if path == "/admin/rules/remove":
        body["query_id"] = request.query_id
    encoded = json.dumps(body).encode("utf-8").replace(
        b"private-raw-body", b"\xffprivate-raw-body"
    )

    async def exercise():
        async with running_app(app) as client:
            writes = len(state_store.writes)
            response = await client.post(
                path, content=encoded, headers={"content-type": "application/json"}
            )
            assert response.status_code == 422
            assert response.json()["code"] == "invalid_arguments"
            assert "private-raw-body" not in response.text
            assert len(state_store.writes) == writes

    asyncio.run(exercise())
    assert "private-raw-body" not in capsys.readouterr().out


def test_other_http_errors_are_not_reclassified(app_factory, monkeypatch):
    app = app_factory()

    async def reject(_query_id, _subscriber):
        raise HTTPException(status_code=400, detail="intentional-error")

    monkeypatch.setattr(app.state.subscriptions, "remove_rule", reject)

    async def exercise():
        async with running_app(app) as client:
            response = await client.post(
                "/admin/rules/remove", json=single_removal(subscription_request())
            )
            assert response.status_code == 400
            assert response.json() == {"detail": "intentional-error"}

    asyncio.run(exercise())


@pytest.mark.parametrize(
    "params",
    [
        {"query_id": ""},
        {"namespace": "applications"},
        {"namespace": "applications", "app_id": "agent-app"},
        {"namespace": "applications", "app_id": "agent-app", "agent_name": ""},
        {"namespace": "bad/name", "app_id": "agent-app", "agent_name": "Agent"},
        {"unknown_filter": "private-filter"},
    ],
)
def test_listing_rejects_partial_or_invalid_filters(app_factory, params):
    app = app_factory()

    async def exercise():
        async with running_app(app) as client:
            response = await client.get("/admin/rules", params=params)
            assert response.status_code == 422
            assert response.json()["code"] == "invalid_arguments"
            assert "private-filter" not in response.text

    asyncio.run(exercise())


@pytest.mark.parametrize("failure", ["read", "write", "after_write"])
@pytest.mark.parametrize("bulk", [False, True])
def test_cleanup_errors_preserve_the_confirmed_view_and_are_retryable(
    app_factory, state_store, caplog, failure, bulk
):
    app = app_factory()
    request = subscription_request()
    path = "/admin/subscribers/remove-rules" if bulk else "/admin/rules/remove"
    body = {"subscriber": to_wire(request.subscriber)} if bulk else single_removal(request)
    expected = {"removed_count": 0 if failure == "after_write" else 1} if bulk else {
        "removed": failure != "after_write"
    }

    async def exercise():
        async with running_app(app) as client:
            registry = app.state.subscriptions
            await registry.subscribe(request)
            snapshot = registry.list_rules()
            setattr(
                state_store, f"{failure}_error", DaprInternalError("private-backend-data")
            )
            response = await client.post(path, json=body)
            assert response.status_code == 503
            assert response.json()["code"] == "state_unavailable"
            assert registry.list_rules() == snapshot
            assert "private-backend-data" not in response.text + caplog.text
            assert (await client.get("/readyz")).status_code == 200
            assert len((await client.get("/admin/rules")).json()["rules"]) == 1
            setattr(state_store, f"{failure}_error", None)
            retried = await client.post(path, json=body)
            assert retried.status_code == 200
            assert retried.json() == expected
            assert registry.list_rules() == ()

    asyncio.run(exercise())


def test_absent_cleanup_does_not_mask_storage_failure(app_factory, state_store):
    app = app_factory()
    request = subscription_request()

    async def exercise():
        async with running_app(app) as client:
            state_store.read_error = RpcError("unavailable")
            for path, body in (
                ("/admin/rules/remove", single_removal(request)),
                ("/admin/subscribers/remove-rules", {"subscriber": to_wire(request.subscriber)}),
            ):
                response = await client.post(path, json=body)
                assert response.status_code == 503
                assert response.json()["code"] == "state_unavailable"

    asyncio.run(exercise())


def test_operator_tools_are_not_exposed_through_mcp(app_factory):
    app = app_factory({"orders.v1": "title: Orders\ndescription: Order changes.\n"})

    async def exercise():
        request = subscription_request()
        async with mcp_session(app) as (session, _):
            tools = await session.list_tools()
            assert {tool.name for tool in tools.tools} == {
                "list_queries", "subscribe", "unsubscribe"
            }
            subscribed = await session.call_tool("subscribe", to_wire(request))
            assert subscribed.isError is False
            async with httpx.AsyncClient(
                transport=httpx.ASGITransport(app=app), base_url="http://router.test"
            ) as client:
                assert len((await client.get("/admin/rules")).json()["rules"]) == 1
                response = await client.post(
                    "/admin/rules/remove", json=single_removal(request)
                )
                assert response.json() == {"removed": True}
            recreated = await session.call_tool("subscribe", to_wire(request))
            assert recreated.structuredContent["status"] == "created"

    asyncio.run(exercise())


def test_admin_health_and_lifecycle_logging(app_factory, capsys):
    app = app_factory()
    request = subscription_request()

    async def exercise():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://router.test"
        ) as client:
            assert (await client.get("/healthz")).json() == {"status": "alive"}
            response = await client.get("/readyz")
            assert response.status_code == 503
            assert response.json() == {"status": "not_ready"}
            assert (await client.get("/admin/rules")).status_code == 503
            assert (await client.post(
                "/admin/subscribers/remove-rules",
                json={"subscriber": to_wire(request.subscriber)},
            )).status_code == 503
            async with app.router.lifespan_context(app):
                assert (await client.get("/healthz")).status_code == 200
                ready = await client.get("/readyz")
                assert ready.status_code == 200
                assert ready.json() == {"status": "ready"}
                await app.state.subscriptions.subscribe(request)
                await client.post("/admin/rules/remove", json=single_removal(request))
            assert (await client.get("/readyz")).status_code == 503
            assert (await client.get("/healthz")).status_code == 200
            assert (await client.get("/admin/rules")).status_code == 503

    asyncio.run(exercise())
    records = [json.loads(line) for line in capsys.readouterr().out.splitlines()]
    events = {record["event"] for record in records}
    assert events >= {
        "router_subscriptions_initializing",
        "router_subscriptions_loaded",
        "router_ready",
        "router_subscription_upserted",
        "router_rules_cleaned",
        "router_subscriptions_closed",
        "router_stopped",
    }
    cleanup = next(record for record in records if record["event"] == "router_rules_cleaned")
    assert cleanup["outcome"] == "success"
    assert cleanup["removed_count"] == 1
    assert cleanup["subscriber"] == to_wire(request.subscriber)
