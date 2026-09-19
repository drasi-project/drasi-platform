# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Exercise packaged router delivery through Dapr and Redis."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import tempfile
import time
import uuid
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Iterator
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from smoke_image import call_tool, initialize_mcp, request_json


APP_ID = "delivery-router-reaction"
ROUTER_ID = f"drasi-system/{APP_ID}"
INBOUND = "delivery-inbound"
EGRESS = "delivery-egress"
CONSUMER_GROUP = APP_ID

QUERIES = (
    "ack-query",
    "mixed-query",
    "sdk-invalid-query",
    "converter-query",
    "recovery-query",
    "exhaustion-query",
)

TOPICS = {
    "mixed-i": "drasi-ai1-4kifrgcnkkbs4pr2vegokq7emi5pfq7vwyqkm4dmhaapbsafwa5a",
    "mixed-u": "drasi-ai1-ozfqykdyeaqn62xcahklqvbtbztbjp5gjjgpgixcgd45e3zuhrla",
    "mixed-d": "drasi-ai1-nvaf6x2uxubd6rxdl5zqyk2lwtfjfdhuw5gug3abwnykrjgoupga",
    "nonmatch": "drasi-ai1-np4pmba376iw6tjsj4rr7xely6r7nxbdyv2d2ud7ibz5ttwhpoyq",
    "converter": "drasi-ai1-ohr4eyrmpur4ozrijvmykxard3lkm2tymvkglzqhvvcd4s462aaa",
    "recovery-a": "drasi-ai1-tqx74n2ih7mp6xwe244uce7n2ewjdqnl4hr4wo4axtyhumwdrjdq",
    "recovery-c": "drasi-ai1-2s665ne2tjhazva6irsgcyzdso7roocl6xqhlibxojaulprnm2oa",
    "recovery-z": "drasi-ai1-34q6a2mgmbi44qyza3oxm4ybdpaaphkamtnhxqecbm55f3hcdjvq",
    "exhaustion-a": "drasi-ai1-hi6vnkizkgmwsay5ompymkckd3oudrg2x2divycoxudoepgqkv2a",
    "exhaustion-z": "drasi-ai1-dafqhrec2m7y4ie7ahdp7tiixsteors5o44n3d26gsbzl7b5wwda",
}
DEAD_LETTER_TOPIC = (
    "drasi-rd1-hbphp4xiksmhclhjl7syabxqngiec7qiobkxbtc56wcqkxuk7wba"
)


def wait_for(
    predicate: Callable[[], Any],
    description: str,
    *,
    timeout: float = 30,
    interval: float = 0.1,
) -> Any:
    deadline = time.monotonic() + timeout
    last_error: Exception | None = None
    while time.monotonic() < deadline:
        try:
            result = predicate()
            if result:
                return result
        except (
            AssertionError,
            HTTPError,
            URLError,
            ConnectionError,
            TimeoutError,
            OSError,
            subprocess.CalledProcessError,
            json.JSONDecodeError,
        ) as error:
            last_error = error
        time.sleep(interval)
    raise AssertionError(f"timed out waiting for {description}") from last_error


def http_ready(url: str) -> bool:
    with urlopen(url, timeout=2) as response:
        return 200 <= response.status < 300


def post_json(url: str, payload: dict[str, Any]) -> None:
    request = Request(
        url,
        data=json.dumps(payload, separators=(",", ":")).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=10) as response:
        if response.status not in (200, 201, 204):
            raise AssertionError(f"unexpected HTTP {response.status} from {url}")


