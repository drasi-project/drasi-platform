# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Install the built wheel outside the checkout and check SDK admission."""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from importlib.metadata import version
from pathlib import Path


def check_installed() -> None:
    from agent_router import create_app
    from drasi.reaction import DrasiReaction
    from drasi.reaction.delivery import DeliveryOutcome
    from drasi.reaction.utils import yaml_query_configs
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    assert callable(create_app)
    messages = []

    async def callback(message):
        messages.append(message)
        return DeliveryOutcome.SUCCESS

    with tempfile.TemporaryDirectory(prefix="drasi-router-queries-") as directory:
        Path(directory, "query1").write_text("{}\n", encoding="utf-8")
        os.environ["QueryConfigPath"] = directory
        reaction = DrasiReaction(
            on_change_event=callback,
            on_control_event=callback,
            parse_query_configs=yaml_query_configs,
        )
        app = FastAPI()
        reaction.install(app)
        with TestClient(app) as client:
            for kind in ("change", "control"):
                data = {
                    "kind": kind,
                    "queryId": "query1",
                    "sequence": 42,
                    "sourceTimeMs": 100,
                }
                if kind == "change":
                    data.update(
                        addedResults=[{"value": "test"}],
                        updatedResults=[],
                        deletedResults=[],
                    )
                else:
                    data["controlSignal"] = {"kind": "running"}
                envelope = {
                    "id": "event-1",
                    "source": "urn:drasi:test",
                    "specversion": "1.0",
                    "type": "com.dapr.event.sent",
                    "topic": "query1-results",
                    "pubsubname": "drasi-pubsub",
                    "datacontenttype": "application/json",
                }
                for field in ("sequence", "sourceTimeMs"):
                    for value in (True, False, "42", "100", 42.0, 1.5, None):
                        messages.clear()
                        response = client.post(
                            "/_drasi/events/query1",
                            json={**envelope, "data": {**data, field: value}},
                        )
                        assert response.status_code == 200
                        assert response.json() == {"status": "DROP"}, (
                            kind, field, value
                        )
                        assert messages == [], (kind, field, value)
                for value in (0, 42, 2**53 + 1):
                    messages.clear()
                    response = client.post(
                        "/_drasi/events/query1",
                        json={
                            **envelope,
                            "data": {**data, "sequence": value, "sourceTimeMs": value},
                        },
                    )
                    assert response.status_code == 200
                    assert response.json() == {"status": "SUCCESS"}, (kind, value)
                    assert len(messages) == 1
                    for field in ("sequence", "sourceTimeMs"):
                        actual = getattr(messages[0].event, field)
                        assert type(actual) is int
                        assert actual == value, (kind, field, value)


def check_package() -> None:
    package = Path(__file__).resolve().parents[1]
    package_version = version("drasi-agent-router")
    wheels = list(
        (package / "dist").glob(f"drasi_agent_router-{package_version}-*.whl")
    )
    if len(wheels) != 1:
        raise RuntimeError(
            f"Expected one built wheel for drasi-agent-router {package_version}"
        )

    environment = os.environ.copy()
    for name in ("PYTHONPATH", "VIRTUAL_ENV", "UV_PROJECT_ENVIRONMENT"):
        environment.pop(name, None)

    with tempfile.TemporaryDirectory(prefix="drasi-router-package-") as directory:
        root = Path(directory)
        virtualenv = root / "venv"
        subprocess.run(
            ["uv", "venv", "--python", sys.executable, str(virtualenv)],
            cwd=root,
            env=environment,
            check=True,
        )
        python = virtualenv / (
            "Scripts/python.exe" if os.name == "nt" else "bin/python"
        )
        subprocess.run(
            [
                "uv", "pip", "install", "--no-config",
                "--python", str(python), str(wheels[0]),
            ],
            cwd=root,
            env=environment,
            check=True,
        )
        subprocess.run(
            [
                str(python), "-I", str(Path(__file__).resolve()),
                "--check-installed",
            ],
            cwd=root,
            env=environment,
            check=True,
        )

    print(f"Standalone wheel installation passed: {wheels[0].name}")


if __name__ == "__main__":
    if sys.argv[1:] == ["--check-installed"]:
        check_installed()
    else:
        check_package()
