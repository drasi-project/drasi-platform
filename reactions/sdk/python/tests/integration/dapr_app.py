import asyncio
import os
from collections import Counter
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Request

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent


app = FastAPI()
observations: list[dict[str, Any]] = []
delivery_counts: Counter[tuple[str, str]] = Counter()


@app.get("/test/observations")
async def get_observations():
    return observations


@app.post("/test/dead-letter")
async def dead_letter(request: Request):
    cloud_event = await request.json()
    metadata = cloud_event.get("data", {}).get("metadata") or {}
    observations.append(
        {
            "kind": "dead_letter",
            "mode": metadata.get("mode"),
            "id": cloud_event.get("id"),
            "source": cloud_event.get("source"),
        }
    )
    return {"status": "SUCCESS"}


async def initialize() -> None:
    gate_path = os.getenv("TEST_INITIALIZATION_GATE")
    if gate_path is not None:
        started = Path(f"{gate_path}.started")
        release = Path(f"{gate_path}.release")
        started.touch()
        while not release.exists():
            await asyncio.sleep(0.05)
    observations.append({"kind": "initialized"})


async def on_change(
    message: ReactionMessage[ChangeEvent, None],
) -> DeliveryOutcome:
    identity = message.delivery.identity
    delivery_counts[identity] += 1

    metadata = message.event.metadata.root if message.event.metadata else {}
    mode = (metadata or {}).get("mode")
    attempt = delivery_counts[identity]
    observations.append(
        {
            "kind": "delivery",
            "mode": mode,
            "attempt": attempt,
            "id": message.delivery.id,
            "source": message.delivery.source,
            "topic": message.delivery.topic,
            "pubsub_name": message.delivery.pubsub_name,
            "trace_context": message.delivery.attributes.get("traceparent")
            or message.delivery.attributes.get("traceid"),
        }
    )

    if mode == "retry_once" and attempt == 1:
        return DeliveryOutcome.RETRY
    if mode == "exception_once" and attempt == 1:
        raise RuntimeError("integration test callback failure")
    if mode == "drop":
        return DeliveryOutcome.DROP
    return DeliveryOutcome.SUCCESS


reaction_options: dict[str, Any] = {}
if dead_letter_topic := os.getenv("TEST_DEAD_LETTER_TOPIC"):
    reaction_options["dead_letter_topic"] = dead_letter_topic

reaction = DrasiReaction(
    on_change_event=on_change,
    on_initialize=initialize,
    **reaction_options,
)
reaction.install(app)
