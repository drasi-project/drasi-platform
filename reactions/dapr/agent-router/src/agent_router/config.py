# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Deployment configuration for one router application."""

from dataclasses import dataclass

from drasi.reaction.utils import get_config_value
from drasi_agent_router_contracts import router_dead_letter_topic


def _required(name: str) -> str:
    value = get_config_value(name)
    if not isinstance(value, str) or not value or any(c.isspace() for c in value):
        raise ValueError(f"{name} must be a non-empty value without whitespace")
    return value


@dataclass(frozen=True)
class RouterConfig:
    router_id: str
    inbound_pubsub_name: str
    egress_pubsub_name: str
    state_store_name: str
    dead_letter_topic: str

    @classmethod
    def from_environment(cls) -> "RouterConfig":
        router_id = _required("routerId")
        inbound = _required("PubsubName")
        egress = _required("egressPubsubName")
        state_store = _required("StateStoreName")

        if egress in ("drasi-pubsub", inbound):
            raise ValueError(
                "egressPubsubName must differ from drasi-pubsub and PubsubName"
            )
        try:
            dead_letter_topic = router_dead_letter_topic(router_id)
        except ValueError:
            raise ValueError(
                "routerId must be a valid <namespace>/<dapr-app-id> identity"
            ) from None

        return cls(
            router_id=router_id,
            inbound_pubsub_name=inbound,
            egress_pubsub_name=egress,
            state_store_name=state_store,
            dead_letter_topic=dead_letter_topic,
        )
