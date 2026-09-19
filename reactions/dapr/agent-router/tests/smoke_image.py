# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Exercise the shipped image using Docker and the Python standard library."""

from __future__ import annotations

import argparse
import json
import subprocess
import tempfile
import time
import uuid
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROUTER_ID = "drasi-system/drasi-router-state-tests"


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


@contextmanager
def state_runtime() -> Iterator[str]:
    project = f"drasi-router-smoke-{uuid.uuid4().hex}"
    fixture = Path(__file__).parent / "state-runtime/compose.yaml"

    def compose(*arguments: str) -> str:
        return docker("compose", "-p", project, "-f", str(fixture), *arguments)

    passed = False
    try:
        compose("up", "--wait", "--wait-timeout", "90", "--quiet-pull")
        dapr = compose("ps", "--quiet", "dapr")
        networks = json.loads(docker("inspect", dapr))[0]["NetworkSettings"]["Networks"]
        assert len(networks) == 1, networks
        yield next(iter(networks))
        passed = True
    finally:
        try:
            if not passed:
                compose("logs", "--no-color", "--tail", "50")
        finally:
            compose("down", "--volumes")


def initialize_mcp(url: str) -> str:
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
    return protocol


def call_tool(
    url: str, protocol: str, name: str, arguments: dict[str, Any]
) -> dict[str, Any]:
    response = request_json(
        f"{url}/mcp",
        {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {"name": name, "arguments": arguments},
        },
        protocol,
    )
    result = response["result"]
    assert result["isError"] is False, result
    return result["structuredContent"]


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
    with (
        state_runtime() as network,
        tempfile.TemporaryDirectory(prefix="drasi-router-smoke-") as directory,
    ):
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
            "--network", network,
            "--publish", "127.0.0.1::8000",
            "--mount", f"type=bind,src={queries},dst=/etc/queries,readonly",
            "--env", f"routerId={ROUTER_ID}",
            "--env", "egressPubsubName=smoke-egress",
            "--env", "PubsubName=smoke-inbound",
            "--env", "StateStoreName=router-state",
            "--env", "DAPR_HTTP_ENDPOINT=http://dapr:3500",
            "--env", "DAPR_GRPC_ENDPOINT=dapr:50001",
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
            assert request_json(f"{url}/healthz") == {"status": "alive"}
            assert request_json(f"{url}/readyz") == {"status": "ready"}
            for path in ("/admin/rules/remove", "/admin/subscribers/remove-rules"):
                invalid = Request(
                    f"{url}{path}",
                    data=(
                        b'{"subscriber":{"namespace":"applications","app_id":"smoke-agent",'
                        b'"agent_name":"\xffrouter-smoke-private-data"}}'
                    ),
                    headers={"Content-Type": "application/json"},
                )
                try:
                    with urlopen(invalid, timeout=10):
                        raise AssertionError("Invalid UTF-8 request was accepted")
                except HTTPError as error:
                    assert error.code == 422, error.code
                    response = json.loads(error.read())
                    assert response["code"] == "invalid_arguments", response
                    assert "router-smoke-private-data" not in json.dumps(response)

            protocol = initialize_mcp(url)
            catalog = call_tool(url, protocol, "list_queries", {})
            assert catalog == {
                "protocol_version": 1,
                "router_id": ROUTER_ID,
                "queries": [{"query_id": "smoke-query", **query}],
            }, catalog

            request = {
                "query_id": "smoke-query",
                "operations": ["i"],
                "subscriber": {
                    "namespace": "applications",
                    "app_id": "smoke-agent",
                    "agent_name": "SmokeAgent",
                },
                "subscription_incarnation": "image-smoke-1",
            }
            created = call_tool(url, protocol, "subscribe", request)
            assert created["status"] == "created", created
            assert created["topic_name"], created
            assert request_json(f"{url}/admin/rules") == {
                "router_id": ROUTER_ID,
                "view": "routing_snapshot",
                "rules": [{**request, "topic_name": created["topic_name"]}],
            }

            docker("stop", "--timeout", "10", container)
            assert docker("inspect", "--format", "{{.State.ExitCode}}", container) == "0"
            docker("start", container)
            url = f"http://{docker('port', container, '8000/tcp')}"
            assert wait_for_subscriptions(container, url) == subscriptions
            protocol = initialize_mcp(url)
            restored = call_tool(url, protocol, "subscribe", request)
            assert restored == {**created, "status": "updated"}, restored
            removal = {key: value for key, value in request.items() if key != "operations"}
            assert call_tool(url, protocol, "unsubscribe", removal) == {
                "query_id": "smoke-query", "removed": True,
            }
            assert call_tool(url, protocol, "unsubscribe", removal) == {
                "query_id": "smoke-query", "removed": False,
            }
            call_tool(url, protocol, "subscribe", request)
            operator_removal = {
                "query_id": request["query_id"],
                "subscriber": request["subscriber"],
            }
            assert request_json(
                f"{url}/admin/rules/remove", operator_removal
            ) == {"removed": True}
            call_tool(url, protocol, "subscribe", request)
            assert request_json(
                f"{url}/admin/subscribers/remove-rules",
                {"subscriber": request["subscriber"]},
            ) == {"removed_count": 1}
            assert request_json(f"{url}/admin/rules")["rules"] == []
            docker("stop", "--timeout", "10", container)
            assert docker("inspect", "--format", "{{.State.ExitCode}}", container) == "0"
            docker("start", container)
            url = f"http://{docker('port', container, '8000/tcp')}"
            assert wait_for_subscriptions(container, url) == subscriptions
            assert request_json(f"{url}/readyz") == {"status": "ready"}
            assert request_json(f"{url}/admin/rules")["rules"] == []

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
                        "metadata": {"private": "router-smoke-private-data"},
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
            logs = subprocess.run(
                ["docker", "logs", container], check=True, text=True, capture_output=True
            )
            records = [
                json.loads(line)
                for line in logs.stdout.splitlines()
                if line.startswith("{")
            ]
            assert {record.get("event") for record in records} >= {
                "router_ready", "router_rules_cleaned", "router_stopped",
            }
            assert "router-smoke-private-data" not in logs.stdout
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
