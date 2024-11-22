""" Defines a `DrasiReaction` class for creating and registering reactions with Python

Typical usage example:
    
    from drasi_reaction.models.ChangeEvent import ChangeEvent

    async def change_func(data: ChangeEvent, query_config: dict[str, Any]):
        print("my custom function")

    dr = DrasiReaction(on_change_event=change_func)

    df.start()
"""

import logging
import os
from io import TextIOWrapper
from pathlib import Path
from typing import Any, Awaitable, Callable

import uvicorn
from dapr.ext.fastapi import DaprApp
from fastapi import FastAPI, Request

from drasi_reaction.logger import config_logging
from drasi_reaction.models.ChangeEvent import ChangeEvent
from drasi_reaction.models.ControlEvent import ControlEvent

AsyncChangeEventFunc = Callable[[ChangeEvent, dict[str, Any] | None], Awaitable[Any]]
AsyncControlEventFunc = Callable[[ControlEvent, dict[str, Any] | None], Awaitable[Any]]


config_logging()

logger = logging.getLogger("reaction.sdk")


class DrasiReaction:
    """Create and register Drasi Reactions for change and control events.

    Attributes:
        on_change_event (AsyncChangeEventFunc): Callback function for handling change events.
        on_control_event (AsyncControlEventFunc | None): Callback function for handling control events.
        parse_query_configs (Callable[[TextIOWrapper], Any] | None): Function to parse query configurations.
        port (int): Port on which the application runs.
    """

    def __init__(
        self,
        on_change_event: AsyncChangeEventFunc,
        on_control_event: AsyncControlEventFunc | None = None,
        parse_query_configs: Callable[[TextIOWrapper], Any] | None = None,
        port: int = 80,
    ) -> None:
        """Initializes the DrasiReaction instance.

        Args:
            on_change_event (AsyncChangeEventFunc): Callback for handling change events.
            on_control_event (AsyncControlEventFunc | None, optional): Callback for handling control events.
                Defaults to None.
            parse_query_configs (Callable[[TextIOWrapper], Any] | None, optional): Function to parse query configurations.
                Defaults to None.
            port (int, optional): Port for the application. Defaults to 80.
        """

        self.on_change_event = on_change_event
        self.on_control_event = on_control_event
        self.parse_query_configs = parse_query_configs
        self.port = port
        self._pubsub_name = os.getenv("PubsubName", "drasi-pubsub")
        self._config_directory = Path(os.getenv("QueryConfigPath", "/etc/queries"))
        self._app = FastAPI()
        self._dapr_app = DaprApp(self._app)
        self._query_configs: dict[str, Any] = {}

    def subscribe(self):
        """Subscribes to queries by reading configuration files and registering handlers."""

        if self._config_directory.is_dir():
            for query_path in self._config_directory.iterdir():
                if query_path.is_file() and not query_path.name.startswith("."):
                    query_id = query_path.stem

                    logger.info(f"subscribing to query `{query_id}`")
                    self.register_handler(query_id)

                    if self.parse_query_configs:
                        with open(query_path, "r") as f:
                            self._query_configs[query_id] = self.parse_query_configs(f)
        else:
            logger.warning(
                f"query directory `{str(self._config_directory)}` does not exist"
            )

    @property
    def query_configs(self):
        """Gets the query configurations.

        Returns:
            dict[str, Any]: The query configurations.
        """

        return self._query_configs

    def start(self):
        """Starts the application by subscribing to queries and running the FastAPI application."""

        try:
            self.subscribe()
            logger.info("starting python reaction app")
            uvicorn.run(self._app, host="0.0.0.0", port=self.port)

        except Exception as err:
            logger.exception("error while running app:", err)
            exit(1)

    def register_handler(self, query_id: str):
        """Registers a Dapr handler for a specific drasi query.

        Args:
            query_id (str): The ID of the query.

        Returns:
            Callable: The registered handler function.
        """

        @self._dapr_app.subscribe(
            pubsub=self._pubsub_name, topic=f"{query_id}-results", route=f"/{query_id}"
        )
        async def handler(context: Request):
            context_body = await context.json()
            data = context_body.get("data", {})

            query_config = self.query_configs.get(data.get("queryId"))

            kind = data.get("kind")
            if kind == "change":
                change_data = ChangeEvent.model_validate(data)
                await self.on_change_event(change_data, query_config)

            if kind == "control" and self.on_control_event:
                control_data = ControlEvent.model_validate(data)
                await self.on_control_event(control_data, query_config)

        return handler
