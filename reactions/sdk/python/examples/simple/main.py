import logging
from typing import Any

from drasi_reaction.models.ChangeEvent import ChangeEvent
from drasi_reaction.sdk import DrasiReaction

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("simple_python_app")


async def change_event(event: ChangeEvent, query_configs: dict[Any, Any] | None = None):
    logger.info(f"Received change sequence {event.sequence} for query {event.queryId}")
    logger.info(event)


if __name__ == "__main__":
    reaction = DrasiReaction(
        on_change_event=change_event,
    )

    reaction.start()
