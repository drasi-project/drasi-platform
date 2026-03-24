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

"""Client for the Drasi management API."""

from typing import Protocol, runtime_checkable

import aiohttp

from drasi.reaction.logger import config_logging

logger = config_logging()

# Internal cluster address where the Drasi API lives.
DRASI_API_BASE = "http://drasi-api:8080"


@runtime_checkable
class ManagementClientBase(Protocol):
    """Protocol matching IManagementClient from the .NET and JavaScript SDKs.

    Any object with a compatible get_query_container_id method satisfies
    this protocol — no inheritance required.
    """

    async def get_query_container_id(self, query_id: str) -> str: ...


class ManagementClient:
    """Talks to the Drasi management API to look up query metadata.

    Currently the only thing reactions need from the management API is
    the container ID that hosts a given continuous query — we need that
    to know which view service instance to connect to.

    A single HTTP session is reused across calls for efficiency. Call
    close() when you're done, or let it be cleaned up on process exit.
    """

    def __init__(self, api_url: str = DRASI_API_BASE):
        self._api_url = api_url
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

    async def get_query_container_id(self, query_id: str) -> str:
        """Find out which container is running a given continuous query.

        Hits GET /v1/continuousQueries/{query_id} and pulls the container
        name from spec.container in the response body.

        Raises:
            RuntimeError: If the API returns a non-200 status.
            ValueError: If the response doesn't include a container ID.
        """
        endpoint = f"{self._api_url}/v1/continuousQueries/{query_id}"
        session = self._get_session()

        async with session.get(endpoint) as resp:
            if resp.status != 200:
                raise RuntimeError(
                    f"Management API returned {resp.status} for query '{query_id}'"
                )
            body = await resp.json()

        container_id = body.get("spec", {}).get("container")
        if not container_id:
            raise ValueError(
                f"Response for query '{query_id}' is missing spec.container"
            )

        return container_id
