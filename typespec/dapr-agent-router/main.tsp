import "@typespec/json-schema";

using TypeSpec.JsonSchema;

@jsonSchema
namespace Drasi.AgentRouter;

alias ProtocolVersion = 1;

@minLength(1)
@extension("title", "NonEmptyString")
scalar NonEmptyString extends string;

// Some regex engines let "$" match before a final newline. Exclude whitespace independently.
@pattern("^[^/\\s]+$")
@extension("not", #{ pattern: "\\s" })
@extension("title", "IdentityPart")
scalar IdentityPart extends NonEmptyString;

@pattern("^[^/\\s]+/[^/\\s]+$")
@extension("not", #{ pattern: "\\s" })
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
@extension("additionalProperties", false)
model Query {
    query_id: NonEmptyString;
    title: NonEmptyString;
    description: NonEmptyString;
    usage?: NonEmptyString;
}

@extension("title", "ListQueriesResponse")
@extension("additionalProperties", false)
model ListQueriesResponse {
    protocol_version: ProtocolVersion;
    router_id: RouterId;
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
@extension("additionalProperties", false)
model SubscribeResponse {
    query_id: NonEmptyString;
    @doc("Selected operations form a non-empty, unique set. Their order has no semantic meaning.")
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
@extension("additionalProperties", false)
model UnsubscribeResponse {
    query_id: NonEmptyString;
    removed: boolean;
}

@extension("title", "ToolError")
@extension("additionalProperties", false)
model ToolError {
    code: "invalid_arguments" | "unknown_query" | "incarnation_conflict" | "state_unavailable";
    message: NonEmptyString;
}

@extension("title", "ChangeSource")
@extension("additionalProperties", false)
model ChangeSource {
    queryId: NonEmptyString;
    ts_ms: Timestamp;
}

@extension("title", "InsertPayload")
@extension("additionalProperties", false)
model InsertPayload {
    source: ChangeSource;
    after: Record<unknown>;
}

@extension("title", "UpdatePayload")
@extension("additionalProperties", false)
model UpdatePayload {
    source: ChangeSource;
    before: Record<unknown>;
    after: Record<unknown>;
}

@extension("title", "DeletePayload")
@extension("additionalProperties", false)
model DeletePayload {
    source: ChangeSource;
    before: Record<unknown>;
}

alias RowMetadata = {
    seq: Sequence;
    ts_ms: Timestamp;
};

@extension("title", "InsertEvent")
@extension("additionalProperties", false)
model InsertEvent {
    ...RowMetadata;
    "op": Operation.Insert;
    payload: InsertPayload;
}

@extension("title", "UpdateEvent")
@extension("additionalProperties", false)
model UpdateEvent {
    ...RowMetadata;
    "op": Operation.Update;
    payload: UpdatePayload;
}

@extension("title", "DeleteEvent")
@extension("additionalProperties", false)
model DeleteEvent {
    ...RowMetadata;
    "op": Operation.Delete;
    payload: DeletePayload;
}

@extension("title", "AgentDelivery")
@extension("additionalProperties", false)
model AgentDelivery {
    schemaVersion: ProtocolVersion;
    routerId: RouterId;
    subscriptionIncarnation: NonEmptyString;
    eventId: NonEmptyString;
    event: InsertEvent | UpdateEvent | DeleteEvent;
}
