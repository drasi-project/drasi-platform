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
            if response.status_code == 408:
                raise TimeoutError(
                    f"Query '{query_id}' did not become ready "
                    f"within {timeout_seconds} seconds."
                )
            response.raise_for_status()
