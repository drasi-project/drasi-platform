# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Compose the router and Reaction SDK in one caller-owned FastAPI app."""

import logging
from collections.abc import AsyncIterator, Mapping
from contextlib import asynccontextmanager
from typing import Any

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi_agent_router_contracts.models.Query import Query
from fastapi import FastAPI
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager

from .catalog import build_catalog, parse_query_config
from .config import RouterConfig
from .mcp import MCPRoute, create_mcp_server
from .subscriptions import SubscriptionRegistry

logger = logging.getLogger(__name__)


async def _forwarding_unavailable(
    message: ReactionMessage[ChangeEvent, Query],
) -> DeliveryOutcome:
    logger.warning(
        "router_forwarding_not_implemented",
        extra={"drasi_query_id": message.query.query_id},
    )
    return DeliveryOutcome.RETRY


def create_app() -> FastAPI:
    config = RouterConfig.from_environment()
    app = FastAPI(redirect_slashes=False)
    subscriptions = SubscriptionRegistry(config.router_id, config.state_store_name)
    reaction = DrasiReaction[Query](
        on_change_event=_forwarding_unavailable,
        parse_query_configs=parse_query_config,
        dead_letter_topic=config.dead_letter_topic,
        on_initialize=subscriptions.initialize,
        on_cleanup=subscriptions.close,
    )
    reaction.install(app)
    catalog = build_catalog(config.router_id, reaction.query_registrations)
    manager = StreamableHTTPSessionManager(
        app=create_mcp_server(catalog, subscriptions),
        stateless=True,
        json_response=True,
    )
    reaction_lifespan = app.router.lifespan_context

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[Mapping[str, Any] | None]:
        async with manager.run():
            async with reaction_lifespan(application) as state:
                yield state

    app.router.lifespan_context = lifespan
    app.add_route(
        "/mcp",
        MCPRoute(manager, lambda: reaction.is_ready),
        methods=["POST"],
    )
    app.state.reaction = reaction
    app.state.subscriptions = subscriptions
    return app
