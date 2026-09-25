from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from types import MappingProxyType
from typing import Any, Generic, Mapping, TypeVar

from drasi.reaction.models.ResultEvent import ResultEvent


ConfigT = TypeVar("ConfigT")
EventT = TypeVar("EventT", bound=ResultEvent)


class DeliveryOutcome(str, Enum):
    """The acknowledgement that the SDK returns to Dapr."""

    SUCCESS = "SUCCESS"
    RETRY = "RETRY"
    DROP = "DROP"


@dataclass(frozen=True)
class CloudEventContext:
    """Structurally validated delivery context from the outer Dapr CloudEvent."""

    id: str
    source: str
    spec_version: str
    type: str
    topic: str
    pubsub_name: str
    attributes: Mapping[str, Any] = field(default_factory=lambda: MappingProxyType({}))

    @property
    def identity(self) -> tuple[str, str]:
        """Identifies this CloudEvent publication and its redeliveries."""

        return (self.source, self.id)


@dataclass(frozen=True)
class QueryRegistration(Generic[ConfigT]):
    """A validated Continuous Query subscription."""

    query_id: str
    topic: str
    config: ConfigT | None


@dataclass(frozen=True)
class ReactionMessage(Generic[EventT, ConfigT]):
    """The typed message passed to a reaction callback."""

    event: EventT
    query: QueryRegistration[ConfigT]
    delivery: CloudEventContext
