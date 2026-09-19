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
from starlette.responses import JSONResponse

from .admin import create_admin_router
from .catalog import build_catalog, parse_query_config
from .config import RouterConfig
from .logging import configure_logging
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
    configure_logging()
    try:
        config = RouterConfig.from_environment()
    except ValueError:
        logger.error(
            "router_initialization_failed",
            extra={"initialization_stage": "configuration", "outcome": "error"},
        )
        raise
    app = FastAPI(redirect_slashes=False)
    subscriptions = SubscriptionRegistry(config.router_id, config.state_store_name)
    reaction = DrasiReaction[Query](
        on_change_event=_forwarding_unavailable,
        parse_query_configs=parse_query_config,
        dead_letter_topic=config.dead_letter_topic,
        on_initialize=subscriptions.initialize,
        on_cleanup=subscriptions.close,
    )
    try:
        reaction.install(app)
        catalog = build_catalog(config.router_id, reaction.query_registrations)
    except (ValueError, OSError):
        logger.error(
            "router_initialization_failed",
            extra={
                "router_id": config.router_id,
                "initialization_stage": "catalog",
                "outcome": "error",
            },
        )
        raise
    manager = StreamableHTTPSessionManager(
        app=create_mcp_server(catalog, subscriptions),
        stateless=True,
        json_response=True,
    )
    reaction_lifespan = app.router.lifespan_context

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[Mapping[str, Any] | None]:
        initialized = False
        stopped = False
        try:
            async with manager.run():
                async with reaction_lifespan(application) as state:
                    initialized = True
                    logger.info(
                        "router_ready",
                        extra={"router_id": config.router_id, "outcome": "success"},
                    )
                    yield state
            stopped = True
        finally:
            if not initialized:
                logger.error(
                    "router_initialization_failed",
                    extra={
                        "router_id": config.router_id,
                        "initialization_stage": "runtime",
                        "outcome": "error",
                    },
                )
            else:
                logger.log(
                    logging.INFO if stopped else logging.ERROR,
                    "router_stopped",
                    extra={
                        "router_id": config.router_id,
                        "outcome": "success" if stopped else "error",
                    },
                )

    app.router.lifespan_context = lifespan
    app.add_route(
        "/mcp",
        MCPRoute(manager, lambda: reaction.is_ready),
        methods=["POST"],
    )
    app.include_router(create_admin_router(subscriptions, lambda: reaction.is_ready))

    @app.get("/healthz", tags=["Health"])
    async def liveness() -> dict[str, str]:
        return {"status": "alive"}

    @app.get("/readyz", tags=["Health"])
    async def readiness() -> JSONResponse:
        return JSONResponse(
            status_code=200 if reaction.is_ready else 503,
            content={"status": "ready" if reaction.is_ready else "not_ready"},
        )

    app.state.reaction = reaction
    app.state.subscriptions = subscriptions
    return app
