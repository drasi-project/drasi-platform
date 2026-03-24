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

from drasi.reaction.management_client import ManagementClient, ManagementClientBase
from drasi.reaction.result_view_client import ResultViewClient, ResultViewClientBase

__all__ = [
    "DrasiReaction",
    "ManagementClient",
    "ManagementClientBase",
    "ResultViewClient",
    "ResultViewClientBase",
]


# DrasiReaction pulls in the full Dapr dependency chain, so we load it
# lazily to keep the lighter-weight clients importable on their own.
def __getattr__(name: str):
    if name == "DrasiReaction":
        from drasi.reaction.sdk import DrasiReaction
        return DrasiReaction
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
