# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from typing import Any

import httpx
import pytest
from fastapi.testclient import TestClient
from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError
from mcp import ClientSession, types
from mcp.client.streamable_http import streamable_http_client

from drasi_agent_router_contracts import (
    ListQueriesResponse,
    ToolError,
    parse,
    to_wire,
)


def _contains_reference(value: Any) -> bool:
    if isinstance(value, dict):
        return "$ref" in value or any(_contains_reference(item) for item in value.values())
    if isinstance(value, list):
        return any(_contains_reference(item) for item in value)
    return False


async def _mcp_roundtrip(app):
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
                    tools = await session.list_tools()
                    success = await session.call_tool("list_queries", {})
                    second_success = await session.call_tool("list_queries", {})
                    invalid = await session.call_tool(
                        "list_queries",
                        {"private_metadata": {"token": "super-secret"}},
                    )
                    return (
                        tools,
                        success,
                        second_success,
                        invalid,
                        get_session_id(),
                    )


def test_only_exact_post_mcp_route_is_exposed(app_factory) -> None:
    app = app_factory()

    with TestClient(app) as client:
        assert client.get("/mcp", follow_redirects=False).status_code == 405
        assert client.delete("/mcp", follow_redirects=False).status_code == 405
        assert client.post("/mcp/", follow_redirects=False).status_code == 404


def test_official_client_roundtrip_schemas_snapshot_and_sanitized_errors(
    app_factory,
    query_directory: Path,
    caplog: pytest.LogCaptureFixture,
) -> None:
    app = app_factory(
        {
            "orders.v1": (
                "title: Orders\n"
                "description: Newly matching orders.\n"
                "usage: React to inserts.\n"
            )
        }
    )
    (query_directory / "orders.v1").write_text(
        "title: Changed on disk\n"
        "description: The running catalog must remain immutable.\n",
        encoding="utf-8",
    )
    (query_directory / "created-after-start").write_text(
        "title: Late\n"
        "description: Requires restart.\n",
        encoding="utf-8",
    )

    caplog.set_level(logging.WARNING)
    tools_result, success, second_success, invalid, session_id = asyncio.run(
        _mcp_roundtrip(app)
    )

    assert [tool.name for tool in tools_result.tools] == ["list_queries"]
    tool = tools_result.tools[0]
    assert tool.inputSchema["additionalProperties"] is False
    assert tool.outputSchema is not None
    assert not _contains_reference(tool.inputSchema)
    assert not _contains_reference(tool.outputSchema)
    Draft202012Validator.check_schema(tool.inputSchema)
    Draft202012Validator.check_schema(tool.outputSchema)

    assert success.isError is False
    assert success.structuredContent is not None
    assert len(success.content) == 1
    assert isinstance(success.content[0], types.TextContent)
    assert json.loads(success.content[0].text) == success.structuredContent
    catalog = parse(ListQueriesResponse, success.structuredContent)
    assert to_wire(catalog) == {
        "protocol_version": 1,
        "router_id": "drasi-system/router-app",
        "queries": [
            {
                "query_id": "orders.v1",
                "title": "Orders",
                "description": "Newly matching orders.",
                "usage": "React to inserts.",
            }
        ],
    }
    assert second_success.structuredContent == success.structuredContent
    assert session_id is None

    validator = Draft202012Validator(tool.outputSchema)
    validator.validate(success.structuredContent)
    for invalid_output in (
        {**success.structuredContent, "private": True},
        {**success.structuredContent, "protocol_version": 2},
        {**success.structuredContent, "router_id": "not-an-identity"},
        {
            **success.structuredContent,
            "queries": [{**success.structuredContent["queries"][0], "title": ""}],
        },
        {
            **success.structuredContent,
            "queries": [{**success.structuredContent["queries"][0], "usage": None}],
        },
    ):
        with pytest.raises(ValidationError):
            validator.validate(invalid_output)

    assert invalid.isError is True
    assert invalid.structuredContent is None
    assert len(invalid.content) == 1
    assert isinstance(invalid.content[0], types.TextContent)
    error_document = json.loads(invalid.content[0].text)
    error = parse(ToolError, error_document)
    assert to_wire(error) == {
        "code": "invalid_arguments",
        "message": "list_queries accepts an empty object",
    }
    assert "super-secret" not in invalid.content[0].text
    assert "super-secret" not in caplog.text
