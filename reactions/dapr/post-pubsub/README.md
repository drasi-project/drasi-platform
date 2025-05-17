# Post Dapr PubSub Reaction

This reaction forwards Drasi query results to Dapr PubSub topics. It allows mapping each Drasi query to a specific Dapr pubsub component and topic.

## Features

- Maps Drasi queries to Dapr PubSub topics
- Supports both packed and unpacked event formats (unpacked is default, using Drasi native format)
- Forwards both change events and control signals
- Configurable per query
- Automatic tracking of query failure states
- Validation of configurations at startup

## Configuration

The reaction is configured using JSON for each query. The configuration includes:

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `pubsubName` | Name of the Dapr PubSub component | `drasi-pubsub` | Yes |
| `topicName` | Name of the topic to publish to | - | Yes |
| `packed` | Whether to send events in packed format (`true`) or unpacked (`false`) | `false` | No |
| `maxFailureCount` | Max failures before query is marked as failed | `5` | No |
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
        "maxFailureCount": 5,
        "skipControlSignals": false
      }
    another-query: |
      {
        "pubsubName": "messaging",
        "topicName": "data-updates",
        "packed": true,
        "maxFailureCount": 10,
        "skipControlSignals": false
      }
    control-signals-skipped: |
      {
        "pubsubName": "drasi-pubsub",
        "topicName": "changes-only",
        # "packed" defaults to false
        "maxFailureCount": 5,
        "skipControlSignals": true
      }
```

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
