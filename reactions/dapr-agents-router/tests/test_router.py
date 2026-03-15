"""
Tests for DrasiAgentRouter change/control event handling.
Uses unittest.mock to avoid needing a real Dapr sidecar.
"""
import asyncio
import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent

from src.config import OutputFormat, RouterQueryConfig
from src.router import DrasiAgentRouter


SAMPLE_CONFIG_DICT = {
    "pubsubName": "agent-pubsub",
    "topicName": "support.sla-breach",
    "format": "packed",
    "skipControlSignals": True,
}

SAMPLE_CHANGE_DICT = {
    "kind": "change",
    "queryId": "sla-breaches",
    "sequence": 1,
    "sourceTimeMs": 1700000000000,
    "addedResults": [{"ticket_id": "T001"}],
    "updatedResults": [],
    "deletedResults": [],
}


@pytest.mark.asyncio
async def test_handle_change_publishes_packed_event():
    router = DrasiAgentRouter()
    event = ChangeEvent.model_validate(SAMPLE_CHANGE_DICT)

    mock_client = AsyncMock()
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)

    with patch("src.router.DaprClient", return_value=mock_client):
        await router._handle_change(event, SAMPLE_CONFIG_DICT)

    mock_client.publish_event.assert_called_once()
    call_kwargs = mock_client.publish_event.call_args.kwargs
    assert call_kwargs["pubsub_name"] == "agent-pubsub"
    assert call_kwargs["topic_name"] == "support.sla-breach"

    published_data = json.loads(call_kwargs["data"])
    assert published_data["kind"] == "change"
    assert published_data["queryId"] == "sla-breaches"
    assert published_data["addedResults"][0]["ticket_id"] == "T001"

    metadata = call_kwargs["publish_metadata"]
    assert metadata["cloudevent.type"] == "drasi.change.packed"
    assert metadata["cloudevent.source"] == "drasi/query/sla-breaches"


@pytest.mark.asyncio
async def test_handle_change_skips_none_config():
    router = DrasiAgentRouter()
    event = ChangeEvent.model_validate(SAMPLE_CHANGE_DICT)

    with patch("src.router.DaprClient") as mock_dapr:
        await router._handle_change(event, None)

    # Should not publish anything if config is missing
    mock_dapr.assert_not_called()


@pytest.mark.asyncio
async def test_handle_control_skips_when_configured():
    router = DrasiAgentRouter()
    control_dict = {
        "kind": "control",
        "queryId": "sla-breaches",
        "sequence": 1,
        "sourceTimeMs": 1700000000000,
        "controlSignal": {"kind": "running"},
    }
    event = ControlEvent.model_validate(control_dict)

    with patch("src.router.DaprClient") as mock_dapr:
        await router._handle_control(event, SAMPLE_CONFIG_DICT)

    # skip_control_signals=True means no publish
    mock_dapr.assert_not_called()
