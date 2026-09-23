# Drasi agent-router contracts

`drasi-agent-router-contracts` is the shared Python wire-contract package for the DaprAgentRouter reaction and the Drasi extension in Dapr Agents. It contains generated Pydantic v2 models, JSON Schemas, protocol validation, deterministic naming helpers, and shared fixtures.

This is an integration-specific library, not a router application, agent implementation, or general-purpose Reaction SDK. It has no runtime dependency on Dapr, MCP, either application, or code-generation tools.

Use `parse`/`parse_catalog` at input boundaries and `to_wire` before publishing. Generated Pydantic types alone do not preserve every JSON Schema or protocol constraint. Subscribe operations are non-empty, unique sets of `i`, `u`, and `d`; request and response ordering has no semantic meaning.

The current pre-release contract may change without compatibility adapters or migrations. Both consumers should use the same package revision. Protocol objects reject undeclared fields; query-result columns remain unrestricted.

## Minimal consumer example

The authoritative [protocol](https://github.com/drasi-project/drasi-platform/blob/main/typespec/dapr-agent-router/README.md) defines transport, lifecycle, and failure handling; this example only demonstrates the shared package boundaries, not a Dapr Agents extension. Install this package using the [consumer dependency instructions](https://github.com/drasi-project/drasi-platform/blob/main/typespec/dapr-agent-router/README.md#shared-package-and-consumer-development). For operator configuration, reuse the [Reaction example](https://github.com/drasi-project/drasi-platform/blob/main/reactions/dapr/agent-router/README.md#provider-installation-and-deployment), including its required `routerId` and `egressPubsubName`; the platform supplies `StateStoreName` and `PubsubName`.

Call `list_queries` with `{}` and check MCP `isError` before passing its `structuredContent` (or decoded JSON text result) as `catalog_document`. The catalog contains only `protocol_version`, `router_id`, and `queries`; there are no `delivery_schema_version` or `capabilities` fields. `expected_router_id` below comes from trusted configuration, never from the returned catalog.

For this example, `query_id` is selected from that catalog, `subscription_incarnation` is an extension-generated token already persisted with pending intent, and `cloud_event` is a later decoded Dapr delivery. Subscriber identity comes from trusted extension configuration, not model arguments. The shared [message fixtures](https://github.com/drasi-project/drasi-platform/blob/main/typespec/dapr-agent-router/fixtures/messages.json) provide sample catalog, subscription, and delivery documents.

```python
from jsonschema.exceptions import ValidationError

from drasi_agent_router_contracts import (
    AgentDelivery,
    Subscriber,
    SubscribeRequest,
    agent_inbox_topic,
    parse,
    parse_catalog,
    to_wire,
)

expected_router_id = "drasi-system/sre-router-reaction"
try:
    catalog = parse_catalog(catalog_document, expected_router_id)
except (ValidationError, ValueError):
    # Fail startup on unsupported protocol version, wrong router, or invalid shape.
    raise RuntimeError("Incompatible router catalog; do not subscribe") from None

if query_id not in {query.query_id for query in catalog.queries}:
    raise ValueError("Selected query is not in the router catalog")
subscriber = Subscriber(
    namespace="applications", app_id="checkout-sre", agent_name="CheckoutSRE"
)
request = SubscribeRequest(
    query_id=query_id,
    operations=["i", "u"],
    subscriber=subscriber,
    subscription_incarnation=subscription_incarnation,
)
subscribe_arguments = to_wire(request)
expected_inbox = agent_inbox_topic(expected_router_id, subscriber)

try:
    delivery = parse(AgentDelivery, cloud_event["data"])
except (KeyError, ValidationError, ValueError):
    # Reject malformed/unsupported M2 envelopes, including inconsistent event IDs.
    raise ValueError("Invalid or unsupported router delivery") from None
if delivery.routerId != expected_router_id:
    raise ValueError("Delivery is from an unexpected router")
```

Send `subscribe_arguments` to `subscribe`; do not send `expected_inbox`, handling instructions, or broker overrides. The router derives the destination using the same helper. Before marking intent active, validate the `SubscribeResponse` and compare its query, incarnation, operation set, and `topic_name` to the request and `expected_inbox`, as required by the [subscription lifecycle](https://github.com/drasi-project/drasi-platform/blob/main/typespec/dapr-agent-router/README.md#subscribe).

`parse(AgentDelivery, ...)` validates all five M2 fields (`schemaVersion`, `routerId`, `subscriptionIncarnation`, `eventId`, `event`) and semantic row identity, but does not consult local intent. Before scheduling work, additionally match the query, current incarnation, operation filter, and active lifecycle status. Stale incarnations or absent/inactive intent are intentional discards. Translate malformed/unsupported deliveries and wrong-router failures into the explicit failure/dead-letter path; state-access or scheduling failures request retry. Follow the [admission and failure boundaries](https://github.com/drasi-project/drasi-platform/blob/main/typespec/dapr-agent-router/README.md#admission-and-failure-boundaries), and do not log validation exceptions or input documents containing row data.

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
