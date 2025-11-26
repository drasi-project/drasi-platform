# Post Dapr PubSub Reaction

This reaction forwards Drasi query results to Dapr PubSub topics. It allows mapping each Drasi query to a specific Dapr pubsub component and topic.

## Features

- Maps Drasi queries to Dapr PubSub topics
- Supports both packed and unpacked event formats (unpacked is default, using Drasi native format)
- Supports Handlebars templates for custom output formatting
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
| `format` | Event format: `Unpacked` or `Packed` | `Unpacked` | No |
| `skipControlSignals` | Skip publishing control signals | `false` | No |
| `templates` | Handlebars template configuration for custom output | - | No |
| `templates.added` | Template for added (inserted) results | - | No |
| `templates.updated` | Template for updated results | - | No |
| `templates.deleted` | Template for deleted results | - | No |

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
        "format": "Unpacked",
        "skipControlSignals": false
      }
    another-query: |
      {
        "pubsubName": "messaging",
        "topicName": "data-updates",
        "format": "Packed",
        "skipControlSignals": false
      }
    control-signals-skipped: |
      {
        "pubsubName": "drasi-pubsub",
        "topicName": "changes-only",
        "skipControlSignals": true
      }
```

### Templated Output Configuration

You can use Handlebars templates to customize the output format for each change type. This is useful when you need to transform the Drasi change events into a specific format for downstream consumers.

```yaml
kind: Reaction
apiVersion: v1
name: post-dapr-pubsub-templated
spec:
  kind: PostDaprPubSub
  queries:
    my-query: |
      {
        "pubsubName": "drasi-pubsub",
        "topicName": "my-topic",
        "templates": {
          "added": "{\"eventType\": \"CREATED\", \"entityId\": \"{{after.id}}\", \"name\": \"{{after.name}}\", \"queryId\": \"{{queryId}}\"}",
          "updated": "{\"eventType\": \"UPDATED\", \"entityId\": \"{{after.id}}\", \"oldName\": \"{{before.name}}\", \"newName\": \"{{after.name}}\"}",
          "deleted": "{\"eventType\": \"DELETED\", \"entityId\": \"{{before.id}}\", \"name\": \"{{before.name}}\"}"
        }
      }
```

#### Template Context

Each template receives a context object with the following properties:

| Template | Context Properties |
|----------|-------------------|
| `added` | `after` (the new row data), `queryId` |
| `updated` | `before` (the old row data), `after` (the new row data), `queryId` |
| `deleted` | `before` (the deleted row data), `queryId` |

The row data (`before`/`after`) contains all the columns from the query result as properties. For example, if your query returns columns `id`, `name`, and `status`, you can access them as `{{after.id}}`, `{{after.name}}`, `{{after.status}}`.

#### Template Notes

- Templates must produce valid JSON
- If a template is not specified for a change type, that change type will not produce any output (useful for filtering)
- Template errors are logged but do not stop processing of other events
- Templates are only used with `Unpacked` format; `Packed` format sends the raw change event

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