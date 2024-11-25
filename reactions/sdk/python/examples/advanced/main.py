import logging
from typing import Any

from drasi_reaction.models.ChangeEvent import ChangeEvent
from drasi_reaction.models.ControlEvent import ControlEvent
from drasi_reaction.sdk import DrasiReaction
from drasi_reaction.utils import get_config_value, yaml_query_configs

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("advanced_python_app")


def change_event_wrapper(conn_str: str):

    # conn str can be accessed by the inner function
    logger.info(f"Connection string from the config props: {conn_str}")

    async def change_event(event: ChangeEvent, query_configs: dict[Any, Any] | None):
        logger.info(query_configs)
        logger.info(
            f"Received change sequence {event.sequence} for query {event.queryId}"
        )

        if event.addedResults:
            logger.info(f"Added Results: {event.addedResults}")

        if event.deletedResults:
            logger.info(f"Removed Results: {event.deletedResults}")

        if event.updatedResults:
            logger.info(
                f"Updated Results - before: {event.updatedResults[0].before}, after {event.updatedResults[0].after}"
            )

    return change_event


async def control_event(
    event: ControlEvent, query_configs: dict[Any, Any] | None = None
):
    logger.info(
        f"Received control signal: {event.controlSignal} for query {event.queryId}"
    )


if __name__ == "__main__":
    conn_str = get_config_value("MyConnectionString")

    change_event = change_event_wrapper(conn_str)

    reaction = DrasiReaction(
        on_change_event=change_event,
        on_control_event=control_event,
        parse_query_configs=yaml_query_configs,
    )

    reaction.start()
