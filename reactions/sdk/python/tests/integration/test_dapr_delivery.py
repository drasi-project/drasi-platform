import os
import signal
import shutil
import socket
import subprocess
import sys
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Callable, Iterator

import httpx
import pytest


pytestmark = pytest.mark.integration
APP_ID = "python-reaction-sdk-test"
TRACE_ID = "4bf92f3577b34da6a3ce929d0e0e4736"
TRACEPARENT = f"00-{TRACE_ID}-00f067aa0ba902b7-01"


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def wait_for(
    predicate: Callable[[], Any],
    *,
    timeout: float = 15,
) -> Any:
    deadline = time.monotonic() + timeout
    last_error: Exception | None = None
    while time.monotonic() < deadline:
        try:
            result = predicate()
            if result:
                return result
        except (httpx.HTTPError, KeyError, ValueError) as error:
            last_error = error
        time.sleep(0.1)
    raise AssertionError("condition was not met before timeout") from last_error


def result_event(mode: str, sequence: int) -> dict[str, Any]:
    return {
        "kind": "change",
        "queryId": "query1",
        "sequence": sequence,
        "sourceTimeMs": int(time.time() * 1000),
        "metadata": {"mode": mode},
        "addedResults": [{"mode": mode}],
        "updatedResults": [],
        "deletedResults": [],
    }


def stop_process_tree(process: subprocess.Popen[Any]) -> None:
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        return

    try:
        process.wait(timeout=10)
    except subprocess.TimeoutExpired:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            return
        process.wait(timeout=5)


def check_runtime_requirements() -> tuple[str, str | None]:
    if os.getenv("DAPR_INTEGRATION_TESTS") != "1":
        pytest.skip("set DAPR_INTEGRATION_TESTS=1 to run real-Dapr tests")
    if os.name != "posix":
        pytest.skip("real-Dapr process isolation requires a POSIX host")

    dapr = shutil.which("dapr")
    if dapr is None:
        pytest.fail("DAPR_INTEGRATION_TESTS=1 requires the dapr CLI on PATH")

    runtime_path = os.getenv("DAPR_RUNTIME_PATH")
    if (
        runtime_path is not None
        and not (Path(runtime_path) / ".dapr" / "bin" / "daprd").is_file()
    ):
        pytest.fail("DAPR_RUNTIME_PATH must contain .dapr/bin/daprd")

    return dapr, runtime_path


@contextmanager
def run_dapr_runtime(
    tmp_path_factory,
    *,
    app_id: str,
    dead_letter_topic: str | None,
) -> Iterator[dict[str, str]]:
    dapr, runtime_path = check_runtime_requirements()
    temp_dir = tmp_path_factory.mktemp(app_id)
    query_dir = temp_dir / "queries"
    query_dir.mkdir()
    (query_dir / "query1").write_text("", encoding="utf-8")
    initialization_gate = temp_dir / "initialization"

    app_port = free_port()
    dapr_http_port = free_port()
    dapr_grpc_port = free_port()
    metrics_port = free_port()
    profile_port = free_port()
    resources = Path(__file__).parent / "resources"
    log_path = temp_dir / "dapr.log"
    log_file = log_path.open("w", encoding="utf-8")

    command = [dapr]
    if runtime_path is not None:
        command.extend(["--runtime-path", runtime_path])
    command.extend(
        [
            "run",
            "--app-id",
            app_id,
            "--app-port",
            str(app_port),
            "--dapr-http-port",
            str(dapr_http_port),
            "--dapr-grpc-port",
            str(dapr_grpc_port),
            "--metrics-port",
            str(metrics_port),
            "--profile-port",
            str(profile_port),
            "--config",
            str(resources / "config.yaml"),
            "--resources-path",
            str(resources),
            "--log-level",
            "warn",
            "--",
            sys.executable,
            "-m",
            "uvicorn",
            "tests.integration.dapr_app:app",
            "--host",
            "127.0.0.1",
            "--port",
            str(app_port),
            "--log-level",
            "warning",
        ]
    )
    env = os.environ.copy()
    env.update(
        {
            "QueryConfigPath": str(query_dir),
            "PubsubName": "drasi-pubsub",
            "TEST_INITIALIZATION_GATE": str(initialization_gate),
        }
    )
    if dead_letter_topic is not None:
        env["TEST_DEAD_LETTER_TOPIC"] = dead_letter_topic
    else:
        env.pop("TEST_DEAD_LETTER_TOPIC", None)

    process = subprocess.Popen(
        command,
        cwd=Path(__file__).parents[2],
        env=env,
        stdout=log_file,
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )

    try:
        try:
            wait_for(lambda: Path(f"{initialization_gate}.started").exists())

            with pytest.raises(httpx.HTTPError):
                httpx.get(
                    f"http://127.0.0.1:{app_port}/test/observations",
                    timeout=0.2,
                )

            Path(f"{initialization_gate}.release").touch()

            def first_app_response():
                response = httpx.get(
                    f"http://127.0.0.1:{app_port}/test/observations",
                    timeout=1,
                )
                response.raise_for_status()
                return {"available": True, "items": response.json()}

            first_observations = wait_for(first_app_response)["items"]
            assert {"kind": "initialized"} in first_observations
            wait_for(
                lambda: httpx.get(
                    f"http://127.0.0.1:{dapr_http_port}/v1.0/healthz",
                    timeout=1,
                ).is_success
            )
        except (AssertionError, httpx.HTTPError):
            log_file.flush()
            pytest.fail(log_path.read_text(encoding="utf-8"))

        yield {
            "app_url": f"http://127.0.0.1:{app_port}",
            "dapr_url": f"http://127.0.0.1:{dapr_http_port}",
        }
    finally:
        stop_process_tree(process)
        log_file.close()


