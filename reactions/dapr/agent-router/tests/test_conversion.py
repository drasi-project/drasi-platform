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
from copy import deepcopy
from dataclasses import replace
from importlib.resources import files
from typing import Any

from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi_agent_router_contracts import AgentDelivery, parse
from jsonschema.exceptions import ValidationError as SchemaValidationError
from pydantic import ValidationError
import pytest

from agent_router import InvalidPackedChangeError, build_delivery, unpack_change


def change(**overrides: Any) -> ChangeEvent:
    document = {
        "kind": "change",
        "queryId": "service-errors",
        "sequence": 42,
        "sourceTimeMs": 100,
        "addedResults": [],
        "updatedResults": [],
        "deletedResults": [],
    }
    document.update(overrides)
    return ChangeEvent.model_validate(document)


@pytest.fixture
def routing() -> dict[str, Any]:
    fixture = (
        files("drasi_agent_router_contracts")
        .joinpath("fixtures")
        .joinpath("routing.json")
    )
    return json.loads(fixture.read_text(encoding="utf-8"))


def test_matches_shared_routing_fixture(routing):
    rows = unpack_change(
        ChangeEvent.model_validate(routing["packed"]),
        unpacked_at_ms=routing["unpacked_at_ms"],
    )

    assert isinstance(rows, list)
    assert len(rows) == len(routing["rows"])
    for row, expected in zip(rows, routing["rows"]):
        wire = build_delivery(
            row,
            router_id=routing["router_id"],
            subscription_incarnation="fixture-recipient",
        )
        assert wire == {
            "schemaVersion": 1,
            "routerId": routing["router_id"],
            "subscriptionIncarnation": "fixture-recipient",
            **expected,
        }
        assert parse(AgentDelivery, wire).eventId == row.event_id


@pytest.mark.parametrize("reverse_recipients", [False, True])
def test_recipient_filters_do_not_change_rows_or_identity(routing, reverse_recipients):
    rows = unpack_change(
        ChangeEvent.model_validate(routing["packed"]),
        unpacked_at_ms=routing["unpacked_at_ms"],
    )
    recipients = routing["recipients"]
    if reverse_recipients:
        recipients = list(reversed(recipients))

    for recipient in recipients:
        selected = [row for row in rows if row.event.op in recipient["operations"]]
        deliveries = [
            build_delivery(
                row,
                router_id=routing["router_id"],
                subscription_incarnation=recipient["subscriptionIncarnation"],
            )
            for row in selected
        ]
        assert [delivery["eventId"] for delivery in deliveries] == recipient["eventIds"]
        assert all(
            delivery["subscriptionIncarnation"]
            == recipient["subscriptionIncarnation"]
            for delivery in deliveries
        )
        assert [delivery["event"] for delivery in deliveries] == [
            expected["event"]
            for expected in routing["rows"]
            if expected["event"]["op"] in recipient["operations"]
        ]


def test_positions_restart_for_each_operation():
    rows = unpack_change(
        change(
            addedResults=[{"id": 1}, {"id": 2}],
            updatedResults=[
                {"before": {"id": 3}, "after": {"id": 3, "value": "new"}},
                {"before": {"id": 4}, "after": {"id": 4, "value": "new"}},
            ],
            deletedResults=[{"id": 5}, {"id": 6}],
        ),
        unpacked_at_ms=200,
    )
    assert [row.event_id for row in rows] == [
        "drasi:v1:service-errors:42:i:0",
        "drasi:v1:service-errors:42:i:1",
        "drasi:v1:service-errors:42:u:0",
        "drasi:v1:service-errors:42:u:1",
        "drasi:v1:service-errors:42:d:0",
        "drasi:v1:service-errors:42:d:1",
    ]


@pytest.mark.parametrize("sequence", [0, 2**53 + 1, 2**64 - 1])
def test_preserves_sequence_without_rounding(sequence):
    rows = unpack_change(change(sequence=sequence, addedResults=[{}]), unpacked_at_ms=0)
    wire = build_delivery(
        rows[0], router_id="drasi/router", subscription_incarnation="lifecycle"
    )
    assert wire["event"]["seq"] == sequence
    assert wire["eventId"] == f"drasi:v1:service-errors:{sequence}:i:0"
    assert json.loads(json.dumps(wire))["event"]["seq"] == sequence


