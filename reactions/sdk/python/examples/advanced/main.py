import logging
from typing import Any

from fastapi import FastAPI

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent
from drasi.reaction.utils import get_config_value, yaml_query_configs


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("advanced_python_app")

connection_string = get_config_value("MyConnectionString")


async def change_event(
    message: ReactionMessage[ChangeEvent, dict[str, Any]],
) -> DeliveryOutcome:
    event = message.event
    query_config = message.query.config

    logger.info(
        "Processing change sequence %s for query %s with greeting %s",
        event.sequence,
        event.queryId,
        query_config.get("greeting") if query_config else None,
    )
    # Use connection_string to send the result changes to the external system.
    return DeliveryOutcome.SUCCESS


async def control_event(
    message: ReactionMessage[ControlEvent, dict[str, Any]],
) -> DeliveryOutcome:
    logger.info(
        "Received control signal %s for query %s",
        message.event.controlSignal.kind,
        message.event.queryId,
    )
    return DeliveryOutcome.SUCCESS


app = FastAPI()
reaction = DrasiReaction[dict[str, Any]](
    on_change_event=change_event,
    on_control_event=control_event,
    parse_query_configs=yaml_query_configs,
)
reaction.install(app)
