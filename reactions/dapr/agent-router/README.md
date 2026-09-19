# DaprAgentRouter

This directory owns the concrete DaprAgentRouter reaction's [protocol contract](../../../typespec/dapr-agent-router/README.md). It currently supplies the portable `agent_router.protocol` package: generated JSON Schemas and Pydantic models, boundary validation, and deterministic identity helpers. The router application, durable subscriptions, event conversion, and deployment are separate implementation work; this is not yet a runnable reaction service.

These contracts and dependencies are specific to this reaction, not the general-purpose Python Reaction SDK.

The pre-release implementation uses one current control/delivery contract, not a compatibility or migration framework. Protocol objects reject undeclared fields; projected query-result columns remain unrestricted.

```python
from agent_router.protocol import AgentDelivery, parse, to_wire

delivery = parse(AgentDelivery, cloud_event["data"])
wire_data = to_wire(delivery)
```

Use `parse`/`parse_catalog` at input boundaries and `to_wire` before publishing. Generated Pydantic types alone do not preserve every JSON Schema constraint.

## Development

Use Python 3.10+, uv, and Node.js 22. From this directory:

```sh
make install-dependencies
make generate-types
make check-types
make test
make package
```

TypeSpec in `typespec/dapr-agent-router/` is the source of truth. Do not edit `src/agent_router/protocol/models/` or `schemas/` by hand. Regeneration affects only this protocol.

The protocol subpackage has no imports from the Reaction SDK, Dapr, or the agent framework. Dapr Agents can vendor that subpackage and the shared fixtures using the provenance procedure in the contract document; it does not need to depend on the router application or the Reaction SDK.
