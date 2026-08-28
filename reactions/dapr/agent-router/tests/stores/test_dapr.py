#
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
#

"""Tests for DaprStateStore public methods, including client reads, writes, deletes, and validation fallback."""

import json
from dataclasses import dataclass
from unittest.mock import Mock

import pytest
from pydantic import BaseModel, field_validator

from agent_router.stores import DaprStateStore


@dataclass
class _FakeDaprStateResponse:
    """Stand in for the Dapr get_state response object."""

    payload: dict
    etag: str | None = "etag-1"

    @property
    def data(self) -> bytes:
        return json.dumps(self.payload).encode("utf-8")

    def json(self) -> dict:
        return self.payload


class MockDaprClient:
    """Mock DaprClient that maintains an internal dict with mocked state methods."""

    def __init__(self) -> None:
        """Initialize the fake client and wire mocked Dapr state methods."""
        self.state: dict[str, dict] = {}
        self.get_state = Mock(side_effect=self._get_state)
        self.save_state = Mock(side_effect=self._save_state)
        self.delete_state = Mock(side_effect=self._delete_state)

    def _get_state(self, *, store_name, key, state_metadata=None, **kwargs):
        """Return a Dapr-like state response for the requested key."""
        payload = self.state.get(key)
        if payload is None:
            return Mock(data=None, etag=None, json=lambda: {})
        return _FakeDaprStateResponse(payload=payload)

    def _save_state(self, *, store_name, key, value, state_metadata=None, state_options=None, **kwargs):
        """Persist the JSON payload into the in-memory backing dict."""
        if isinstance(value, (bytes, bytearray)):
            payload = json.loads(value.decode("utf-8"))
        elif isinstance(value, str):
            payload = json.loads(value)
        else:
            payload = value

        self.state[key] = payload
        return None

    def _delete_state(self, *, store_name, key, etag=None, options=None, state_metadata=None, **kwargs):
        """Remove a state entry from the in-memory backing dict."""
        self.state.pop(key, None)
        return None


class _ValidatedState(BaseModel):
    """Pydantic model used to exercise validation success and failure branches."""

    count: int = 0
    label: str = "unset"

    @field_validator("count")
    @classmethod
    def _count_must_be_non_negative(cls, value: int) -> int:
        """Reject negative values so get_state can exercise the validation fallback."""
        if value < 0:
            raise ValueError("count must be non-negative")
        return value


def _make_dapr_store(
    *,
    client: MockDaprClient | None = None,
    state_key_prefix: str | None = None,
) -> tuple[DaprStateStore[_ValidatedState], MockDaprClient]:
    """Create a Dapr state store and its mock client for each test."""
    dapr_client = client if client is not None else MockDaprClient()
    store = DaprStateStore(
        dapr_client=dapr_client,
        state_store_name="test-store",
        state_model_cls=_ValidatedState,
        state_key_prefix=state_key_prefix,
    )
    return store, dapr_client


def _seed_etag_cache(store: DaprStateStore[_ValidatedState], *, key: str, etag: str) -> None:
    """Seed the store's cached ETag so purge_state can exercise the cleanup path."""
    store._etag_cache[key] = etag


@pytest.mark.asyncio
async def test_has_key_returns_false_when_key_is_missing() -> None:
    """Verify has_key returns False when the backing Dapr state has no record."""
    store, _ = _make_dapr_store()

    assert await store.has_key("query-1") is False


@pytest.mark.asyncio
async def test_has_key_returns_true_when_state_exists() -> None:
    """Verify has_key returns True when the backing Dapr state contains a record."""
    store, client = _make_dapr_store()
    client.state["query-1"] = {"count": 1, "label": "ready"}

    assert await store.has_key("query-1") is True


@pytest.mark.asyncio
async def test_get_state_returns_default_model_when_key_is_missing() -> None:
    """Verify get_state returns the default model when the key is absent."""
    store, _ = _make_dapr_store()

    state = await store.get_state("query-1")

    assert state == _ValidatedState()


