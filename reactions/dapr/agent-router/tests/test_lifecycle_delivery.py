# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import agent_router.app as app_module
from drasi_agent_router_contracts import router_dead_letter_topic

from conftest import cloud_event


def test_sdk_and_mcp_reject_work_before_lifespan_start(app_factory) -> None:
    app = app_factory(
        {"query.one": "title: One\ndescription: First query.\n"}
    )
    client = TestClient(app)
    try:
        assert client.get("/dapr/subscribe").status_code == 503
        assert client.post(
            "/_drasi/events/query.one",
            json=cloud_event("query.one"),
        ).json() == {"status": "RETRY"}
        mcp = client.post("/mcp", json={})
        assert mcp.status_code == 503
        assert mcp.json() == {"detail": "router initialization is incomplete"}
    finally:
        client.close()


def test_lifecycle_starts_mcp_before_sdk_and_clears_readiness_before_stop(
    monkeypatch: pytest.MonkeyPatch,
    query_directory: Path,
) -> None:
    events: list[tuple[str, bool]] = []
    application = None

    class RecordingManager:
        def __init__(self, **_kwargs):
            pass

        @asynccontextmanager
        async def run(self):
            assert application is not None
            events.append(("mcp_started", application.state.reaction.is_ready))
            try:
                yield
            finally:
                events.append(("mcp_stopped", application.state.reaction.is_ready))

        async def handle_request(self, _scope, _receive, _send):
            raise AssertionError("MCP requests are not part of this lifecycle test")

    monkeypatch.setattr(app_module, "StreamableHTTPSessionManager", RecordingManager)
    application = app_module.create_app()

    with TestClient(application):
        assert application.state.reaction.is_ready is True
        assert events == [("mcp_started", False)]

    assert application.state.reaction.is_ready is False
    assert events == [("mcp_started", False), ("mcp_stopped", False)]


def test_mcp_startup_failure_unwinds_and_never_marks_sdk_ready(
    monkeypatch: pytest.MonkeyPatch,
    query_directory: Path,
) -> None:
    events: list[str] = []

    class FailingManager:
        def __init__(self, **_kwargs):
            pass

        @asynccontextmanager
        async def run(self):
            events.append("start")
            try:
                raise RuntimeError("MCP startup failed")
                yield
            finally:
                events.append("cleanup")

        async def handle_request(self, _scope, _receive, _send):
            raise AssertionError("manager never started")

    monkeypatch.setattr(app_module, "StreamableHTTPSessionManager", FailingManager)
    app = app_module.create_app()

    with pytest.raises(RuntimeError, match="MCP startup failed"):
        with TestClient(app):
            pass

    assert events == ["start", "cleanup"]
    assert app.state.reaction.is_ready is False


def test_sdk_routes_dlt_and_typed_delivery_boundaries(
    app_factory,
    caplog: pytest.LogCaptureFixture,
) -> None:
    query_id = "orders.region.v1"
    app = app_factory(
        {
            query_id: (
                "title: Regional orders\n"
                "description: Newly matching regional orders.\n"
            )
        }
    )
    caplog.set_level(logging.INFO)

    with TestClient(app) as client:
        assert app.state.reaction.is_ready is True
        assert client.get("/dapr/subscribe").json() == [
            {
                "pubsubname": "router-inbound",
                "topic": f"{query_id}-results",
                "route": f"/_drasi/events/{query_id}",
                "deadLetterTopic": router_dead_letter_topic(
                    "drasi-system/router-app"
                ),
            }
        ]

        change = client.post(
            f"/_drasi/events/{query_id}",
            json=cloud_event(query_id, secret="do-not-log-this"),
        )
        assert change.status_code == 200
        assert change.json() == {"status": "RETRY"}

        control = client.post(
            f"/_drasi/events/{query_id}",
            json=cloud_event(query_id, kind="control", secret="control-private"),
        )
        assert control.json() == {"status": "SUCCESS"}

        malformed_event = cloud_event(query_id, secret="malformed-private")
        del malformed_event["data"]["addedResults"]
        malformed = client.post(
            f"/_drasi/events/{query_id}",
            json=malformed_event,
        )
        assert malformed.json() == {"status": "DROP"}

    forwarding_records = [
        record
        for record in caplog.records
        if record.getMessage() == "router_forwarding_not_implemented"
    ]
    assert len(forwarding_records) == 1
    assert forwarding_records[0].drasi_query_id == query_id
    assert "do-not-log-this" not in caplog.text
    assert "control-private" not in caplog.text
    assert "malformed-private" not in caplog.text
    assert app.state.reaction.is_ready is False
