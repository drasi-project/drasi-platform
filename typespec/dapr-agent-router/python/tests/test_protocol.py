# Copyright 2026 The Drasi Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import re
from copy import deepcopy
from itertools import permutations
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError
from pydantic import BaseModel
from referencing import Registry, Resource

import drasi_agent_router_contracts as protocol

BUNDLE = Path(protocol.__file__).parent
FIXTURES = BUNDLE / "fixtures"
CASES = json.loads((FIXTURES / "messages.json").read_text())
IDENTITIES = json.loads((FIXTURES / "identities.json").read_text())
OPERATION_PERMUTATIONS = [
    operations
    for size in (1, 2, 3)
    for operations in permutations(("i", "u", "d"), size)
]


def message(name):
    return deepcopy(next(case["message"] for case in CASES if case["name"] == name))


@pytest.fixture(scope="module")
def schemas():
    documents = {
        path.name: json.loads(path.read_text())
        for path in (BUNDLE / "schemas").glob("*.json")
    }
    registry = Registry().with_resources(
        (name, Resource.from_contents(document)) for name, document in documents.items()
    )
    for document in documents.values():
        Draft202012Validator.check_schema(document)
    return documents, registry


@pytest.mark.parametrize("case", CASES, ids=lambda case: case["name"])
def test_shared_wire_fixtures(case, schemas):
    documents, registry = schemas
    validator = Draft202012Validator(
        documents[f"{case['model']}.json"], registry=registry
    )
    assert validator.is_valid(case["message"]) == case.get(
        "schema_valid", case["valid"]
    )
    model = getattr(protocol, case["model"])
    original = deepcopy(case["message"])
    if case["valid"]:
        parsed = protocol.parse(model, case["message"])
        assert protocol.to_wire(parsed) == case["message"]
    else:
        with pytest.raises((ValueError, ValidationError)):
            protocol.parse(model, case["message"])
    assert case["message"] == original


@pytest.mark.parametrize("operations", OPERATION_PERMUTATIONS)
def test_subscribe_requests_accept_any_operation_order(operations):
    request = message("subscribe")
    request["operations"] = list(operations)
    parsed = protocol.parse(protocol.SubscribeRequest, request)
    assert protocol.to_wire(parsed) == request


@pytest.mark.parametrize("operations", OPERATION_PERMUTATIONS)
def test_subscribe_responses_accept_any_operation_order(operations):
    response = message("created")
    response["operations"] = list(operations)
    model = protocol.SubscribeResponse.model_validate(response)
    assert (
        protocol.to_wire(protocol.parse(protocol.SubscribeResponse, response))
        == response
    )
    assert protocol.to_wire(model) == response


@pytest.mark.parametrize(
    ("model", "fixture"),
    [
        (protocol.SubscribeRequest, "subscribe"),
        (protocol.SubscribeResponse, "created"),
    ],
)
@pytest.mark.parametrize("operations", [[], ["i", "i"], ["x"], ["i", "u", "d", "i"]])
def test_operation_sets_reject_empty_duplicate_or_unsupported_values(
    model, fixture, operations
):
    document = message(fixture)
    document["operations"] = operations
    with pytest.raises(ValidationError):
        protocol.parse(model, document)


@pytest.mark.parametrize(
    ("model", "fixture"),
    [
        (protocol.SubscribeRequest, "subscribe"),
        (protocol.SubscribeResponse, "created"),
    ],
)
def test_serialization_still_rejects_duplicate_operations(model, fixture):
    document = message(fixture)
    document["operations"] = ["i", "i"]
    unchecked = model.model_validate(document)
    with pytest.raises(ValidationError):
        protocol.to_wire(unchecked)


@pytest.mark.parametrize("vector", IDENTITIES["topics"])
def test_topic_vectors(vector):
    subscriber = protocol.parse(protocol.Subscriber, vector["subscriber"])
    assert (
        protocol.agent_inbox_topic(vector["router_id"], subscriber) == vector["inbox"]
    )
    assert (
        protocol.agent_dead_letter_topic(vector["router_id"], subscriber)
        == vector["agent_dlt"]
    )
    assert (
        protocol.router_dead_letter_topic(vector["router_id"]) == vector["router_dlt"]
    )
    for name in ("inbox", "agent_dlt", "router_dlt"):
        assert len(vector[name]) == 62
        assert re.fullmatch(r"[a-z0-9-]+", vector[name])
    assert len({vector["inbox"], vector["agent_dlt"], vector["router_dlt"]}) == 3


@pytest.mark.parametrize("vector", IDENTITIES["rows"])
def test_row_identity_vectors(vector):
    assert (
        protocol.row_event_id(
            vector["query_id"],
            vector["sequence"],
            vector["operation"],
            vector["position"],
        )
        == vector["id"]
    )


