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

# Adapted from Dapr Agents:
# https://github.com/dapr/dapr-agents/blob/29dee4b9418e50f5bb6c0f434a154284accb00d2/dapr_agents/agents/components.py
# https://github.com/dapr/dapr-agents/blob/29dee4b9418e50f5bb6c0f434a154284accb00d2/dapr_agents/storage/daprstores/stateservice.py

import asyncio
import json
import logging
import random
from typing import Any, Callable

from cachetools import LRUCache
from dapr.clients import DaprClient
from dapr.clients.grpc._state import Concurrency, Consistency, StateOptions
from pydantic import BaseModel, ValidationError

from agent_router.stores.base import StateStore, TState

logger = logging.getLogger(__name__)

_ETAG_CACHE_MAXSIZE = 1024


# TODO: make all dapr client calls async
# TODO: standardize error handling (propagate non-runtime exceptions?)
class DaprStateStore(StateStore[TState]):
    """
    Dapr key-value state store for persisting and recovering subscription state.
    Note: Access is not synchronized — callers must synchronize access with their own locks.
    """

    def __init__(
        self,
        *,
        dapr_client: DaprClient,
        state_store_name: str,
        state_model_cls: type[TState],
        state_key_prefix: str | None = None,
        name: str = "drasi-agent-router-dapr-store",
    ) -> None:
        """
        Initialize a DaprStateStore instance.

        Args:
            dapr_client (DaprClient): Injected Dapr client.
            state_store_name (str): The Dapr state store component name.
            state_model_cls (type[TState]): The state model class used for validation. Must not take any required arguments.
            state_key_prefix (str | None): Optional prefix for state keys.
            name (str): The name for the store (used for logging). Defaults to "drasi-agent-router-dapr-store".
        """
        super().__init__(state_model_cls=state_model_cls, state_key_prefix=state_key_prefix, name=name)

        self._dapr_client = dapr_client
        self._state_store_name = state_store_name

        # Per-instance-id etag cache replaces the single _last_etag field.
        self._etag_cache: LRUCache[str, str | None] = LRUCache(
            maxsize=_ETAG_CACHE_MAXSIZE
        )
        self._etag_cache_lock = asyncio.Lock()

        self._save_options = StateOptions(
            concurrency=Concurrency.first_write,
            consistency=Consistency.strong,
        )
        self._max_etag_attempts = 10  # TODO: make this configurable
        self._retry_attempts = max(1, 3)
        self._retry_initial_backoff = max(0.0, 0.1)
        self._retry_backoff_multiplier = max(1.0, 2.0)
        self._retry_jitter = max(0.0, 0.1)


    async def has_key(self, key: str) -> bool:
        """
        Check whether a logical key exists in the backing Dapr state store.

        Args:
            key (str): The logical key for which to check existence (unprefixed).

        Returns:
            bool: True if the key exists, False otherwise.
        """
        state_key = self._normalize_key(key)
        meta = self._state_metadata_for_key(state_key)
        snapshot, _ = await self._load_with_etag(
            key=state_key,
            state_metadata=meta,
        )
        return snapshot is not None


    async def get_state(self, key: str) -> TState:
        """
        Get the state for a given key (read + set in-memory).

        Loads the entry from the store, validates it as the bundle's entry Pydantic model,
        and returns it. Callers should mutate the returned model and then call
        save_state(key, entry=entry) to persist it.

        The etag is cached per state-store key so that a subsequent save_state can skip
        an extra round-trip.

        Args:
            key: The logical key for which to get the state (unprefixed).

        Returns:
            A copy of the state, or a default instance if not found.
        """
        state_key = self._normalize_key(key)
        meta = self._state_metadata_for_key(state_key)

        try:
            snapshot, etag = await self._load_with_etag(
                key=state_key,
                state_metadata=meta,
            )
        except RuntimeError as exc:
            logger.warning(
                "Invalid state encountered (%s); returning default entry.", exc
            )
            return self._default_state_model_factory()

        if snapshot is None:
            return self._default_state_model_factory()

        async with self._etag_cache_lock:
            self._etag_cache[state_key] = etag

        try:
            if isinstance(snapshot, dict):
                return self._state_model_cls.model_validate(snapshot)
            raise TypeError(f"Unexpected state snapshot type {type(snapshot)}")
        except (ValidationError, TypeError) as exc:
            logger.warning(
                "Invalid state encountered (%s); returning default entry.", exc
            )

        return self._default_state_model_factory()


    async def save_state(
        self,
        key: str,
        value: TState,
    ) -> None:
        """
        Persist the current state with optimistic concurrency.

        No-op when no state store is configured. Uses load_with_etag + save(etag=...)
        with a short retry loop to avoid lost updates under contention.

        Args:
            key: The logicalkey for which to save the state (unprefixed).
            value: The state value to persist.
        """
        if not key:
            raise ValueError(
                "key must be provided to save state"
            )

        state_key = self._normalize_key(key)
        meta = self._state_metadata_for_key(state_key)
        attempts = max(1, min(self._max_etag_attempts, 10))

        value = value.model_dump(mode="json")

        # Use the per-key cached etag from a prior get_state when available to avoid
        # an extra round-trip. Falls back to load_with_etag on the first
        # attempt when no cached etag exists, and always on retries.
        async with self._etag_cache_lock:
            etag = self._etag_cache.pop(state_key, None)

        if etag is None:
            # No cached etag — ensure the document exists so we get one.
            try:
                current, etag = await self._load_with_etag(
                    key=state_key,
                    state_metadata=meta,
                )
                if etag is None:
                    # Initialize to get an etag
                    await self._save(
                        key=state_key,
                        value=current if isinstance(current, dict) else value,
                        etag=None,
                        state_metadata=meta,
                        state_options=self._save_options,
                    )
                    _, etag = await self._load_with_etag(
                        key=state_key,
                        state_metadata=meta,
                    )
            except Exception:
                logger.exception(
                    "Failed to initialize state document for key '%s'.", state_key
                )

        for attempt in range(1, attempts + 1):
            try:
                if etag is None:
                    # Shouldn't happen normally, but recover gracefully.
                    _, etag = await self._load_with_etag(
                        key=state_key,
                        state_metadata=meta,
                    )
                await self._save(
                    key=state_key,
                    value=value,
                    etag=etag,
                    state_metadata=meta,
                    state_options=self._save_options,
                )
                return
            except Exception as exc:  # noqa: BLE001
                logger.warning(
                    "Conflict during state save (attempt %d/%d) for '%s': %s",
                    attempt,
                    attempts,
                    state_key,
                    exc,
                )
                if attempt == attempts:
                    logger.exception(
                        "Failed to persist state after %d attempts.", attempts
                    )
                    return
                # Refresh etag for next retry.
                etag = None
                await asyncio.sleep(min(0.25 * attempt, 1.0) * (1 + random.uniform(0, 0.25)))


    async def purge_state(self, key: str) -> None:
        """
        Permanently delete state for the given key from the state store.

        Args:
            key: The logical key whose state to delete (unprefixed).
        """
        if not key:
            raise ValueError(
                "key must be provided to purge state"
            )

        state_key = self._normalize_key(key)
        meta = self._state_metadata_for_key(state_key)
        try:
            await self._delete(key=state_key, state_metadata=meta)
            logger.info(
                "Purged state for key=%s", state_key
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                "Failed to purge state for key=%s: %s",
                state_key,
                exc,
            )
        finally:
            # Drop any cached etag for this instance so teardown reclaims the slot
            # even when a read-only get_state left an entry behind.
            async with self._etag_cache_lock:
                self._etag_cache.pop(state_key, None)


    def _state_metadata_for_key(self, key: str) -> dict[str, str]:
        """Return Dapr state metadata including partition key."""
        meta = {"contentType": "application/json"}
        meta["partitionKey"] = key
        return meta


    def _ensure_dict(self, value: Any) -> dict[str, Any]:
        """
        Coerce value into a dict.

        Accepts:
            - dict (returned as-is)
            - pydantic BaseModel (dumped)
            - JSON str (parsed to dict)
            - JSON bytes (decoded to str, parsed to dict)
        """
        if isinstance(value, BaseModel):
            return value.model_dump()
        if isinstance(value, dict):
            return value
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
            except json.JSONDecodeError as exc:
                raise RuntimeError(f"State string is not valid JSON: {exc}") from exc
            if not isinstance(parsed, dict):
                raise RuntimeError(f"Expected dict JSON, got {type(parsed)}")
            return parsed
        if isinstance(value, bytes):
            return self._ensure_dict(value.decode("utf-8"))
        raise RuntimeError(
            f"Unsupported state type: {type(value)}. Expected dict, BaseModel, str, or bytes."
        )


    def _validate_model(
        self, payload: dict[str, Any], *, return_model: bool = False
    ) -> dict[str, Any] | BaseModel:
        """Validate payload with configured Pydantic model (if any)."""
        if not self._state_model_cls:
            return payload
        try:
            parsed = self._state_model_cls(**payload)
        except ValidationError as exc:
            raise RuntimeError(f"State validation failed: {exc.errors()}") from exc
        return parsed if return_model else parsed.model_dump()


    def _coerce_state_options(
        self,
        state_options: StateOptions | dict[str, Any] | None,
    ) -> StateOptions | None:
        """
        Convert a dict of state options into a `StateOptions` instance, or pass
        through an existing `StateOptions`.

        Args:
            state_options: None, a dict matching `StateOptions` fields, or a `StateOptions`.

        Returns:
            A `StateOptions` instance or None.
        """
        if state_options is None:
            return None

        # Prefer explicit dict detection first; newer typing helpers may wrap StateOptions
        # in `typing.NewType`/Union-style aliases that `isinstance` cannot handle.
        if isinstance(state_options, dict):
            return StateOptions(**state_options)

        # Fallback: treat any object exposing the expected attributes as StateOptions-like.
        if hasattr(state_options, "consistency") and hasattr(state_options, "concurrency"):
            return state_options

        # When annotations or typing aliases wrap the class, fall back to constructing one.
        return StateOptions(**dict(state_options))


    async def _load_with_etag(
        self,
        *,
        key: str,
        state_metadata: dict[str, str] | None = None,
        return_model: bool = False,
    ) -> tuple[dict[str, Any] | BaseModel | None, str | None]:
        """
        Load a JSON dict and return `(payload, etag)`.

        Args:
            key: Fully qualified key.
            state_metadata: Optional Dapr metadata.
            return_model: If True and model configured, return model instance.

        Returns:
            (dict | BaseModel | None, etag | None)

        Raises:
            RuntimeError: If the state cannot be loaded or is invalid.
        """
        logger.debug(
            "Loading state with etag from %s key=%s", self._state_store_name, key
        )

        def call() -> Any:
            return self._dapr_client.get_state(
                store_name=self._state_store_name,
                key=key,
                state_metadata=state_metadata,
            )

        try:
            response = await self._with_retries(call)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(
                f"Failed to load state for key '{key}': {exc}"
            ) from exc

        if not response or not getattr(response, "data", None):
            return None, None

        try:
            state_data = response.json()
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(
                f"State for key '{key}' is not valid JSON: {exc}"
            ) from exc

        if not isinstance(state_data, dict):
            raise RuntimeError(
                f"State for key '{key}' must be a dict, got {type(state_data)}"
            )

        payload = self._validate_model(state_data, return_model=return_model)
        etag = getattr(response, "etag", None)
        return payload, etag


    async def _save(
        self,
        *,
        key: str,
        value: Any,
        etag: str | None = None,
        state_metadata: dict[str, str] | None = None,
        state_options: dict[str, Any] | None = None,
        ttl_in_seconds: int | None = None,
    ) -> None:
        """
        Save a JSON payload under a key.

        Args:
            key: Fully qualified key.
            value: dict | BaseModel | JSON str | JSON bytes.
            etag: Optional ETag for optimistic concurrency.
            state_metadata: Optional Dapr metadata.
            state_options: Dict of `StateOptions` fields (or a `StateOptions` instance).
            ttl_in_seconds: Optional TTL; backend must support TTL via metadata.

        Raises:
            RuntimeError: If the state cannot be saved.
        """
        payload_dict = self._ensure_dict(value)
        payload_str = json.dumps(payload_dict)

        metadata = dict(state_metadata or {})
        if ttl_in_seconds is not None:
            metadata.setdefault("ttlInSeconds", str(ttl_in_seconds))

        logger.debug(
            "Saving state to %s key=%s etag=%s ttl=%s",
            self._state_store_name,
            key,
            etag,
            ttl_in_seconds,
        )

        def call() -> None:
            self._dapr_client.save_state(
                store_name=self._state_store_name,
                key=key,
                value=payload_str,
                etag=etag,
                options=self._coerce_state_options(state_options),
                state_metadata=metadata or None,
            )

        try:
            await self._with_retries(call)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(
                f"Failed to save state for key '{key}': {exc}"
            ) from exc


    async def _delete(
        self,
        *,
        key: str,
        etag: str | None = None,
        state_metadata: dict[str, str] | None = None,
        state_options: dict[str, Any] | None = None,
    ) -> None:
        """
        Delete a key.

        Args:
            key: Fully qualified key.
            etag: Optional ETag for concurrency.
            state_metadata: Optional Dapr metadata.
            state_options: Dict or `StateOptions` controlling delete behavior.

        Raises:
            RuntimeError: If the state cannot be deleted.
        """
        logger.debug(
            "Deleting state from %s key=%s etag=%s", self._state_store_name, key, etag
        )

        def call() -> None:
            self._dapr_client.delete_state(
                store_name=self._state_store_name,
                key=key,
                etag=etag,
                options=self._coerce_state_options(state_options),
                state_metadata=state_metadata,
            )

        try:
            await self._with_retries(call)
        except Exception as exc:  # noqa: BLE001
            # TODO: throw more specific exception
            raise RuntimeError(
                f"Failed to delete state for key '{key}': {exc}"
            ) from exc


    async def _with_retries(self, func: Callable[[], Any]) -> Any:
        """Execute a callable with retry/backoff/jitter."""
        delay = self._retry_initial_backoff
        attempt = 0
        while True:
            try:
                return func()
            except Exception as exc:  # noqa: BLE001
                attempt += 1
                if attempt >= self._retry_attempts:
                    raise
                sleep_for = delay * (
                    1 + random.uniform(-self._retry_jitter, self._retry_jitter)
                )
                if sleep_for > 0:
                    await asyncio.sleep(max(0.0, sleep_for))
                delay *= self._retry_backoff_multiplier
                logger.debug(
                    "Retrying state operation after error: %s", exc, exc_info=True
                )
