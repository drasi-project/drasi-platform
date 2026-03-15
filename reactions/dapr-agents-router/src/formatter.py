"""
Transforms Drasi ChangeEvents into CloudEvent payloads for Dapr Pub/Sub.

Two modes (matching the C# ChangeHandler.cs in reactions/dapr/post-pubsub/):
- PACKED: The entire ChangeEvent is one message. Agents get everything at once.
- UNPACKED: Each add/update/delete becomes its own separate message.
  Agents process changes one record at a time.
"""
from __future__ import annotations

from typing import Any

from drasi.reaction.models.ChangeEvent import ChangeEvent

from .config import OutputFormat, RouterQueryConfig


def format_packed(event: ChangeEvent, config: RouterQueryConfig) -> list[dict[str, Any]]:
    """
    Return a single CloudEvent payload containing the full ChangeEvent.

    The agent receives one message with all addedResults, updatedResults,
    and deletedResults in it, plus the queryId and sequence number.
    """
    return [{
        "kind": "change",
        "queryId": event.queryId,
        "sequence": event.sequence,
        "sourceTimeMs": event.sourceTimeMs,
        "addedResults": [r.root for r in event.addedResults],
        "updatedResults": [
            {"before": u.before.root if u.before else None,
             "after": u.after.root if u.after else None}
            for u in event.updatedResults
        ],
        "deletedResults": [r.root for r in event.deletedResults],
        "metadata": event.metadata.root if event.metadata else None,
    }]


def format_unpacked(event: ChangeEvent, config: RouterQueryConfig) -> list[dict[str, Any]]:
    """
    Return one CloudEvent payload per individual changed record.

    Each message has:
    - op: "I" (insert/add), "U" (update), or "D" (delete)
    - queryId: which query triggered this
    - sequence: event ordering number
    - tsMs: timestamp in milliseconds
    - payload.before: the record before the change (None for inserts)
    - payload.after: the record after the change (None for deletes)
    """
    messages = []

    source = {"queryId": event.queryId, "tsMs": event.sourceTimeMs}

    for record in event.addedResults:
        messages.append({
            "op": "I",
            "queryId": event.queryId,
            "sequence": event.sequence,
            "tsMs": event.sourceTimeMs,
            "payload": {
                "source": source,
                "before": None,
                "after": record.root,
            },
        })

    for update in event.updatedResults:
        messages.append({
            "op": "U",
            "queryId": event.queryId,
            "sequence": event.sequence,
            "tsMs": event.sourceTimeMs,
            "payload": {
                "source": source,
                "before": update.before.root if update.before else None,
                "after": update.after.root if update.after else None,
            },
        })

    for record in event.deletedResults:
        messages.append({
            "op": "D",
            "queryId": event.queryId,
            "sequence": event.sequence,
            "tsMs": event.sourceTimeMs,
            "payload": {
                "source": source,
                "before": record.root,
                "after": None,
            },
        })

    return messages


def get_cloudevent_type(config: RouterQueryConfig, op: str | None = None) -> str:
    """
    Return the CloudEvent 'type' string for a given message.

    Packed events: 'drasi.change.packed'
    Unpacked events: 'drasi.change.insert', 'drasi.change.update', 'drasi.change.delete'
    """
    if config.format == OutputFormat.PACKED:
        return "drasi.change.packed"
    op_map = {"I": "insert", "U": "update", "D": "delete"}
    return f"drasi.change.{op_map.get(op or 'I', 'insert')}"
