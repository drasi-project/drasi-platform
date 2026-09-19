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

"""Portable protocol v1 models, validation, and deterministic identity helpers."""

import base64
import hashlib
import json
import re
from functools import lru_cache
from importlib.resources import files
from typing import Any, TypeVar
from urllib.parse import quote

from jsonschema import Draft202012Validator
from pydantic import BaseModel
from referencing import Registry, Resource

from .models.AgentDelivery import AgentDelivery
from .models.ListQueriesRequest import ListQueriesRequest
from .models.ListQueriesResponse import ListQueriesResponse
from .models.Subscriber import Subscriber
from .models.SubscribeRequest import SubscribeRequest
from .models.SubscribeResponse import SubscribeResponse
from .models.ToolError import ToolError
from .models.UnsubscribeRequest import UnsubscribeRequest
from .models.UnsubscribeResponse import UnsubscribeResponse

__all__ = [
    "AgentDelivery",
    "ListQueriesRequest",
    "ListQueriesResponse",
    "SubscribeRequest",
    "SubscribeResponse",
    "Subscriber",
    "ToolError",
    "UnsubscribeRequest",
    "UnsubscribeResponse",
    "agent_inbox_topic",
    "agent_dead_letter_topic",
    "router_dead_letter_topic",
    "row_event_id",
    "parse",
    "parse_catalog",
    "to_wire",
]

Model = TypeVar("Model", bound=BaseModel)


@lru_cache(maxsize=1)
def _schemas() -> tuple[dict[str, Any], Registry]:
    documents = {
        resource.name: json.loads(resource.read_text(encoding="utf-8"))
        for resource in files(__package__).joinpath("schemas").iterdir()
        if resource.name.endswith(".json")
    }
    registry = Registry().with_resources(
        (name, Resource.from_contents(document)) for name, document in documents.items()
    )
    return documents, registry


def parse(model: type[Model], document: Any) -> Model:
    """Validate the wire schema before parsing; generated types alone are insufficient."""
    schemas, registry = _schemas()
    schema = schemas.get(f"{model.__name__}.json")
    if schema is None:
        raise ValueError(f"Unknown agent-router contract model: {model.__name__}")
    Draft202012Validator(schema, registry=registry).validate(document)
    result = model.model_validate(document)
    if isinstance(result, AgentDelivery):
        position = result.eventId.rsplit(":", 1)[-1]
        if re.fullmatch(r"0|[1-9][0-9]*", position) is None:
            raise ValueError("Row event ID has a non-canonical position")
        expected = row_event_id(
            result.event.payload.source.queryId,
            result.event.seq,
            result.event.op,
            int(position),
        )
        if result.eventId != expected:
            raise ValueError("Row event ID does not match the event identity")
    if isinstance(result, ListQueriesResponse):
        query_ids = [query.query_id for query in result.queries]
        if len(query_ids) != len(set(query_ids)):
            raise ValueError("Catalog contains duplicate query IDs")
    return result


def parse_catalog(document: Any, expected_router_id: str) -> ListQueriesResponse:
    """Validate the current catalog contract and its configured router identity."""
    _router_parts(expected_router_id)
    catalog = parse(ListQueriesResponse, document)
    if catalog.router_id != expected_router_id:
        raise ValueError("Catalog router identity does not match the configured router")
    return catalog


def to_wire(message: BaseModel) -> dict[str, Any]:
    """Omit unset optional fields and validate the current protocol message."""
    document = message.model_dump(mode="json", exclude_unset=True)
    if not isinstance(document, dict):
        raise ValueError("Protocol messages must serialize to JSON objects")
    parse(type(message), document)
    return document


def _router_parts(router_id: str) -> tuple[str, str]:
    if not isinstance(router_id, str):
        raise ValueError("Router identity must be a namespace/app-id string")
    parts = router_id.split("/")
    if len(parts) != 2 or any(re.fullmatch(r"[^/\s]+", part) is None for part in parts):
        raise ValueError("Router identity must contain one namespace and one app ID")
    return parts[0], parts[1]


def _digest(parts: tuple[str, ...]) -> str:
    digest = hashlib.sha256(b"drasi-agent-router/v1\0")
    for part in parts:
        if not isinstance(part, str) or not part:
            raise ValueError("Identity components must be non-empty strings")
        value = part.encode("utf-8")
        digest.update(len(value).to_bytes(4, "big"))
        digest.update(value)
    return base64.b32encode(digest.digest()).decode("ascii").lower().rstrip("=")


def _agent_digest(router_id: str, subscriber: Subscriber) -> str:
    subscriber = parse(Subscriber, subscriber.model_dump(mode="json"))
    return _digest(
        (
            *_router_parts(router_id),
            subscriber.namespace,
            subscriber.app_id,
            subscriber.agent_name,
        )
    )


def agent_inbox_topic(router_id: str, subscriber: Subscriber) -> str:
    return "drasi-ai1-" + _agent_digest(router_id, subscriber)


def agent_dead_letter_topic(router_id: str, subscriber: Subscriber) -> str:
    return "drasi-ad1-" + _agent_digest(router_id, subscriber)


def router_dead_letter_topic(router_id: str) -> str:
    return "drasi-rd1-" + _digest(_router_parts(router_id))


def row_event_id(query_id: str, sequence: int, operation: str, position: int) -> str:
    if not isinstance(query_id, str) or not query_id:
        raise ValueError("Query ID must be a non-empty string")
    if operation not in ("i", "u", "d"):
        raise ValueError("Operation must be i, u, or d")
    if any(type(value) is not int or value < 0 for value in (sequence, position)):
        raise ValueError("Sequence and position must be non-negative integers")
    encoded = quote(query_id, safe="-._~", encoding="utf-8", errors="strict")
    return f"drasi:v1:{encoded}:{sequence}:{operation}:{position}"
