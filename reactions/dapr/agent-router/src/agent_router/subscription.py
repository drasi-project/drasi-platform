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

import asyncio
import logging

from dapr.clients import DaprClient

from agent_router.stores import DaprStateStore, InMemoryStateStore
from agent_router.utils.types import EventType, QuerySubscription, QuerySubscriptionState, StateConfig

logger = logging.getLogger(__name__)


class SubscriptionRegistry():
    """
    Subscription management for the Dapr Agent Router.
    Uses cache-aside for reads + write-through for writes with an in-memory cache and a Dapr state store for persistence.
    For a single replica, this ensures that reads are fast while writes can never be lost.
    """

    def __init__(
        self,
        dapr_client: DaprClient,
        state_config: StateConfig,
    ) -> None:
        """
        Initialize a SubscriptionRegistry instance.

        Args:
            dapr_client (DaprClient): Injected Dapr client.
            state_config (StateConfig): Configuration for subscription state.
        """
        self._cache = InMemoryStateStore[QuerySubscriptionState](
            state_model_cls=QuerySubscriptionState,
            state_key_prefix=state_config.state_key_prefix,
        )
        self._state_store = DaprStateStore[QuerySubscriptionState](
            dapr_client=dapr_client,
            state_store_name=state_config.state_store_name,
            state_model_cls=QuerySubscriptionState,
            state_key_prefix=state_config.state_key_prefix,
        )
        self._lock = asyncio.Lock()


    async def get_subscription(self, query_id: str, subscription_id: str) -> QuerySubscription | None:
        """
        Get a subscription.

        Args:
            query_id (str): The query ID targeted by the subscription.
            subscription_id (str): The subscription ID for the subscription.
        """
        async with self._lock:
            state = await self._get_subscription_state(query_id)
            return state.root.get(subscription_id, None)


    async def get_subscriptions(
        self,
        query_id: str,
        *,
        event_types: list[EventType] | None = None
    ) -> list[QuerySubscription]:
        """
        Get all subscriptions for a given query and match any of the given event types (if provided).

        Args:
            query_id (str): The query ID targeted by the subscriptions.
            event_types (list[EventType] | None): The event types to filter by.
                If omitted or empty, all event types are included.
        """
        async with self._lock:
            state = await self._get_subscription_state(query_id)
            subscriptions_list = list(state.root.values())

            if not event_types:
                return subscriptions_list

            return [
                sub for sub in subscriptions_list
                if any(event_type in sub.event_types for event_type in event_types)
            ]


    async def upsert_subscription(
        self,
        query_id: str,
        subscription_id: str,
        *,
        topic: str,
        event_types: list[EventType],
    ) -> None:
        """
        Create or update a subscription (idempotent).

        Args:
            query_id (str): The query ID targeted by the subscription.
            subscription_id (str): The subscription ID for the subscription.
            topic (str): The topic on which to publish events for this subscription.
            event_types (list[EventType]): The event types that the subscription is interested in.
        """
        async with self._lock:
            state = await self._get_subscription_state(query_id)
            state.root[subscription_id] = QuerySubscription(
                id=subscription_id,
                query_id=query_id,
                topic=topic,
                event_types=event_types,
            )

            await self._save_subscription_state(query_id, state)


    # TODO: is this needed?
    async def update_subscription(
        self,
        query_id: str,
        subscription_id: str,
        *,
        topic: str | None = None,
        event_types: list[EventType] | None = None,
    ) -> None:
        """
        Update an existing subscription.

        Args:
            query_id (str): The query ID targeted by the subscription.
            subscription_id (str): The subscription ID for the subscription.
            topic (str | None): The topic on which to publish events for this subscription.
            event_types (list[EventType] | None): The event types that the subscription is interested in.
        """
        async with self._lock:
            state = await self._get_subscription_state(query_id)
            current_sub = state.root.get(subscription_id, None)

            if current_sub is None:
                return

            state.root[subscription_id] = QuerySubscription(
                id=subscription_id,
                query_id=query_id,
                topic=topic if topic is not None else current_sub.topic,
                event_types=event_types if event_types is not None else current_sub.event_types,
            )

            await self._save_subscription_state(query_id, state)


    async def delete_subscription(self, query_id: str, subscription_id: str) -> None:
        """
        Delete a subscription (idempotent).

        Args:
            query_id (str): The query ID targeted by the subscription.
            subscription_id (str): The subscription ID for the subscription.
        """
        async with self._lock:
            state = await self._get_subscription_state(query_id)
            subscriptions = state.root

            subscriptions.pop(subscription_id, None)

            if subscriptions:
                await self._save_subscription_state(query_id, state)
            else:
                # TODO: should purging be done on the hot path?
                await self._delete_subscription_state(query_id)


    async def _get_subscription_state(self, query_id: str) -> QuerySubscriptionState:
        """
        Get per-query subscription state with cache-aside semantics.

        Cache entries are treated as authoritative for this process. On a miss, the state
        store is read and the cache is refreshed with the full state snapshot.

        Args:
            query_id (str): The query ID for which to get subscription state.

        Returns:
            QuerySubscriptionState: The subscription state for the given query ID.
        """
        if await self._cache.has_key(query_id):
            return await self._cache.get_state(query_id)

        state = await self._state_store.get_state(query_id)
        await self._cache.save_state(query_id, state)

        return state


    async def _save_subscription_state(self, query_id: str, state: QuerySubscriptionState) -> None:
        """
        Write per-query subscription state to the backing store and mirror it into the cache.

        Args:
            query_id (str): The query ID for which to write subscription state.
            state (QuerySubscriptionState): The subscription state to persist.
        """
        await self._state_store.save_state(query_id, state)
        await self._cache.save_state(query_id, state)


    async def _delete_subscription_state(self, query_id: str) -> None:
        """
        Delete per-query subscription state from the backing store and leave an empty cache entry behind.

        Keeping an empty cache entry avoids an immediate state-store read on the next
        lookup while still reflecting that the query has no subscriptions.

        Args:
            query_id (str): The query ID for which to delete subscription state.
        """
        await self._state_store.purge_state(query_id)
        await self._cache.save_state(query_id, QuerySubscriptionState())