@pytest.mark.asyncio
async def test_get_state_returns_validated_model_when_state_exists() -> None:
    """Verify get_state returns the persisted model when the payload validates."""
    store, client = _make_dapr_store(state_key_prefix="Tenant-")
    client.state["tenant-query-1"] = {"count": 2, "label": "active"}

    state = await store.get_state("QUERY-1")

    assert state == _ValidatedState(count=2, label="active")


@pytest.mark.asyncio
async def test_get_state_returns_default_model_when_validation_fails() -> None:
    """Verify get_state falls back to the default model for invalid persisted payloads."""
    store, client = _make_dapr_store()
    client.state["query-1"] = {"count": -1, "label": "invalid"}

    state = await store.get_state("query-1")

    assert state == _ValidatedState()


@pytest.mark.asyncio
async def test_save_state_persists_new_state_and_serializes_json() -> None:
    """Verify save_state writes JSON payloads into the Dapr client."""
    store, client = _make_dapr_store()
    expected = _ValidatedState(count=7, label="ready")

    await store.save_state("query-1", expected)

    assert client.state["query-1"] == expected.model_dump(mode="json")
    assert client.save_state.call_args.kwargs["store_name"] == "test-store"
    assert client.save_state.call_args.kwargs["key"] == "query-1"
    assert client.save_state.call_args.kwargs["value"] == json.dumps(expected.model_dump(mode="json"))
    assert client.save_state.call_args.kwargs["state_metadata"] == {
        "contentType": "application/json",
        "partitionKey": "query-1",
    }


@pytest.mark.asyncio
async def test_save_state_uses_cached_etag_after_seeded_cache() -> None:
    """Verify save_state reuses a cached etag that was already seeded in the cache."""
    store, client = _make_dapr_store(state_key_prefix="Tenant-")
    client.state["tenant-query-1"] = {"count": 1, "label": "existing"}

    _seed_etag_cache(store, key="tenant-query-1", etag="etag-1")
    client.save_state.reset_mock()

    expected = _ValidatedState(count=3, label="updated")
    await store.save_state("QUERY-1", expected)

    assert client.save_state.call_count == 1
    assert client.save_state.call_args.kwargs["etag"] == "etag-1"
    assert client.save_state.call_args.kwargs["key"] == "tenant-query-1"
    assert client.state["tenant-query-1"] == expected.model_dump(mode="json")


@pytest.mark.asyncio
async def test_save_state_rejects_empty_key() -> None:
    """Verify save_state rejects an empty logical key."""
    store, _ = _make_dapr_store()

    with pytest.raises(ValueError, match="key must be provided to save state"):
        await store.save_state("", _ValidatedState())


@pytest.mark.asyncio
async def test_purge_state_deletes_existing_state_and_clears_cached_etag() -> None:
    """Verify purge_state deletes the record and clears any cached etag."""
    store, client = _make_dapr_store()
    client.state["query-1"] = {"count": 4, "label": "to-delete"}

    _seed_etag_cache(store, key="query-1", etag="etag-1")
    client.delete_state.reset_mock()

    await store.purge_state("query-1")

    assert client.delete_state.call_count == 1
    assert client.delete_state.call_args.kwargs["store_name"] == "test-store"
    assert client.delete_state.call_args.kwargs["key"] == "query-1"
    assert "query-1" not in client.state


@pytest.mark.asyncio
async def test_purge_state_is_noop_when_key_is_missing() -> None:
    """Verify purge_state does not fail when the key is already absent."""
    store, client = _make_dapr_store()

    await store.purge_state("missing-query")

    assert client.delete_state.call_count == 1
    assert client.delete_state.call_args.kwargs["key"] == "missing-query"
    assert client.state == {}


@pytest.mark.asyncio
async def test_purge_state_rejects_empty_key() -> None:
    """Verify purge_state rejects an empty logical key."""
    store, _ = _make_dapr_store()

    with pytest.raises(ValueError, match="key must be provided to purge state"):
        await store.purge_state("")
