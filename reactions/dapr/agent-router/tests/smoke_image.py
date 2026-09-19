# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Exercise the shipped image using Docker and the Python standard library."""

from __future__ import annotations

import argparse
import json
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def docker(*arguments: str) -> str:
    return subprocess.check_output(["docker", *arguments], text=True).strip()


def request_json(
    url: str,
    payload: dict[str, Any] | None = None,
    protocol: str | None = None,
) -> Any:
    headers = {
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json",
    }
    if protocol is not None:
        headers["MCP-Protocol-Version"] = protocol
    request = Request(
        url,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers=headers,
    )
    with urlopen(request, timeout=10) as response:
        content = response.read()
        return json.loads(content) if content else None


def wait_for_subscriptions(container: str, url: str) -> Any:
    deadline = time.monotonic() + 90
    last_error: Exception | None = None
    while time.monotonic() < deadline:
        if docker("inspect", "--format", "{{.State.Running}}", container) != "true":
            raise RuntimeError("Router exited before becoming ready")
        try:
            return request_json(f"{url}/dapr/subscribe")
        except HTTPError as error:
            if error.code != 503:
                raise
            last_error = error
        except (URLError, ConnectionError, TimeoutError) as error:
            last_error = error
        time.sleep(0.5)
    raise TimeoutError("Router did not become ready within 90 seconds") from last_error


def check_image(image: str) -> None:
    with tempfile.TemporaryDirectory(prefix="drasi-router-smoke-") as directory:
        queries = Path(directory)
        queries.chmod(0o755)
        query = {
            "title": "Smoke query",
            "description": "Synthetic row changes used only for packaging verification.",
        }
        query_file = queries / "smoke-query"
        query_file.write_text(json.dumps(query), encoding="utf-8")
        query_file.chmod(0o644)
        container = docker(
            "create",
            "--publish", "127.0.0.1::8000",
            "--mount", f"type=bind,src={queries},dst=/etc/queries,readonly",
            "--env", "routerId=drasi-system/smoke-router-reaction",
            "--env", "egressPubsubName=smoke-egress",
            "--env", "PubsubName=smoke-inbound",
            "--env", "StateStoreName=smoke-state",
            image,
        )
        passed = False
        try:
            docker("start", container)
            address = docker("port", container, "8000/tcp")
            url = f"http://{address}"
            subscriptions = wait_for_subscriptions(container, url)
            assert len(subscriptions) == 1, subscriptions
            subscription = subscriptions[0]
            assert subscription["pubsubname"] == "smoke-inbound", subscription
            assert subscription["topic"] == "smoke-query-results", subscription
            assert subscription["deadLetterTopic"], subscription

            initialization = request_json(
                f"{url}/mcp",
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {"name": "image-smoke", "version": "1"},
                    },
                },
            )
            protocol = initialization["result"]["protocolVersion"]
            request_json(
                f"{url}/mcp",
                {"jsonrpc": "2.0", "method": "notifications/initialized"},
                protocol,
            )
            catalog_result = request_json(
                f"{url}/mcp",
                {
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "tools/call",
                    "params": {"name": "list_queries", "arguments": {}},
                },
                protocol,
            )
            result = catalog_result["result"]
            assert result["isError"] is False, result
            assert result["structuredContent"] == {
                "protocol_version": 1,
                "router_id": "drasi-system/smoke-router-reaction",
                "queries": [{"query_id": "smoke-query", **query}],
            }, result

            control = request_json(
                f"{url}{subscription['route']}",
                {
                    "id": "smoke-control",
                    "source": "urn:drasi:packaging-test",
                    "specversion": "1.0",
                    "type": "com.dapr.event.sent",
                    "topic": subscription["topic"],
                    "pubsubname": subscription["pubsubname"],
                    "datacontenttype": "application/json",
                    "data": {
                        "kind": "control",
                        "queryId": "smoke-query",
                        "sequence": 1,
                        "sourceTimeMs": 1,
                        "metadata": {},
                        "controlSignal": {"kind": "running"},
                    },
                },
            )
            assert control == {"status": "SUCCESS"}, control
            uid = docker("exec", container, "python", "-c", "import os; print(os.getuid())")
            assert int(uid) != 0, "Router must run as a non-root user"
            entrypoint = json.loads(
                docker("inspect", "--format", "{{json .Config.Entrypoint}}", container)
            )
            assert entrypoint[entrypoint.index("--workers") + 1] == "1", entrypoint
            docker("stop", "--timeout", "10", container)
            assert docker("inspect", "--format", "{{.State.ExitCode}}", container) == "0"
            passed = True
        finally:
            try:
                if not passed:
                    subprocess.run(["docker", "logs", container], check=True)
            finally:
                docker("rm", "--force", container)
    print(f"Router image smoke passed: {image}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", help="Locally built router image and tag")
    check_image(parser.parse_args().image)
