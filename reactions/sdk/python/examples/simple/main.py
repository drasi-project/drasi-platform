import logging

from fastapi import FastAPI

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("simple_python_app")


async def change_event(
    message: ReactionMessage[ChangeEvent, None],
) -> DeliveryOutcome:
    event = message.event
    logger.info(
        "Received change sequence %s for query %s",
        event.sequence,
        event.queryId,
    )
    return DeliveryOutcome.SUCCESS


app = FastAPI()
reaction = DrasiReaction(on_change_event=change_event)
reaction.install(app)
