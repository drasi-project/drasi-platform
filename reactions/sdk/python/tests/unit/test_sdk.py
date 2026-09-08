import asyncio
import json
import logging
from contextlib import asynccontextmanager
from typing import Any

import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient

from drasi.reaction.delivery import DeliveryOutcome, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.sdk import DrasiReaction
from drasi.reaction.utils import yaml_query_configs


def change_event(
    query_id: str = "query1",
    *,
    event_id: str = "event-1",
) -> dict[str, Any]:
    return {
        "id": event_id,
        "source": "urn:drasi:test",
        "specversion": "1.0",
        "type": "com.dapr.event.sent",
        "topic": f"{query_id}-results",
        "pubsubname": "drasi-pubsub",
        "datacontenttype": "application/json",
        "traceid": "trace-value",
        "data": {
            "kind": "change",
            "queryId": query_id,
            "sequence": 1,
            "sourceTimeMs": 1000,
            "metadata": None,
            "addedResults": [{"value": "secret-payload"}],
            "updatedResults": [],
            "deletedResults": [],
        },
    }


def control_event(query_id: str = "query1") -> dict[str, Any]:
    event = change_event(query_id)
    event["data"] = {
        "kind": "control",
        "queryId": query_id,
        "sequence": 2,
        "sourceTimeMs": 1001,
        "metadata": None,
        "controlSignal": {"kind": "running"},
    }
    return event


@pytest.fixture
def query_config_dir(tmp_path):
    (tmp_path / "query1").write_text("nested:\n  value: original\n", encoding="utf-8")
    (tmp_path / "query.with.dot").write_text("enabled: true\n", encoding="utf-8")
    return tmp_path


def configured_reaction(
    query_config_dir,
    callback,
    **kwargs,
) -> DrasiReaction[dict[str, Any]]:
    reaction = DrasiReaction[dict[str, Any]](
        on_change_event=callback,
        parse_query_configs=yaml_query_configs,
        **kwargs,
    )
    reaction._config_directory = query_config_dir
    return reaction


def test_install_composes_lifespan_and_preserves_state(query_config_dir):
    lifecycle_events = []

    @asynccontextmanager
    async def caller_lifespan(app):
        lifecycle_events.append("caller_start")
        yield {"caller_resource": "available"}
        lifecycle_events.append("caller_stop")

    async def initialize():
        lifecycle_events.append("reaction_start")

    async def cleanup():
        lifecycle_events.append("reaction_stop")

    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI(lifespan=caller_lifespan)

    @app.get("/caller")
    async def caller_route(request: Request):
        return {"resource": request.state.caller_resource}

    reaction = configured_reaction(
        query_config_dir,
        callback,
        on_initialize=initialize,
        on_cleanup=cleanup,
    )
    reaction.install(app)

    assert reaction.is_ready is False
    with TestClient(app) as client:
        assert reaction.is_ready is True
        assert client.get("/caller").json() == {"resource": "available"}
        assert lifecycle_events == ["caller_start", "reaction_start"]

    assert reaction.is_ready is False
    assert lifecycle_events == [
        "caller_start",
        "reaction_start",
        "reaction_stop",
        "caller_stop",
    ]


def test_cleanup_runs_when_initialization_fails(query_config_dir):
    lifecycle_events = []

    @asynccontextmanager
    async def caller_lifespan(app):
        lifecycle_events.append("caller_start")
        try:
            yield
        except RuntimeError:
            lifecycle_events.append("caller_error")
            raise
        finally:
            lifecycle_events.append("caller_stop")

    async def initialize():
        lifecycle_events.append("initialize")
        raise RuntimeError("initialization failed")

    async def cleanup():
        lifecycle_events.append("cleanup")

    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI(lifespan=caller_lifespan)
    reaction = configured_reaction(
        query_config_dir,
        callback,
        on_initialize=initialize,
        on_cleanup=cleanup,
    )
    reaction.install(app)

    with pytest.raises(RuntimeError, match="initialization failed"):
        with TestClient(app):
            pass

    assert lifecycle_events == [
        "caller_start",
        "initialize",
        "cleanup",
        "caller_error",
        "caller_stop",
    ]
    assert reaction.is_ready is False


def test_cleanup_failure_does_not_skip_caller_teardown(query_config_dir):
    lifecycle_events = []

    @asynccontextmanager
    async def caller_lifespan(app):
        lifecycle_events.append("caller_start")
        try:
            yield
        except RuntimeError:
            lifecycle_events.append("caller_error")
            raise
        finally:
            lifecycle_events.append("caller_stop")

    async def cleanup():
        lifecycle_events.append("cleanup")
        raise RuntimeError("cleanup failed")

    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI(lifespan=caller_lifespan)
    reaction = configured_reaction(
        query_config_dir,
        callback,
        on_cleanup=cleanup,
    )
    reaction.install(app)

    with pytest.raises(RuntimeError, match="cleanup failed"):
        with TestClient(app):
            pass

    assert lifecycle_events == [
        "caller_start",
        "cleanup",
        "caller_error",
        "caller_stop",
    ]
    assert reaction.is_ready is False