@pytest.fixture(scope="module")
def dapr_runtime(tmp_path_factory):
    with run_dapr_runtime(
        tmp_path_factory,
        app_id=APP_ID,
        dead_letter_topic="reaction-dead-letter",
    ) as runtime:
        yield runtime


@pytest.fixture(scope="module")
def dapr_runtime_without_dlt(tmp_path_factory):
    with run_dapr_runtime(
        tmp_path_factory,
        app_id="python-reaction-sdk-no-dlt-test",
        dead_letter_topic=None,
    ) as runtime:
        yield runtime


def observations(runtime: dict[str, str]) -> list[dict[str, Any]]:
    response = httpx.get(f"{runtime['app_url']}/test/observations", timeout=2)
    response.raise_for_status()
    return response.json()


def publish(runtime: dict[str, str], mode: str, sequence: int) -> None:
    response = httpx.post(
        f"{runtime['dapr_url']}/v1.0/publish/drasi-pubsub/query1-results",
        json=result_event(mode, sequence),
        headers={"traceparent": TRACEPARENT},
        timeout=2,
    )
    response.raise_for_status()


def deliveries(
    runtime: dict[str, str],
    mode: str,
) -> list[dict[str, Any]]:
    return [
        item
        for item in observations(runtime)
        if item.get("kind") == "delivery" and item.get("mode") == mode
    ]


def wait_for_deliveries(
    runtime: dict[str, str],
    mode: str,
    count: int,
) -> list[dict[str, Any]]:
    return wait_for(
        lambda: (items if len(items := deliveries(runtime, mode)) >= count else None)
    )


def test_real_dapr_delivery_contract(dapr_runtime):
    publish(dapr_runtime, "success", 1)
    success = wait_for_deliveries(dapr_runtime, "success", 1)
    assert len(success) == 1
    assert success[0]["id"]
    assert success[0]["source"]
    assert success[0]["topic"] == "query1-results"
    assert success[0]["pubsub_name"] == "drasi-pubsub"
    assert TRACE_ID in success[0]["trace_context"]

    publish(dapr_runtime, "retry_once", 2)
    retries = wait_for_deliveries(dapr_runtime, "retry_once", 2)
    assert [item["attempt"] for item in retries] == [1, 2]
    assert {(item["source"], item["id"]) for item in retries} == {
        (retries[0]["source"], retries[0]["id"])
    }

    publish(dapr_runtime, "exception_once", 3)
    exception_retries = wait_for_deliveries(
        dapr_runtime,
        "exception_once",
        2,
    )
    assert [item["attempt"] for item in exception_retries] == [1, 2]
    assert {(item["source"], item["id"]) for item in exception_retries} == {
        (exception_retries[0]["source"], exception_retries[0]["id"])
    }

    publish(dapr_runtime, "drop", 4)
    dead_letters = wait_for(
        lambda: [
            item
            for item in observations(dapr_runtime)
            if item.get("kind") == "dead_letter" and item.get("mode") == "drop"
        ]
    )
    assert len(dead_letters) == 1

    time.sleep(0.75)
    assert len(deliveries(dapr_runtime, "success")) == 1
    assert len(deliveries(dapr_runtime, "drop")) == 1


def test_drop_without_dlt_is_not_redelivered(dapr_runtime_without_dlt):
    publish(dapr_runtime_without_dlt, "drop", 1)
    wait_for_deliveries(dapr_runtime_without_dlt, "drop", 1)

    time.sleep(0.75)
    assert len(deliveries(dapr_runtime_without_dlt, "drop")) == 1
