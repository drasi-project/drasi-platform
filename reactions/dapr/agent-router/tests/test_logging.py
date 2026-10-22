# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import io
import json
import logging
import sys
from collections.abc import Iterator
from datetime import datetime

import pytest

from agent_router.logging import configure_logging

_TARGET_LOGGERS = ("agent_router", "drasi.reaction")


@pytest.fixture(autouse=True)
def restore_logging_configuration() -> Iterator[None]:
    snapshots = {
        name: (
            list(logger.handlers),
            logger.level,
            logger.propagate,
            logger.disabled,
        )
        for name in _TARGET_LOGGERS
        if (logger := logging.getLogger(name))
    }
    yield
    for name, (handlers, level, propagate, disabled) in snapshots.items():
        logger = logging.getLogger(name)
        logger.handlers[:] = handlers
        logger.setLevel(level)
        logger.propagate = propagate
        logger.disabled = disabled


def _documents(output: io.StringIO) -> list[dict[str, object]]:
    return [json.loads(line) for line in output.getvalue().splitlines()]


def test_router_and_sdk_info_records_are_json_and_propagate(
    monkeypatch: pytest.MonkeyPatch,
    caplog: pytest.LogCaptureFixture,
) -> None:
    output = io.StringIO()
    monkeypatch.setattr(sys, "stdout", output)
    caplog.set_level(logging.INFO)

    configure_logging()
    logging.getLogger("agent_router.app").info(
        "router_initialized",
        extra={
            "router_id": "drasi-system/router-app",
            "state_store": "router-state",
            "drasi_query_id": "orders.v1",
            "subscription_status": "created",
            "subscription_removed": False,
            "router_tool": "subscribe",
            "router_error_code": "state_unavailable",
            "state_failure": "sanitized failure",
            "operation": "initialize",
            "outcome": "success",
            "removed_count": 2,
            "rule_count": 3,
            "initialization_stage": "subscriptions",
        },
    )
    logging.getLogger("drasi.reaction.sdk").info(
        "reaction_delivery",
        extra={
            "drasi_query_id": "orders.v1",
            "drasi_delivery_outcome": "SUCCESS",
            "drasi_delivery_reason": "callback_completed",
            "drasi_event_kind": "change",
        },
    )

    router, sdk = _documents(output)
    assert list(router)[:4] == ["timestamp", "level", "logger", "event"]
    assert router == {
        "timestamp": router["timestamp"],
        "level": "INFO",
        "logger": "agent_router.app",
        "event": "router_initialized",
        "router_id": "drasi-system/router-app",
        "state_store": "router-state",
        "drasi_query_id": "orders.v1",
        "subscription_status": "created",
        "subscription_removed": False,
        "router_tool": "subscribe",
        "router_error_code": "state_unavailable",
        "state_failure": "sanitized failure",
        "operation": "initialize",
        "outcome": "success",
        "removed_count": 2,
        "rule_count": 3,
        "initialization_stage": "subscriptions",
    }
    assert datetime.fromisoformat(str(router["timestamp"]).replace("Z", "+00:00"))
    assert sdk == {
        "timestamp": sdk["timestamp"],
        "level": "INFO",
        "logger": "drasi.reaction.sdk",
        "event": "reaction_delivery",
        "drasi_query_id": "orders.v1",
        "drasi_delivery_outcome": "SUCCESS",
        "drasi_delivery_reason": "callback_completed",
        "drasi_event_kind": "change",
    }
    assert [record.getMessage() for record in caplog.records[-2:]] == [
        "router_initialized",
        "reaction_delivery",
    ]


def test_subscriber_fields_are_filtered_and_newlines_are_escaped(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    output = io.StringIO()
    monkeypatch.setattr(sys, "stdout", output)
    configure_logging()

    logging.getLogger("agent_router.subscriptions").info(
        "router_subscription_upserted",
        extra={
            "subscriber": {
                "namespace": "applications\nforged",
                "app_id": "agent-app",
                "agent_name": "OrdersAgent",
                "credential": "subscriber-secret",
                "nested": {"prompt": "private-prompt"},
            }
        },
    )

    raw = output.getvalue()
    assert len(raw.splitlines()) == 1
    assert "applications\\nforged" in raw
    assert "subscriber-secret" not in raw
    assert "private-prompt" not in raw
    assert _documents(output)[0]["subscriber"] == {
        "namespace": "applications\nforged",
        "app_id": "agent-app",
        "agent_name": "OrdersAgent",
    }


def test_unsupported_subscriber_mapping_is_not_inspected(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class UnsupportedSubscriber(dict[str, object]):
        def get(self, key: str, default: object = None) -> object:
            raise AssertionError("unsupported mapping was inspected")

    output = io.StringIO()
    monkeypatch.setattr(sys, "stdout", output)
    configure_logging()

    logging.getLogger("agent_router.subscriptions").info(
        "router_subscription_upserted",
        extra={"subscriber": UnsupportedSubscriber(namespace="applications")},
    )

    assert "subscriber" not in _documents(output)[0]


def test_unknown_extras_and_exception_details_are_omitted(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    output = io.StringIO()
    monkeypatch.setattr(sys, "stdout", output)
    configure_logging()

    try:
        raise ValueError("credential-from-exception")
    except ValueError:
        logging.getLogger("agent_router.app").exception(
            "router_initialization_failed",
            extra={
                "initialization_stage": "state",
                "password": "credential-from-extra",
                "prompt": "private-prompt",
                "rows": [{"secret": "private-row"}],
            },
            stack_info=True,
        )

    raw = output.getvalue()
    assert _documents(output) == [
        {
            "timestamp": _documents(output)[0]["timestamp"],
            "level": "ERROR",
            "logger": "agent_router.app",
            "event": "router_initialization_failed",
            "initialization_stage": "state",
        }
    ]
    for secret in (
        "credential-from-exception",
        "credential-from-extra",
        "private-prompt",
        "private-row",
        "Traceback",
    ):
        assert secret not in raw


def test_configuration_is_idempotent_and_uses_current_stdout(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    first_output = io.StringIO()
    monkeypatch.setattr(sys, "stdout", first_output)
    configure_logging()
    configure_logging()

    for name in _TARGET_LOGGERS:
        handlers = [
            handler
            for handler in logging.getLogger(name).handlers
            if getattr(handler, "_drasi_agent_router_json_handler", False)
        ]
        assert len(handlers) == 1

    logging.getLogger("agent_router.app").info("first_event")
    assert _documents(first_output)[0]["event"] == "first_event"
    first_output.close()

    second_output = io.StringIO()
    monkeypatch.setattr(sys, "stdout", second_output)
    configure_logging()
    logging.getLogger("agent_router.app").info("second_event")
    assert _documents(second_output)[0]["event"] == "second_event"


def test_unrelated_logger_configuration_is_unchanged() -> None:
    logger = logging.getLogger("uvicorn.unrelated_logging_test")
    original = (list(logger.handlers), logger.level, logger.propagate, logger.disabled)
    sentinel = logging.NullHandler()
    logger.handlers[:] = [sentinel]
    logger.setLevel(logging.ERROR)
    logger.propagate = False
    logger.disabled = True
    try:
        configure_logging()
        assert logger.handlers == [sentinel]
        assert logger.level == logging.ERROR
        assert logger.propagate is False
        assert logger.disabled is True
    finally:
        handlers, level, propagate, disabled = original
        logger.handlers[:] = handlers
        logger.setLevel(level)
        logger.propagate = propagate
        logger.disabled = disabled