@pytest.mark.parametrize("value", [True, -1, 1.0, "1", None])
def test_row_identity_rejects_invalid_numbers(value):
    with pytest.raises(ValueError):
        protocol.row_event_id("query", value, "i", 0)
    with pytest.raises(ValueError):
        protocol.row_event_id("query", 0, "i", value)


@pytest.mark.parametrize(
    "value", ["", "namespace", "a/b/c", "/app", "ns/", "ns/a\n", None]
)
def test_invalid_router_identity(value):
    with pytest.raises(ValueError):
        protocol.router_dead_letter_topic(value)


@pytest.mark.parametrize(
    ("schema_name", "identity"),
    [("IdentityPart", "applications"), ("RouterId", "applications/router-a")],
)
@pytest.mark.parametrize(
    "whitespace", ["\n", "\r", "\r\n", "\t", " ", "\u2028", "\u2029"]
)
def test_identity_schemas_reject_whitespace_at_every_position(
    schema_name, identity, whitespace, schemas
):
    documents, registry = schemas
    validator = Draft202012Validator(
        documents[f"{schema_name}.json"], registry=registry
    )
    assert validator.is_valid(identity)
    for value in (
        whitespace + identity,
        identity + whitespace,
        identity[:1] + whitespace + identity[1:],
    ):
        assert not validator.is_valid(value), repr(value)


@pytest.mark.parametrize("field", ["namespace", "app_id"])
def test_subscriber_models_and_helpers_reject_trailing_newline(field):
    subscriber = {
        "namespace": "applications",
        "app_id": "app-a",
        "agent_name": "agent-a",
    }
    subscriber[field] += "\n"
    with pytest.raises(ValueError):
        protocol.Subscriber.model_validate(subscriber)
    with pytest.raises(ValidationError):
        protocol.parse(protocol.Subscriber, subscriber)


def test_identity_guards_do_not_restrict_logical_agent_names():
    subscriber = {
        "namespace": "applications",
        "app_id": "app-a",
        "agent_name": "Agent name\nwith whitespace",
    }
    parsed = protocol.parse(protocol.Subscriber, subscriber)
    assert protocol.to_wire(parsed) == subscriber
    assert len(protocol.agent_inbox_topic("drasi-system/router-a", parsed)) == 62


def test_identity_boundaries_and_unicode_are_not_normalized():
    vectors = IDENTITIES["topics"]
    assert vectors[1]["inbox"] != vectors[2]["inbox"]
    assert vectors[0]["inbox"] != vectors[3]["inbox"]
    original = protocol.Subscriber(**vectors[0]["subscriber"])
    for field in ("namespace", "app_id", "agent_name"):
        other = original.model_copy(update={field: getattr(original, field) + "x"})
        assert (
            protocol.agent_inbox_topic(vectors[0]["router_id"], other)
            != vectors[0]["inbox"]
        )
    composed = original.model_copy(update={"agent_name": "caf\u00e9"})
    decomposed = original.model_copy(update={"agent_name": "cafe\u0301"})
    assert protocol.agent_inbox_topic(
        vectors[0]["router_id"], composed
    ) != protocol.agent_inbox_topic(vectors[0]["router_id"], decomposed)


def test_catalog_matches_configured_router_and_has_unique_queries():
    catalog = message("catalog")
    assert (
        protocol.parse_catalog(catalog, catalog["router_id"]).queries[0].query_id
        == "service-errors"
    )
    with pytest.raises(ValueError, match="configured router"):
        protocol.parse_catalog(catalog, "another/router")
    catalog["queries"].append(deepcopy(catalog["queries"][0]))
    with pytest.raises(ValueError, match="duplicate query"):
        protocol.parse_catalog(catalog, catalog["router_id"])


@pytest.mark.parametrize("case", json.loads((FIXTURES / "mcp-errors.json").read_text()))
def test_mcp_errors_do_not_violate_success_output_schemas(case):
    result = case["result"]
    assert result["isError"] is True
    assert "structuredContent" not in result
    assert len(result["content"]) == 1
    assert result["content"][0]["type"] == "text"
    error = protocol.parse(protocol.ToolError, json.loads(result["content"][0]["text"]))
    assert error.message


@pytest.mark.parametrize("value", [0, 2, True, "1", None])
def test_catalog_rejects_invalid_protocol_version(value):
    catalog = message("catalog")
    catalog["protocol_version"] = value
    with pytest.raises((ValueError, ValidationError)):
        protocol.parse_catalog(catalog, catalog["router_id"])


@pytest.fixture(scope="module")
def consumer_example():
    readme = Path(__file__).resolve().parents[1] / "README.md"
    code = readme.read_text().split("```python\n", 1)[1].split("```", 1)[0]
    return compile(code, str(readme), "exec")


