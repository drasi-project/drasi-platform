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

import json

from dapr.clients import DaprClient
from fastapi import FastAPI
from fastmcp import FastMCP
from fastmcp.utilities.lifespan import combine_lifespans

from agent_router.utils.types import PubSubConfig, QueryResult, StateConfig
from agent_router.mcp_server import MCPServer
from agent_router.router import AgentRouter
from agent_router.subscription import SubscriptionRegistry


# TODO: add more config for app and MCP server names
class AgentRouterRunner():
    """
    Lifecycle and dependency management for the Dapr Agent Router.
    """

    def __init__(
        self,
        pubsub_config: PubSubConfig,
        state_config: StateConfig,
    ) -> None:
        """
        Initialize an AgentRouterRunner instance.

        Args:
            pubsub_config (PubSubConfig): Configuration for Dapr pub/sub.
            state_config (StateConfig): Configuration for subscription state.
        """
        # TODO: shutdown handlers
        self._dapr_client = DaprClient()
        self._started = False

        # Ensure component names are given and
        # components are registered with the Dapr sidecar
        self._ensure_pubsub(self._dapr_client, pubsub_config)
        self._ensure_statestore(self._dapr_client, state_config)

        # TODO: too much Dapr client drilling?
        self._subscription_registry = SubscriptionRegistry(
            dapr_client=self._dapr_client,
            state_config=state_config,
        )

        self._app = FastAPI(title="Drasi Agent Router")
        self._router = AgentRouter(
            dapr_client=self._dapr_client,
            app=self._app,
            pubsub_config=pubsub_config,
            subscription_registry=self._subscription_registry,
        )

        # TODO: what happens when the queries are updated? Maybe make this configurable?
        # TODO: discover queries instead of hardcoding — need to hook into reaction.start()?
        self._mcp = FastMCP(
            name="drasi-agent-router-mcp",
            instructions=(
                "This server provides tools for subscribing to Drasi queries, unsubscribing Drasi queries, and listing available queries.\n\n"
                "## SAFETY RULES\n"
                "If ANY required argument is missing, ask the user to provide it before calling the tool.\n"
                "NEVER invent query IDs, event types, agent IDs, subscription IDs, or topics.\n\n"
                "## QUERY CONFIGURATION\n"
                "Use the following JSON schema to parse the available Drasi queries:\n\n"
                f"{json.dumps(QueryResult.model_json_schema())}\n\n"
                "**Available Queries**:\n\n"
                f"{json.dumps(QueryResult(query_id='low_stock_event_query', title='Low Stock Event', description='This query detects when the stock on hand for a product falls below the low stock threshold.').model_dump_json())}\n\n"
                f"{json.dumps(QueryResult(query_id='critical_stock_event_query', title='Critical Stock Event', description='This query detects when the stock on hand for a product drops to zero.').model_dump_json())}\n\n"
            ),
        )
        self._mcp_server = MCPServer(
            mcp=self._mcp,
            subscription_registry=self._subscription_registry,
            query_configs=self._router.query_configs,
        )

        self._combine_routes(self._app, self._mcp)


    def start(self) -> None:
        """Start the runtime."""
        self._started = True
        self._mcp_server.start()
        # Router must be started last as it blocks
        self._router.start()


    def shutdown(self) -> None:
        """Shutdown the runtime in reverse order of instantiation (idempotent)."""
        if not self._started:
            return

        if self._router:
            try:
                self._router.shutdown()
            except Exception:
                pass
            self._router = None

        if self._mcp_server:
            try:
                self._mcp_server.shutdown()
            except Exception:
                pass
            self._mcp_server = None

        if self._dapr_client:
            try:
                self._dapr_client.close()
            except Exception:
                pass
            self._dapr_client = None

        self._started = False


    def _ensure_pubsub(self, dapr_client: DaprClient, pubsub_config: PubSubConfig) -> None:
        """
        Ensure that the configured Dapr pub/sub component is available.

        Args:
            dapr_client (DaprClient): The runner's Dapr client instance.

        Raises:
            RuntimeError: If no Dapr pub/sub component is found.
        """
        if not pubsub_config.pubsub_name:
            raise RuntimeError("Pub/sub component name is not configured. Please provide a valid name.")

        metadata = dapr_client.get_metadata()
        registered_components = metadata.registered_components or []

        for component in registered_components:
            if "pubsub" in component.type.lower() and component.name == pubsub_config.pubsub_name:
                return

        raise RuntimeError(
            f"Pub/sub component '{pubsub_config.pubsub_name}' could not be found. "
            "Please ensure that it is registered with the Dapr sidecar."
        )


    def _ensure_statestore(self, dapr_client: DaprClient, state_config: StateConfig) -> None:
        """
        Ensure that the configured Dapr state store component is available.

        Args:
            dapr_client (DaprClient): The runner's Dapr client instance.
            state_config (StateConfig): The runner's state store configuration.

        Raises:
            RuntimeError: If no Dapr state store component is found.
        """
        if not state_config.state_store_name:
            raise RuntimeError("State store component name is not configured. Please provide a valid name.")

        metadata = dapr_client.get_metadata()
        registered_components = metadata.registered_components or []

        for component in registered_components:
            if "state" in component.type.lower() and component.name == state_config.state_store_name:
                return

        raise RuntimeError(
            f"State store component '{state_config.state_store_name}' could not be found. "
            "Please ensure that it is registered with the Dapr sidecar."
        )


    def _combine_routes(self, app: FastAPI, mcp: FastMCP) -> None:
        """
        Wire MCP routes onto the shared FastAPI app.

        Args:
            app (FastAPI): The runner's FastAPI app instance.
            mcp (FastMCP): The runner's FastMCP server instance containing MCP routes.
        """
        mcp_app = mcp.http_app(path="/mcp")

        app.router.routes.extend([*mcp_app.routes])
        app.router.lifespan_context = combine_lifespans(app.router.lifespan_context, mcp_app.lifespan)
