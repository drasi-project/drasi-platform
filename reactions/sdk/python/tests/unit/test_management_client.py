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

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from drasi.reaction.management_client import ManagementClient


#helpers

def _mock_http(response_status, response_body):
    """Build a fake aiohttp session + response for testing."""
    mock_resp = MagicMock()
    mock_resp.status = response_status
    mock_resp.json = AsyncMock(return_value=response_body)
    mock_resp.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_resp.__aexit__ = AsyncMock(return_value=False)

    mock_session = MagicMock()
    mock_session.closed = False
    mock_session.get = MagicMock(return_value=mock_resp)
    mock_session.close = AsyncMock()

    return mock_session


#tests

@pytest.mark.asyncio
async def test_resolves_container_id_from_api():
    """Happy path: the API returns a response with spec.container and we parse it out."""
    fake_body = {
        "spec": {
            "container": "query-host-abc",
            "mode": "query",
        }
    }
    mock_session = _mock_http(200, fake_body)

    with patch("drasi.reaction.management_client.aiohttp.ClientSession", return_value=mock_session):
        client = ManagementClient(api_url="http://test-api:9090")
        container = await client.get_query_container_id("my-query")

    assert container == "query-host-abc"
    mock_session.get.assert_called_once_with("http://test-api:9090/v1/continuousQueries/my-query")


@pytest.mark.asyncio
async def test_reuses_session_across_calls():
    """The client should create one session and reuse it, not make a new one each time."""
    fake_body = {"spec": {"container": "host-1"}}
    mock_session = _mock_http(200, fake_body)

    with patch("drasi.reaction.management_client.aiohttp.ClientSession", return_value=mock_session) as mock_ctor:
        client = ManagementClient()
        await client.get_query_container_id("q1")
        await client.get_query_container_id("q2")

    # The constructor should only have been called once, not twice.
    mock_ctor.assert_called_once()
    assert mock_session.get.call_count == 2


@pytest.mark.asyncio
async def test_close_shuts_down_session():
    """Calling close() should close the underlying aiohttp session."""
    fake_body = {"spec": {"container": "host-1"}}
    mock_session = _mock_http(200, fake_body)

    with patch("drasi.reaction.management_client.aiohttp.ClientSession", return_value=mock_session):
        client = ManagementClient()
        await client.get_query_container_id("q1")
        await client.close()

    mock_session.close.assert_awaited_once()


@pytest.mark.asyncio
async def test_raises_on_non_200_status():
    """If the management API returns an error status, we should get a RuntimeError."""
    mock_session = _mock_http(404, {})

    with patch("drasi.reaction.management_client.aiohttp.ClientSession", return_value=mock_session):
        client = ManagementClient()
        with pytest.raises(RuntimeError, match="404"):
            await client.get_query_container_id("nonexistent-query")


@pytest.mark.asyncio
async def test_raises_when_container_field_is_missing():
    """If the response JSON doesn't have spec.container, we should get a ValueError."""
    fake_body = {"spec": {"mode": "query"}}
    mock_session = _mock_http(200, fake_body)

    with patch("drasi.reaction.management_client.aiohttp.ClientSession", return_value=mock_session):
        client = ManagementClient()
        with pytest.raises(ValueError, match="missing spec.container"):
            await client.get_query_container_id("bad-query")


@pytest.mark.asyncio
async def test_raises_when_spec_is_missing_entirely():
    """Edge case: the response has no spec key at all."""
    fake_body = {"metadata": {"name": "oops"}}
    mock_session = _mock_http(200, fake_body)

    with patch("drasi.reaction.management_client.aiohttp.ClientSession", return_value=mock_session):
        client = ManagementClient()
        with pytest.raises(ValueError, match="missing spec.container"):
            await client.get_query_container_id("weird-query")