def _pairs(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    assert isinstance(value, list) and len(value) % 2 == 0, value
    return dict(zip(value[::2], value[1::2]))


def _redis_id(value: str) -> tuple[int, int]:
    first, second = value.split("-", 1)
    return int(first), int(second)


@dataclass(frozen=True)
class Rule:
    query_id: str
    operations: tuple[str, ...]
    app_id: str
    agent_name: str
    incarnation: str
    expected_topic: str

    @property
    def subscriber(self) -> dict[str, str]:
        return {
            "namespace": "applications",
            "app_id": self.app_id,
            "agent_name": self.agent_name,
        }

    def subscribe_request(self) -> dict[str, Any]:
        return {
            "query_id": self.query_id,
            "operations": list(self.operations),
            "subscriber": self.subscriber,
            "subscription_incarnation": self.incarnation,
        }

    def unsubscribe_request(self) -> dict[str, Any]:
        request = self.subscribe_request()
        del request["operations"]
        return request


class Runtime:
    def __init__(self, image: str, query_path: Path) -> None:
        self.project = f"drasi-router-delivery-{uuid.uuid4().hex}"
        self.fixture = Path(__file__).parent / "delivery-runtime/compose.yaml"
        self.environment = {
            **os.environ,
            "ROUTER_IMAGE": image,
            "QUERY_CONFIG_PATH": str(query_path.resolve()),
        }
        self.app_url = ""
        self.dapr_url = ""

    def compose(self, *arguments: str) -> str:
        return subprocess.check_output(
            [
                "docker",
                "compose",
                "-p",
                self.project,
                "-f",
                str(self.fixture),
                *arguments,
            ],
            env=self.environment,
            text=True,
        ).strip()

    def port(self, service: str, port: int) -> str:
        return self.compose("port", service, str(port))

    def redis(self, service: str, *arguments: str) -> Any:
        output = self.compose(
            "exec",
            "-T",
            service,
            "redis-cli",
            "--json",
            *arguments,
        )
        return json.loads(output)

    def stream_entries(
        self, service: str, topic: str
    ) -> list[tuple[str, dict[str, Any]]]:
        entries = self.redis(service, "XRANGE", topic, "-", "+")
        result: list[tuple[str, dict[str, Any]]] = []
        for entry in entries:
            assert isinstance(entry, list) and len(entry) == 2, entry
            result.append((entry[0], _pairs(entry[1])))
        return result

    def stream_length(self, service: str, topic: str) -> int:
        return int(self.redis(service, "XLEN", topic))

    def stream_payloads(self, service: str, topic: str) -> list[dict[str, Any]]:
        payloads = []
        for _, fields in self.stream_entries(service, topic):
            payload = fields["data"]
            if isinstance(payload, str):
                payload = json.loads(payload)
            assert isinstance(payload, dict), payload
            payloads.append(payload)
        return payloads

    def stream_lengths(self, service: str) -> dict[str, int]:
        keys = self.redis(service, "KEYS", "*")
        return {key: self.stream_length(service, key) for key in sorted(keys)}

    def router_output(self) -> tuple[str, str]:
        container = self.compose("ps", "--quiet", "router")
        result = subprocess.run(
            ["docker", "logs", container],
            text=True,
            capture_output=True,
            check=True,
        )
        return result.stdout, result.stderr

    def router_log_records(self) -> list[dict[str, Any]]:
        stdout, _ = self.router_output()
        records = []
        for line in stdout.splitlines():
            if not line.startswith("{"):
                continue
            record = json.loads(line)
            assert isinstance(record, dict), record
            records.append(record)
        return records

    def group(self, topic: str) -> dict[str, Any]:
        groups = self.redis("inbound-redis", "XINFO", "GROUPS", topic)
        for group in groups:
            values = _pairs(group)
            if values.get("name") == CONSUMER_GROUP:
                return values
        raise AssertionError(f"consumer group {CONSUMER_GROUP} not found on {topic}")

    def is_consumed(self, topic: str, entry_id: str) -> bool:
        group = self.group(topic)
        pending = self.redis(
            "inbound-redis",
            "XPENDING",
            topic,
            CONSUMER_GROUP,
        )
        return (
            _redis_id(str(group["last-delivered-id"])) >= _redis_id(entry_id)
            and isinstance(pending, list)
            and int(pending[0]) == 0
        )

    def publish(self, query_id: str, payload: dict[str, Any]) -> str:
        topic = f"{query_id}-results"
        previous = self.stream_length("inbound-redis", topic)
        post_json(
            f"{self.dapr_url}/v1.0/publish/{INBOUND}/{quote(topic, safe='')}",
            payload,
        )
        wait_for(
            lambda: self.stream_length("inbound-redis", topic) > previous,
            f"the inbound Redis entry on {topic}",
        )
        entries = self.stream_entries("inbound-redis", topic)
        return entries[-1][0]

    def wait_consumed(self, query_id: str, entry_id: str, timeout: float = 30) -> None:
        topic = f"{query_id}-results"
        wait_for(
            lambda: self.is_consumed(topic, entry_id),
            f"{entry_id} to be delivered and acknowledged on {topic}",
            timeout=timeout,
        )

    def wait_stream_length(
        self,
        service: str,
        topic: str,
        length: int,
        *,
        timeout: float = 30,
    ) -> None:
        wait_for(
            lambda: self.stream_length(service, topic) >= length,
            f"{length} entries on {service}/{topic}",
            timeout=timeout,
        )


@contextmanager
def delivery_runtime(image: str) -> Iterator[Runtime]:
    with tempfile.TemporaryDirectory(prefix="drasi-router-delivery-") as directory:
        queries = Path(directory)
        queries.chmod(0o755)
        for query_id in QUERIES:
            path = queries / query_id
            path.write_text(
                json.dumps(
                    {
                        "title": f"Delivery fixture for {query_id}",
                        "description": "Synthetic input used only by packaged-image tests.",
                    }
                ),
                encoding="utf-8",
            )
            path.chmod(0o644)

        runtime = Runtime(image, queries)
        passed = False
        try:
            runtime.compose(
                "up",
                "--detach",
                "--wait",
                "--wait-timeout",
                "90",
                "--quiet-pull",
                "mongo",
                "inbound-redis",
                "egress-redis",
                "dapr",
            )
            runtime.dapr_url = f"http://{runtime.port('dapr', 3500)}"
            wait_for(
                lambda: http_ready(f"{runtime.dapr_url}/v1.0/healthz/outbound"),
                "the Dapr outbound API",
                timeout=30,
            )

            runtime.compose("up", "--detach", "router")
            runtime.app_url = f"http://{runtime.port('router', 8000)}"

            def subscriptions_ready() -> list[dict[str, Any]] | None:
                result = request_json(f"{runtime.app_url}/dapr/subscribe")
                if len(result) != len(QUERIES):
                    return None
                return result

            subscriptions = wait_for(
                subscriptions_ready,
                "the router subscriptions",
                timeout=90,
            )
            assert {item["topic"] for item in subscriptions} == {
                f"{query_id}-results" for query_id in QUERIES
            }
            assert {item["pubsubname"] for item in subscriptions} == {INBOUND}
            assert {item["deadLetterTopic"] for item in subscriptions} == {
                DEAD_LETTER_TOPIC
            }

            for query_id in QUERIES:
                topic = f"{query_id}-results"
                wait_for(
                    lambda topic=topic: runtime.group(topic),
                    f"the Dapr Redis consumer group on {topic}",
                    timeout=90,
                )

            yield runtime
            passed = True
        finally:
            try:
                if not passed:
                    subprocess.run(
                        [
                            "docker",
                            "compose",
                            "-p",
                            runtime.project,
                            "-f",
                            str(runtime.fixture),
                            "logs",
                            "--no-color",
                            "--tail",
                            "100",
                        ],
                        env=runtime.environment,
                        check=False,
                    )
            finally:
                subprocess.run(
                    [
                        "docker",
                        "compose",
                        "-p",
                        runtime.project,
                        "-f",
                        str(runtime.fixture),
                        "down",
                        "--volumes",
                        "--remove-orphans",
                    ],
                    env=runtime.environment,
                    check=False,
                )


def subscribe(runtime: Runtime, protocol: str, rule: Rule) -> None:
    result = call_tool(
        runtime.app_url,
        protocol,
        "subscribe",
        rule.subscribe_request(),
    )
    assert result["status"] == "created", result
    assert result["topic_name"] == rule.expected_topic, result


def unsubscribe(runtime: Runtime, protocol: str, rule: Rule) -> None:
    result = call_tool(
        runtime.app_url,
        protocol,
        "unsubscribe",
        rule.unsubscribe_request(),
    )
    assert result == {"query_id": rule.query_id, "removed": True}, result


def change_event(
    query_id: str,
    sequence: int,
    *,
    added: list[Any] | None = None,
    updated: list[Any] | None = None,
    deleted: list[Any] | None = None,
    source_time_ms: int = 1_700_000_000_000,
) -> dict[str, Any]:
    return {
        "kind": "change",
        "queryId": query_id,
        "sequence": sequence,
        "sourceTimeMs": source_time_ms,
        "metadata": {"fixture": "delivery-runtime"},
        "addedResults": added or [],
        "updatedResults": updated or [],
        "deletedResults": deleted or [],
    }


def _event_data(cloud_event: dict[str, Any]) -> dict[str, Any]:
    data = cloud_event["data"]
    if isinstance(data, str):
        data = json.loads(data)
    assert isinstance(data, dict), data
    return data


def deliveries(runtime: Runtime, topic: str) -> list[dict[str, Any]]:
    result = []
    for cloud_event in runtime.stream_payloads("egress-redis", topic):
        assert cloud_event["topic"] == topic, cloud_event
        assert cloud_event["pubsubname"] == EGRESS, cloud_event
        result.append(_event_data(cloud_event))
    return result


def assert_delivery(
    delivery: dict[str, Any],
    *,
    event_id: str,
    incarnation: str,
    operation: str,
    sequence: int,
    payload: dict[str, Any],
) -> None:
    assert set(delivery) == {
        "schemaVersion",
        "routerId",
        "subscriptionIncarnation",
        "eventId",
        "event",
    }, delivery
    assert delivery["schemaVersion"] == 1
    assert delivery["routerId"] == ROUTER_ID
    assert delivery["subscriptionIncarnation"] == incarnation
    assert delivery["eventId"] == event_id
    event = delivery["event"]
    assert set(event) == {"op", "seq", "ts_ms", "payload"}, event
    assert event["op"] == operation
    assert event["seq"] == sequence
    assert type(event["ts_ms"]) is int and event["ts_ms"] > 0
    assert event["payload"] == payload


def assert_dead_letter(
    runtime: Runtime,
    index: int,
    original: dict[str, Any],
) -> None:
    cloud_events = runtime.stream_payloads("inbound-redis", DEAD_LETTER_TOPIC)
    assert len(cloud_events) == index + 1, cloud_events
    assert _event_data(cloud_events[index]) == original


def exercise_acknowledged_discards(runtime: Runtime, protocol: str) -> None:
    print("Checking no-subscriber, nonmatching-operation, and control ACKs")
    dlt_count = runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC)
    egress_before = runtime.stream_lengths("egress-redis")

    no_subscribers = change_event(
        "ack-query",
        1,
        added=[{"case": "no-subscribers"}],
    )
    entry_id = runtime.publish("ack-query", no_subscribers)
    runtime.wait_consumed("ack-query", entry_id)

    nonmatching = Rule(
        query_id="ack-query",
        operations=("d",),
        app_id="nonmatch-agent",
        agent_name="Nonmatching",
        incarnation="nonmatch-v1",
        expected_topic=TOPICS["nonmatch"],
    )
    subscribe(runtime, protocol, nonmatching)
    entry_id = runtime.publish(
        "ack-query",
        change_event("ack-query", 2, added=[{"case": "not-selected"}]),
    )
    runtime.wait_consumed("ack-query", entry_id)

    control = {
        "kind": "control",
        "queryId": "ack-query",
        "sequence": 3,
        "sourceTimeMs": 1_700_000_000_003,
        "metadata": {"fixture": "delivery-runtime"},
        "controlSignal": {"kind": "running"},
    }
    entry_id = runtime.publish("ack-query", control)
    runtime.wait_consumed("ack-query", entry_id)

    assert runtime.stream_lengths("egress-redis") == egress_before
    assert runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC) == dlt_count


