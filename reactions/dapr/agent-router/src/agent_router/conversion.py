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

"""Convert packed SDK changes without subscription or transport side effects."""

from dataclasses import dataclass
from typing import Any, TypeAlias

from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi_agent_router_contracts import AgentDelivery, row_event_id, to_wire
from drasi_agent_router_contracts.models.ChangeSource import ChangeSource
from drasi_agent_router_contracts.models.DeleteEvent import DeleteEvent
from drasi_agent_router_contracts.models.DeletePayload import DeletePayload
from drasi_agent_router_contracts.models.InsertEvent import InsertEvent
from drasi_agent_router_contracts.models.InsertPayload import InsertPayload
from drasi_agent_router_contracts.models.UpdateEvent import UpdateEvent
from drasi_agent_router_contracts.models.UpdatePayload import UpdatePayload
from pydantic import ConfigDict, JsonValue, TypeAdapter, ValidationError

RowEvent: TypeAlias = InsertEvent | UpdateEvent | DeleteEvent

_SNAPSHOT = TypeAdapter(
    dict[str, JsonValue], config=ConfigDict(strict=True, allow_inf_nan=False)
)


@dataclass(frozen=True)
class ConvertedRow:
    event_id: str
    event: RowEvent


class InvalidPackedChangeError(ValueError):
    """A packed change cannot be represented by the supported row contract."""

    def __init__(
        self,
        reason: str,
        *,
        query_id: str,
        operation: str | None = None,
        position: int | None = None,
    ) -> None:
        super().__init__(reason)
        self.query_id = query_id
        self.operation = operation
        self.position = position


def _snapshot(
    value: dict[str, Any] | None,
    *,
    query_id: str,
    operation: str,
    position: int,
    name: str,
) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise InvalidPackedChangeError(
            f"{name} snapshot must be a result-row object",
            query_id=query_id,
            operation=operation,
            position=position,
        )
    try:
        _SNAPSHOT.validate_python(value)
    except ValidationError:
        raise InvalidPackedChangeError(
            f"{name} snapshot must contain finite JSON values",
            query_id=query_id,
            operation=operation,
            position=position,
        ) from None
    return value


def _identify(event: RowEvent, position: int) -> ConvertedRow:
    try:
        event_id = row_event_id(
            event.payload.source.queryId, event.seq, event.op, position
        )
    except UnicodeEncodeError:
        raise InvalidPackedChangeError(
            "Row identity cannot be encoded",
            query_id=event.payload.source.queryId,
            operation=event.op,
            position=position,
        ) from None
    return ConvertedRow(event_id=event_id, event=event)


def unpack_change(change: ChangeEvent, *, unpacked_at_ms: int) -> list[ConvertedRow]:
    """Eagerly convert all rows, retaining their original per-operation positions.

    The caller supplies one unpacking timestamp for this processing attempt.
    Invalid input raises before any rows are returned; controls are not inputs.
    """
    if type(unpacked_at_ms) is not int or unpacked_at_ms < 0:
        raise ValueError("unpacked_at_ms must be a non-negative integer")
    if type(change.sequence) is not int or change.sequence < 0:
        raise InvalidPackedChangeError(
            "Sequence must be a non-negative integer", query_id=change.queryId
        )
    try:
        source = ChangeSource(queryId=change.queryId, ts_ms=change.sourceTimeMs)
    except ValidationError:
        raise InvalidPackedChangeError(
            "Query ID or source timestamp is invalid", query_id=change.queryId
        ) from None

    rows: list[ConvertedRow] = []
    for position, added in enumerate(change.addedResults):
        after = _snapshot(
            added.root,
            query_id=change.queryId,
            operation="i",
            position=position,
            name="after",
        )
        rows.append(
            _identify(
                InsertEvent(
                    op="i",
                    seq=change.sequence,
                    ts_ms=unpacked_at_ms,
                    payload=InsertPayload(source=source, after=after),
                ),
                position,
            )
        )

    for position, updated in enumerate(change.updatedResults):
        before = _snapshot(
            updated.before.root,
            query_id=change.queryId,
            operation="u",
            position=position,
            name="before",
        )
        after = _snapshot(
            updated.after.root,
            query_id=change.queryId,
            operation="u",
            position=position,
            name="after",
        )
        rows.append(
            _identify(
                UpdateEvent(
                    op="u",
                    seq=change.sequence,
                    ts_ms=unpacked_at_ms,
                    payload=UpdatePayload(source=source, before=before, after=after),
                ),
                position,
            )
        )

    for position, deleted in enumerate(change.deletedResults):
        before = _snapshot(
            deleted.root,
            query_id=change.queryId,
            operation="d",
            position=position,
            name="before",
        )
        rows.append(
            _identify(
                DeleteEvent(
                    op="d",
                    seq=change.sequence,
                    ts_ms=unpacked_at_ms,
                    payload=DeletePayload(source=source, before=before),
                ),
                position,
            )
        )
    return rows


def build_delivery(
    row: ConvertedRow, *, router_id: str, subscription_incarnation: str
) -> dict[str, Any]:
    """Build validated CloudEvent data without modifying the shared row."""
    return to_wire(
        AgentDelivery(
            schemaVersion=1,
            routerId=router_id,
            subscriptionIncarnation=subscription_incarnation,
            eventId=row.event_id,
            event=row.event,
        )
    )
