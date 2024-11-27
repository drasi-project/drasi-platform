# Reaction SDK for Python

This library provides the building blocks and infrastructure to implement a [Drasi](https://drasi.io/) Reaction in python.

## Getting started

### Install the package

```
pip install drasi_reaction_sdk
```

### Simple example

The following example logs the various parts of the incoming change event from a [Continuous Query](https://drasi.io/concepts/continuous-queries/).

```python
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.sdk import DrasiReaction


async def change_event(event: ChangeEvent, query_configs: dict[str, Any] | None = None):
    print(f"Received change sequence {event.sequence} for query {event.queryId}")
    print(event)


reaction = DrasiReaction(on_change_event=change_event)

reaction.start()
```

### Advanced example

The following example illustrates 
 - Retrieving a configuration value from the Reaction manifest
 - Parsing the per query configuration object from Yaml
 - Process change events from the query
 - Process control events (start, stop, etc.) from the query

```python
from drasi.reaction.models.ChangeEvent import ChangeEvent
from drasi.reaction.models.ControlEvent import ControlEvent
from drasi.reaction.sdk import DrasiReaction 
from drasi.reaction.utils import get_config_value, parse_yaml

# Retrieve the connection string from the Reaction configuration
my_connection_string = get_config_value("MyConnectionString")

# Define the function that will be called when a change event is received
async def on_change_event(event: ChangeEvent, query_config: dict[str, Any] | None) -> None:
    print(f"Received change signal for query {event.query_id}")
    print(f"Passed in the query config: {query_config}")
    
    # do something else with the `event` and `query_config`

# Define the function that will be called when a control event is received
async def on_control_event(event: ControlEvent, query_config: dict[str, Any] | None) -> None:
    print(f"Received control signal: {event.control_signal} for query {event.query_id}")
    print(f"Passed in the query config: {query_config}")

print(f"Starting Drasi reaction with connection string: {my_connection_string}")

# Configure the Reaction with the on_change_event and on_control_event functions
custom_reaction = DrasiReaction(
    on_change_event=on_change_event,
    on_control_event=on_control_event,
    parse_query_configs=parse_yaml,
)

# Start the Reaction
custom_reaction.start()
```
