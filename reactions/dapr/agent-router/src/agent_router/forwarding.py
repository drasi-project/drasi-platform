# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Publish one packed change against one immutable subscription snapshot."""

import asyncio
import json
import logging
from time import time_ns

from dapr.aio.clients import DaprClient
from dapr.clients.exceptions import DaprInternalError
from drasi.reaction import DeliveryOutcome, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi_agent_router_contracts.models.Operation import Operation
from drasi_agent_router_contracts.models.Query import Query
from grpc import RpcError

from .config import RouterConfig
from .conversion import InvalidPackedChangeError, build_delivery, unpack_change
from .subscriptions import SubscriptionError, SubscriptionRegistry

logger = logging.getLogger(__name__)
_PUBLISH_TIMEOUT_SECONDS = 30


class ChangeForwarder:
    def __init__(
        self, config: RouterConfig, subscriptions: SubscriptionRegistry
    ) -> None:
        self._config = config
        self._subscriptions = subscriptions
        self._client: DaprClient | None = None

    async def initialize(self) -> None:
        if self._client is not None:
            raise RuntimeError("Router publication client is already initialized")
        try:
            self._client = DaprClient()
        except (DaprInternalError, RpcError, TimeoutError):
            logger.error(
                "router_publisher_initialization_failed", extra=self._log_context()
            )
            raise RuntimeError(
                "Unable to initialize router publication client"
            ) from None

    async def close(self) -> None:
        client, self._client = self._client, None
        if client is not None:
            await client.close()

    async def on_change(
        self, message: ReactionMessage[ChangeEvent, Query]
    ) -> DeliveryOutcome:
        context = {
            **self._log_context(),
            "drasi_query_id": message.query.query_id,
        }
        client = self._client
        if client is None:
            logger.warning(
                "router_publisher_not_initialized",
                extra={**context, "outcome": DeliveryOutcome.RETRY.value},
            )
            return DeliveryOutcome.RETRY

        try:
            rules = self._subscriptions.snapshot(message.query.query_id)
        except SubscriptionError:
            return DeliveryOutcome.RETRY

        try:
            rows = unpack_change(message.event, unpacked_at_ms=time_ns() // 1_000_000)
        except InvalidPackedChangeError as error:
            logger.warning(
                "router_invalid_packed_change",
                extra={
                    **context,
                    "operation": error.operation,
                    "row_position": error.position,
                    "drasi_delivery_reason": str(error),
                    "outcome": DeliveryOutcome.DROP.value,
                },
            )
            return DeliveryOutcome.DROP

        published = 0
        for row in rows:
            operation = Operation(row.event.op)
            for rule in rules:
                if operation not in rule.operations:
                    continue
                delivery = build_delivery(
                    row,
                    router_id=self._config.router_id,
                    subscription_incarnation=rule.subscription_incarnation,
                )
                try:
                    await asyncio.wait_for(
                        client.publish_event(
                            pubsub_name=self._config.egress_pubsub_name,
                            topic_name=rule.topic_name,
                            data=json.dumps(delivery, allow_nan=False),
                            data_content_type="application/json",
                        ),
                        timeout=_PUBLISH_TIMEOUT_SECONDS,
                    )
                except (DaprInternalError, RpcError, asyncio.TimeoutError) as error:
                    logger.warning(
                        "router_publication_failed",
                        extra={
                            **context,
                            "drasi_event_id": row.event_id,
                            "topic_name": rule.topic_name,
                            "accepted_publications": published,
                            "error_type": type(error).__name__,
                            "outcome": DeliveryOutcome.RETRY.value,
                        },
                    )
                    return DeliveryOutcome.RETRY
                published += 1

        logger.info(
            "router_change_processed",
            extra={
                **context,
                "accepted_publications": published,
                "outcome": DeliveryOutcome.SUCCESS.value,
            },
        )
        return DeliveryOutcome.SUCCESS

    def _log_context(self) -> dict[str, str]:
        return {
            "router_id": self._config.router_id,
            "pubsub_name": self._config.egress_pubsub_name,
        }
