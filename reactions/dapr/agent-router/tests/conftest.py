# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import shutil
import uuid
from collections.abc import Iterator, Mapping
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

import pytest
import httpx
from drasi_agent_router_contracts import (
    SubscribeRequest,
    UnsubscribeRequest,
    parse,
    to_wire,
)
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

from agent_router import create_app
import agent_router.subscriptions as subscriptions_module

from fakes import FakeStateStore


@pytest.fixture
def state_store(monkeypatch: pytest.MonkeyPatch) -> FakeStateStore:
    store = FakeStateStore()
    monkeypatch.setattr(subscriptions_module, "DaprClient", store.client)
    return store


@pytest.fixture
def query_directory(
    monkeypatch: pytest.MonkeyPatch, state_store: FakeStateStore
) -> Iterator[Path]:
    runtime_root = Path(__file__).parent / ".runtime"
    path = runtime_root / uuid.uuid4().hex
    path.mkdir(parents=True)
    monkeypatch.setenv("routerId", "drasi-system/router-app")
    monkeypatch.setenv("egressPubsubName", "router-egress")
    monkeypatch.setenv("PubsubName", "router-inbound")
    monkeypatch.setenv("StateStoreName", "router-state")
    monkeypatch.setenv("QueryConfigPath", str(path))
    try:
        yield path
    finally:
        shutil.rmtree(path, ignore_errors=True)
        try:
            runtime_root.rmdir()
        except OSError:
            pass


@pytest.fixture
def app_factory(query_directory: Path):
    def factory(files: Mapping[str, str] | None = None):
        for name, document in (files or {}).items():
            (query_directory / name).write_text(document, encoding="utf-8")
        return create_app()

    return factory


def subscription_request(
    query_id: str = "orders.v1",
    operations: tuple[str, ...] = ("i",),
    incarnation: str = "incarnation-1",
    *,
    namespace: str = "applications",
    app_id: str = "agent-app",
    agent_name: str = "OrdersAgent",
) -> SubscribeRequest:
    return parse(
        SubscribeRequest,
        {
            "query_id": query_id,
            "operations": list(operations),
            "subscriber": {
                "namespace": namespace,
                "app_id": app_id,
                "agent_name": agent_name,
            },
            "subscription_incarnation": incarnation,
        },
    )


def removal_request(request: SubscribeRequest) -> UnsubscribeRequest:
    document = to_wire(request)
    del document["operations"]
    return parse(UnsubscribeRequest, document)


@asynccontextmanager
async def mcp_session(app):
    async with app.router.lifespan_context(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://router.test",
            headers={"accept": "application/json, text/event-stream"},
        ) as http_client:
            async with streamable_http_client(
                "http://router.test/mcp",
                http_client=http_client,
                terminate_on_close=False,
            ) as (read_stream, write_stream, get_session_id):
                async with ClientSession(read_stream, write_stream) as session:
                    await session.initialize()
                    yield session, get_session_id


def cloud_event(
    query_id: str,
    *,
    kind: str = "change",
    pubsub_name: str = "router-inbound",
    secret: str = "private-result",
) -> dict[str, Any]:
    if kind == "change":
        data: dict[str, Any] = {
            "kind": "change",
            "queryId": query_id,
            "sequence": 1,
            "sourceTimeMs": 1000,
            "metadata": {"private": secret},
            "addedResults": [{"value": secret}],
            "updatedResults": [],
            "deletedResults": [],
        }
    else:
        data = {
            "kind": "control",
            "queryId": query_id,
            "sequence": 2,
            "sourceTimeMs": 1001,
            "metadata": {"private": secret},
            "controlSignal": {"kind": "running"},
        }
    return {
        "id": "event-1",
        "source": "urn:drasi:test",
        "specversion": "1.0",
        "type": "com.dapr.event.sent",
        "topic": f"{query_id}-results",
        "pubsubname": pubsub_name,
        "datacontenttype": "application/json",
        "data": data,
    }