@pytest.mark.parametrize(
    ("query_id", "encoded"),
    [
        ("ordinary-query", "ordinary-query"),
        ("a:b/c% \u00e9", "a%3Ab%2Fc%25%20%C3%A9"),
        ("%2F", "%252F"),
    ],
)
def test_uses_canonical_query_encoding(query_id, encoded):
    rows = unpack_change(change(queryId=query_id, addedResults=[{}]), unpacked_at_ms=200)
    assert rows[0].event_id == f"drasi:v1:{encoded}:42:i:0"
    assert rows[0].event.payload.source.queryId == query_id


def test_retry_changes_only_unpacking_time(routing):
    packed = ChangeEvent.model_validate(routing["packed"])
    first = unpack_change(packed, unpacked_at_ms=routing["unpacked_at_ms"])
    retried = unpack_change(packed, unpacked_at_ms=routing["unpacked_at_ms"] + 500)

    for original, retry in zip(first, retried):
        assert original.event_id == retry.event_id
        assert retry.event.ts_ms == original.event.ts_ms + 500
        assert retry.event.payload == original.event.payload
        assert retry.event.seq == original.event.seq


def test_empty_change_has_no_rows():
    assert unpack_change(change(), unpacked_at_ms=0) == []


@pytest.mark.parametrize(
    ("array", "value", "expected_snapshots"),
    [
        ("addedResults", [{}], {"after": {}}),
        ("updatedResults", [{"before": {}, "after": {}}], {"before": {}, "after": {}}),
        ("deletedResults", [{}], {"before": {}}),
    ],
)
def test_empty_snapshot_objects_are_preserved(array, value, expected_snapshots):
    row = unpack_change(change(**{array: value}), unpacked_at_ms=200)[0]
    wire = build_delivery(
        row, router_id="drasi/router", subscription_incarnation="lifecycle"
    )
    assert wire["event"]["payload"] == {
        "source": {"queryId": "service-errors", "ts_ms": 100},
        **expected_snapshots,
    }


def test_preserves_projected_data_without_forwarding_packed_metadata():
    projected = {
        "nested": {"items": [None, {"value": "unchanged"}]},
        "metadata": {"column": "keep"},
        "instructions": "a projected column, not handling instructions",
    }
    packed = change(
        addedResults=[projected],
        metadata={"secret": "do not forward"},
    )
    before = deepcopy(packed.model_dump(mode="json"))
    rows = unpack_change(packed, unpacked_at_ms=200)
    first = build_delivery(
        rows[0], router_id="drasi/router", subscription_incarnation="first"
    )
    assert first["event"]["payload"]["after"] == projected
    assert "before" not in first["event"]["payload"]
    assert "metadata" not in first
    assert "metadata" not in first["event"]
    assert "secret" not in json.dumps(first)

    first["event"]["payload"]["after"]["nested"]["items"].append("changed")
    second = build_delivery(
        rows[0], router_id="drasi/router", subscription_incarnation="second"
    )
    assert second["event"]["payload"]["after"] == projected
    assert packed.model_dump(mode="json") == before


@pytest.mark.parametrize(
    ("array", "value", "operation", "snapshot"),
    [
        ("addedResults", [None], "i", "after"),
        ("updatedResults", [{"before": None, "after": {}}], "u", "before"),
        ("updatedResults", [{"before": {}, "after": None}], "u", "after"),
        ("deletedResults", [None], "d", "before"),
    ],
)
def test_null_snapshots_are_explicit_permanent_input_errors(
    array, value, operation, snapshot
):
    with pytest.raises(InvalidPackedChangeError, match=f"{snapshot} snapshot") as error:
        unpack_change(change(**{array: value}), unpacked_at_ms=200)

    assert error.value.query_id == "service-errors"
    assert error.value.operation == operation
    assert error.value.position == 0


def test_invalid_later_row_fails_before_returning_any_rows():
    packed = change(
        addedResults=[{"private": "never include this in errors"}],
        updatedResults=[
            {"before": {}, "after": {}},
            {"before": {}, "after": None},
        ],
    )
    with pytest.raises(InvalidPackedChangeError) as error:
        unpack_change(packed, unpacked_at_ms=200)

    assert error.value.operation == "u"
    assert error.value.position == 1
    assert "private" not in str(error.value)
    assert "never include" not in str(error.value)


