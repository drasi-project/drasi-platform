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

"""Client for streaming current query results from the Drasi view service."""

from typing import AsyncGenerator, Protocol, runtime_checkable

import aiohttp
import ijson

from drasi.reaction.logger import config_logging
from drasi.reaction.management_client import ManagementClientBase
from drasi.reaction.models.ViewItem import ViewItem

logger = config_logging()


@runtime_checkable
class ResultViewClientBase(Protocol):
    """Protocol matching IResultViewClient from the .NET and JavaScript SDKs.

    Any object with a compatible get_current_result method satisfies
    this protocol — no inheritance required.
    """

    def get_current_result(
        self,
        query_id: str,
        *,
        query_container_id: str | None = None,
    ) -> AsyncGenerator[ViewItem, None]: ...


class ResultViewClient:
    """Streams the live result set for a continuous query.

    The view service returns results as a JSON array that can be quite
    large. Rather than downloading and parsing the whole thing at once,
    we use ijson to walk through the array incrementally — each ViewItem
    is yielded to the caller as soon as it's parsed off the wire, keeping
    memory usage constant regardless of how many results come back.

    A single HTTP session is reused across calls for efficiency. Call
    close() when you're done, or let it be cleaned up on process exit.

    Cancellation works via normal Python async patterns — the caller can
    break out of the ``async for`` loop, cancel the task, or wrap the
    call in ``asyncio.timeout()``. In all cases the underlying HTTP
    connection is cleaned up automatically.
    """

    def __init__(self, management_client: ManagementClientBase):
        self._management_client = management_client
        self._session: aiohttp.ClientSession | None = None

    def _get_session(self) -> aiohttp.ClientSession:
        """Return the shared HTTP session, creating it on first use."""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session

    async def close(self):
        """Shut down the underlying HTTP session."""
        if self._session and not self._session.closed:
            await self._session.close()

    async def get_current_result(
        self,
        query_id: str,
        *,
        query_container_id: str | None = None,
    ) -> AsyncGenerator[ViewItem, None]:
        """Stream every ViewItem in a query's current result set.

        Pass query_container_id if you already know which container hosts
        the query. Otherwise we'll ask the management API to resolve it.

        Yields:
            ViewItem — either a Header (metadata about the snapshot) or
            a Data record (one row of actual results).
        """
        # If the caller didn't tell us which container, look it up.
        if query_container_id is None:
            try:
                query_container_id = await self._management_client.get_query_container_id(query_id)
            except Exception as err:
                logger.error("Couldn't resolve container for query '%s': %s", query_id, err)
                return

        view_url = f"http://{query_container_id}-view-svc/{query_id}"

        try:
            session = self._get_session()
            async with session.get(view_url) as resp:
                if resp.status != 200:
                    logger.error(
                        "View service returned %d for %s: %s",
                        resp.status, view_url, resp.reason,
                    )
                    return

                # 'item' is ijson's prefix for each top-level element in
                # a JSON array. items_async reads from the async stream
                # chunk by chunk so we never hold the full body in memory.
                async for raw_item in ijson.items_async(resp.content, "item"):
                    yield ViewItem.model_validate(raw_item)

        except aiohttp.ClientError as err:
            logger.error("Connection error while streaming from %s: %s", view_url, err)
