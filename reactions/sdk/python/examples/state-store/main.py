import os

from dapr.aio.clients import DaprClient
from fastapi import FastAPI

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent

STATE_STORE_NAME = os.environ["StateStoreName"]


async def on_change_event(
    _message: ReactionMessage[ChangeEvent, None],
) -> DeliveryOutcome:
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

    return DeliveryOutcome.SUCCESS


app = FastAPI()
reaction = DrasiReaction(on_change_event=on_change_event)
reaction.install(app)
