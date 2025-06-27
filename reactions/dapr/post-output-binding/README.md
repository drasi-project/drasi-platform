# Post Dapr Output Binding Reaction

This reaction forwards Drasi query results to Dapr Output Binding. It allows mapping each Drasi query to a specific Dapr Output Binding component with a specified operation.

## Features

- Maps Drasi queries to Dapr Output Binding
- Supports both packed and unpacked event formats (unpacked is default, using Drasi native format)
- Forwards both change events and control signals
- Configurable per query
- Automatic tracking of query failure states
- Validation of configurations at startup

## Configuration

The reaction is configured using JSON for each query. The configuration includes:

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `bindingName` | Name of the Dapr Output Binding component | `drasi-binding` | Yes |
| `bindingType` | The type of the Output Binding  | - | Yes |
| `bindingOperation` | The operation to run | - | Yes |
| `packed` | Whether to send events in packed format (`true`) or unpacked (`false`) | `false` | No |
| `maxFailureCount` | Max failures before query is marked as failed | `5` | No |
| `skipControlSignals` | Skip publishing control signals | `false` | No |

### Example Configuration

```yaml
kind: Reaction
apiVersion: v1
name: post-dapr-output-binding
spec:
  kind: PostDaprOutputBinding
  properties:
    # No global properties needed for this reaction
  queries:
    example-query: |
      {
        "bindingName": "drasi-output-binding",
        "bindingType": "http",
        "bindingOperation": "put"
        "packed": false,
        "maxFailureCount": 5,
        "skipControlSignals": false
      }
    another-query: |
      {
        "bindingName": "drasi-output-binding",
        "bindingType": "http",
        "bindingOperation": "get"
        "packed": false,
        "maxFailureCount": 5,
        "skipControlSignals": false
      }
    control-signals-skipped: |
      {
        "bindingName": "drasi-output-binding",
        "bindingType": "http",
        "bindingOperation": "get"
        "packed": false,
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
