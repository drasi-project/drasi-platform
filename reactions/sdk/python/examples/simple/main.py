import logging
from typing import Any

from drasi_reaction.models.ChangeEvent import ChangeEvent
from drasi_reaction.models.ControlEvent import ControlEvent
from drasi_reaction.sdk import DrasiReaction
from drasi_reaction.utils import yaml_query_configs

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("simple_python_app")


async def change_event(data: ChangeEvent, query_configs: dict[Any, Any] | None = None):
    logger.info(f"handling change event")
    logger.info(data)


async def control_event(
    data: ControlEvent, query_configs: dict[Any, Any] | None = None
):
    logger.info(f"handling control event")
    logger.info(data)


if __name__ == "__main__":
    reaction = DrasiReaction(
        on_change_event=change_event,
        on_control_event=control_event,
        parse_query_configs=yaml_query_configs,
    )

    reaction.start()
