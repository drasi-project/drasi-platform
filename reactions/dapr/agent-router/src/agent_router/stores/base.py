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

from typing import Generic, TypeVar

from pydantic import BaseModel

TState = TypeVar("TState", bound=BaseModel)
"""
The state model class used for validation. Must not take any required arguments.
"""


# TODO: does this need to be parameterized?
class StateStore(Generic[TState]):
    """
    Base class for state store implementations.
    This class defines the interface that all state store implementations must adhere to.
    """

    def __init__(
        self,
        *,
        state_model_cls: type[TState],
        state_key_prefix: str | None = None,
        name: str = "drasi-agent-router-store",
    ) -> None:
        """
        Initialize a StateStore instance.

        Args:
            state_model_cls (type[TState]): The state model class used for validation. Must not take any required arguments.
            state_key_prefix (str | None): Optional prefix for state keys.
            name (str): The name for the store (used for logging). Defaults to "drasi-agent-router-store".
        """
        self._state_model_cls = state_model_cls
        self._state_key_prefix = state_key_prefix
        # TODO: assumes model takes in no args
        # TODO: should this be configurable
        self._default_state_model_factory = lambda: state_model_cls()
        self._name = name


    def _normalize_key(self, key: str) -> str:
        """Apply the configured key prefix to a logical key."""
        return f"{self._state_key_prefix}{key}".lower() if self._state_key_prefix else key


    # TODO: should these be sync? how to call underlying sync and async methods via a sync interface?
    async def has_key(self, key: str) -> bool:
        """
        Check whether a logical key exists in the store.

        Args:
            key (str): The key to check for existence.

        Returns:
            bool: True if the key exists, False otherwise.
        """
        raise NotImplementedError("has_key method must be implemented by subclasses.")


    async def get_state(self, key: str) -> TState:
        """
        Retrieve the state associated with the given key.

        Args:
            key (str): The key for which to retrieve the state.

        Returns:
            TState: A copy of the state associated with the key, or the default model if the key does not exist.
        """
        raise NotImplementedError("get_state method must be implemented by subclasses.")


    async def save_state(self, key: str, value: TState) -> None:
        """
        Save the state associated with the given key.

        Args:
            key (str): The key for which to save the state.
            value (TState): The state to be saved.
        """
        raise NotImplementedError("save_state method must be implemented by subclasses.")


    async def purge_state(self, key: str) -> None:
        """
        Delete the state associated with the given key.

        Args:
            key (str): The key whose state to delete.
        """
        raise NotImplementedError("purge_state method must be implemented by subclasses.")