def exercise_permanent_input_drops(runtime: Runtime, protocol: str) -> None:
    print("Checking SDK-invalid and converter-unsupported DLT delivery")
    egress_before = runtime.stream_lengths("egress-redis")
    dlt_index = runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC)

    sdk_invalid = {
        "kind": "change",
        "queryId": "sdk-invalid-query",
        "sourceTimeMs": 1_700_000_000_010,
        "addedResults": [],
        "updatedResults": [],
        "deletedResults": [],
    }
    entry_id = runtime.publish("sdk-invalid-query", sdk_invalid)
    runtime.wait_stream_length(
        "inbound-redis",
        DEAD_LETTER_TOPIC,
        dlt_index + 1,
    )
    runtime.wait_consumed("sdk-invalid-query", entry_id)
    assert_dead_letter(runtime, dlt_index, sdk_invalid)
    assert runtime.stream_lengths("egress-redis") == egress_before
    dlt_index += 1

    converter = Rule(
        query_id="converter-query",
        operations=("i", "u"),
        app_id="converter-agent",
        agent_name="ConverterGuard",
        incarnation="converter-v1",
        expected_topic=TOPICS["converter"],
    )
    subscribe(runtime, protocol, converter)
    converter_invalid = change_event(
        "converter-query",
        11,
        added=[{"case": "must-not-publish"}],
        updated=[{"before": {"case": "old"}, "after": None}],
    )
    entry_id = runtime.publish("converter-query", converter_invalid)
    runtime.wait_stream_length(
        "inbound-redis",
        DEAD_LETTER_TOPIC,
        dlt_index + 1,
    )
    runtime.wait_consumed("converter-query", entry_id)
    assert_dead_letter(runtime, dlt_index, converter_invalid)
    assert runtime.stream_length("egress-redis", converter.expected_topic) == 0
    assert runtime.stream_lengths("egress-redis") == egress_before


