# DaprAgentRouter end-to-end scenario

This scenario covers the Kubernetes path from PostgreSQL changes through a
Drasi Source and two ordinary Continuous Queries to the built-in
`DaprAgentRouter`, then through a separate Redis broker to a Dapr-enabled
receiving application.

It verifies the MCP catalog and subscription lifecycle, query and operation
selection, projected insert/update/delete snapshots, durable rule restoration
after router pod replacement, the current delivery envelope, real application
callbacks, and acknowledged filtered inputs. It does not assert exactly-once
delivery or ordering between query streams.

Runtime assumptions:

- The Drasi CLI installs Dapr runtime and sidecars at its current default,
  `1.14.5`.
- The platform-managed router state component uses the installed MongoDB 6
  backing store.
- Scenario PostgreSQL uses `postgres:15.8-alpine3.20`.
- The application-facing broker uses `redis:7.4.1-alpine3.20`, AOF enabled,
  and a persistent volume.
- The receiver runs a ConfigMap-mounted Python standard-library HTTP server in
  `python:3.12.7-alpine3.20`, with Dapr app ID `i460-e2e-reader` in `default`.
  It preserves each raw CloudEvent body, records it before returning
  `{"status":"SUCCESS"}`, and exposes `/healthz` and test-only `/records`.
- `i460-router-postgres` and `i460-agent-redis` expose namespace-local ports
  `5432` and `6379`; router management uses app port `8000` through its Dapr
  sidecar on `3500`, while the receiver uses app port `8080` and sidecar port
  `3500`. The test chooses dynamic local port-forward ports.
- The installed `DaprAgentRouter` provider supplies one `Recreate` replica and
  the `reaction-dapr-agent-router` image matching `DRASI_VERSION`.
- `i460-agent-egress` Components exist only in `drasi-system` and `default`;
  both target the scenario Redis broker and do not replace Drasi's internal
  Pub/Sub Components. The `default` Component is scoped to the receiver.
- After MCP returns the derived inbox topic, the test creates a scoped
  declarative Subscription before starting the receiver. It waits for both
  Dapr subscription metadata and the receiver's Redis consumer group before
  producing selected changes; HTTP health alone is not delivery readiness.
- Inbound retries are finite and scoped to `i460-agent-router-reaction`. The
  router declares its derived dead-letter topic through `/dapr/subscribe`, and
  the test inspects that stream without installing a dead-letter callback
  consumer.

Troubleshooting: a CloudEvent `pubsubname` identifies the publisher Component
and can differ from the router-local per-reaction Component alias. Normal router
builds include the required same-checkout Reaction SDK support. If valid query
events log `delivery_route_mismatch` and reach the dead-letter topic, verify the
image was built from the complete checkout; do not rename the fixture
Components or bypass route validation.

On failure, the test captures limited router and receiver container/sidecar
logs, receiver callback summaries validated by the shared contract package,
and the relevant Redis group and stream diagnostics.

Run only this scenario from `e2e-tests`:

```bash
npm test -- --runInBand 11-dapr-agent-router-scenario/dapr-agent-router.test.js
```

Set `DRASI_VERSION=latest-azure-linux` to exercise the Azure Linux image
variant; the default is `latest`.
