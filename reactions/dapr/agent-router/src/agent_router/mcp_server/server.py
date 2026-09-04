#
# Copyright 2026 The Drasi Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import logging

from fastmcp import FastMCP

from agent_router.mcp_server.tools import AgentRouterToolset
from agent_router.subscription import SubscriptionRegistry
from agent_router.utils.types import QueryConfig

logger = logging.getLogger(__name__)


class MCPServer:
    """
    An MCP server that registers tools.
    """

    def __init__(self,
        mcp: FastMCP,
        subscription_registry: SubscriptionRegistry,
        query_configs: dict[str, QueryConfig],
        name: str = "drasi-agent-router-mcp"
    ) -> None:
        """
        Initialize an MCPServer instance.

        Args:
            mcp (FastMCP): Injected FastMCP server instance.
            subscription_registry (SubscriptionRegistry): Injected subscription registry.
            query_configs (dict[str, QueryConfig]): Reference to the static configuration for all queries.
            name (str): Name for the server (used for logging). Defaults to "drasi-agent-router-mcp".
        """
        self._name = name
        self._tools = AgentRouterToolset(
            mcp=mcp,
            subscription_registry=subscription_registry,
            query_configs=query_configs,
        )

        logger.info(f"MCPServer initialized with name: {self._name} and tools registered")


    def start(self) -> None:
        """Start the MCP server."""
        pass


    def shutdown(self) -> None:
        """Shutdown the MCP server."""
        pass