def exercise_mixed_operations(runtime: Runtime, protocol: str) -> None:
    print("Checking mixed operation filters, envelopes, and operator cleanup")
    rules = (
        Rule(
            "mixed-query",
            ("i",),
            "mixed-i-agent",
            "MixedInsert",
            "mixed-i-v1",
            TOPICS["mixed-i"],
        ),
        Rule(
            "mixed-query",
            ("u",),
            "mixed-u-agent",
            "MixedUpdate",
            "mixed-u-v1",
            TOPICS["mixed-u"],
        ),
        Rule(
            "mixed-query",
            ("d",),
            "mixed-d-agent",
            "MixedDelete",
            "mixed-d-v1",
            TOPICS["mixed-d"],
        ),
    )
    for rule in rules:
        subscribe(runtime, protocol, rule)

    sequence = 9_007_199_254_740_993
    source_time = 1_700_000_000_020
    packed = change_event(
        "mixed-query",
        sequence,
        added=[{"id": "insert-0", "value": "new"}],
        updated=[
            {
                "before": {"id": "update-0", "value": "old"},
                "after": {"id": "update-0", "value": "new"},
            }
        ],
        deleted=[{"id": "delete-0", "value": "old"}],
        source_time_ms=source_time,
    )
    dlt_count = runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC)
    entry_id = runtime.publish("mixed-query", packed)
    runtime.wait_consumed("mixed-query", entry_id)
    for rule in rules:
        runtime.wait_stream_length("egress-redis", rule.expected_topic, 1)
        assert runtime.stream_length("egress-redis", rule.expected_topic) == 1

    source = {"queryId": "mixed-query", "ts_ms": source_time}
    insert = deliveries(runtime, TOPICS["mixed-i"])[0]
    assert_delivery(
        insert,
        event_id=f"drasi:v1:mixed-query:{sequence}:i:0",
        incarnation="mixed-i-v1",
        operation="i",
        sequence=sequence,
        payload={
            "source": source,
            "after": {"id": "insert-0", "value": "new"},
        },
    )
    update = deliveries(runtime, TOPICS["mixed-u"])[0]
    assert_delivery(
        update,
        event_id=f"drasi:v1:mixed-query:{sequence}:u:0",
        incarnation="mixed-u-v1",
        operation="u",
        sequence=sequence,
        payload={
            "source": source,
            "before": {"id": "update-0", "value": "old"},
            "after": {"id": "update-0", "value": "new"},
        },
    )
    delete = deliveries(runtime, TOPICS["mixed-d"])[0]
    assert_delivery(
        delete,
        event_id=f"drasi:v1:mixed-query:{sequence}:d:0",
        incarnation="mixed-d-v1",
        operation="d",
        sequence=sequence,
        payload={
            "source": source,
            "before": {"id": "delete-0", "value": "old"},
        },
    )
    assert runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC) == dlt_count

    removed = request_json(
        f"{runtime.app_url}/admin/rules/remove",
        {
            "query_id": rules[0].query_id,
            "subscriber": rules[0].subscriber,
        },
    )
    assert removed == {"removed": True}, removed
    egress_before = runtime.stream_lengths("egress-redis")
    entry_id = runtime.publish(
        "mixed-query",
        change_event(
            "mixed-query",
            sequence + 1,
            added=[{"value": "removed-rule-private-row"}],
        ),
    )
    runtime.wait_consumed("mixed-query", entry_id)
    assert runtime.stream_lengths("egress-redis") == egress_before
    assert runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC) == dlt_count


