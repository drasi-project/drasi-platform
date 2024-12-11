# Debezeium Reaction

The Drasi Debezium Reaction connector generates a Debezium-compatible _data change event_ for each Added, Updated, or Removed in a Drasi result for a given Continuous Query.

## Data change events

While Debezium doesn't spell out a specification for the structure of the data change events, the existing implementations do adhere to a roughly common structure: because Debezium expects the structure of the events to potentially change over time, it supports encapsulating the schema of the key and value in the event itself to make each event self-contained. The events produced by this Reaction a should be comparable to the data change events produced by similar Debezium Connectors, which can be used as a reference model and more detailed commentary. For example, refer to the [Vitess events](https://debezium.io/documentation/reference/2.1/connectors/vitess.html#vitess-events).

The Debezium Reaction output differs from standard Debezium data change events, which typically include four JSON fields: the change event key schema, the actual event key, the change event value schema, and the event value payload. Instead, the Debezium Reaction output contains only a single `payload` field. This field contains the result from a query change event and its metadata.

 We removed the event key fields as the change events themselves do not have primary keys, and we removed the change event value schema field as currently the Drasi Reactions do not have the ability to access the definition of the Continuous Queries. In other words, Drasi is currently unable to generate an accurate schema of a Change Event based on the results from a Continuous Query.

The example below showscases the sample output from a Drasi Debezium Reaction subscrbied to a Continuous Query with id of `hello-world-from`:


```json
{
    "payload": { // <1>
        "before": null, // <2>
        "after": { //<3>
            "MessageFrom": "Allen",
            "MessageId": 25
        },
        "source": { // <4>
            "version": "0.1.6",
            "connector": "drasi",
            "ts_ms": 1732729776549,
            "seq": 26716600
        },
        "op": "c", // <5>
        "ts_ms": 1732729853215 // <6>
    }
}
```

| Item | Field | Description
| --- | --- |---
|1|`payload`|The value's actual data. This is the information that the change event is providing.
|2|`before`|An optional field that specifies the state of the document before the event occurred. In this example, all fields are part of the `hello-world-from` query result. When the `op` field is `c` for _create_, the `before` field will be `null` since it reflects added results.
|3|`after`|An optional field that specifies the state of the document before the event occurred. In this example, all fields are part of the `hello-world-from` query result. When the `op` field is `d` for _delete_, the `after` field will be `null` since it reflects deleted results.
|4|`source`|Mandatory field that describes the source metadata for the event. This field contains information that you can use to compare this event with other events, with regard to the origin of the events, the order in which the events occurred, and whether events were part of the same transaction. The source metadata includes:<ul><li>Drasi version.</li><li>Name of Drasi Reaction "connector" that generated the event (i.e. always "drasi").</li><li>Timestamp for when the query was complete and the result published in ms.</li><li>Unique sequence number for the result.</li></ul>
|5|`op`|Mandatory string that describes the type of operation that caused the connector to generate the event. In this example, `u` indicates that the operation is _updated_ so the value is one of the Continuous Query `updatedResults`. Valid values are:<ul><li>`c` = create</li><li>`u` = update</li><li>`d` = delete</li></ul>
|6|`ts_ms`|Optional field that displays the time at which the Drasi Debezium Reaction processed the event. The time is based on the system clock in running in the Reaction reported in ms. Note that the current implementation always fills in a value here despite it being schematically optional.<br/>In the `source` object, `ts_ms` indicates the time that the query result was published. By comparing the value for `payload.source.ts_ms` with the value for `payload.ts_ms`, you can determine the lag between the query result and the Reaction's handling of it.


## Deployment and testing

The `test-debezium-reaction.yaml` file in the `devops` folder can be used to deploy the Reaction and test it with a Kafka topic, with the following configuration options:

|Property|Description
|--- |---
|`queries`| The list of continuous queries you would like the Debezium Reaction to listen to and publish change events for.
|`properties.brokers`| The Kafka broker to write to, for example `test-kakfa:9092` which is the name of the server set up by applying the `test-kafka.yaml` file.
|`properties.topic`| The name of the Kafka topic to write to, for example `my-kafka-topic`.

For testing purposes, this folder also includes a `test-kafka.yaml` file that can be used to deploy a Kafka & Zookeper instance in your Kubernetes cluster. 

Navigate to the `devops` folder and follow the following steps:

```bash
# Deploy a Drasi Source and a Continuous Query
# This example uses the Source and queries from the Quickstart tutorial

# If you wish to subscribe to a different Continuous Query, modify the 'queries' field in the 'test-debezium-reaction.yaml` pod.
kubectl apply -f test-kafka.yaml
# Wait for the Kafka & Zookeeper pods to be ready
kubectl apply -f test-debezium-reaction.yaml
```

You can view the content of the kakfa topic by executing into the kafka pod:
```bash
kubectl exec -it <name-of-the-kafka-pod> -n <k8s-namespace> -- bash
# After executing into the pod, run the following command:
kafka-console-consumer.sh --bootstrap-server test-kafka:9092 --topic my-kafka-topic --from-beginning 
```

## Future considerations

The Debezium Reaction remains a work in progress and there are several additional areas that need to be addressed in the future:

- Update the output of the Debezium Reaction to include the three missing fields. Specifically
  - Populate a schema field for the change event values; this requires us to develop a mechanism that allows the Drasi Reactions to access the definitions of the Continuous Queries.
  - Add the change event key and change event key schema fields; we still need to design a suitable primary key for a change event.

  
- Consider other fields to put in the event value `source`:
  - Other fields commonly seen in other Debezium connectors:
    - Snapshot (probably unnecessary, since there's no snapshotting as applies to a SQL database, example).
  - Other fields from the result `metadata` property:
    - Passthrough the underlying Debzium `changeEvent`?
    - `tracking.query.indexType`?
    - `tracking.query.mode`?
    - Any of the other performance timing fields?

- Convert this to an actual Debezium connector (i.e. Kafka Connect source connector) instead of a Reaction. This would require thinking about whether the Reaction extensibility/development model in general, but it feels like one of the selling points of Debezium is that they are just Kafka Connect source connectors, and participants in that ecosystem may not be as interested in the Drasi Reaction model.