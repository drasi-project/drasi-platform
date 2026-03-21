# Copyright 2024 The Drasi Authors.
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
import os
import httpx


class ManagementClient:

    def __init__(self, management_api_url=None):
        self._management_api_url = (
            management_api_url
            or os.environ.get("MANAGEMENT_API_URL", "http://drasi-api:8080")
        ).rstrip("/")

    async def get_query_container_id(self, query_id: str) -> str:
        url = f"{self._management_api_url}/v1/continuousQueries/{query_id}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            body = response.json()
            try:
                container_id = body["spec"]["container"]
            except (KeyError, TypeError):
                raise ValueError(
                    f"container ID not found for query '{query_id}'"
                )
            return container_id

    async def wait_for_query_ready(self, query_id: str, timeout_seconds: int = 30) -> None:
        url = (
            f"{self._management_api_url}"
            f"/v1/continuousQueries/{query_id}"
            f"/ready-wait?timeout={timeout_seconds}"
        )
        async with httpx.AsyncClient(timeout=timeout_seconds + 5) as client:
            response = await client.get(url)
            if response.status_code == 503:
                raise TimeoutError(
                    f"Query '{query_id}' did not become ready "
                    f"within {timeout_seconds} seconds."
                )
            if response.status_code == 404:
                raise ValueError(f"Query '{query_id}' not found.")

            response.raise_for_status()