def exercise_retry_recovery(runtime: Runtime, protocol: str) -> None:
    print("Checking partial success, retry duplication, and later rule visibility")
    allowed_a = Rule(
        "recovery-query",
        ("i",),
        "recovery-a-agent",
        "RecoveryA",
        "recovery-a-v1",
        TOPICS["recovery-a"],
    )
    denied_z = Rule(
        "recovery-query",
        ("u",),
        "recovery-z-agent",
        "RecoveryDenied",
        "recovery-z-v1",
        TOPICS["recovery-z"],
    )
    allowed_c = Rule(
        "recovery-query",
        ("i",),
        "recovery-c-agent",
        "RecoveryC",
        "recovery-c-v1",
        TOPICS["recovery-c"],
    )
    subscribe(runtime, protocol, allowed_a)
    subscribe(runtime, protocol, denied_z)

    packed = change_event(
        "recovery-query",
        21,
        added=[{"case": "published-before-failure"}],
        updated=[
            {
                "before": {"case": "denied-old"},
                "after": {"case": "denied-new"},
            }
        ],
        source_time_ms=1_700_000_000_021,
    )
    dlt_count = runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC)
    entry_id = runtime.publish("recovery-query", packed)
    runtime.wait_stream_length("egress-redis", allowed_a.expected_topic, 1)

    # The first callback already owns its snapshot. Add C before removing the
    # failing rule: if a retry lands between the two mutations it still fails
    # at the later update row, and the following attempt can recover.
    subscribe(runtime, protocol, allowed_c)
    unsubscribe(runtime, protocol, denied_z)

    runtime.wait_consumed("recovery-query", entry_id, timeout=20)
    runtime.wait_stream_length("egress-redis", allowed_a.expected_topic, 2)
    runtime.wait_stream_length("egress-redis", allowed_c.expected_topic, 1)
    assert runtime.stream_length("egress-redis", denied_z.expected_topic) == 0
    assert runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC) == dlt_count

    a_deliveries = deliveries(runtime, allowed_a.expected_topic)
    c_deliveries = deliveries(runtime, allowed_c.expected_topic)
    expected_id = "drasi:v1:recovery-query:21:i:0"
    # Usually the second attempt observes both mutations. A retry that starts
    # between them may fail once more, but it is still within the finite limit.
    assert len(a_deliveries) in (2, 3), a_deliveries
    assert len(c_deliveries) == len(a_deliveries) - 1, c_deliveries
    assert {item["eventId"] for item in a_deliveries} == {expected_id}
    assert {item["subscriptionIncarnation"] for item in a_deliveries} == {
        allowed_a.incarnation
    }
    assert {item["eventId"] for item in c_deliveries} == {expected_id}
    assert {item["subscriptionIncarnation"] for item in c_deliveries} == {
        allowed_c.incarnation
    }


