# Debezeium Reaction

The Drasi Debezium Reaction connector generates a Debezium-compatible _data change event_ for each Added, Updated, or Removed in a Drasi result for a given Continuous Query. Each event contains a value and optionally a key, with the structure of both depends on the result returned by the Continuous Query.

## Data change events

While Debezium doesn't spell out a specification for the structure of the data change events, the existing implementations do adhere to a roughly common structure: because Debezium expects the structure of the events to potentially change over time, it supports encapsulating the schema of the key and value in the event itself to make each event self-contained. The events produced by this Reaction a should be analogous to the data change events produced by similar Debezium Connectors, which can be used as a reference model and more detailed commentary. For example, refer to the [Vitess events](https://debezium.io/documentation/reference/2.1/connectors/vitess.html#vitess-events).

The following skeleton JSON shows the basic four parts of a standard Debezium change data event, assuming all optional parts of the event are requested as part of the Reaction configuration:

```json
{
 "schema": { // <1>
   ...
  },
 "payload": { // <2>
   ...
 },
 "schema": { // <3>
   ...
 },
 "payload": { // <4>
   ...
 },
}
```

| Item | Field | Description
| --- | --- |---
|1|`schema`| The first `schema` field is part of the event key. It specifies a Kafka Connect schema that describes what is in the event key's `payload` portion. In other words, the first `schema` field describes the structure of the key for the Continuous Query result that contains the change event.
|2|`payload`|The first `payload` field is part of the event key. It has the structure described by the previous `schema` field and it contains the key for the Continuous Query result that contains the change event.
|3|`schema`|The second `schema` field is part of the event value. It specifies the Kafka Connect schema that describes what is in the event value's `payload` portion. In other words, the second `schema` describes the structure of the Continuous Query result data. Typically, this schema contains nested schemas.
|4|`payload`|The second `payload` field is part of the event value. It has the structure described by the previous `schema` field and it contains the actual Continuous Query result data.

## Change event keys

A change event's key contains the schema for the Continuous Query result key and the key value for that Continuous Query result.

Note that in most Debezium Connectors, the key consists of a single `id` field which specifies the unique identifier for the document/row/record's that was changed. This Reaction does not have access to the indexing information used by the query containers, so it instead uses the _sequence number_ of a Continuous Query result as the key. For consistency with existing Debezium Connectors, we treat the sequence number as a string and use the field name `id`, even though this is equivalent to the `seq` numeric field in the change event value `source` data we'll see below.

To illustrate the structure of the key, we treat this Reaction as if it is a connector with the fixed logical name of `drasi`, with a query container in the `default` namespace, and using the `building-comfort-ui` Continuous Query results:

```json
{
    "schema": { // <1>
        "type": "struct",
        "name": "drasi.default.building-comfort-ui.Key", // <2>
        "optional": false, // <3>
        "fields": [ // <4>
            {
                "field": "id",
                "type": "string",
                "optional": false
            }
        ]
    },
    "payload": { // <5>
        "id": "486"
    }
}    
```

| Item | Field | Description
| --- | --- |---
|1|`schema`|The schema portion of the key specifies a Kafka Connect schema that describes what is in the key's `payload` portion.
|2|`"drasi.default.building-comfort-ui.Key"`|Name of the schema that defines the structure of the key's payload. This schema describes the structure of the key for the Continuous Query result. Key schema names have the format `<connector-name>.<container-namespace>.<query-id>.Key`. In this example: <ul><li>`drasi` is the name of the connector that generated this event.</li><li>`default` is the query container namespace.</li><li>`building-comfort-ui` is the Continuous Query ID that produced the results.</li></ul>
|3|`optional`|Indicates whether the event key must contain a value in its `payload` field. As a Drasi Reaction, a value in the key's payload is always required (all results have a sequence number).
|4|`fields`|Specifies each field that is expected in the `payload`, including each field's name, type, and whether it is required.
|5|`payload`|Contains the key for the result for which this change event was generated. In this example, the key contains a single `id` field of type `string` whose value is `486` that is the sequence number of the result.

## Change event values

Like the key, the value has a `schema` section and a `payload` section. The `schema` section contains the schema that describes the `Envelope` structure of the `payload` section, including its nested fields. Change events for operations that _create_, _update_ or _delete_ data all have a value payload with an envelope structure, with each of those Debezium operations corresponding to an event in the `addedResults`, `updatedResults`, and `deletedResults` lists respectively for a given Continuous Query result.

Continuing the example of this Reaction as a connector with the fixed logical name of `drasi`, pulling results from a query container in the `default` namespace for the `building-comfort-ui` Continuous Query:

