"""
Per-query configuration for the Drasi-to-Dapr-Agents router.

Each Drasi query that this reaction subscribes to has its own config file
at /etc/queries/{queryId}. This module parses those YAML files.

Example YAML config for a query:
    pubsubName: agent-pubsub
    topicName: support.sla-breach
    format: packed
    skipControlSignals: true
"""
from __future__ import annotations

import os
from enum import Enum
from io import TextIOWrapper

import yaml
from pydantic import BaseModel, Field


class OutputFormat(str, Enum):
    """How to deliver Drasi change events to agents."""
    PACKED = "packed"    # Entire ChangeEvent as one message (all adds/updates/deletes together)
    UNPACKED = "unpacked"  # One message per individual add, update, or delete


class RouterQueryConfig(BaseModel):
    """
    Configuration for routing one Drasi query's results to a Dapr Pub/Sub topic.

    This is loaded from /etc/queries/{queryId} YAML files.
    """
    pubsub_name: str = Field(
        default_factory=lambda: os.getenv("DefaultPubsubName", "agent-pubsub"),
        alias="pubsubName",
        description="Dapr pub/sub component name to publish to (for agents)",
    )
    topic_name: str = Field(
        alias="topicName",
        description="Dapr pub/sub topic to publish to (agents subscribe to this)",
    )
    format: OutputFormat = Field(
        default=OutputFormat.PACKED,
        description="packed=one message per event, unpacked=one message per changed record",
    )
    skip_control_signals: bool = Field(
        default=True,
        alias="skipControlSignals",
        description="If True, control signals (bootstrap, running, stopped) are not forwarded",
    )

    model_config = {"populate_by_name": True}


def parse_query_config(file: TextIOWrapper) -> dict:
    """
    Parse a query config YAML file into a dict.
    Used as the parse_query_configs callback for DrasiReaction.
    """
    return yaml.safe_load(file) or {}
