"""
DrasiAgentRouter: The core of the Router Reaction.

Composes DrasiReaction (from the Drasi Python SDK) to:
1. Subscribe to Drasi query result topics (drasi-pubsub: {queryId}-results)
2. Transform each ChangeEvent into CloudEvent payloads
3. Publish those payloads to agent-accessible Dapr Pub/Sub topics

This is the Python equivalent of the C# PostDaprPubSub reaction, but with:
- Dynamic routing rules per query (packed vs unpacked)
- An embedded MCP server for query discovery
- Native CloudEvent metadata for agent SDK compatibility
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
from typing import Any

from dapr.clients import DaprClient
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent
from drasi.reaction.sdk import DrasiReaction

from .config import OutputFormat, RouterQueryConfig, parse_query_config
from .formatter import format_packed, format_unpacked, get_cloudevent_type

logger = logging.getLogger(__name__)


class DrasiAgentRouter:
    """
    Routes Drasi query change events to Dapr Pub/Sub topics for AI agents.

    How it works:
    1. DrasiReaction (from drasi SDK) subscribes to {queryId}-results topics on drasi-pubsub
    2. When a change event arrives, we look up the per-query config (which topic to publish to)
    3. We format the event (packed or unpacked) and publish it as a CloudEvent to the agent topic
    4. Agents subscribed to that topic wake up and process the change

    Example:
        router = DrasiAgentRouter()
        router.start()  # Blocks, serving requests
    """

    def __init__(self, port: int = 80):
        self._port = port
        self._reaction = DrasiReaction(
            on_change_event=self._handle_change,
            on_control_event=self._handle_control,
            parse_query_configs=parse_query_config,
            port=port,
        )
        # Will be populated by MCP server after query configs are loaded
        self._query_configs: dict[str, RouterQueryConfig] = {}

    def start(self):
        """
        Start the router. This blocks indefinitely, processing events.
        The DrasiReaction handles subscribing to topics and running the server.
        """
        logger.info("Starting Drasi Agent Router")
        self._reaction.start()

    async def _handle_change(self, event: ChangeEvent, raw_config: Any) -> None:
        """
        Called by DrasiReaction when a change event arrives from Drasi.

        Steps:
        1. Parse the per-query config (which pubsub/topic to forward to, packed or unpacked)
        2. Format the event into one or more CloudEvent payloads
        3. Publish each payload to the agent's Dapr Pub/Sub topic
        """
        if raw_config is None:
            logger.warning(
                "No config found for query '%s' - skipping. "
                "Check /etc/queries/%s exists with topicName set.",
                event.queryId, event.queryId
            )
            return

        try:
            config = RouterQueryConfig.model_validate(raw_config)
        except Exception as e:
            logger.error("Invalid config for query '%s': %s", event.queryId, e)
            return

        # Cache the config so the MCP server can expose it
        self._query_configs[event.queryId] = config

        logger.info(
            "Routing change event: query=%s seq=%d -> pubsub=%s topic=%s format=%s",
            event.queryId, event.sequence,
            config.pubsub_name, config.topic_name, config.format.value
        )

        # Format the event into one or more messages
        if config.format == OutputFormat.PACKED:
            messages = format_packed(event, config)
        else:
            messages = format_unpacked(event, config)

        # Publish each message as a CloudEvent to the agent's topic
        await self._publish_messages(event, config, messages)

    async def _handle_control(self, event: ControlEvent, raw_config: Any) -> None:
        """
        Called by DrasiReaction when a control signal arrives (e.g., query started/stopped).

        Most agents don't need control signals (they care about data changes, not query lifecycle).
        If skip_control_signals=False in the query config, we forward it.
        """
        if raw_config is None:
            return

        try:
            config = RouterQueryConfig.model_validate(raw_config)
        except Exception:
            return

        if config.skip_control_signals:
            logger.debug(
                "Skipping control signal for query '%s' (skip_control_signals=True)",
                event.queryId
            )
            return

        signal_kind = getattr(event.controlSignal, "kind", "unknown")
        logger.info(
            "Routing control signal: query=%s signal=%s -> pubsub=%s topic=%s",
            event.queryId, signal_kind, config.pubsub_name, config.topic_name
        )

        payload = {
            "kind": "control",
            "queryId": event.queryId,
            "sequence": event.sequence,
            "sourceTimeMs": event.sourceTimeMs,
            "controlSignal": {"kind": signal_kind},
        }

        async with DaprClient() as client:
            await client.publish_event(
                pubsub_name=config.pubsub_name,
                topic_name=config.topic_name,
                data=json.dumps(payload),
                data_content_type="application/json",
                publish_metadata={
                    "cloudevent.source": f"drasi/query/{event.queryId}",
                    "cloudevent.type": f"drasi.control.{signal_kind}",
                },
            )

    async def _publish_messages(
        self,
        event: ChangeEvent,
        config: RouterQueryConfig,
        messages: list[dict],
    ) -> None:
        """
        Publish a list of formatted messages to Dapr Pub/Sub.

        Each message becomes a CloudEvent on the agent's configured topic.
        The CloudEvent 'type' field tells agents whether this is packed, insert, update, or delete.
        """
        if not messages:
            logger.debug("No messages to publish for query '%s'", event.queryId)
            return

        async with DaprClient() as client:
            for msg in messages:
                op = msg.get("op")  # Only set for unpacked events
                ce_type = get_cloudevent_type(config, op)

                try:
                    await client.publish_event(
                        pubsub_name=config.pubsub_name,
                        topic_name=config.topic_name,
                        data=json.dumps(msg),
                        data_content_type="application/json",
                        publish_metadata={
                            "cloudevent.source": f"drasi/query/{event.queryId}",
                            "cloudevent.type": ce_type,
                        },
                    )
                    logger.debug(
                        "Published %s event to %s/%s",
                        ce_type, config.pubsub_name, config.topic_name
                    )
                except Exception as e:
                    logger.error(
                        "Failed to publish event for query '%s' to %s/%s: %s",
                        event.queryId, config.pubsub_name, config.topic_name, e
                    )
                    raise  # Re-raise so Dapr retries delivery
