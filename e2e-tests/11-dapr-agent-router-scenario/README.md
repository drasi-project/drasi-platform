# DaprAgentRouter end-to-end scenario

This scenario covers the Kubernetes path from PostgreSQL changes through a
Drasi Source and two ordinary Continuous Queries to the built-in
`DaprAgentRouter`, then through a separate Redis broker to a Dapr-enabled
receiving application.

The order rows and subscriber identities are synthetic test data. No Dapr Agents application, language model, or model credentials are needed.

The control path is the Jest client -> loopback port-forward to the `i460-e2e-caller` Dapr sidecar in `default` -> Dapr service invocation of `i460-agent-router-reaction.drasi-system` -> router MCP endpoint. Initialization and every tool call (`list_queries`, `subscribe`, and `unsubscribe`) use this application-namespace sidecar, not the router's sidecar. The caller registers the existing `i460-e2e-reader` receiver as the subscriber; delivery still travels through the application-facing Redis broker to its derived inbox. Router-side port-forwarding is retained only for readiness, subscription metadata, and administrative inspection/cleanup.

The scenario checks router identity, subscription incarnation, query/operation, and inbox derivation using the shared protocol package. After unsubscribe it produces a fresh delete for the previously selected operation, waits for router input acknowledgement, and checks that no matching delivery was published. Previously queued deliveries need not disappear.

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
- The outbound-only caller uses the same Python image, with Dapr app ID `i460-e2e-caller` in `default`. It needs no application listener, Service, or public ingress; the scripted client reaches its local sidecar on port `3500` through a loopback-only port-forward.
- `i460-router-postgres` and `i460-agent-redis` expose namespace-local ports `5432` and `6379`; router MCP uses app port `8000` via Dapr service invocation from the caller sidecar on `3500`, while the receiver uses app port `8080` and sidecar port `3500`. The test chooses dynamic local port-forward ports.
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

Cleanup removes only scenario-owned definitions and this synthetic subscriber's router rules. It does not delete either namespace or shared platform resources.

Troubleshooting: a CloudEvent `pubsubname` identifies the publisher Component
and can differ from the router-local per-reaction Component alias. Normal router
builds include the required same-checkout Reaction SDK support. If valid query
events log `delivery_route_mismatch` and reach the dead-letter topic, verify the
image was built from the complete checkout; do not rename the fixture
Components or bypass route validation.

On failure, the test captures limited router, caller, and receiver container/sidecar
logs, receiver callback summaries validated by the shared contract package,
and the relevant Redis group and stream diagnostics.

Run only this scenario from `e2e-tests`:

```bash
npm test -- --runInBand 11-dapr-agent-router-scenario/dapr-agent-router.test.js
```

Set `DRASI_VERSION=latest-azure-linux` to exercise the Azure Linux image
variant; the default is `latest`.

The Docker-capable Python 3.12 application CI job also runs `make -C reactions/dapr/agent-router test-state-integration`. This existing target starts Dapr `1.14.5` and MongoDB 6 with Docker Compose, configures the runtime endpoints and state store, runs all five real-state cases (with individual outcomes shown in CI), and removes its Compose resources. Ordinary pytest runs without that runtime configuration skip these cases.
