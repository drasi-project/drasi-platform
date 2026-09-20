# DaprAgentRouter end-to-end scenario

This scenario covers the Kubernetes path from PostgreSQL changes through a
Drasi Source and two ordinary Continuous Queries to the built-in
`DaprAgentRouter`, with deliveries inspected in a separate Redis broker.

It verifies the MCP catalog and subscription lifecycle, query and operation
selection, projected insert/update/delete snapshots, durable rule restoration
after router pod replacement, the current delivery envelope, and acknowledged
filtered inputs. It does not assert exactly-once delivery or ordering between
query streams.

Runtime assumptions:

- The Drasi CLI installs Dapr runtime and sidecars at its current default,
  `1.14.5`.
- The platform-managed router state component uses the installed MongoDB 6
  backing store.
- Scenario PostgreSQL uses `postgres:15.8-alpine3.20`.
- The application-facing broker uses `redis:7.4.1-alpine3.20`, AOF enabled,
  and a persistent volume.
- `i460-router-postgres` and `i460-agent-redis` expose namespace-local ports
  `5432` and `6379`; router management uses app port `8000` through its Dapr
  sidecar on `3500`. The test chooses dynamic local port-forward ports.
- The installed `DaprAgentRouter` provider supplies one `Recreate` replica and
  the `reaction-dapr-agent-router` image matching `DRASI_VERSION`.
- `i460-agent-egress` Components exist only in `drasi-system` and `default`;
  both target the scenario Redis broker and do not replace Drasi's internal
  Pub/Sub Components.
- Inbound retries are finite and scoped to `i460-agent-router-reaction`. The
  router declares its derived dead-letter topic through `/dapr/subscribe`, and
  the test inspects that stream without installing a callback consumer.

Troubleshooting: a CloudEvent `pubsubname` identifies the publisher Component
and can differ from the router-local per-reaction Component alias. Normal router
builds include the required same-checkout Reaction SDK support. If valid query
events log `delivery_route_mismatch` and reach the dead-letter topic, verify the
image was built from the complete checkout; do not rename the fixture
Components or bypass route validation.

Run only this scenario from `e2e-tests`:

```bash
npm test -- --runInBand 11-dapr-agent-router-scenario/dapr-agent-router.test.js
```

Set `DRASI_VERSION=latest-azure-linux` to exercise the Azure Linux image
variant; the default is `latest`.
