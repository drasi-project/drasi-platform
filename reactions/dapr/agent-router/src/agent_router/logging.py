# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Structured logging for the DaprAgentRouter process."""

import json
import logging
import math
import sys
from datetime import datetime, timezone
from typing import Final

_LOGGER_NAMES: Final = ("agent_router", "drasi.reaction")
_HANDLER_MARKER: Final = "_drasi_agent_router_json_handler"
_CONTEXT_FIELDS: Final = (
    "router_id",
    "state_store",
    "drasi_query_id",
    "subscriber",
    "subscription_status",
    "subscription_removed",
    "router_tool",
    "router_error_code",
    "state_failure",
    "drasi_delivery_outcome",
    "drasi_delivery_reason",
    "drasi_event_kind",
    "operation",
    "outcome",
    "removed_count",
    "rule_count",
    "initialization_stage",
)
_SUBSCRIBER_FIELDS: Final = ("namespace", "app_id", "agent_name")
_OMIT: Final = object()


def _safe_scalar(value: object) -> object:
    if value is None or type(value) in (str, bool, int):
        return value
    if type(value) is float and math.isfinite(value):
        return value
    return _OMIT


def _safe_subscriber(value: object) -> dict[str, object] | None:
    if type(value) is not dict:
        return None
    subscriber: dict[str, object] = {}
    for field in _SUBSCRIBER_FIELDS:
        field_value = value.get(field, _OMIT)
        safe_value = _safe_scalar(field_value)
        if safe_value is not _OMIT:
            subscriber[field] = safe_value
    return subscriber or None


class _JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        event = record.msg if isinstance(record.msg, str) else "invalid_log_event"
        document: dict[str, object] = {
            "timestamp": datetime.fromtimestamp(
                record.created, tz=timezone.utc
            ).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
            "level": record.levelname,
            "logger": record.name,
            "event": event,
        }
        for field in _CONTEXT_FIELDS:
            value = getattr(record, field, _OMIT)
            if field == "subscriber":
                subscriber = _safe_subscriber(value)
                if subscriber is not None:
                    document[field] = subscriber
                continue
            safe_value = _safe_scalar(value)
            if safe_value is not _OMIT:
                document[field] = safe_value
        return json.dumps(
            document,
            ensure_ascii=True,
            allow_nan=False,
            separators=(",", ":"),
        )


class _CurrentStdout:
    def write(self, message: str) -> int:
        return sys.stdout.write(message)

    def flush(self) -> None:
        sys.stdout.flush()


def configure_logging() -> None:
    """Emit router and Reaction SDK records as safe JSON on standard output."""

    for name in _LOGGER_NAMES:
        logger = logging.getLogger(name)
        if logger.level == logging.NOTSET or logger.level > logging.INFO:
            logger.setLevel(logging.INFO)
        logger.disabled = False
        logger.propagate = True

        handler = next(
            (
                current
                for current in logger.handlers
                if getattr(current, _HANDLER_MARKER, False)
            ),
            None,
        )
        if handler is None:
            handler = logging.StreamHandler(_CurrentStdout())
            setattr(handler, _HANDLER_MARKER, True)
            logger.addHandler(handler)
        handler.setLevel(logging.INFO)
        handler.setFormatter(_JsonFormatter())


__all__ = ["configure_logging"]