@pytest.fixture
def consumer_inputs():
    request = message("subscribe")
    return {
        "catalog_document": message("catalog"),
        "query_id": request["query_id"],
        "subscription_incarnation": request["subscription_incarnation"],
        "cloud_event": {"specversion": "1.0", "data": message("insert")},
    }


@pytest.mark.parametrize("event_name", ["insert", "update", "delete"])
def test_documented_consumer_uses_shared_contract(
    consumer_example, consumer_inputs, event_name
):
    consumer_inputs["cloud_event"]["data"] = message(event_name)
    exec(consumer_example, consumer_inputs)
    assert consumer_inputs["subscribe_arguments"] == message("subscribe")
    assert consumer_inputs["expected_inbox"] == message("created")["topic_name"]
    assert protocol.to_wire(consumer_inputs["delivery"]) == message(event_name)


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("router_id", "another/router"),
        ("protocol_version", 2),
        ("delivery_schema_version", 1),
        ("capabilities", []),
    ],
)
def test_documented_consumer_rejects_incompatible_catalog(
    consumer_example, consumer_inputs, field, value
):
    consumer_inputs["catalog_document"][field] = value
    with pytest.raises(RuntimeError, match="Incompatible router catalog"):
        exec(consumer_example, consumer_inputs)
    assert "subscribe_arguments" not in consumer_inputs


def test_documented_consumer_does_not_subscribe_to_absent_query(
    consumer_example, consumer_inputs
):
    consumer_inputs["catalog_document"]["queries"] = []
    with pytest.raises(ValueError, match="not in the router catalog"):
        exec(consumer_example, consumer_inputs)


@pytest.mark.parametrize(
    ("field", "value", "error"),
    [
        ("routerId", "another/router", "unexpected router"),
        ("schemaVersion", 2, "Invalid or unsupported"),
        ("eventId", "drasi:v1:another-query:42:i:0", "Invalid or unsupported"),
    ],
)
def test_documented_consumer_rejects_invalid_delivery(
    consumer_example, consumer_inputs, field, value, error
):
    consumer_inputs["cloud_event"]["data"][field] = value
    with pytest.raises(ValueError, match=error):
        exec(consumer_example, consumer_inputs)


@pytest.mark.parametrize(
    "case", [case for case in CASES if case["valid"]], ids=lambda case: case["name"]
)
def test_protocol_messages_reject_unknown_fields(case):
    document = deepcopy(case["message"])
    document["unsupported_option"] = True
    with pytest.raises(ValidationError):
        protocol.parse(getattr(protocol, case["model"]), document)


@pytest.mark.parametrize("event_name", ["insert", "update", "delete"])
@pytest.mark.parametrize("level", ["event", "payload", "source"])
def test_delivery_protocol_objects_reject_unknown_fields(event_name, level):
    delivery = message(event_name)
    target = delivery["event"]
    if level in ("payload", "source"):
        target = target["payload"]
    if level == "source":
        target = target["source"]
    target["unsupported_option"] = True
    with pytest.raises(ValidationError):
        protocol.parse(protocol.AgentDelivery, delivery)


def test_catalog_metadata_rejects_unknown_fields():
    catalog = message("catalog")
    catalog["queries"][0]["unsupported_option"] = True
    with pytest.raises(ValidationError):
        protocol.parse_catalog(catalog, catalog["router_id"])


@pytest.mark.parametrize("event_name", ["insert", "update", "delete"])
def test_projected_row_columns_remain_unrestricted(event_name):
    delivery = message(event_name)
    for snapshot in ("before", "after"):
        if snapshot in delivery["event"]["payload"]:
            delivery["event"]["payload"][snapshot]["newColumn"] = {
                "nested": [None, 2, {"unsupported_option": True}]
            }
    parsed = protocol.parse(protocol.AgentDelivery, delivery)
    assert protocol.to_wire(parsed) == delivery


def test_generated_event_models_reject_unknown_fields():
    delivery = message("insert")
    delivery["event"]["unsupported_option"] = True
    with pytest.raises(ValueError):
        protocol.AgentDelivery.model_validate(delivery)


@pytest.mark.parametrize("event_name", ["insert", "delete"])
def test_generated_snapshots_need_no_null_placeholder_fields(event_name):
    delivery = protocol.AgentDelivery.model_validate(message(event_name))
    assert delivery.model_dump(mode="json") == message(event_name)
    assert protocol.to_wire(delivery) == message(event_name)


def test_serialization_validates_the_current_event_identity():
    delivery = protocol.parse(protocol.AgentDelivery, message("insert"))
    unchecked = delivery.model_copy(update={"eventId": "drasi:v1:another-query:42:i:0"})
    with pytest.raises(ValueError, match="does not match"):
        protocol.to_wire(unchecked)


