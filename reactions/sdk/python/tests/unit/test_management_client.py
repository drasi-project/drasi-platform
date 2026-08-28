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
from unittest.mock import AsyncMock, patch, MagicMock
import pytest
from drasi.reaction.management_client import ManagementClient


@pytest.mark.asyncio
async def test_get_query_container_id_success():
    client = ManagementClient("http://fake-drasi-api:8080")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"spec": {"container": "default"}}
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(
            return_value=mock_response
        )
        result = await client.get_query_container_id("query1")

    assert result == "default"


@pytest.mark.asyncio
async def test_get_query_container_id_missing_field():
    client = ManagementClient("http://fake-drasi-api:8080")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"spec": {}}
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(
            return_value=mock_response
        )
        with pytest.raises(ValueError, match="container ID not found"):
            await client.get_query_container_id("query1")


@pytest.mark.asyncio
async def test_wait_for_query_ready_success():
    client = ManagementClient("http://fake-drasi-api:8080")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(
            return_value=mock_response
        )
        await client.wait_for_query_ready("query1")


@pytest.mark.asyncio
async def test_wait_for_query_ready_timeout():
    client = ManagementClient("http://fake-drasi-api:8080")
    mock_response = MagicMock()
    mock_response.status_code = 503
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(
            return_value=mock_response
        )
        with pytest.raises(TimeoutError, match="query1"):
            await client.wait_for_query_ready("query1", timeout_seconds=5)
@pytest.mark.asyncio
async def test_wait_for_query_ready_not_found():
    client = ManagementClient("http://fake-drasi-api:8080")
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(
            return_value=mock_response
        )
        with pytest.raises(ValueError, match="not found"):
            await client.wait_for_query_ready("query1")
