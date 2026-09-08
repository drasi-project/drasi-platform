"""Infrastructure for installing a Drasi Reaction into a FastAPI application."""

from __future__ import annotations

import copy
import json
import logging
import os
import re
from contextlib import asynccontextmanager
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from types import MappingProxyType
from typing import (
    Any,
    AsyncIterator,
    Awaitable,
    Callable,
    Generic,
    Literal,
    Mapping,
    TextIO,
    TypeVar,
)

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator
from rfc3986_validator import validate_rfc3986
from starlette.routing import Match

from drasi.reaction.delivery import (
    CloudEventContext,
    DeliveryOutcome,
    QueryRegistration,
    ReactionMessage,
)
from drasi.reaction.logger import get_logger
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent


ConfigT = TypeVar("ConfigT")
AsyncChangeEventFunc = Callable[
    [ReactionMessage[ChangeEvent, ConfigT]], Awaitable[DeliveryOutcome]
]
AsyncControlEventFunc = Callable[
    [ReactionMessage[ControlEvent, ConfigT]], Awaitable[DeliveryOutcome]
]
AsyncLifecycleFunc = Callable[[], Awaitable[None]]

_CLOUD_EVENT_ATTRIBUTE_NAME = re.compile(r"^[a-z0-9]+$")
_RFC3339_TIMESTAMP = re.compile(
    r"^(?P<year>[0-9]{4})-(?P<month>[0-9]{2})-(?P<day>[0-9]{2})"
    r"[Tt](?P<hour>[0-9]{2}):(?P<minute>[0-9]{2}):(?P<second>[0-9]{2})"
    r"(?:\.[0-9]+)?(?P<offset>[Zz]|[+-][0-9]{2}:[0-9]{2})$"
)
_MIME_TSPECIALS = frozenset('()<>@,;:\\"/[]?=')
_LEAP_SECOND_DATES = frozenset(
    {
        date(1972, 6, 30),
        date(1972, 12, 31),
        date(1973, 12, 31),
        date(1974, 12, 31),
        date(1975, 12, 31),
        date(1976, 12, 31),
        date(1977, 12, 31),
        date(1978, 12, 31),
        date(1979, 12, 31),
        date(1981, 6, 30),
        date(1982, 6, 30),
        date(1983, 6, 30),
        date(1985, 6, 30),
        date(1987, 12, 31),
        date(1989, 12, 31),
        date(1990, 12, 31),
        date(1992, 6, 30),
        date(1993, 6, 30),
        date(1994, 6, 30),
        date(1995, 12, 31),
        date(1997, 6, 30),
        date(1998, 12, 31),
        date(2005, 12, 31),
        date(2008, 12, 31),
        date(2012, 6, 30),
        date(2015, 6, 30),
        date(2016, 12, 31),
    }
)
_MIN_CLOUD_EVENT_INTEGER = -(2**31)
_MAX_CLOUD_EVENT_INTEGER = 2**31 - 1
_DELIVERY_ROUTE = "/_drasi/events/{query_id}"
_SUBSCRIPTION_ROUTE = "/dapr/subscribe"

logger = get_logger()


class _CloudEventEnvelope(BaseModel):
    model_config = ConfigDict(extra="allow", frozen=True, strict=True)

    id: str = Field(min_length=1)
    source: str = Field(min_length=1)
    specversion: Literal["1.0"]
    type: str = Field(min_length=1)
    datacontenttype: str | None = None
    dataschema: str | None = None
    subject: str | None = Field(default=None, min_length=1)
    time: str | None = None
    topic: str = Field(min_length=1)
    pubsubname: str = Field(min_length=1)
    data: dict[str, Any]

    @field_validator("id", "type", "subject", "topic", "pubsubname")
    @classmethod
    def validate_string(cls, value: str | None) -> str | None:
        if value is not None and not _is_cloud_event_string(value):
            raise ValueError("attribute must be a valid CloudEvents string")
        return value

    @field_validator("source")
    @classmethod
    def validate_source(cls, value: str) -> str:
        if validate_rfc3986(value, rule="URI_reference") is None:
            raise ValueError("source must be a URI-reference")
        return value

    @field_validator("datacontenttype")
    @classmethod
    def validate_data_content_type(cls, value: str | None) -> str | None:
        if value is not None and not _is_valid_media_type(value):
            raise ValueError("datacontenttype must be a valid media type")
        return value

    @field_validator("dataschema")
    @classmethod
    def validate_data_schema(cls, value: str | None) -> str | None:
        if value is not None and validate_rfc3986(value, rule="URI") is None:
            raise ValueError("dataschema must be an absolute URI")
        return value

    @field_validator("time")
    @classmethod
    def validate_time(cls, value: str | None) -> str | None:
        if value is not None and not _is_rfc3339_timestamp(value):
            raise ValueError("time must be an RFC 3339 timestamp")
        return value


