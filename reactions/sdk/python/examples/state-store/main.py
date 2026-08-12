import os
from typing import Any

from dapr.aio.clients import DaprClient
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.sdk import DrasiReaction

STATE_STORE_NAME = os.environ["StateStoreName"]


async def on_change_event(
    _event: ChangeEvent, _query_config: dict[str, Any] | None
) -> None:
    async with DaprClient() as client:
        current = await client.get_state(
            store_name=STATE_STORE_NAME,
            key="counter",
        )
        count = int(current.data.decode()) if current.data else 0
        await client.save_state(
            store_name=STATE_STORE_NAME,
            key="counter",
            value=str(count + 1),
            etag=current.etag or None,
        )


reaction = DrasiReaction(on_change_event=on_change_event)


if __name__ == "__main__":
    reaction.start()
