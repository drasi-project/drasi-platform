from unittest.mock import AsyncMock, patch, MagicMock
import pytest
from drasi.management_client import ManagementClient


@pytest.mark.asyncio
async def test_get_query_container_id_success():
    client = ManagementClient("http://drasi-api:8080")
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
    client = ManagementClient("http://drasi-api:8080")
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
    client = ManagementClient("http://drasi-api:8080")
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
    client = ManagementClient("http://drasi-api:8080")
    mock_response = MagicMock()
    mock_response.status_code = 408
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(
            return_value=mock_response
        )
        with pytest.raises(TimeoutError, match="query1"):
            await client.wait_for_query_ready("query1", timeout_seconds=5)
