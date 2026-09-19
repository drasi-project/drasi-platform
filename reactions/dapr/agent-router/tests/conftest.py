# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import shutil
import uuid
from collections.abc import Iterator, Mapping
from pathlib import Path
from typing import Any

import pytest

from agent_router import create_app


@pytest.fixture
def query_directory(monkeypatch: pytest.MonkeyPatch) -> Iterator[Path]:
    runtime_root = Path(__file__).parent / ".runtime"
    path = runtime_root / uuid.uuid4().hex
    path.mkdir(parents=True)
    monkeypatch.setenv("routerId", "drasi-system/router-app")
    monkeypatch.setenv("egressPubsubName", "router-egress")
    monkeypatch.setenv("PubsubName", "router-inbound")
    monkeypatch.setenv("StateStoreName", "router-state")
    monkeypatch.setenv("QueryConfigPath", str(path))
    try:
        yield path
    finally:
        shutil.rmtree(path, ignore_errors=True)
        try:
            runtime_root.rmdir()
        except OSError:
            pass


@pytest.fixture
def app_factory(query_directory: Path):
    def factory(files: Mapping[str, str] | None = None):
        for name, document in (files or {}).items():
            (query_directory / name).write_text(document, encoding="utf-8")
        return create_app()

    return factory


def cloud_event(
    query_id: str,
    *,
    kind: str = "change",
    pubsub_name: str = "router-inbound",
    secret: str = "private-result",
) -> dict[str, Any]:
    if kind == "change":
        data: dict[str, Any] = {
            "kind": "change",
            "queryId": query_id,
            "sequence": 1,
            "sourceTimeMs": 1000,
            "metadata": {"private": secret},
            "addedResults": [{"value": secret}],
            "updatedResults": [],
            "deletedResults": [],
        }
    else:
        data = {
            "kind": "control",
            "queryId": query_id,
            "sequence": 2,
            "sourceTimeMs": 1001,
            "metadata": {"private": secret},
            "controlSignal": {"kind": "running"},
        }
    return {
        "id": "event-1",
        "source": "urn:drasi:test",
        "specversion": "1.0",
        "type": "com.dapr.event.sent",
        "topic": f"{query_id}-results",
        "pubsubname": pubsub_name,
        "datacontenttype": "application/json",
        "data": data,
    }