```json
{
    "schema": { // <1>
        "type": "struct",
        "fields": [
            {
                "type": "struct",
                "fields": [
                    {
                        "field": "BuildingId",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "BuildingName",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "CO2",
                        "type": "number",
                        "optional": false
                    },
                    {
                        "field": "ComfortLevel",
                        "type": "number",
                        "optional": false
                    },
                    {
                        "field": "FloorId",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "FloorName",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "Humidity",
                        "type": "number",
                        "optional": false
                    },
                    {
                        "field": "RoomId",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "RoomName",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "Temperature",
                        "type": "number",
                        "optional": false
                    }
                ],
                "optional": true,
                "name": "drasi.default.building-comfort-ui.Value", // <2>
                "field": "before"
            },
            {
                "type": "struct",
                "fields": [
                    {
                        "field": "BuildingId",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "BuildingName",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "CO2",
                        "type": "number",
                        "optional": false
                    },
                    {
                        "field": "ComfortLevel",
                        "type": "number",
                        "optional": false
                    },
                    {
                        "field": "FloorId",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "FloorName",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "Humidity",
                        "type": "number",
                        "optional": false
                    },
                    {
                        "field": "RoomId",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "RoomName",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "Temperature",
                        "type": "number",
                        "optional": false
                    }
                ],
                "optional": true,
                "name": "drasi.default.building-comfort-ui.Value",
                "field": "after"
            },
            {
                "type": "struct",
                "fields": [
                    {
                        "field": "version",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "connector",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "container",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "hostname",
                        "type": "string",
                        "optional": false
                    },
                    {
                        "field": "ts_ms",
                        "type": "int64",
                        "optional": false
                    },
                    {
                        "field": "seq",
                        "type": "int64",
                        "optional": false
                    }
                ],
                "optional": false,
                "name": "io.debezium.connector.drasi.Source", // <3>
                "field": "source"
            },
            {
                "type": "string",
                "optional": false,
                "field": "op"
            },
            {
                "type": "int64",
                "optional": true,
                "field": "ts_ms"
            }
        ],
        "optional": false,
        "name": "drasi.default.building-comfort-ui.Envelope" // <4>
    },
    "payload": { // <5>
        "before": { // <6>
            "BuildingId": "building_01",
            "BuildingName": "Building 01",
            "CO2": 9,
            "ComfortLevel": 48,
            "FloorId": "floor_01_03",
            "FloorName": "Floor 03",
            "Humidity": 38,
            "RoomId": "room_01_03_05",
            "RoomName": "Room 0305",
            "Temperature": 74
        },
        "after": { // <7>
            "BuildingId": "building_01",
            "BuildingName": "Building 01",
            "CO2": 12,
            "ComfortLevel": 48,
            "FloorId": "floor_01_03",
            "FloorName": "Floor 03",
            "Humidity": 38,
            "RoomId": "room_01_03_05",
            "RoomName": "Room 0305",
            "Temperature": 74
        },
        "source": { // <8>
            "version": "preview.1",
            "connector": "drasi",
            "container": "default",
            "hostname": "default-query-host-567bb9b874-vdq6l",
            "ts_ms": 1678145871903,
            "seq": 486
        },
        "op": "u", // <9>
        "ts_ms": 1678145872465 // <10>
    }
}
```

| Item | Field | Description
| --- | --- |---
|1|`schema`|The value's schema, which describes the structure of the value's payload. A change event's value schema is the same in every change event that the Reaction generates for a particular Continuous Query result.
|2|`name`|In the `schema` section, each `name` field specifies the schema for a field in the value's payload.<br/>In this example, `drasi.default.building-comfort-ui.Value` is the schema for both `before` and `after` fields in the payload, and the schema is specific to the `building-comfort-ui` query.<br/>Names of the schemas for `before` and `after` fields are of the form `<connector-name>.<container-namespace>.<query-id>.Key` so that they have unique names per query.
|3|`name`|`io.debezium.connector.drasi.Source` is the schema for the payload's `source` field. This schema is specific to the Drasi Debezium Reaction, and is used for all events that it generates.
|4|`name`|`drasi.default.building-comfort-ui.Envelope` is the schema for the overall structure of the payload, where `drasi` is the connector name, `default` is the query container namespace, and `building-comfort-ui` is the query ID. This schema is specific to the query result.
|5|`payload`|The value's actual data. This is the information that the change event is providing.
|6|`before`|An optional field that specifies the state of the document before the event occurred. In this example, all fields are part of the `building-comfort-ui` query result. When the `op` field is `c` for _create_, the `before` field will be `null` since it reflects added results.
|7|`after`|An optional field that specifies the state of the document before the event occurred. In this example, all fields are part of the `building-comfort-ui` query result. When the `op` field is `d` for _delete_, the `after` field will be `null` since it reflects deleted results.
|8|`source`|Mandatory field that describes the source metadata for the event. This field contains information that you can use to compare this event with other events, with regard to the origin of the events, the order in which the events occurred, and whether events were part of the same transaction. The source metadata includes:<ul><li>Drasi version.</li><li>Name of Drasi Reaction "connector" that generated the event (i.e. always "drasi").</li><li>Namespace of the query container.</li><li>Hostname of the query container instance.</li><li>Timestamp for when the query was complete and the result published in ms.</li><li>Unique sequence number for the result.</li></ul>
|9|`op`|Mandatory string that describes the type of operation that caused the connector to generate the event. In this example, `u` indicates that the operation is _updated_ so the value is one of the Continuous Query `updatedResults`. Valid values are:<ul><li>`c` = create</li><li>`u` = update</li><li>`d` = delete</li></ul>
|9|`ts_ms`|Optional field that displays the time at which the Drasi Debezium Reaction processed the event. The time is based on the system clock in running in the Reaction reported in ms. Note that the current implementation always fills in a value here despite it being schematically optional.<br/>In the `source` object, `ts_ms` indicates the time that the query result was published. By comparing the value for `payload.source.ts_ms` with the value for `payload.ts_ms`, you can determine the lag between the query result and the Reaction's handling of it.

