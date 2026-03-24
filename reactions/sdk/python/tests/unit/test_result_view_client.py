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

import json

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from drasi.reaction.management_client import ManagementClient
from drasi.reaction.result_view_client import ResultViewClient
from drasi.reaction.models.ViewItem import ViewItem
from drasi.reaction.models.Header import Header
from drasi.reaction.models.Data import Data


#helpers

class FakeAsyncReader:
    """Pretends to be an aiohttp StreamReader for testing.

    ijson.items_async calls `await f.read(buf_size)` in a loop until
    it gets empty bytes, so all we need is an async read() method
    that drains a byte buffer.
    """

    def __init__(self, data: bytes):
        self._buf = data
        self._pos = 0

    async def read(self, n: int = -1) -> bytes:
        if self._pos >= len(self._buf):
            return b""
        if n < 0:
            chunk = self._buf[self._pos:]
            self._pos = len(self._buf)
        else:
            chunk = self._buf[self._pos:self._pos + n]
            self._pos += n
        return chunk


def _mock_view_response(status, payload_bytes=b""):
    """Build a fake aiohttp session whose GET returns the given bytes as a stream."""
    mock_resp = MagicMock()
    mock_resp.status = status
    mock_resp.reason = "OK" if status == 200 else "Error"
    mock_resp.content = FakeAsyncReader(payload_bytes)
    mock_resp.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_resp.__aexit__ = AsyncMock(return_value=False)

    mock_session = MagicMock()
    mock_session.closed = False
    mock_session.get = MagicMock(return_value=mock_resp)
    mock_session.close = AsyncMock()

    return mock_session


#tests

@pytest.mark.asyncio
async def test_streams_header_and_data_items():
    """Feed a JSON array with one header and two data rows through ijson,
    and make sure we get the right ViewItem objects back."""
    payload = json.dumps([
        {"header": {"sequence": 5, "timestamp": 1700000000}},
        {"data": {"name": "Alice", "score": 42}},
        {"data": {"name": "Bob", "score": 99}},
    ]).encode()

    mock_session = _mock_view_response(200, payload)
    mock_mgmt = AsyncMock(spec=ManagementClient)

    with patch("drasi.reaction.result_view_client.aiohttp.ClientSession", return_value=mock_session):
        client = ResultViewClient(mock_mgmt)
        items = []
        async for view_item in client.get_current_result("q1", query_container_id="host-xyz"):
            items.append(view_item)

    assert len(items) == 3

    # First should be a Header
    first = items[0].root
    assert isinstance(first, Header)
    assert first.header.sequence == 5
    assert first.header.timestamp == 1700000000

    # Next two should be Data rows
    for i, expected_name in enumerate(["Alice", "Bob"], start=1):
        row = items[i].root
        assert isinstance(row, Data)
        assert row.data.root["name"] == expected_name


@pytest.mark.asyncio
async def test_resolves_container_via_management_client():
    """When query_container_id is not given, we should call the management
    client to figure it out before hitting the view service."""
    payload = json.dumps([
        {"header": {"sequence": 1, "timestamp": 1000}},
    ]).encode()

    mock_session = _mock_view_response(200, payload)
    mock_mgmt = AsyncMock(spec=ManagementClient)
    mock_mgmt.get_query_container_id.return_value = "resolved-host"

    with patch("drasi.reaction.result_view_client.aiohttp.ClientSession", return_value=mock_session):
        client = ResultViewClient(mock_mgmt)
        items = []
        async for view_item in client.get_current_result("q1"):
            items.append(view_item)

    # Check that we asked the management client for the container
    mock_mgmt.get_query_container_id.assert_awaited_once_with("q1")

    # And that we hit the right URL
    mock_session.get.assert_called_once_with("http://resolved-host-view-svc/q1")

    assert len(items) == 1


@pytest.mark.asyncio
async def test_reuses_session_across_calls():
    """The client should create one session and reuse it, not make a new one each time."""
    payload = json.dumps([{"header": {"sequence": 1, "timestamp": 1000}}]).encode()

    mock_session = _mock_view_response(200, payload)
    mock_mgmt = AsyncMock(spec=ManagementClient)

    with patch("drasi.reaction.result_view_client.aiohttp.ClientSession", return_value=mock_session) as mock_ctor:
        client = ResultViewClient(mock_mgmt)

        async for _ in client.get_current_result("q1", query_container_id="host-a"):
            pass

        # Need a fresh reader for the second call since the first one is exhausted.
        mock_resp_2 = MagicMock()
        mock_resp_2.status = 200
        mock_resp_2.content = FakeAsyncReader(payload)
        mock_resp_2.__aenter__ = AsyncMock(return_value=mock_resp_2)
        mock_resp_2.__aexit__ = AsyncMock(return_value=False)
        mock_session.get = MagicMock(return_value=mock_resp_2)

        async for _ in client.get_current_result("q2", query_container_id="host-a"):
            pass

    # Session constructor called once, but two requests went through.
    mock_ctor.assert_called_once()


@pytest.mark.asyncio
async def test_close_shuts_down_session():
    """Calling close() should close the underlying aiohttp session."""
    payload = json.dumps([{"header": {"sequence": 1, "timestamp": 1000}}]).encode()
    mock_session = _mock_view_response(200, payload)
    mock_mgmt = AsyncMock(spec=ManagementClient)

    with patch("drasi.reaction.result_view_client.aiohttp.ClientSession", return_value=mock_session):
        client = ResultViewClient(mock_mgmt)
        async for _ in client.get_current_result("q1", query_container_id="host-a"):
            pass
        await client.close()

    mock_session.close.assert_awaited_once()


@pytest.mark.asyncio
async def test_yields_nothing_on_non_200():
    """If the view service returns an error, we should just log it and
    yield nothing instead of blowing up."""
    mock_session = _mock_view_response(500)
    mock_mgmt = AsyncMock(spec=ManagementClient)

    with patch("drasi.reaction.result_view_client.aiohttp.ClientSession", return_value=mock_session):
        client = ResultViewClient(mock_mgmt)
        items = []
        async for view_item in client.get_current_result("q1", query_container_id="host-xyz"):
            items.append(view_item)

    assert items == []


@pytest.mark.asyncio
async def test_yields_nothing_when_container_lookup_fails():
    """If the management client throws, we should log and yield nothing."""
    mock_mgmt = AsyncMock(spec=ManagementClient)
    mock_mgmt.get_query_container_id.side_effect = RuntimeError("API is down")

    client = ResultViewClient(mock_mgmt)
    items = []
    async for view_item in client.get_current_result("q1"):
        items.append(view_item)

    assert items == []


@pytest.mark.asyncio
async def test_empty_result_set():
    """An empty JSON array should yield zero items without errors."""
    payload = b"[]"
    mock_session = _mock_view_response(200, payload)
    mock_mgmt = AsyncMock(spec=ManagementClient)

    with patch("drasi.reaction.result_view_client.aiohttp.ClientSession", return_value=mock_session):
        client = ResultViewClient(mock_mgmt)
        items = []
        async for view_item in client.get_current_result("q1", query_container_id="host-xyz"):
            items.append(view_item)

    assert items == []
