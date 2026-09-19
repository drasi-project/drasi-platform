# Drasi agent-router contracts

`drasi-agent-router-contracts` is the shared Python wire-contract package for the DaprAgentRouter reaction and the Drasi extension in Dapr Agents. It contains generated Pydantic v2 models, JSON Schemas, protocol validation, deterministic naming helpers, and shared fixtures.

This is an integration-specific library, not a router application, agent implementation, or general-purpose Reaction SDK. It has no runtime dependency on Dapr, MCP, either application, or code-generation tools.

```python
from drasi_agent_router_contracts import AgentDelivery, parse, to_wire

delivery = parse(AgentDelivery, cloud_event["data"])
wire_data = to_wire(delivery)
```

Use `parse`/`parse_catalog` at input boundaries and `to_wire` before publishing. Generated Pydantic types alone do not preserve every JSON Schema or protocol constraint. Subscribe operations are non-empty, unique sets of `i`, `u`, and `d`; request and response ordering has no semantic meaning.

The current pre-release contract may change without compatibility adapters or migrations. Both consumers should use the same package revision. Protocol objects reject undeclared fields; query-result columns remain unrestricted.

## Development

TypeSpec is the source of truth in the parent `typespec/dapr-agent-router/` directory. Generation needs Node.js 22, uv, and Python 3.10+. From that directory:

```sh
make install-dependencies
make generate-types
make check-types
make test
make package
```

Do not edit `src/drasi_agent_router_contracts/models/`, `schemas/`, or `fixtures/` by hand. The generation target produces those artifacts from the TypeSpec source and canonical fixtures. Building or installing this Python package uses the checked-in artifacts and does not need Node.js or the TypeSpec compiler.

For local consumer development, install this directory as an editable dependency. For fork CI, pin a public source commit with the subdirectory `typespec/dapr-agent-router/python`. Consume a separately published prerelease when ready; do not copy the model files into either application.

The [protocol documentation](https://github.com/drasi-project/drasi-platform/tree/main/typespec/dapr-agent-router) describes the wire format, dependency examples, and the release/development workflow.
