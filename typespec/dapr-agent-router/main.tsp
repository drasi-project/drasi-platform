import "@typespec/json-schema";

using TypeSpec.JsonSchema;

@jsonSchema
namespace Drasi.AgentRouter;

@minLength(1)
@extension("title", "NonEmptyString")
scalar NonEmptyString extends string;

@pattern("^[^/\\s]+$")
@extension("title", "IdentityPart")
scalar IdentityPart extends NonEmptyString;

@pattern("^[^/\\s]+/[^/\\s]+$")
@extension("title", "RouterId")
scalar RouterId extends NonEmptyString;

@minValue(0)
@extension("title", "Sequence")
scalar Sequence extends integer;

@minValue(0)
@extension("title", "Timestamp")
scalar Timestamp extends integer;

@extension("title", "Operation")
enum Operation {
    Insert: "i",
    Update: "u",
    Delete: "d",
}

@extension("additionalProperties", false)
@extension("title", "ListQueriesRequest")
model ListQueriesRequest {}

@extension("title", "Query")
model Query {
    query_id: NonEmptyString;
    title: NonEmptyString;
    description: NonEmptyString;
    usage?: NonEmptyString;
}

@extension("title", "ListQueriesResponse")
model ListQueriesResponse {
    protocol_version: 1;
    delivery_schema_version: 1;
    router_id: RouterId;
    @minItems(1)
    @uniqueItems
    @extension("contains", #{ `const`: "dynamic-subscriptions" })
    capabilities: NonEmptyString[];
    queries: Query[];
}

@extension("additionalProperties", false)
@extension("title", "Subscriber")
model Subscriber {
    "namespace": IdentityPart;
    app_id: IdentityPart;
    agent_name: NonEmptyString;
}

@extension("additionalProperties", false)
@extension("title", "SubscribeRequest")
model SubscribeRequest {
    query_id: NonEmptyString;
    @minItems(1)
    @maxItems(3)
    @uniqueItems
    operations: Operation[];
    subscriber: Subscriber;
    subscription_incarnation: NonEmptyString;
}

@extension("title", "SubscribeResponse")
model SubscribeResponse {
    query_id: NonEmptyString;
    @minItems(1)
    @maxItems(3)
    @uniqueItems
    operations: Operation[];
    subscription_incarnation: NonEmptyString;
    topic_name: NonEmptyString;
    status: "created" | "updated";
}

@extension("additionalProperties", false)
@extension("title", "UnsubscribeRequest")
model UnsubscribeRequest {
    query_id: NonEmptyString;
    subscriber: Subscriber;
    subscription_incarnation: NonEmptyString;
}

@extension("title", "UnsubscribeResponse")
model UnsubscribeResponse {
    query_id: NonEmptyString;
    removed: boolean;
}

@extension("title", "ToolError")
model ToolError {
    code: "invalid_arguments" | "unknown_query" | "incarnation_conflict" | "state_unavailable";
    message: NonEmptyString;
}

@extension("title", "ChangeSource")
model ChangeSource {
    queryId: NonEmptyString;
    ts_ms: Timestamp;
}

@extension("title", "InsertPayload")
model InsertPayload {
    source: ChangeSource;
    before?: never;
    after: Record<unknown>;
}

@extension("title", "UpdatePayload")
model UpdatePayload {
    source: ChangeSource;
    before: Record<unknown>;
    after: Record<unknown>;
}

@extension("title", "DeletePayload")
model DeletePayload {
    source: ChangeSource;
    before: Record<unknown>;
    after?: never;
}

@extension("title", "RowEvent")
model RowEvent {
    "op": Operation;
    seq: Sequence;
    ts_ms: Timestamp;
}

@extension("title", "InsertEvent")
model InsertEvent extends RowEvent {
    "op": Operation.Insert;
    payload: InsertPayload;
}

@extension("title", "UpdateEvent")
model UpdateEvent extends RowEvent {
    "op": Operation.Update;
    payload: UpdatePayload;
}

@extension("title", "DeleteEvent")
model DeleteEvent extends RowEvent {
    "op": Operation.Delete;
    payload: DeletePayload;
}

@extension("title", "AgentDelivery")
model AgentDelivery {
    schemaVersion: 1;
    routerId: RouterId;
    subscriptionIncarnation: NonEmptyString;
    eventId: NonEmptyString;
    event: InsertEvent | UpdateEvent | DeleteEvent;
}
