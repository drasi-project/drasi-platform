# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Stateless MCP transport for the router catalog and durable subscriptions."""

import json
import logging
from collections.abc import Callable
from importlib.resources import files
from typing import Any

from drasi_agent_router_contracts import (
    ListQueriesRequest,
    ListQueriesResponse,
    SubscribeRequest,
    SubscribeResponse,
    ToolError,
    UnsubscribeRequest,
    UnsubscribeResponse,
    parse,
    to_wire,
)
from drasi_agent_router_contracts.models.ToolError import Code
from jsonschema.exceptions import ValidationError as SchemaValidationError
from mcp import types
from mcp.server.lowlevel import Server
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager
from pydantic import ValidationError
from starlette.responses import JSONResponse
from starlette.types import Receive, Scope, Send

from .subscriptions import SubscriptionError, SubscriptionRegistry

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


def _tool_error(code: Code, message: str) -> types.CallToolResult:
    error = to_wire(ToolError(code=code, message=message))
    return types.CallToolResult(
        isError=True,
        content=[types.TextContent(type="text", text=json.dumps(error))],
    )


def create_mcp_server(
    catalog: ListQueriesResponse, subscriptions: SubscriptionRegistry
) -> Server:
    server = Server("DaprAgentRouter")
    query_ids = frozenset(query.query_id for query in catalog.queries)
    tools = [
        types.Tool(
            name="list_queries",
            description="List the complete operator-configured Drasi query catalog.",
            inputSchema=_tool_schema("ListQueriesRequest"),
            outputSchema=_tool_schema("ListQueriesResponse"),
        ),
        types.Tool(
            name="subscribe",
            description=(
                "Persist a delivery rule for an approved query. Repeating the same "
                "subscriber and incarnation replaces its selected operations."
            ),
            inputSchema=_tool_schema("SubscribeRequest"),
            outputSchema=_tool_schema("SubscribeResponse"),
        ),
        types.Tool(
            name="unsubscribe",
            description=(
                "Durably remove a matching subscription incarnation. An absent "
                "rule is a successful no-op, including for retired queries."
            ),
            inputSchema=_tool_schema("UnsubscribeRequest"),
            outputSchema=_tool_schema("UnsubscribeResponse"),
        ),
    ]

    @server.list_tools()
    async def list_tools() -> list[types.Tool]:
        return tools

    @server.call_tool(validate_input=False)
    async def call_tool(name: str, arguments: dict[str, Any]) -> types.CallToolResult:
        if name not in {"list_queries", "subscribe", "unsubscribe"}:
            return _tool_error(Code.invalid_arguments, "Unknown router tool")
        result: ListQueriesResponse | SubscribeResponse | UnsubscribeResponse
        try:
            if name == "list_queries":
                parse(ListQueriesRequest, arguments)
                result = catalog
            elif name == "subscribe":
                request = parse(SubscribeRequest, arguments)
                if request.query_id not in query_ids:
                    return _tool_error(
                        Code.unknown_query,
                        "The requested query is not in the router catalog",
                    )
                result = await subscriptions.subscribe(request)
            else:
                removal = parse(UnsubscribeRequest, arguments)
                result = await subscriptions.unsubscribe(removal)
        except (SchemaValidationError, ValidationError, ValueError):
            logger.warning("router_invalid_tool_arguments", extra={"router_tool": name})
            message = (
                "list_queries accepts an empty object"
                if name == "list_queries"
                else f"{name} arguments do not match the subscription contract"
            )
            return _tool_error(Code.invalid_arguments, message)
        except SubscriptionError as error:
            logger.warning(
                "router_subscription_operation_failed",
                extra={"router_tool": name, "router_error_code": error.code.value},
            )
            return _tool_error(error.code, str(error))
        document = to_wire(result)
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