def _is_cloud_event_string(value: str) -> bool:
    try:
        value.encode("utf-8")
    except UnicodeEncodeError:
        return False

    for character in value:
        code_point = ord(character)
        if code_point <= 0x1F or 0x7F <= code_point <= 0x9F:
            return False
        if 0xFDD0 <= code_point <= 0xFDEF:
            return False
        if code_point & 0xFFFF in (0xFFFE, 0xFFFF):
            return False
    return True


def _is_rfc3339_timestamp(value: str) -> bool:
    match = _RFC3339_TIMESTAMP.fullmatch(value)
    if match is None:
        return False

    parts = {
        name: int(part) for name, part in match.groupdict().items() if name != "offset"
    }
    if parts["hour"] > 23 or parts["minute"] > 59 or parts["second"] > 60:
        return False

    offset = match.group("offset")
    if offset in ("Z", "z"):
        utc_offset = timedelta()
    else:
        offset_hour, offset_minute = (int(part) for part in offset[1:].split(":"))
        if offset_hour > 23 or offset_minute > 59:
            return False
        direction = 1 if offset[0] == "+" else -1
        utc_offset = direction * timedelta(
            hours=offset_hour,
            minutes=offset_minute,
        )

    try:
        local_time = datetime(
            parts["year"],
            parts["month"],
            parts["day"],
            parts["hour"],
            parts["minute"],
            min(parts["second"], 59),
            tzinfo=timezone(utc_offset),
        )
    except ValueError:
        return False

    if parts["second"] == 60:
        try:
            utc_time = local_time.astimezone(timezone.utc)
        except OverflowError:
            return False
        return (
            utc_time.date() in _LEAP_SECOND_DATES
            and utc_time.hour == 23
            and utc_time.minute == 59
            and utc_time.second == 59
        )

    return True


def _is_mime_token_character(character: str) -> bool:
    return 0x21 <= ord(character) <= 0x7E and character not in _MIME_TSPECIALS


def _consume_mime_token(value: str, position: int) -> int | None:
    start = position
    while position < len(value) and _is_mime_token_character(value[position]):
        position += 1
    return position if position > start else None


def _consume_mime_whitespace_and_comments(
    value: str,
    position: int,
) -> int | None:
    while position < len(value):
        while position < len(value) and value[position] == " ":
            position += 1
        if position >= len(value) or value[position] != "(":
            return position

        depth = 1
        position += 1
        while position < len(value) and depth:
            character = value[position]
            if character == "\\":
                position += 2
                if position > len(value):
                    return None
                continue
            if character == "(":
                depth += 1
            elif character == ")":
                depth -= 1
            position += 1
        if depth:
            return None
    return position


def _consume_mime_quoted_string(value: str, position: int) -> int | None:
    if position >= len(value) or value[position] != '"':
        return None
    position += 1
    while position < len(value):
        character = value[position]
        if character == '"':
            return position + 1
        if character == "\\":
            position += 2
            if position > len(value):
                return None
            continue
        position += 1
    return None


def _is_valid_media_type(value: str) -> bool:
    if not _is_cloud_event_string(value) or not value.isascii():
        return False

    position = _consume_mime_whitespace_and_comments(value, 0)
    if position is None:
        return False
    position = _consume_mime_token(value, position)
    if position is None:
        return False
    position = _consume_mime_whitespace_and_comments(value, position)
    if position is None or position >= len(value) or value[position] != "/":
        return False

    position = _consume_mime_whitespace_and_comments(value, position + 1)
    if position is None:
        return False
    position = _consume_mime_token(value, position)
    if position is None:
        return False

    while True:
        position = _consume_mime_whitespace_and_comments(value, position)
        if position is None:
            return False
        if position == len(value):
            return True
        if value[position] != ";":
            return False

        position = _consume_mime_whitespace_and_comments(value, position + 1)
        if position is None:
            return False
        position = _consume_mime_token(value, position)
        if position is None:
            return False
        position = _consume_mime_whitespace_and_comments(value, position)
        if position is None or position >= len(value) or value[position] != "=":
            return False
        position = _consume_mime_whitespace_and_comments(value, position + 1)
        if position is None:
            return False

        quoted_end = _consume_mime_quoted_string(value, position)
        if quoted_end is not None:
            position = quoted_end
            continue
        position = _consume_mime_token(value, position)
        if position is None:
            return False


