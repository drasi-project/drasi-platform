# Drasi: Azure Storage Queue Reaction

The Azure Storage Queue Reaction enqueues messages on [Azure Storage Queues](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction) in response to changes to the result set of a Drasi Continuous Query.  The output format can either be the raw query output or a Debezium style format.

## Getting started

The reaction takes the following configuration properties:

| Property | Description |
|-|-|
| accountName | Name of Azure Storage Account. |
| accountKey | Access Key for Azure Storage Account. |
| queueName | Name of Queue. It should already exist on your storage account. |
| format | The output format for the messages that are enqueued. The can either be `raw` for the raw query output or `debezium` for a Debezium style format. |

### Example

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: StorageQueue
  properties:
    accountName: <Name of Azure Storage Account>
    accountKey: <Access Key for Azure Storage Account>
    queueName: <Name of Queue>
    format: <raw | debezium>
  queries:
    query1:
    query2:
```

## Output formats

### Raw Format

The raw query output format produces one message per source change that includes all changes to the result set and looks as follows:

```json
{
    "kind":"change",
    "queryId": "query1",
    "sequence": 2,
    "sourceTimeMs": 0,
    "addedResults": [
        { "id": 10, "temperature": 22 }
    ],
    "updatedResults":[{
        "before": { "id": 11, "temperature": 25 },
        "after": { "id": 11, "temperature": 27 } 
    }],
    "deletedResults":[
        { "id": 12, "temperature": 30 }
    ]
}
```


### Debezium Format

The Debezium format flattens all the changed result set items into one message per item and looks as follows:

```json
{
    "op": "i",
    "ts_ms": 0,
    "payload": {
        "source": {
            "queryId": "query1",
            "ts_ms": 0
        },
        "after": { 
            "id": 10, 
            "temperature": 22 
        }
    }
}
```
```json
{
    "op": "u",
    "ts_ms": 0,
    "payload": {
        "source": {
            "queryId": "query1",
            "ts_ms": 0
        },
        "before": {
            "id": 11, 
            "temperature": 25 
        },
        "after": { 
            "id": 11, 
            "temperature": 27
        }
    }
}
```
```json
{
    "op": "d",
    "ts_ms": 0,
    "payload": {
        "source": {
            "queryId": "query1",
            "ts_ms": 0
        },
        "before": { 
            "id": 12, 
            "temperature": 30
        }
    }
}
```

