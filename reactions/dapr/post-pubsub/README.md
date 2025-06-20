# Post Dapr PubSub Reaction

This reaction forwards Drasi query results to Dapr PubSub topics. It allows mapping each Drasi query to a specific Dapr pubsub component and topic.

## Features

- Maps Drasi queries to Dapr PubSub topics
- Supports both packed and unpacked event formats (unpacked is default, using Drasi native format)
- Forwards both change events and control signals
- Configurable per query
- Validation of configurations at startup
- Leverages Dapr's built-in retry mechanisms for publishing reliability

## Configuration

The reaction is configured using JSON for each query. The configuration includes:

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `pubsubName` | Name of the Dapr PubSub component | `drasi-pubsub` | Yes |
| `topicName` | Name of the topic to publish to | - | Yes |
| `packed` | Whether to send events in packed format (`true`) or unpacked (`false`) | `false` | No |
| `skipControlSignals` | Skip publishing control signals | `false` | No |

### Example Configuration

```yaml
kind: Reaction
apiVersion: v1
name: post-dapr-pubsub
spec:
  kind: PostDaprPubSub
  properties:
    # No global properties needed for this reaction
  queries:
    example-query: |
      {
        "pubsubName": "drasi-pubsub",
        "topicName": "example-topic",
        "packed": false,
        "skipControlSignals": false
      }
    another-query: |
      {
        "pubsubName": "messaging",
        "topicName": "data-updates",
        "packed": true,
        "skipControlSignals": false
      }
    control-signals-skipped: |
      {
        "pubsubName": "drasi-pubsub",
        "topicName": "changes-only",
        # "packed" defaults to false
        "skipControlSignals": true
      }
```

## Error Handling and Retries

If an error occurs while attempting to publish an event to the configured Dapr Pub/Sub topic (e.g., the Dapr sidecar is temporarily unavailable or the Pub/Sub component returns an error), the reaction will throw an exception.

Drasi's internal infrastructure, which uses a Dapr Pub/Sub component to deliver messages to reactions, will handle this exception. This typically results in the message being redelivered to the `PostDaprPubSub` reaction later, effectively retrying the publish operation. The exact retry behavior (number of retries, backoff strategy) is governed by the Dapr Pub/Sub component's configuration used internally by Drasi for reaction message delivery. This ensures that transient issues during publishing do not lead to lost messages, relying on Dapr's inherent resilience.

## Event Formats

### Packed vs. Unpacked

- **Packed format**: The entire ChangeEvent or ControlEvent is sent as a single message to the topic.
- **Unpacked format (Default)**: Individual messages are created for each change or control signal.

### Drasi Native Format (for Unpacked Events)

The native Drasi format uses these operation types:
- Insert operations (I): For new data added
- Update operations (U): For data changes
- Delete operations (D): For data removed
- Control signals (X): For system events