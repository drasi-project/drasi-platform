# Reaction SDK for Python

This library provides the building blocks for implementing a [Drasi](https://drasi.io/) Reaction in Python.

## Install

```shell
pip install drasi_reaction_sdk
```

The SDK installs its routes and lifespan behavior into a caller-owned FastAPI application. The application, rather than the SDK, owns the ASGI server and process lifecycle.

## Basic example

```python
from fastapi import FastAPI

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent


async def on_change(
    message: ReactionMessage[ChangeEvent, None],
) -> DeliveryOutcome:
    event = message.event
    print(f"Received sequence {event.sequence} for query {event.queryId}")

    for result in event.addedResults:
        print(f"Added result: {result}")

    for result in event.deletedResults:
        print(f"Deleted result: {result}")

    for update in event.updatedResults:
        print(f"Updated result: before={update.before}, after={update.after}")

    return DeliveryOutcome.SUCCESS


app = FastAPI()
reaction = DrasiReaction(on_change_event=on_change)
reaction.install(app)
```

Run the application with an ASGI server:

```shell
uvicorn main:app --host 0.0.0.0 --port 80
```

Build either example container from this directory so its Dockerfile can install the local SDK source:

```shell
docker build -f examples/simple/Dockerfile .
docker build -f examples/advanced/Dockerfile .
```

## Delivery contract

Each callback receives one `ReactionMessage` containing:

- `event`: A typed `ChangeEvent` or `ControlEvent`.
- `query`: The validated query ID, topic, and isolated query configuration.
- `delivery`: Structurally validated CloudEvent context. Its `identity` property is the `(source, id)` pair for this publication and any redeliveries. Attribute values remain untrusted application input.

Callbacks must return a `DeliveryOutcome`:

| Outcome | Dapr behavior |
| --- | --- |
| `DeliveryOutcome.SUCCESS` | Acknowledge the message. |
| `DeliveryOutcome.RETRY` | Request redelivery according to Dapr resiliency configuration. |
| `DeliveryOutcome.DROP` | Drop the message or forward it to the configured dead-letter topic. |

Returning `None`, returning another type, or raising an ordinary exception maps to `DeliveryOutcome.RETRY`.

## Query configuration

The keys in `spec.queries` are mounted as files in `/etc/queries`. During `install()`, the SDK discovers and parses all files before publishing one read-only registration snapshot. If any parser invocation fails, installation fails without publishing partial state.

A missing query configuration directory fails installation because it indicates that the expected configuration volume is unavailable. An existing empty directory produces a valid empty registration snapshot.

```python
from typing import Any

from fastapi import FastAPI

from drasi.reaction import DeliveryOutcome, DrasiReaction, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent
from drasi.reaction.utils import get_config_value, yaml_query_configs


connection_string = get_config_value("MyConnectionString")


async def on_change(
    message: ReactionMessage[ChangeEvent, dict[str, Any]],
) -> DeliveryOutcome:
    query_config = message.query.config
    # Use connection_string, query_config, and message.event here.
    return DeliveryOutcome.SUCCESS


async def on_control(
    message: ReactionMessage[ControlEvent, dict[str, Any]],
) -> DeliveryOutcome:
    print(message.event.controlSignal.kind)
    return DeliveryOutcome.SUCCESS


app = FastAPI()
reaction = DrasiReaction[dict[str, Any]](
    on_change_event=on_change,
    on_control_event=on_control,
    parse_query_configs=yaml_query_configs,
)
reaction.install(app)
```

If no parser is supplied, each registration has `config=None`. Configuration objects passed to callbacks are isolated copies, so callback mutation cannot change the startup snapshot.

The SDK reads:

- `PubsubName`, defaulting to `drasi-pubsub`.
- `QueryConfigPath`, defaulting to `/etc/queries`.
- Other Reaction properties through `get_config_value()`.

## Durable reaction state

A ReactionProvider can request a dedicated Dapr state store by setting `state_store: true`:

```yaml
apiVersion: v1
kind: ReactionProvider
name: PythonStatefulReaction
spec:
  state_store: true
  services:
    reaction:
      image: python-stateful-reaction
```

The platform injects the generated component name as `StateStoreName`. Use the official Dapr SDK to access it:

```python
import os

from dapr.aio.clients import DaprClient
from drasi.reaction import DeliveryOutcome, ReactionMessage
from drasi.reaction.models.ChangeEvent import ChangeEvent


async def update_routing_rules(
    message: ReactionMessage[ChangeEvent, None],
) -> DeliveryOutcome:
    store_name = os.environ["StateStoreName"]

    async with DaprClient() as client:
        current = await client.get_state(
            store_name=store_name,
            key="routing-rules",
        )
        await client.save_state(
            store_name=store_name,
            key="routing-rules",
            value='{"route": "agent"}',
            etag=current.etag or None,
        )

    return DeliveryOutcome.SUCCESS
```

`get_state` returns the store ETag in `current.etag`. Passing it to `save_state` enables optimistic concurrency when the configured state store supports ETags. The Dapr SDK also provides consistency options, transactions, bulk operations, deletes, and request metadata.

The platform creates a per-reaction Dapr Component, not a separate backing database. Components use the state store configured when Drasi is installed and are not currently scoped to the reaction's Dapr app IDs. Deleting a reaction removes its state-store and pub/sub Component resources, but does not purge records from the shared backing store. Recreating the same reaction ID may make its previous state accessible again.

## Initialization and cleanup

Async initialization runs after the caller's FastAPI lifespan starts and before the application becomes ready. Cleanup runs once before the caller's lifespan shuts down.

```python
async def initialize() -> None:
    ...


async def cleanup() -> None:
    ...


reaction = DrasiReaction(
    on_change_event=on_change,
    on_initialize=initialize,
    on_cleanup=cleanup,
)
reaction.install(app)
```

`reaction.is_ready` can be used by an application-owned readiness endpoint. The Dapr subscription endpoint returns `503` until initialization completes.

## Dead-letter delivery

Set one dead-letter topic for all query subscriptions:

```python
reaction = DrasiReaction(
    on_change_event=on_change,
    dead_letter_topic="reaction-dead-letter",
)
```

Retry count and backoff remain part of the Dapr deployment and resiliency configuration.

## Testing

Run the unit and FastAPI suite with `make test`. Run the real-Dapr delivery suite with `make integration-test`; it requires the Dapr CLI and a local Dapr runtime and uses the in-memory pub/sub component.
