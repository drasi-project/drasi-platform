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
from typing import Annotated, Any

from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
from pydantic import Field

from agent_router.subscription import SubscriptionRegistry
from agent_router.utils.types import (
    EventType,
    ListQueriesResult,
    QueryConfig,
    QueryResult,
    SubscribeResult,
    UnsubscribeResult,
)

logger = logging.getLogger(__name__)


# TODO: fix docstrings
# TODO: better error handling
class AgentRouterToolset:
    """
    Toolset for the Drasi Agent Router MCP server.
    """

    def __init__(
        self,
        mcp: FastMCP,
        subscription_registry: SubscriptionRegistry,
        query_configs: dict[str, QueryConfig],
    ) -> None:
        """
        Initialize an AgentRouterToolset instance.

        Args:
            mcp (FastMCP): Injected FastMCP server instance.
            subscription_registry (SubscriptionRegistry): Injected subscription registry.
            query_configs (dict[str, QueryConfig]): Reference to the static configuration for all queries.
        """
        self._subscription_registry = subscription_registry
        self._query_configs = query_configs

        mcp.tool(self.subscribe_drasi_query)
        mcp.tool(self.unsubscribe_drasi_query)
        mcp.tool(self.list_drasi_queries)

        logger.info("DrasiQueryToolSet initialized and tools registered with MCP")


    async def subscribe_drasi_query(
        self,
        query_id: str,
        event_types: Annotated[list[EventType], Field(min_length=1)],
        agent_id: str,
        subscription_id: str,
        topic: str,
    ) -> SubscribeResult:
        """
        Subscribe an agent to a Drasi query.

        Args:
            query_id (str): Unique ID of the Drasi query to subscribe to.
            event_types (list[EventType]): List of Drasi event types that the agent is interested in.
                Must contain at least one event type.
            agent_id (str): Unique ID of the agent making the subscription.
                Injected by the agent framework — must never be exposed to the LLM through the tool schema.
            subscription_id (str): Unique ID of the subscription.
                Injected by the agent framework — must never be exposed to the LLM through the tool
            topic (str): Name of the topic on which the agent will receive messages.
                Injected by the agent — must never be exposed to the LLM through the tool schema.

        Returns:
            SubscribeResult: Result of the subscription operation.

        Raises:
            ToolError: If the query_id is unknown or if event_types is empty.
        """
        # Deduplicate event types
        event_types = list(dict.fromkeys(event_types))

        logger.info(
            f"Subscribing agent '{agent_id}' "
            f"to query '{query_id}' "
            f"on topic '{topic}', "
            f"event_types={event_types!r}",
        )

        if self._query_configs.get(query_id) is None:
            raise ToolError(f"Unknown query_id '{query_id}'")

        # TODO: Subscription ID comprises a principal (API key ID, OAuth sub, SPIFFE ID, URN)
        # and a globally unique identifier. This should be verified.
        qualified_subscription_id = f"{agent_id}:{subscription_id}"
        await self._subscription_registry.upsert_subscription(
            query_id=query_id,
            subscription_id=qualified_subscription_id,
            topic=topic,
            event_types=event_types,
        )
    
        logger.info(
            f"Agent '{agent_id}' successfully subscribed to query '{query_id}' "
            f"on topic '{topic}', subscription_id='{subscription_id}', event_types={event_types!r}"
        )

        return SubscribeResult(
            agent_id=agent_id,
            query_id=query_id,
            topic=topic,
            subscription_id=subscription_id,
            event_types=event_types,
        )


    async def unsubscribe_drasi_query(
        self,
        query_id: str,
        agent_id: str,
        subscription_id: str,
    ) -> UnsubscribeResult:
        """
        Unsubscribe an agent from a Drasi query.

        Args:
            query_id (str): Unique ID of the Drasi query to unsubscribe from.
            agent_id (str): Unique ID of the agent to unsubscribe.
                Injected by the agent framework — must never be exposed to the LLM through the tool schema.
            subscription_id (str): Unique ID of the subscription to remove.
                Injected by the agent framework — must never be exposed to the LLM through the tool schema.

        Returns:
            UnsubscribeResult: Result of the unsubscription operation.

        Raises:
            ToolError: If the query_id is unknown.
        """
        logger.info(
            f"Unsubscribing agent '{agent_id}' from query '{query_id}', subscription_id='{subscription_id}'",
        )

        if self._query_configs.get(query_id) is None:
            raise ToolError(f"Unknown query_id '{query_id}'")

        # TODO: verify that the agent actually owns the subscription
        subscription = await self._subscription_registry.get_subscription(
            query_id=query_id,
            subscription_id=subscription_id,
        )

        if subscription is None:
            return (
                f"Agent '{agent_id}' successfully unsubscribed from query '{query_id}', "
                f"subscription_id='{subscription_id}'(no existing subscription found)"
            )

        await self._subscription_registry.delete_subscription(
            query_id=query_id,
            subscription_id=subscription_id,
        )

        logger.info(
            f"Agent '{agent_id}' successfully unsubscribed from query '{query_id}', "
            f"subscription_id='{subscription_id}'"
        )

        return UnsubscribeResult(
            agent_id=agent_id,
            query_id=query_id,
            subscription_id=subscription_id,
        )


    # TODO: remove this?
    async def list_drasi_queries(self) -> ListQueriesResult:
        """
        List all Drasi queries.

        Returns:
            ListQueriesResult: A result containing a list of all query configurations.
        """
        logger.info("Listing all queries")

        queries = [
            self._make_query_result(query_id, query_config)
            for query_id, query_config in self._query_configs.items()
        ]

        return ListQueriesResult(queries=queries)


    def _make_query_result(self, query_id: str, query_config: dict[str, Any]) -> QueryResult:
        """
        Validate and create a QueryResult object from a query and its configuration.

        Args:
            query_id (str): Unique ID for the query.
            query_config (dict[str, Any]): Static query configuration.

        Returns:
            QueryResult: A QueryResult object representing the query.
        """
        config = QueryConfig(**query_config)
        return QueryResult(
            query_id=query_id,
            title=config.title,
            description=config.description,
        )