def test_install_publishes_isolated_read_only_snapshot(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(FastAPI())

    assert set(reaction.query_registrations) == {"query1", "query.with.dot"}
    assert reaction.query_registrations["query.with.dot"].query_id == "query.with.dot"

    configs = reaction.query_configs
    with pytest.raises(TypeError):
        configs["another"] = {}  # type: ignore[index]

    configs["query1"]["nested"]["value"] = "mutated"
    assert reaction.query_configs["query1"]["nested"]["value"] == "original"


def test_install_without_parser_registers_none_config(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    reaction = DrasiReaction(on_change_event=callback)
    reaction._config_directory = query_config_dir
    reaction.install(FastAPI())

    assert reaction.query_configs == {
        "query.with.dot": None,
        "query1": None,
    }


def test_parser_failure_does_not_publish_partial_state(tmp_path):
    (tmp_path / "good").write_text("good", encoding="utf-8")
    (tmp_path / "bad").write_text("bad", encoding="utf-8")

    def parser(config_file):
        value = config_file.read()
        if value == "bad":
            raise ValueError("invalid query config")
        return value

    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    original_routes = tuple(app.router.routes)
    reaction = DrasiReaction(on_change_event=callback, parse_query_configs=parser)
    reaction._config_directory = tmp_path

    with pytest.raises(ValueError, match="invalid query config"):
        reaction.install(app)

    assert reaction.query_registrations == {}
    assert tuple(app.router.routes) == original_routes


def test_missing_query_directory_fails_installation(tmp_path):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    original_routes = tuple(app.router.routes)
    reaction = DrasiReaction(on_change_event=callback)
    reaction._config_directory = tmp_path / "missing"

    with pytest.raises(FileNotFoundError, match="does not exist"):
        reaction.install(app)

    assert reaction.query_registrations == {}
    assert tuple(app.router.routes) == original_routes


def test_empty_query_directory_publishes_empty_snapshot(tmp_path):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    reaction = DrasiReaction(on_change_event=callback)
    reaction._config_directory = tmp_path
    reaction.install(app)

    with TestClient(app) as client:
        assert reaction.is_ready is True
        assert client.get("/dapr/subscribe").json() == []

    assert reaction.query_registrations == {}


def test_dapr_discovery_is_readiness_gated_and_includes_dlt(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    reaction = configured_reaction(
        query_config_dir,
        callback,
        dead_letter_topic="reaction-dead-letter",
    )
    reaction.install(app)

    client = TestClient(app)
    assert client.get("/dapr/subscribe").status_code == 503
    client.close()

    with TestClient(app) as client:
        response = client.get("/dapr/subscribe")

    assert response.status_code == 200
    assert response.json() == [
        {
            "pubsubname": "drasi-pubsub",
            "topic": "query.with.dot-results",
            "route": "/_drasi/events/query.with.dot",
            "deadLetterTopic": "reaction-dead-letter",
        },
        {
            "pubsubname": "drasi-pubsub",
            "topic": "query1-results",
            "route": "/_drasi/events/query1",
            "deadLetterTopic": "reaction-dead-letter",
        },
    ]


def test_delivery_passes_typed_event_config_and_cloud_event_context(
    query_config_dir,
):
    messages: list[ReactionMessage[ChangeEvent, dict[str, Any]]] = []
    config_values = []

    async def callback(message):
        messages.append(message)
        config_values.append(message.query.config["nested"]["value"])
        message.query.config["nested"]["value"] = "callback mutation"
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        first_response = client.post(
            "/_drasi/events/query1", json=change_event(event_id="event-1")
        )
        second_response = client.post(
            "/_drasi/events/query1", json=change_event(event_id="event-2")
        )

    assert first_response.json() == {"status": "SUCCESS"}
    assert second_response.json() == {"status": "SUCCESS"}
    assert len(messages) == 2
    assert isinstance(messages[0].event, ChangeEvent)
    assert messages[0].query.query_id == "query1"
    assert messages[0].query.topic == "query1-results"
    assert messages[0].delivery.identity == ("urn:drasi:test", "event-1")
    assert messages[0].delivery.attributes["traceid"] == "trace-value"
    assert "data" not in messages[0].delivery.attributes
    assert config_values == ["original", "original"]
    assert reaction.query_configs["query1"]["nested"]["value"] == "original"

    with pytest.raises(TypeError):
        messages[0].delivery.attributes["another"] = "value"  # type: ignore[index]


def test_optional_cloud_event_attributes_accept_null_and_long_names(
    query_config_dir,
):
    messages = []

    async def callback(message):
        messages.append(message)
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)
    event = change_event()
    event["subject"] = None
    event["time"] = "1990-12-31t23:59:60z"
    event["dataschema"] = "https://drasi.io/schemas/query-result"
    event["datacontenttype"] = (
        "application/json; profile=foo*bar; version=foo'bar; shape={query-result}"
    )
    event["longextensionattributename"] = "value"
    event["attempt"] = 2**31 - 1
    event["sampled"] = True

    with TestClient(app) as client:
        response = client.post("/_drasi/events/query1", json=event)

    assert response.json() == {"status": "SUCCESS"}
    assert messages[0].delivery.attributes["longextensionattributename"] == "value"
    assert messages[0].delivery.attributes["time"] == "1990-12-31t23:59:60z"
    assert messages[0].delivery.attributes["attempt"] == 2**31 - 1
    assert messages[0].delivery.attributes["sampled"] is True
    assert "subject" not in messages[0].delivery.attributes


@pytest.mark.parametrize(
    ("callback_result", "expected_status"),
    [
        (DeliveryOutcome.SUCCESS, "SUCCESS"),
        (DeliveryOutcome.RETRY, "RETRY"),
        (DeliveryOutcome.DROP, "DROP"),
        (None, "RETRY"),
        ("SUCCESS", "RETRY"),
    ],
)
def test_callback_result_maps_to_explicit_dapr_status(
    query_config_dir,
    callback_result,
    expected_status,
):
    async def callback(message):
        return callback_result

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post("/_drasi/events/query1", json=change_event())

    assert response.json() == {"status": expected_status}


def test_callback_exception_maps_to_retry_without_logging_sensitive_data(
    query_config_dir,
    caplog,
):
    async def callback(message):
        raise RuntimeError("secret-exception")

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with caplog.at_level(logging.WARNING, logger="drasi.reaction.sdk"):
        with TestClient(app) as client:
            response = client.post("/_drasi/events/query1", json=change_event())

    assert response.json() == {"status": "RETRY"}
    assert caplog.records[-1].drasi_delivery_outcome == "RETRY"
    assert caplog.records[-1].drasi_delivery_reason == "callback_exception"
    assert "secret-exception" not in caplog.text
    assert "secret-payload" not in caplog.text
    assert "trace-value" not in caplog.text


def test_callback_cancellation_propagates(query_config_dir):
    async def callback(message):
        raise asyncio.CancelledError()

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)
    body = json.dumps(change_event()).encode()
    received = False

    async def receive():
        nonlocal received
        if received:
            return {"type": "http.disconnect"}
        received = True
        return {"type": "http.request", "body": body, "more_body": False}

    request = Request(
        {
            "type": "http",
            "http_version": "1.1",
            "method": "POST",
            "scheme": "http",
            "path": "/_drasi/events/query1",
            "raw_path": b"/_drasi/events/query1",
            "query_string": b"",
            "headers": [(b"content-type", b"application/json")],
            "client": ("127.0.0.1", 1),
            "server": ("127.0.0.1", 80),
        },
        receive,
    )

    with TestClient(app):
        with pytest.raises(asyncio.CancelledError):
            asyncio.run(reaction._handle_delivery("query1", request))


def test_malformed_json_is_dropped_before_callback(query_config_dir):
    calls = 0

    async def callback(message):
        nonlocal calls
        calls += 1
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post(
            "/_drasi/events/query1",
            content="{",
            headers={"content-type": "application/json"},
        )

    assert response.json() == {"status": "DROP"}
    assert calls == 0


@pytest.mark.parametrize(
    "mutate",
    [
        lambda event: event.pop("id"),
        lambda event: event.update(source="%"),
        lambda event: event.update(source="https://exa<mple"),
        lambda event: event.update(source="bad\u0001source"),
        lambda event: event.update(time=123),
        lambda event: event.update(time="not-a-timestamp"),
        lambda event: event.update(time="2024-01-01T12:00:60Z"),
        lambda event: event.update(time="٢٠٢٤-٠٩-٠٧T١٨:١٢:٣٢Z"),
        lambda event: event.update(time="0001-01-01T00:00:60+23:59"),
        lambda event: event.update(time="9999-12-31T23:59:60-23:59"),
        lambda event: event.update(subject=True),
        lambda event: event.update(subject=""),
        lambda event: event.update(dataschema="relative/schema"),
        lambda event: event.update(datacontenttype="not-a-media-type"),
        lambda event: event.update(datacontenttype='application/json; profile="café"'),
        lambda event: event.update(floatingextension=1.5),
        lambda event: event.update(integerextension=2**31),
        lambda event: event.update(stringextension="bad\u0001value"),
        lambda event: event["data"].pop("sequence"),
    ],
)
def test_malformed_event_is_dropped_before_callback(
    query_config_dir,
    mutate,
):
    calls = 0

    async def callback(message):
        nonlocal calls
        calls += 1
        return DeliveryOutcome.SUCCESS

    payload = change_event()
    mutate(payload)
    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post("/_drasi/events/query1", json=payload)

    assert response.json() == {"status": "DROP"}
    assert calls == 0


def test_deeply_nested_mime_comments_do_not_escape_validation(query_config_dir):
    calls = 0

    async def callback(message):
        nonlocal calls
        calls += 1
        return DeliveryOutcome.SUCCESS

    payload = change_event()
    nested_comment = "(" * 500 + "comment" + ")" * 500
    payload["datacontenttype"] = f"application{nested_comment}/json"
    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post("/_drasi/events/query1", json=payload)

    assert response.json() == {"status": "SUCCESS"}
    assert calls == 1


@pytest.mark.parametrize(
    ("mutate", "path"),
    [
        (lambda event: event.update(topic="another-results"), "/_drasi/events/query1"),
        (
            lambda event: event.update(pubsubname="another-pubsub"),
            "/_drasi/events/query1",
        ),
        (
            lambda event: event["data"].update(queryId="query.with.dot"),
            "/_drasi/events/query1",
        ),
        (lambda event: event["data"].update(kind="unknown"), "/_drasi/events/query1"),
    ],
)
def test_invalid_delivery_is_dropped_before_callback(
    query_config_dir,
    mutate,
    path,
):
    calls = 0

    async def callback(message):
        nonlocal calls
        calls += 1
        return DeliveryOutcome.SUCCESS

    payload = change_event()
    mutate(payload)
    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post(path, json=payload)

    assert response.json() == {"status": "DROP"}
    assert calls == 0


def test_unregistered_query_is_dropped(query_config_dir):
    async def callback(message):
        raise AssertionError("callback must not be called")

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post("/_drasi/events/unknown", json=change_event("unknown"))

    assert response.json() == {"status": "DROP"}


def test_control_event_without_handler_is_acknowledged(query_config_dir):
    async def callback(message):
        raise AssertionError("change callback must not be called")

    app = FastAPI()
    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post("/_drasi/events/query1", json=control_event())

    assert response.json() == {"status": "SUCCESS"}


def test_control_event_callback_receives_typed_message(query_config_dir):
    control_messages = []

    async def change_callback(message):
        raise AssertionError("change callback must not be called")

    async def control_callback(message):
        control_messages.append(message)
        return DeliveryOutcome.SUCCESS

    app = FastAPI()
    reaction = configured_reaction(
        query_config_dir,
        change_callback,
        on_control_event=control_callback,
    )
    reaction.install(app)

    with TestClient(app) as client:
        response = client.post("/_drasi/events/query1", json=control_event())

    assert response.json() == {"status": "SUCCESS"}
    assert len(control_messages) == 1
    assert control_messages[0].event.kind == "control"
    assert control_messages[0].query.query_id == "query1"


def test_install_preserves_fastapi_middleware(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()

    @app.middleware("http")
    async def add_caller_header(request, call_next):
        response = await call_next(request)
        response.headers["x-caller-middleware"] = "preserved"
        return response

    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        discovery = client.get("/dapr/subscribe")
        delivery = client.post("/_drasi/events/query1", json=change_event())

    assert discovery.headers["x-caller-middleware"] == "preserved"
    assert delivery.headers["x-caller-middleware"] == "preserved"


def test_route_collision_fails_installation(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()

    @app.post("/{path:path}")
    async def catch_all(path: str):
        return {"path": path}

    reaction = configured_reaction(query_config_dir, callback)

    with pytest.raises(RuntimeError, match="existing route"):
        reaction.install(app)


def test_same_path_with_different_method_does_not_collide(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    app = FastAPI()

    @app.post("/dapr/subscribe")
    async def caller_route():
        return {"caller": True}

    reaction = configured_reaction(query_config_dir, callback)
    reaction.install(app)

    with TestClient(app) as client:
        assert client.get("/dapr/subscribe").status_code == 200
        assert client.post("/dapr/subscribe").json() == {"caller": True}


def test_reaction_and_app_cannot_be_installed_twice(query_config_dir):
    async def callback(message):
        return DeliveryOutcome.SUCCESS

    first_app = FastAPI()
    second_app = FastAPI()
    first_reaction = configured_reaction(query_config_dir, callback)
    second_reaction = configured_reaction(query_config_dir, callback)

    first_reaction.install(first_app)
    with pytest.raises(RuntimeError, match="already installed"):
        first_reaction.install(second_app)
    with pytest.raises(RuntimeError, match="already installed"):
        second_reaction.install(first_app)