def exercise_retry_exhaustion(runtime: Runtime, protocol: str) -> None:
    print("Checking bounded retry exhaustion, duplicates, and original DLT data")
    allowed = Rule(
        "exhaustion-query",
        ("i",),
        "exhaustion-a-agent",
        "ExhaustionA",
        "exhaustion-a-v1",
        TOPICS["exhaustion-a"],
    )
    denied = Rule(
        "exhaustion-query",
        ("u",),
        "exhaustion-z-agent",
        "ExhaustionDenied",
        "exhaustion-z-v1",
        TOPICS["exhaustion-z"],
    )
    subscribe(runtime, protocol, allowed)
    subscribe(runtime, protocol, denied)

    packed = change_event(
        "exhaustion-query",
        31,
        added=[{"case": "duplicate-on-each-attempt"}],
        updated=[
            {
                "before": {"case": "always-denied-old"},
                "after": {"case": "always-denied-new"},
            }
        ],
        source_time_ms=1_700_000_000_031,
    )
    dlt_index = runtime.stream_length("inbound-redis", DEAD_LETTER_TOPIC)
    entry_id = runtime.publish("exhaustion-query", packed)
    runtime.wait_stream_length("egress-redis", allowed.expected_topic, 1)
    runtime.wait_stream_length(
        "inbound-redis",
        DEAD_LETTER_TOPIC,
        dlt_index + 1,
        timeout=20,
    )
    runtime.wait_consumed("exhaustion-query", entry_id, timeout=20)

    assert runtime.stream_length("egress-redis", allowed.expected_topic) == 3
    assert runtime.stream_length("egress-redis", denied.expected_topic) == 0
    duplicate_ids = [
        item["eventId"] for item in deliveries(runtime, allowed.expected_topic)
    ]
    assert duplicate_ids == ["drasi:v1:exhaustion-query:31:i:0"] * 3
    assert_dead_letter(runtime, dlt_index, packed)


