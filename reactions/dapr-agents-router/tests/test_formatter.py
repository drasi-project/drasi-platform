"""
Tests for the event formatter.
These tests do NOT need a running Drasi or Dapr instance.
"""
import pytest
from drasi.reaction.models.ChangeEvent import ChangeEvent, RecordUnknown
from drasi.reaction.models.UpdatePayload import UpdatePayload

from src.config import OutputFormat, RouterQueryConfig
from src.formatter import format_packed, format_unpacked, get_cloudevent_type


# A sample ChangeEvent as Drasi would send it
SAMPLE_CHANGE_EVENT_DICT = {
    "kind": "change",
    "queryId": "sla-breaches",
    "sequence": 42,
    "sourceTimeMs": 1700000000000,
    "addedResults": [{"ticket_id": "T001", "customer_id": "C123", "sla_hours": 25}],
    "updatedResults": [],
    "deletedResults": [],
}

SAMPLE_CONFIG_PACKED = RouterQueryConfig(
    pubsubName="agent-pubsub",
    topicName="support.sla-breach",
    format=OutputFormat.PACKED,
    skipControlSignals=True,
)

SAMPLE_CONFIG_UNPACKED = RouterQueryConfig(
    pubsubName="agent-pubsub",
    topicName="support.sla-breach",
    format=OutputFormat.UNPACKED,
    skipControlSignals=True,
)


def make_event() -> ChangeEvent:
    return ChangeEvent.model_validate(SAMPLE_CHANGE_EVENT_DICT)


def test_format_packed_returns_one_message():
    event = make_event()
    messages = format_packed(event, SAMPLE_CONFIG_PACKED)

    assert len(messages) == 1
    msg = messages[0]
    assert msg["kind"] == "change"
    assert msg["queryId"] == "sla-breaches"
    assert msg["sequence"] == 42
    assert len(msg["addedResults"]) == 1
    assert msg["addedResults"][0]["ticket_id"] == "T001"


def test_format_unpacked_insert_produces_one_message():
    event = make_event()
    messages = format_unpacked(event, SAMPLE_CONFIG_UNPACKED)

    assert len(messages) == 1
    msg = messages[0]
    assert msg["op"] == "I"
    assert msg["queryId"] == "sla-breaches"
    assert msg["payload"]["before"] is None
    assert msg["payload"]["after"]["ticket_id"] == "T001"


def test_format_unpacked_with_update():
    event_dict = {
        **SAMPLE_CHANGE_EVENT_DICT,
        "addedResults": [],
        "updatedResults": [
            {
                "before": {"ticket_id": "T001", "sla_hours": 23},
                "after": {"ticket_id": "T001", "sla_hours": 25},
            }
        ],
    }
    event = ChangeEvent.model_validate(event_dict)
    messages = format_unpacked(event, SAMPLE_CONFIG_UNPACKED)

    assert len(messages) == 1
    assert messages[0]["op"] == "U"
    assert messages[0]["payload"]["before"]["sla_hours"] == 23
    assert messages[0]["payload"]["after"]["sla_hours"] == 25


def test_format_unpacked_with_delete():
    event_dict = {
        **SAMPLE_CHANGE_EVENT_DICT,
        "addedResults": [],
        "deletedResults": [{"ticket_id": "T001"}],
    }
    event = ChangeEvent.model_validate(event_dict)
    messages = format_unpacked(event, SAMPLE_CONFIG_UNPACKED)

    assert len(messages) == 1
    assert messages[0]["op"] == "D"
    assert messages[0]["payload"]["after"] is None
    assert messages[0]["payload"]["before"]["ticket_id"] == "T001"


def test_get_cloudevent_type_packed():
    assert get_cloudevent_type(SAMPLE_CONFIG_PACKED) == "drasi.change.packed"


def test_get_cloudevent_type_unpacked():
    assert get_cloudevent_type(SAMPLE_CONFIG_UNPACKED, "I") == "drasi.change.insert"
    assert get_cloudevent_type(SAMPLE_CONFIG_UNPACKED, "U") == "drasi.change.update"
    assert get_cloudevent_type(SAMPLE_CONFIG_UNPACKED, "D") == "drasi.change.delete"
