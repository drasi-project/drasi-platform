# Drasi: Azure Storage Queue Reaction

The Azure Storage Queue Reaction enqueues messages on [Azure Storage Queues](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction) in response to changes to the result set of a Drasi Continuous Query.  The output format can either be the packed format of the raw query output or an unpacked format, where a single message represents one change to the result set.

## Getting started

The reaction takes the following configuration properties:

| Property | Description |
|-|-|
| endpoint | Endpoint of the Storage Account queue service, in the form https://{account-name}.queue.core.windows.net, if not using connection string|
| connectionString | Connection String of Azure Storage Account, if using connection string based authentication. |
| queueName | Name of Queue. It should already exist on your storage account. |
| format | The output format for the messages that are enqueued. The can either be `packed` for the raw query output or `unpacked` for a message per result set change. |

### Example

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: StorageQueue
  properties:
    connectionString: <Connection String of Azure Storage Account>
    queueName: <Name of Queue>
    format: <packed | unpacked>
  queries:
    query1:
    query2:
```

## Output formats

### Packed Format

The packed format produces one message per source change that includes all changes to the result set and looks as follows:

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


### Unpacked Format

The Unpacked format flattens all the changed result set items into one message per item and looks as follows:

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

