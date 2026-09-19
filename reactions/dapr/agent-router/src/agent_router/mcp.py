# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Stateless MCP transport and the implemented router catalog tool."""

import json
import logging
from collections.abc import Callable
from importlib.resources import files
from typing import Any

from drasi_agent_router_contracts import (
    ListQueriesRequest,
    ListQueriesResponse,
    ToolError,
    parse,
    to_wire,
)
from jsonschema.exceptions import ValidationError as SchemaValidationError
from mcp import types
from mcp.server.lowlevel import Server
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager
from pydantic import ValidationError
from starlette.responses import JSONResponse
from starlette.types import Receive, Scope, Send

logger = logging.getLogger(__name__)


def _tool_schema(name: str) -> dict[str, Any]:
    resources = files("drasi_agent_router_contracts").joinpath("schemas")

    def load(filename: str, ancestors: frozenset[str]) -> dict[str, Any]:
        if filename in ancestors:
            raise ValueError("Recursive router schemas cannot be embedded in MCP")
        if "/" in filename or "\\" in filename or not filename.endswith(".json"):
            raise ValueError("Router schema reference is not a local JSON file")
        document = json.loads(resources.joinpath(filename).read_text(encoding="utf-8"))
        return resolve(document, ancestors | {filename})

    def resolve(value: Any, ancestors: frozenset[str]) -> Any:
        if isinstance(value, list):
            return [resolve(item, ancestors) for item in value]
        if not isinstance(value, dict):
            return value
        fields = {
            key: resolve(item, ancestors)
            for key, item in value.items()
            if key not in ("$id", "$schema", "$ref")
        }
        if "$ref" not in value:
            return fields
        referenced = load(value["$ref"], ancestors)
        return {"allOf": [referenced, fields]} if fields else referenced

    return load(f"{name}.json", frozenset())


def _argument_error(message: str) -> types.CallToolResult:
    error = to_wire(ToolError(code="invalid_arguments", message=message))
    return types.CallToolResult(
        isError=True,
        content=[types.TextContent(type="text", text=json.dumps(error))],
    )


def create_mcp_server(catalog: ListQueriesResponse) -> Server:
    server = Server("DaprAgentRouter")
    catalog_tool = types.Tool(
        name="list_queries",
        description="List the complete operator-configured Drasi query catalog.",
        inputSchema=_tool_schema("ListQueriesRequest"),
        outputSchema=_tool_schema("ListQueriesResponse"),
    )

    @server.list_tools()
    async def list_tools() -> list[types.Tool]:
        return [catalog_tool]

    @server.call_tool(validate_input=False)
    async def call_tool(name: str, arguments: dict[str, Any]) -> types.CallToolResult:
        if name != "list_queries":
            return _argument_error("Unknown router tool")
        try:
            parse(ListQueriesRequest, arguments)
        except (SchemaValidationError, ValidationError, ValueError):
            logger.warning("router_invalid_catalog_arguments")
            return _argument_error("list_queries accepts an empty object")
        document = to_wire(catalog)
        return types.CallToolResult(
            isError=False,
            structuredContent=document,
            content=[types.TextContent(type="text", text=json.dumps(document))],
        )

    return server


class MCPRoute:
    """ASGI endpoint that preserves SDK readiness before entering MCP."""

    def __init__(
        self,
        manager: StreamableHTTPSessionManager,
        is_ready: Callable[[], bool],
    ) -> None:
        self.manager = manager
        self.is_ready = is_ready

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if not self.is_ready():
            response = JSONResponse(
                status_code=503, content={"detail": "router initialization is incomplete"}
            )
            await response(scope, receive, send)
            return
        await self.manager.handle_request(scope, receive, send)