## Data type mappings

Note that unlike other connectors, the Drasi Debezium Reaction doesn't inherit type information from the underlying data sources (e.g. SQL, MongoDB, etc.). Instead, it infers the type information from the Continuous Query result JSON, representing the schema. This means that the type information in the event is not necessarily the same as the type information in the underlying data source, and are limited to the 6 broad JSON types:

- `string`
- `number`
- `boolean`
- `null`
- `object`
- `array`

> ⚠️ This is one area where it potentially breaks compatibility with Debezium because the type information associated with the event schemas are expected to be Kafka Connect types, not JSON types. This will need to be addressed in the future.

Types used elsewhere in the schema definitions, such as for the Drasi `source` adhere to Kafka Connect types, with most of them being strings and several fields called out as `Int64`:

- `payload.source.seq`: The sequence number of the query result containing the change event.
- `payload.source.ts_ms`: The time that the query result containing the change event was published in ms.
- `payload.ts_ms`: The time that the change event was processed by the Drasi Reaction in ms.

## Deployment and testing

The `test-debezium-reaction.yaml` file can be used to deploy the Reaction and test it with a Kafka topic, with the following configuration options:

|Property|Description
|--- |---
|`queries`| The list of continuous queries you would like the Debezium Reaction to listen to and publish change events for.
|`properties.Brokers`| The comma-separated list of Kafka brokers to write to, for example `test-kakfa:9092` which is the name of the server set up by applying the `test-kafka.yaml` file.
|`properties.Topic`| The name of the Kafka topic to write to, for example `my-kafka-topic`.
|`properties.IncludeKey`| Whether to include the `key` in the resulting event. This defaults to `false` so only the value is included by default.
|`properties.IncludeSchemas`| Whether to include the `schema` in the resulting event. If `IncludeKey` is set to `true` this will also include the key schema, otherwise only the value schema is included. This defaults to `false`.

For testing purposes, this folder also includes a `test-kafka.yaml` file that can be used to deploy a separate Kafka & Zookeper instance distinct from the `rg-kafka` & `rg-zookeeper` instances to avoid polluting the Drasi environment. Assuming you have built the Debezium Reaction container per [dev deployment instructions](../../../devops/README.md), you can deploy them with `kubectl`:

```bash
kubectl apply -f test-kafka.yaml
# Wait for the Kafka & Zookeeper pods to be ready
kubectl apply -f test-debezium-reaction.yaml
```

There is also a Kafka consumer container in the [./log-kafka](./log-kafka/readme.md) subfolder that can be used to consume the events from the topic and print them to the console.

## Future considerations

The Debezium Reaction remains a work in progress and there are several additional areas that need to be addressed in the future:

- Consider using a schema ID to a schema registry instead of packing the schema in the event itself, which may be one way around the issue of the current `before`/`after` schemas using inferred JSON types and not Kafka Connect types.
  - MongoDB connector sort of works around this by using the Debezium text schema ID, so the documents are effectively untyped text blocks.

- Add SASL or other auth support for Kafka brokers. As with the Drasi Kafka instance today, this depends on an unsecured Kafka instance for prototyping purposes.

- Add support for mapping queries to different topics; the Reaction publishes all queries to the same topic today, but it's not entirely clear if this is a necessary use case (or if the recommended approach is to have a separate Reaction for each query).
  
- Consider other fields to put in the event value `source`:
  - Other fields commonly seen in other Debezium connectors:
    - Snapshot (probably unnecessary, since there's no snapshotting as applies to a SQL database, example).
  - Other fields from the result `metadata` property:
    - Passthrough the underlying Debzium `changeEvent`?
    - `tracking.query.indexType`?
    - `tracking.query.mode`?
    - Any of the other performance timing fields?

- Convert this to an actual Debezium connector (i.e. Kafka Connect source connector) instead of a Reaction. This would require thinking about whether the Reaction extensibility/development model in general, but it feels like one of the selling points of Debezium is that they are just Kafka Connect source connectors, and participants in that ecosystem may not be as interested in the Drasi Reaction model.