def exercise_forwarding_logs(runtime: Runtime) -> None:
    print("Checking packaged JSON forwarding diagnostics and payload exclusion")

    def expected_records() -> list[dict[str, Any]] | None:
        records = runtime.router_log_records()
        failures = [
            record
            for record in records
            if record.get("event") == "router_publication_failed"
            and record.get("drasi_query_id") == "exhaustion-query"
        ]
        poison = [
            record
            for record in records
            if record.get("event") == "router_invalid_packed_change"
            and record.get("drasi_query_id") == "converter-query"
        ]
        return records if len(failures) >= 3 and len(poison) >= 1 else None

    records = wait_for(
        expected_records,
        "the forwarding diagnostics in router stdout",
        timeout=10,
    )
    stdout, stderr = runtime.router_output()
    for private_value in (
        "insert-0",
        "must-not-publish",
        "removed-rule-private-row",
        "published-before-failure",
        "denied-new",
        "duplicate-on-each-attempt",
        "always-denied-new",
    ):
        assert private_value not in stdout
        assert private_value not in stderr

    processed = [
        record
        for record in records
        if record.get("event") == "router_change_processed"
        and record.get("drasi_query_id") == "mixed-query"
    ]
    assert [record["accepted_publications"] for record in processed] == [3, 0]
    assert all(record["pubsub_name"] == EGRESS for record in processed)
    assert all(record["router_id"] == ROUTER_ID for record in processed)
    assert all(record["outcome"] == "SUCCESS" for record in processed)

    failures = [
        record
        for record in records
        if record.get("event") == "router_publication_failed"
        and record.get("drasi_query_id") == "exhaustion-query"
    ]
    assert len(failures) == 3, failures
    for record in failures:
        assert record["router_id"] == ROUTER_ID
        assert record["pubsub_name"] == EGRESS
        assert record["topic_name"] == TOPICS["exhaustion-z"]
        assert record["drasi_event_id"] == "drasi:v1:exhaustion-query:31:u:0"
        assert record["accepted_publications"] == 1
        assert record["outcome"] == "RETRY"
        assert isinstance(record["error_type"], str) and record["error_type"]

    poison = [
        record
        for record in records
        if record.get("event") == "router_invalid_packed_change"
        and record.get("drasi_query_id") == "converter-query"
    ]
    assert len(poison) == 1, poison
    assert poison[0]["router_id"] == ROUTER_ID
    assert poison[0]["pubsub_name"] == EGRESS
    assert poison[0]["operation"] == "u"
    assert poison[0]["row_position"] == 0
    assert (
        poison[0]["drasi_delivery_reason"]
        == "after snapshot must be a result-row object"
    )
    assert poison[0]["outcome"] == "DROP"
    assert "reason" not in poison[0]


def check_delivery(image: str) -> None:
    with delivery_runtime(image) as runtime:
        protocol = initialize_mcp(runtime.app_url)
        exercise_acknowledged_discards(runtime, protocol)
        exercise_permanent_input_drops(runtime, protocol)
        exercise_mixed_operations(runtime, protocol)
        exercise_retry_recovery(runtime, protocol)
        exercise_retry_exhaustion(runtime, protocol)
        exercise_forwarding_logs(runtime)
    print(f"Router real-Dapr delivery passed: {image}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", help="Locally built router image and tag")
    check_delivery(parser.parse_args().image)
