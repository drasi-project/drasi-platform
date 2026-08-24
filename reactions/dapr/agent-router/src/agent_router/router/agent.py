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
import logging
from typing import Any

from dapr.clients import DaprClient
from fastapi import FastAPI
from pydantic_handlebars import render

from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ChangeNotification import ChangeNotification
from drasi.reaction.models.ChangeNotification import Op
from drasi.reaction.models.ChangePayload import ChangePayload
from drasi.reaction.models.ChangeSource import ChangeSource
from drasi.reaction.models.ControlEvent import ControlEvent
from drasi.reaction.sdk import AsyncChangeEventFunc, AsyncControlEventFunc, DrasiReaction
from drasi.reaction.utils import yaml_query_configs

from agent_router.subscription import SubscriptionRegistry
from agent_router.utils.types import EventType, PubSubConfig, QuerySubscription

logger = logging.getLogger(__name__)


# TODO: add/fix logging
class AgentRouter():
    """
    Dispatches Drasi events to subscribed agents via Dapr pub/sub.
    """

    def __init__(
        self,
        dapr_client: DaprClient,
        app: FastAPI,
        pubsub_config: PubSubConfig,
        subscription_registry: SubscriptionRegistry,
        name: str = "drasi-agent-router",
    ) -> None:
        """
        Initialize an AgentRouter instance.

        Args:
            dapr_client (DaprClient): Injected Dapr client.
            app (FastAPI): The FastAPI application instance.
            pubsub_config (PubSubConfig): The Dapr pub/sub configuration.
            subscription_registry (SubscriptionRegistry): The subscription registry.
            name (str): The name for the router (used for logging). Defaults to "drasi-agent-router".
        """
        self._name = name
        self._dapr_client = dapr_client
        self._pubsub_config = pubsub_config
        self._subscription_registry = subscription_registry
        self._reaction = DrasiReaction(
            on_change_event=self._make_on_change_event(),
            on_control_event=self._make_on_control_event(),
            parse_query_configs=yaml_query_configs,
            app=app,
            host="0.0.0.0",
        )


    @property
    def query_configs(self) -> dict[str, Any]:
        """
        Return a reference to the static query configuration.

        Returns:
            dict[str, Any]: A map of query IDs to their corresponding configuration.
        """
        # TODO: may want to validate but query configs are populated at reaction startup
        return self._reaction.query_configs


    def start(self) -> None:
        """Start the router (blocking)."""
        self._reaction.start()
    
        
    def shutdown(self) -> None:
        """Shutdown the router (idempotent)."""
        pass


    def _get_event_type(self, event: ChangeEvent) -> EventType | None:
        """
        Return the event type of a packed Drasi change event.
        Assumes that the event contains only one type of change (added, updated, or deleted).

        Args:
            event (ChangeEvent): The packed Drasi change event.
        
        Returns:
            EventType | None: The event type (EventType.ADDED, EventType.UPDATED, EventType.DELETED)
                or None if the event does not match any known event type.
        """
        if event.addedResults:
            return EventType.ADDED
        elif event.updatedResults:
            return EventType.UPDATED
        elif event.deletedResults:
            return EventType.DELETED
        else:
            return None


    def _to_unpacked_events(self, event: ChangeEvent) -> list[ChangeNotification]:
        """
        Converts a single Drasi change event (containing batched records) into a list
        of unpacked events, one per record.
        Preserves the original order of the records.

        Args:
            event (ChangeEvent): The packed Drasi change event.

        Returns:
            list[ChangeNotification]: A list of unpacked Drasi change events.

        """
        source = ChangeSource(
            queryId=event.queryId,
            ts_ms=event.sourceTimeMs,
        )
        # TODO: sequence numbers for "unpacked" events are currently not reliable since they are generated reaction-side,
        # clients should perform their own deduplication based on payload content or CloudEvents ID.
        # This sequence number is a dummy to enable validation.
        seq = 0
        unpacked_events: list[ChangeNotification] = []

        for record in event.addedResults:
            after = record.model_dump()
            unpacked_events.append(
                ChangeNotification(
                    op=Op.i,
                    ts_ms=event.sourceTimeMs,
                    seq=seq,
                    payload=ChangePayload(source=source, before=None, after=after),
                )
            )

        for record in event.updatedResults:
            before = record.before.model_dump() if record.before is not None else None
            after = record.after.model_dump() if record.after is not None else None
            unpacked_events.append(
                ChangeNotification(
                    op=Op.u,
                    ts_ms=event.sourceTimeMs,
                    seq=seq,
                    payload=ChangePayload(source=source, before=before, after=after),
                )
            )

        for record in event.deletedResults:
            before = record.model_dump()
            unpacked_events.append(
                ChangeNotification(
                    op=Op.d,
                    ts_ms=event.sourceTimeMs,
                    seq=seq,
                    payload=ChangePayload(source=source, before=before, after=None),
                )
            )

        return unpacked_events

 
    def _publish_event(self, pubsub_name: str, topic: str, event: str) -> None:
        """
        Publish an event to a Dapr pub/sub topic.

        Args:
            pubsub_name (str): The name of the Dapr pub/sub component.
            topic (str): The name of the topic on which to publish the event.
            event (str): The serialized event to publish (must follow the CloudEvents 1.0 specification).
        """

        self._dapr_client.publish_event(
            pubsub_name=pubsub_name,
            topic_name=topic,
            data=event,
            data_content_type="application/cloudevents+json",
        )


    def _make_binding(
        self,
        subscription: QuerySubscription,
        event: ChangeNotification,
    ) -> tuple[QuerySubscription, str]:
        """
        Pair a subscription with a serialized Drasi unpacked event.

        Args:
            subscription (QuerySubscription): The subscription configuration.
            event (ChangeNotification): The unpacked Drasi event.

        Returns:
            tuple[QuerySubscription, str]: A tuple containing the subscription and the serialized event.
        """

        serialized = event.model_dump_json()
        return (subscription, serialized)

    def _make_on_change_event(self) -> AsyncChangeEventFunc:
        async def on_change_event(event: ChangeEvent, query_config: dict[str, Any] | None) -> None:
            if query_config is None:
                return

            event_type = self._get_event_type(event)
            if not event_type:
                # Defensive guard — shouldn't happen
                return

            logger.info(
                f"Received Drasi change event for query '{event.queryId}' with event type '{event_type.value}'"
            )

            # Debatch event to unpacked format
            unpacked_events = self._to_unpacked_events(event)
            if not unpacked_events:
                return

            # Get all agents that are interested in this event type
            subscriptions = await self._subscription_registry.get_subscriptions(
                query_id=event.queryId,
                event_types=[event_type],
            )

            logger.info(
                f"Found {len(subscriptions)} subscriptions for query '{event.queryId}' and event type '{event_type.value}'"
            )

            bindings: list[tuple[QuerySubscription, str]] = []
            for evt in unpacked_events:
                for sub in subscriptions:
                    bindings.append(self._make_binding(sub, evt))

            # Publish to Dapr pub/sub
            # TODO: may want to bulk publish
            for idx, (sub, evt) in enumerate(bindings):
                # TODO: add source and type metadata
                # TODO: opt-in signing?
                # Construct a CloudEvent ID from the query ID, sequence number of the original packed event,
                # and row index of the record in the original packed event
                payload = {
                    "id": f"{event.queryId}:{event.sequence}:{idx}",
                    "data": evt,
                }
                self._publish_event(
                    pubsub_name=self._pubsub_config.pubsub_name,
                    topic=sub.topic,
                    event=json.dumps(payload),
                )

        return on_change_event


    def _make_on_control_event(self) -> AsyncControlEventFunc:
        async def on_control_event(event: ControlEvent, query_config: dict[str, Any] | None) -> None:
            # TODO: implement
            pass

        return on_control_event
