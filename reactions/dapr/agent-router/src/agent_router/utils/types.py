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

from enum import StrEnum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, RootModel


# ------------------------------------------
# Query models
# ------------------------------------------


# TODO: consider moving these into a `types` package
class EventType(StrEnum):
    """
    Enumeration of supported event types.
    
    ADDED: A record was added to the query result set.
    UPDATED: A record was updated in the query result set.
    DELETED: A record was deleted from the query result set.
    """

    ADDED = "added"
    UPDATED = "updated"
    DELETED = "deleted"


# ------------------------------------------
# Static query configuration models
# ------------------------------------------


class QueryConfig(BaseModel):
    """
    Static query configuration for a Drasi query.

    Attributes:
        title (str): Human-readable name for the query.
        description (str): Human-readable description of the query.
    """

    title: str
    description: str


# ------------------------------------------
# Runner configuration models
# ------------------------------------------


class PubSubConfig(BaseModel):
    """
    Configuration for pub/sub.

    Attributes:
        pubsub_name (str | None): Name of the Dapr pub/sub component to use.
    """

    pubsub_name: str | None = None


class StateConfig(BaseModel):
    """
    Configuration for subscription state.

    Attributes:
        state_store_name (str | None): Name of the Dapr state store component to use for persistence.
        state_key_prefix (str | None): Optional prefix to use for state keys to avoid collisions.
    """

    state_store_name: str | None = None
    state_key_prefix: str | None = None


# ------------------------------------------
# Subscription state models
# ------------------------------------------


class QuerySubscription(BaseModel):
    """
    Subscription configuration.

    Attributes:
        id (str): Unique identifier for the subscription (this may not be the same as the agent's).
        query_id (str): Unique identifier for the query targeted by the subscription.
        topic (str): Name of the topic on which to publish events.
        event_types (list[EventType]): List of event types that the subscription is interested in.
            Must contain at least one event type.
    """

    id: str
    query_id: str
    topic: str
    event_types: Annotated[list[EventType], Field(min_length=1)]


class QuerySubscriptionState(RootModel[dict[str, QuerySubscription]]):
    """
    State model for query subscriptions.

    Attributes:
        root (dict[str, QuerySubscription]): A map of subscription identifiers to their corresponding subscription configuration.
    """
    root: dict[str, QuerySubscription] = Field(default_factory=dict)


# ------------------------------------------
# Tool result models
# ------------------------------------------


# TODO: what should the result look like
class SubscribeResult(BaseModel):
    """
    Result of a `subscribe` tool call.

    Attributes:
        agent_id (str): Unique ID for the agent making the subscription.
        query_id (str): Unique ID for the Drasi query targeted by the subscription.
        topic (str): Name of the topic on which the agent will receive messages.
        subscription_id (str): Unique ID for the subscription.
        event_types (list[EventType]): List of event types that the subscription is interested in.
    """
    agent_id: str
    query_id: str
    topic: str
    subscription_id: str
    event_types: Annotated[list[EventType], Field(min_length=1)]


# TODO: what should the result look like
class UnsubscribeResult(BaseModel):
    """
    Result of an `unsubscribe` tool call.

    Attributes:
        agent_id (str): Unique ID for the agent unsubscribing.
        query_id (str): Unique ID for the Drasi query targeted by the subscription.
        subscription_id (str): Unique ID for the subscription.
    """
    agent_id: str
    query_id: str
    subscription_id: str


class QueryResult(BaseModel):
    """
    Individual query result in a `list_queries` tool call.

    Attributes:
        query_id (str): Unique ID for the query.
        title (str): Human-readable name for the query.
        description (str): Human-readable description of the query.
    """
    query_id: str
    title: str
    description: str


class ListQueriesResult(BaseModel):
    """
    Result of a `list_queries` tool call.

    Attributes:
        queries (list[QueryResult]): List of query results.
    """
    queries: list[QueryResult]