@pytest.mark.parametrize("token", ["NaN", "Infinity", "-Infinity"])
@pytest.mark.parametrize(
    ("array", "operation", "snapshot"),
    [
        ("addedResults", "i", "after"),
        ("updatedResults", "u", "before"),
        ("updatedResults", "u", "after"),
        ("deletedResults", "d", "before"),
    ],
)
def test_nonfinite_numbers_fail_before_returning_rows(token, array, operation, snapshot):
    projected = json.loads(
        '{"private": "never include this in errors", "nested": [{"value": '
        + token
        + "}]}"
    )
    if operation == "u":
        first = {"before": {}, "after": {}}
        invalid = {"before": {}, "after": {}}
        invalid[snapshot] = projected
    else:
        first = {}
        invalid = projected

    with pytest.raises(InvalidPackedChangeError, match="finite JSON") as error:
        unpack_change(change(**{array: [first, invalid]}), unpacked_at_ms=200)

    assert error.value.operation == operation
    assert error.value.position == 1
    assert "private" not in str(error.value)
    assert "never include" not in str(error.value)


def test_finite_json_values_are_preserved():
    projected = {
        "nested": [None, True, False, 2**64 - 1, 1.5, -0.25, {"value": "kept"}]
    }
    row = unpack_change(change(addedResults=[projected]), unpacked_at_ms=200)[0]
    wire = build_delivery(
        row, router_id="drasi/router", subscription_incarnation="lifecycle"
    )
    assert wire["event"]["payload"]["after"] == projected
    assert json.loads(json.dumps(wire, allow_nan=False)) == wire


@pytest.mark.parametrize(
    "value",
    [b"not-json", (1, 2), {1, 2}, {1: "not a JSON object key"}],
)
def test_nonjson_python_values_are_not_silently_coerced(value):
    with pytest.raises(InvalidPackedChangeError, match="finite JSON"):
        unpack_change(change(addedResults=[{"value": value}]), unpacked_at_ms=200)


def test_cyclic_snapshot_fails_explicitly():
    projected = {}
    projected["self"] = projected
    with pytest.raises(InvalidPackedChangeError, match="finite JSON"):
        unpack_change(change(addedResults=[projected]), unpacked_at_ms=200)


@pytest.mark.parametrize(
    "snapshot",
    [{"before": {}}, {"after": {}}, {"before": {}, "after": []}],
)
def test_sdk_rejects_missing_or_nonobject_update_snapshots(snapshot):
    with pytest.raises(ValidationError):
        change(updatedResults=[snapshot])


@pytest.mark.parametrize(
    "overrides",
    [
        {"queryId": ""},
        {"sequence": -1},
        {"sourceTimeMs": -1},
    ],
)
def test_invalid_metadata_is_rejected_even_for_empty_batches(overrides):
    with pytest.raises(InvalidPackedChangeError):
        unpack_change(change(**overrides), unpacked_at_ms=200)


@pytest.mark.parametrize("timestamp", [-1, True, 1.5, "200", None])
def test_invalid_processing_time_is_a_caller_error(timestamp):
    with pytest.raises(ValueError, match="unpacked_at_ms") as error:
        unpack_change(change(addedResults=[{}]), unpacked_at_ms=timestamp)
    assert not isinstance(error.value, InvalidPackedChangeError)


def test_invalid_utf8_query_identity_is_a_permanent_input_error():
    with pytest.raises(InvalidPackedChangeError) as error:
        unpack_change(change(queryId="\ud800", addedResults=[{}]), unpacked_at_ms=200)
    assert error.value.query_id == "\ud800"
    assert "\ud800" not in str(error.value)


@pytest.mark.parametrize(
    ("router_id", "incarnation"),
    [
        ("missing-namespace", "lifecycle"),
        ("drasi/router\n", "lifecycle"),
        ("drasi/router", ""),
    ],
)
def test_delivery_validates_recipient_configuration(router_id, incarnation):
    row = unpack_change(change(addedResults=[{}]), unpacked_at_ms=200)[0]
    with pytest.raises((ValidationError, SchemaValidationError)) as error:
        build_delivery(row, router_id=router_id, subscription_incarnation=incarnation)
    assert not isinstance(error.value, InvalidPackedChangeError)


def test_delivery_checks_identity_in_addition_to_generated_models():
    row = unpack_change(change(addedResults=[{}]), unpacked_at_ms=200)[0]
    inconsistent = replace(row, event_id="drasi:v1:service-errors:99:i:0")
    with pytest.raises(ValueError, match="does not match"):
        build_delivery(
            inconsistent,
            router_id="drasi/router",
            subscription_incarnation="lifecycle",
        )
