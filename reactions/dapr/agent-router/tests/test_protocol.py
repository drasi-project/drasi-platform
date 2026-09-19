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
import shutil
import subprocess
import sys
from copy import deepcopy
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError
from pydantic import BaseModel
from referencing import Registry, Resource

from agent_router import protocol

ROOT = Path(__file__).resolve().parents[4]
FIXTURES = ROOT / "typespec/dapr-agent-router/fixtures"
BUNDLE = Path(protocol.__file__).parent
CASES = json.loads((FIXTURES / "messages.json").read_text())
IDENTITIES = json.loads((FIXTURES / "identities.json").read_text())


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


def test_catalog_handshake():
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


@pytest.mark.parametrize("field", ["protocol_version", "delivery_schema_version"])
@pytest.mark.parametrize("value", [0, 2, True, "1", None])
def test_catalog_rejects_invalid_versions(field, value):
    catalog = message("catalog")
    catalog[field] = value
    with pytest.raises((ValueError, ValidationError)):
        protocol.parse_catalog(catalog, catalog["router_id"])


def test_unknown_optional_fields_are_accepted_without_changing_row_data():
    delivery = message("insert")
    delivery["future"] = {"option": True}
    delivery["event"]["future"] = True
    delivery["event"]["payload"]["source"]["future"] = True
    delivery["event"]["payload"]["future"] = True
    delivery["event"]["payload"]["after"]["newColumn"] = {"nested": [None, 2]}
    parsed = protocol.parse(protocol.AgentDelivery, delivery)
    assert parsed.event.payload.after == delivery["event"]["payload"]["after"]
    catalog = message("catalog")
    catalog["future"] = True
    catalog["queries"][0]["future"] = True
    catalog["capabilities"].append("future-capability")
    protocol.parse_catalog(catalog, catalog["router_id"])


def test_serialization_checks_generated_models_and_omits_unset_snapshots():
    delivery = protocol.AgentDelivery.model_validate(message("insert"))
    assert "before" not in protocol.to_wire(delivery)["event"]["payload"]
    invalid = message("insert")
    invalid["event"]["payload"]["before"] = None
    unchecked = protocol.AgentDelivery.model_validate(invalid)
    with pytest.raises(ValidationError):
        protocol.to_wire(unchecked)


@pytest.mark.parametrize("field", ["query_id", "subscription_incarnation"])
def test_subscribe_rejects_empty_required_strings(field):
    request = message("subscribe")
    request[field] = ""
    with pytest.raises(ValidationError):
        protocol.parse(protocol.SubscribeRequest, request)


def test_catalog_rejects_duplicate_capabilities_and_empty_metadata():
    catalog = message("catalog")
    catalog["capabilities"].append("dynamic-subscriptions")
    with pytest.raises(ValidationError):
        protocol.parse_catalog(catalog, catalog["router_id"])
    for field in ("title", "description"):
        catalog = message("catalog")
        catalog["queries"][0][field] = ""
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


def test_portable_bundle_runs_without_drasi_or_dapr_imports(tmp_path):
    shutil.copytree(
        BUNDLE,
        tmp_path / "portable_contract",
        ignore=shutil.ignore_patterns("__pycache__"),
    )
    script = """
import importlib, json, sys
sys.path.insert(0, sys.argv[1])
protocol = importlib.import_module("portable_contract")
from jsonschema.exceptions import ValidationError
for case in json.load(open(sys.argv[2])):
    try:
        parsed = protocol.parse(getattr(protocol, case["model"]), case["message"])
        assert protocol.to_wire(parsed) == case["message"]
    except (ValueError, ValidationError):
        assert not case["valid"], case["name"]
    else:
        assert case["valid"], case["name"]
assert not any(name == "drasi" or name.startswith(("drasi.", "dapr.")) for name in sys.modules)
"""
    subprocess.run(
        [
            sys.executable,
            "-I",
            "-c",
            script,
            str(tmp_path),
            str(FIXTURES / "messages.json"),
        ],
        check=True,
        capture_output=True,
        text=True,
    )


def test_unknown_model_fails_explicitly():
    class Unknown(BaseModel):
        pass

    with pytest.raises(ValueError, match="Unknown agent-router"):
        protocol.parse(Unknown, {})
