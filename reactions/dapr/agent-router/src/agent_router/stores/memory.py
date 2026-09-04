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

from cachetools import LRUCache

from agent_router.stores.base import StateStore, TState


# TODO: look into TTL cache for subscription refresh
class InMemoryStateStore(StateStore[TState]):
    """
    In-memory key-value state store for all subscription reads and writes.
    Note: Access is not synchronized — callers must synchronize access with their own locks.
    """

    def __init__(
        self,
        *,
        state_model_cls: type[TState],
        state_key_prefix: str | None = None,
        name: str = "drasi-agent-router-memory-store",
    ) -> None:
        """
        Initialize an InMemoryStateStore instance.

        Args:
            state_model_cls (type[TState]): The state model class used for validation. Must not take any required arguments.
            state_key_prefix (str | None): Optional prefix for state keys.
            name (str): The name for the store (used for logging). Defaults to "drasi-agent-router-memory-store".
        """
        super().__init__(state_model_cls=state_model_cls, state_key_prefix=state_key_prefix, name=name)

        self._store: LRUCache[str, str | None] = LRUCache(maxsize=1024)  # TODO: make this configurable


    async def has_key(self, key: str) -> bool:
        """
        Check whether the given key exists in the store.

        Args:
            key (str): The key to check.

        Returns:
            bool: True if the key exists, False otherwise.
        """
        state_key = self._normalize_key(key)
        return state_key in self._store


    async def get_state(self, key: str) -> TState:
        """
        Retrieve the state associated with the given key.

        Args:
            key (str): The key for which to retrieve the state.

        Returns:
            TState: A copy of the state associated with the key, or a default instance if not found.
        """
        state_key = self._normalize_key(key)

        state = self._store.get(state_key, None)

        if state is None:
            return self._default_state_model_factory()

        return self._state_model_cls.model_validate_json(state) 


    async def save_state(self, key: str, value: TState) -> None:
        """
        Save the state associated with the given key.

        Args:
            key (str): The key for the state.
            value (TState): The state to be saved.
        """
        state_key = self._normalize_key(key)

        value = value.model_dump_json()
        self._store[state_key] = value


    async def purge_state(self, key: str) -> None:
        """
        Delete the state associated with the given key.

        Args:
            key (str): The key for which to delete the state.
        """
        state_key = self._normalize_key(key)

        if state_key in self._store:
            self._store.pop(state_key, None)
