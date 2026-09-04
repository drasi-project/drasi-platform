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

import logging
import os

from agent_router.runner import AgentRouterRunner
from agent_router.utils.types import PubSubConfig, StateConfig

# TODO: make this configurable?
logging.basicConfig(level=logging.INFO)

PUBSUB_NAME = os.getenv("pubsubName")
# Fallback to the per-reaction injected state store name
STATE_STORE_NAME = os.getenv("stateStoreName") or os.getenv("StateStoreName")
STATE_STORE_KEY_PREFIX = os.getenv("stateStoreKeyPrefix")


def main() -> None:
    runner = None
    # TODO: could maybe resolve component names from env inside runner
    try:
        runner = AgentRouterRunner(
            pubsub_config=PubSubConfig(pubsub_name=PUBSUB_NAME),
            state_config=StateConfig(
                state_store_name=STATE_STORE_NAME,
                state_key_prefix=STATE_STORE_KEY_PREFIX,
            ),
        )
        runner.start()
    finally:
        if runner:
            runner.shutdown()


if __name__ == "__main__":
    main()
