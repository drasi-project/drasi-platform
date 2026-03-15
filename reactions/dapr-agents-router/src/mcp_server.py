"""
MCP (Model Context Protocol) server for Drasi query discovery.

Agents can connect to this server to discover:
- Which Drasi queries are available (as MCP resources)
- What topic each query publishes to
- What format the events use (packed/unpacked)

This allows agents to dynamically configure themselves at startup
instead of hardcoding topic names. It mirrors the pattern from
the existing Drasi MCP reaction (reactions/mcp/).

Usage from an agent:
    from dapr_agents.tool.mcp.client import MCPClient
    mcp = MCPClient()
    await mcp.connect_streamable_http("drasi-router", url="http://drasi-router:3001/mcp")
    # Now the agent knows which queries are available and their topics
"""
from __future__ import annotations

import json
import logging
import threading
from typing import Any

import uvicorn
from mcp.server import Server
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager
from mcp.types import (
    ListResourcesResult,
    ReadResourceResult,
    Resource,
    TextResourceContents,
)
from starlette.applications import Starlette
from starlette.routing import Mount, Route

from .config import RouterQueryConfig

logger = logging.getLogger(__name__)

# The MCP server instance (module-level so the router can call notify_change)
_server = Server("drasi-agent-router")
_session_manager: StreamableHTTPSessionManager | None = None

# Shared dict: queryId -> RouterQueryConfig (populated by router as events arrive)
_query_configs: dict[str, RouterQueryConfig] = {}


def set_query_configs(configs: dict[str, RouterQueryConfig]) -> None:
    """
    Called by the router to share its query config dict with the MCP server.
    The MCP server reads this to answer list_resources and read_resource requests.
    """
    global _query_configs
    _query_configs = configs


@_server.list_resources()
async def list_resources() -> ListResourcesResult:
    """
    Return a list of all Drasi queries as MCP resources.

    Each query appears as: drasi://query/{queryId}
    Agents call this to discover what queries are available.
    """
    resources = []
    for query_id, config in _query_configs.items():
        resources.append(Resource(
            uri=f"drasi://query/{query_id}",
            name=query_id,
            description=(
                f"Drasi continuous query '{query_id}'. "
                f"Publishes to {config.pubsub_name}/{config.topic_name} "
                f"in {config.format.value} format."
            ),
            mimeType="application/json",
        ))
    return ListResourcesResult(resources=resources)


@_server.read_resource()
async def read_resource(uri: str) -> ReadResourceResult:
    """
    Return the config details for a specific Drasi query resource.

    Agents call this after discovering a query to learn:
    - Which pubsub component to subscribe to
    - Which topic to subscribe to
    - What format the events use
    """
    # URI format: drasi://query/{queryId}
    if not uri.startswith("drasi://query/"):
        raise ValueError(f"Unknown resource URI: {uri}")

    query_id = uri.removeprefix("drasi://query/")
    config = _query_configs.get(query_id)

    if config is None:
        raise ValueError(f"Query '{query_id}' not found")

    content = {
        "queryId": query_id,
        "pubsubName": config.pubsub_name,
        "topicName": config.topic_name,
        "format": config.format.value,
        "skipControlSignals": config.skip_control_signals,
    }

    return ReadResourceResult(
        contents=[TextResourceContents(
            uri=uri,
            mimeType="application/json",
            text=json.dumps(content, indent=2),
        )]
    )


def start_mcp_server(port: int = 3001) -> None:
    """
    Start the MCP server in a background thread on the given port.

    The MCP server runs independently of the Drasi reaction server.
    Agents connect to http://localhost:{port}/mcp using StreamableHTTP transport.

    This is a non-blocking call - it starts a daemon thread.
    """
    global _session_manager
    _session_manager = StreamableHTTPSessionManager(
        app=_server,
        event_store=None,
        json_response=True,
        stateless=True,  # Stateless: no persistent connections needed for resource reads
    )

    async def handle_mcp(scope, receive, send):
        await _session_manager.handle_request(scope, receive, send)

    starlette_app = Starlette(
        routes=[Mount("/mcp", app=handle_mcp)],
    )

    def run():
        uvicorn.run(starlette_app, host="0.0.0.0", port=port, log_level="warning")

    thread = threading.Thread(target=run, daemon=True, name="mcp-server")
    thread.start()
    logger.info("MCP server started on port %d (path: /mcp)", port)