class DrasiReaction(Generic[ConfigT]):
    """Install typed Drasi delivery handlers into a caller-owned FastAPI app."""

    def __init__(
        self,
        on_change_event: AsyncChangeEventFunc[ConfigT],
        on_control_event: AsyncControlEventFunc[ConfigT] | None = None,
        parse_query_configs: Callable[[TextIO], ConfigT] | None = None,
        on_initialize: AsyncLifecycleFunc | None = None,
        on_cleanup: AsyncLifecycleFunc | None = None,
        dead_letter_topic: str | None = None,
    ) -> None:
        self.on_change_event = on_change_event
        self.on_control_event = on_control_event
        self.parse_query_configs = parse_query_configs
        self.on_initialize = on_initialize
        self.on_cleanup = on_cleanup

        if dead_letter_topic is not None and not dead_letter_topic.strip():
            raise ValueError("dead_letter_topic must not be empty")
        self.dead_letter_topic = dead_letter_topic

        self._pubsub_name = os.getenv("PubsubName", "drasi-pubsub")
        self._config_directory = Path(os.getenv("QueryConfigPath", "/etc/queries"))
        self._registrations: Mapping[str, QueryRegistration[ConfigT]] = (
            MappingProxyType({})
        )
        self._subscriptions: tuple[dict[str, Any], ...] = ()
        self._installed_app: FastAPI | None = None
        self._ready = False
        self._lifecycle_active = False

    @property
    def is_ready(self) -> bool:
        """Whether initialization completed and deliveries may be processed."""

        return self._ready

    @property
    def query_registrations(self) -> Mapping[str, QueryRegistration[ConfigT]]:
        """Return an isolated, read-only copy of the startup registrations."""

        return MappingProxyType(
            {
                query_id: self._copy_registration(registration)
                for query_id, registration in self._registrations.items()
            }
        )

    @property
    def query_configs(self) -> Mapping[str, ConfigT | None]:
        """Return isolated query configurations keyed by query ID."""

        return MappingProxyType(
            {
                query_id: copy.deepcopy(registration.config)
                for query_id, registration in self._registrations.items()
            }
        )

    def install(self, app: FastAPI) -> None:
        """Install Dapr discovery, delivery routes, and lifecycle behavior."""

        if self._installed_app is not None:
            raise RuntimeError("this reaction is already installed")
        if getattr(app.state, "_drasi_reaction_installed", False):
            raise RuntimeError("a Drasi reaction is already installed on this app")

        registrations = self._prepare_registrations()
        subscriptions = self._prepare_subscriptions(registrations)
        self._preflight_routes(app, registrations)

        original_route_count = len(app.router.routes)
        original_lifespan = app.router.lifespan_context

        try:
            app.add_api_route(
                _SUBSCRIPTION_ROUTE,
                self._get_subscriptions,
                methods=["GET"],
                tags=["PubSub"],
                name="drasi_subscriptions",
                response_model=None,
            )
            app.add_api_route(
                _DELIVERY_ROUTE,
                self._handle_delivery,
                methods=["POST"],
                tags=["PubSub"],
                name="drasi_delivery",
            )
            app.router.lifespan_context = self._compose_lifespan(original_lifespan)
        except BaseException:
            del app.router.routes[original_route_count:]
            app.router.lifespan_context = original_lifespan
            raise

        self._registrations = MappingProxyType(registrations)
        self._subscriptions = tuple(subscriptions)
        self._installed_app = app
        app.state._drasi_reaction_installed = True

    def _prepare_registrations(self) -> dict[str, QueryRegistration[ConfigT]]:
        if not self._config_directory.exists():
            raise FileNotFoundError(
                f"query configuration directory does not exist: "
                f"{self._config_directory}"
            )
        if not self._config_directory.is_dir():
            raise NotADirectoryError(
                f"query configuration path is not a directory: "
                f"{self._config_directory}"
            )

        registrations: dict[str, QueryRegistration[ConfigT]] = {}
        for query_path in sorted(self._config_directory.iterdir()):
            if not query_path.is_file() or query_path.name.startswith("."):
                continue

            query_id = query_path.name
            topic = f"{query_id}-results"
            config = None

            if self.parse_query_configs is not None:
                with query_path.open("r", encoding="utf-8") as query_file:
                    parsed_config = self.parse_query_configs(query_file)
                config = copy.deepcopy(parsed_config)
                copy.deepcopy(config)

            registrations[query_id] = QueryRegistration(
                query_id=query_id,
                topic=topic,
                config=config,
            )

        return registrations

    def _prepare_subscriptions(
        self, registrations: Mapping[str, QueryRegistration[ConfigT]]
    ) -> list[dict[str, Any]]:
        subscriptions: list[dict[str, Any]] = []
        for registration in registrations.values():
            subscription: dict[str, Any] = {
                "pubsubname": self._pubsub_name,
                "topic": registration.topic,
                "route": self._delivery_path(registration.query_id),
            }
            if self.dead_letter_topic is not None:
                subscription["deadLetterTopic"] = self.dead_letter_topic
            subscriptions.append(subscription)
        return subscriptions

    def _preflight_routes(
        self,
        app: FastAPI,
        registrations: Mapping[str, QueryRegistration[ConfigT]],
    ) -> None:
        routes = [(_SUBSCRIPTION_ROUTE, "GET")]
        routes.extend(
            (self._delivery_path(query_id), "POST") for query_id in registrations
        )

        for path, method in routes:
            scope = {
                "type": "http",
                "asgi": {"version": "3.0"},
                "http_version": "1.1",
                "scheme": "http",
                "method": method,
                "root_path": "",
                "path": path,
                "raw_path": path.encode("utf-8"),
                "query_string": b"",
                "headers": [],
                "client": ("127.0.0.1", 0),
                "server": ("127.0.0.1", 80),
            }
            for route in app.router.routes:
                match, _ = route.matches(scope)
                if match == Match.FULL:
                    raise RuntimeError(
                        f"cannot install Drasi route {method} {path}: "
                        "an existing route would handle it first"
                    )

    def _compose_lifespan(
        self,
        original_lifespan: Callable[[FastAPI], Any],
    ) -> Callable[[FastAPI], Any]:
        @asynccontextmanager
        async def lifespan(app: FastAPI) -> AsyncIterator[Mapping[str, Any] | None]:
            async with original_lifespan(app) as state:
                if self._lifecycle_active:
                    raise RuntimeError("the Drasi reaction lifecycle is already active")

                self._lifecycle_active = True
                primary_error: BaseException | None = None
                try:
                    if self.on_initialize is not None:
                        await self.on_initialize()
                    self._ready = True
                    yield state
                except BaseException as error:
                    primary_error = error
                finally:
                    self._ready = False
                    cleanup_error: BaseException | None = None
                    try:
                        if self.on_cleanup is not None:
                            await self.on_cleanup()
                    except BaseException as error:
                        cleanup_error = error
                        logger.error("reaction_cleanup_failed")
                    finally:
                        self._lifecycle_active = False

                    if primary_error is not None:
                        if cleanup_error is not None:
                            raise primary_error from cleanup_error
                        raise primary_error
                    if cleanup_error is not None:
                        raise cleanup_error

        return lifespan

    async def _get_subscriptions(self) -> list[dict[str, Any]] | JSONResponse:
        if not self.is_ready:
            return JSONResponse(
                status_code=503,
                content={"detail": "reaction initialization is incomplete"},
            )
        return [dict(subscription) for subscription in self._subscriptions]

    async def _handle_delivery(self, query_id: str, request: Request) -> dict[str, str]:
        if not self.is_ready:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.RETRY,
                reason="not_ready",
            )
        if query_id not in self._registrations:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.DROP,
                reason="unregistered_query",
            )

        try:
            payload = await request.json()
        except (json.JSONDecodeError, UnicodeDecodeError):
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.DROP,
                reason="invalid_json",
            )

        try:
            envelope = _CloudEventEnvelope.model_validate(payload)
            attributes = self._validate_cloud_event_attributes(payload)
        except (ValidationError, ValueError):
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.DROP,
                reason="invalid_cloud_event",
            )

        expected_topic = f"{query_id}-results"
        if envelope.topic != expected_topic or envelope.pubsubname != self._pubsub_name:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.DROP,
                reason="delivery_route_mismatch",
            )

        event_kind = envelope.data.get("kind")
        try:
            if event_kind == "change":
                event = ChangeEvent.model_validate(envelope.data)
                callback = self.on_change_event
            elif event_kind == "control":
                event = ControlEvent.model_validate(envelope.data)
                callback = self.on_control_event
            else:
                return self._delivery_response(
                    query_id=query_id,
                    outcome=DeliveryOutcome.DROP,
                    reason="unsupported_event_kind",
                )
        except ValidationError:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.DROP,
                reason="invalid_drasi_event",
                event_kind=event_kind,
            )

        if event.queryId != query_id:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.DROP,
                reason="query_id_mismatch",
                event_kind=event_kind,
            )

        registration = self._copy_registration(self._registrations[query_id])
        context = CloudEventContext(
            id=envelope.id,
            source=envelope.source,
            spec_version=envelope.specversion,
            type=envelope.type,
            topic=envelope.topic,
            pubsub_name=envelope.pubsubname,
            attributes=attributes,
        )

        if callback is None:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.SUCCESS,
                reason="no_control_handler",
                event_kind=event_kind,
            )

        message = ReactionMessage(
            event=event,
            query=registration,
            delivery=context,
        )
        try:
            outcome = await callback(message)
        except Exception:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.RETRY,
                reason="callback_exception",
                event_kind=event_kind,
            )

        if outcome is None:
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.RETRY,
                reason="callback_returned_none",
                event_kind=event_kind,
            )
        if not isinstance(outcome, DeliveryOutcome):
            return self._delivery_response(
                query_id=query_id,
                outcome=DeliveryOutcome.RETRY,
                reason="invalid_callback_outcome",
                event_kind=event_kind,
            )

        return self._delivery_response(
            query_id=query_id,
            outcome=outcome,
            reason="callback_completed",
            event_kind=event_kind,
        )

    @staticmethod
    def _validate_cloud_event_attributes(payload: Any) -> Mapping[str, Any]:
        if not isinstance(payload, dict):
            raise ValueError("CloudEvent must be an object")

        attributes: dict[str, Any] = {}
        for name, value in payload.items():
            if name == "data":
                continue
            if not _CLOUD_EVENT_ATTRIBUTE_NAME.fullmatch(name):
                raise ValueError("invalid CloudEvent attribute name")
            if value is None:
                continue
            if isinstance(value, bool):
                pass
            elif isinstance(value, int):
                if not _MIN_CLOUD_EVENT_INTEGER <= value <= _MAX_CLOUD_EVENT_INTEGER:
                    raise ValueError("CloudEvent integer attribute is out of range")
            elif isinstance(value, str):
                if not _is_cloud_event_string(value):
                    raise ValueError("invalid CloudEvent string attribute")
            else:
                raise ValueError("invalid CloudEvent attribute value")
            attributes[name] = copy.deepcopy(value)

        return MappingProxyType(attributes)

    @staticmethod
    def _delivery_path(query_id: str) -> str:
        if "/" in query_id:
            raise ValueError("query IDs containing '/' are not supported")
        return f"/_drasi/events/{query_id}"

    @staticmethod
    def _copy_registration(
        registration: QueryRegistration[ConfigT],
    ) -> QueryRegistration[ConfigT]:
        return QueryRegistration(
            query_id=registration.query_id,
            topic=registration.topic,
            config=copy.deepcopy(registration.config),
        )

    @staticmethod
    def _delivery_response(
        *,
        query_id: str,
        outcome: DeliveryOutcome,
        reason: str,
        event_kind: Any = None,
    ) -> dict[str, str]:
        log_level = (
            logging.INFO if outcome == DeliveryOutcome.SUCCESS else logging.WARNING
        )
        extra = {
            "drasi_query_id": query_id,
            "drasi_delivery_outcome": outcome.value,
            "drasi_delivery_reason": reason,
        }
        if event_kind in ("change", "control"):
            extra["drasi_event_kind"] = event_kind
        logger.log(log_level, "reaction_delivery", extra=extra)
        return {"status": outcome.value}