@pytest.mark.parametrize("field", ["query_id", "subscription_incarnation"])
def test_subscribe_rejects_empty_required_strings(field):
    request = message("subscribe")
    request[field] = ""
    with pytest.raises(ValidationError):
        protocol.parse(protocol.SubscribeRequest, request)


def test_catalog_rejects_empty_metadata():
    for field in ("title", "description"):
        catalog = message("catalog")
        catalog["queries"][0][field] = ""
        with pytest.raises(ValidationError):
            protocol.parse_catalog(catalog, catalog["router_id"])


def test_optional_catalog_guidance_is_not_nullable():
    catalog = message("catalog")
    catalog["queries"][0]["usage"] = None
    with pytest.raises(ValidationError):
        protocol.parse_catalog(catalog, catalog["router_id"])


def test_cloud_event_wrapper_is_not_the_application_envelope():
    with pytest.raises(ValidationError):
        protocol.parse(
            protocol.AgentDelivery, {"specversion": "1.0", "data": message("insert")}
        )


@pytest.mark.parametrize(
    "field", ["topic", "ttl", "expires_at", "replay", "instructions", "pubsub_name"]
)
def test_request_rejects_unsupported_arguments(field):
    request = message("subscribe")
    request[field] = "unsupported"
    with pytest.raises(ValidationError):
        protocol.parse(protocol.SubscribeRequest, request)


@pytest.mark.parametrize("value", [True, -1, "42", 42.0, None])
def test_delivery_sequence_is_not_coerced(value):
    delivery = message("insert")
    delivery["event"]["seq"] = value
    with pytest.raises((ValueError, ValidationError)):
        protocol.parse(protocol.AgentDelivery, delivery)


@pytest.mark.parametrize(
    "event_id",
    [
        "drasi:v1:service-errors:43:i:0",
        "drasi:v1:service-errors:42:u:0",
        "drasi:v1:%73ervice-errors:42:i:0",
        "drasi:v1:service-errors:42:i:-1",
        "drasi:v1:service-errors:42:i:0\n",
    ],
)
def test_delivery_id_must_match_canonical_row_identity(event_id):
    delivery = message("insert")
    delivery["eventId"] = event_id
    with pytest.raises(ValueError):
        protocol.parse(protocol.AgentDelivery, delivery)


def test_packed_fixture_defines_independent_row_positions_and_recipient_envelopes():
    fixture = json.loads((FIXTURES / "routing.json").read_text())
    packed = fixture["packed"]
    rows = fixture["rows"]
    assert len(rows) == 4
    expected_order = [("i", 0), ("i", 1), ("u", 0), ("d", 0)]
    for row, (op, position) in zip(rows, expected_order):
        event = row["event"]
        assert row["eventId"] == protocol.row_event_id(
            packed["queryId"], packed["sequence"], op, position
        )
        assert event["seq"] == packed["sequence"]
        assert event["ts_ms"] == fixture["unpacked_at_ms"]
        assert event["payload"]["source"] == {
            "queryId": packed["queryId"],
            "ts_ms": packed["sourceTimeMs"],
        }
        assert "metadata" not in event
        if op == "i":
            assert event["payload"]["after"] == packed["addedResults"][position]
        elif op == "u":
            assert (
                event["payload"]["before"]
                == packed["updatedResults"][position]["before"]
            )
            assert (
                event["payload"]["after"] == packed["updatedResults"][position]["after"]
            )
        else:
            assert event["payload"]["before"] == packed["deletedResults"][position]
    for recipient in fixture["recipients"]:
        selected = [
            row for row in rows if row["event"]["op"] in recipient["operations"]
        ]
        assert [row["eventId"] for row in selected] == recipient["eventIds"]
        for row in selected:
            envelope = {
                "schemaVersion": 1,
                "routerId": fixture["router_id"],
                "subscriptionIncarnation": recipient["subscriptionIncarnation"],
                **row,
            }
            parsed = protocol.parse(protocol.AgentDelivery, envelope)
            assert parsed.eventId == row["eventId"]
            assert parsed.event.seq == 9007199254740993
            assert parsed.model_dump(mode="json", exclude_unset=True) == envelope
            envelope["event"] = deepcopy(envelope["event"])
            envelope["event"]["ts_ms"] += 100
            assert (
                protocol.parse(protocol.AgentDelivery, envelope).eventId
                == row["eventId"]
            )


def test_unknown_model_fails_explicitly():
    class Unknown(BaseModel):
        pass

    with pytest.raises(ValueError, match="Unknown agent-router"):
        protocol.parse(Unknown, {})
