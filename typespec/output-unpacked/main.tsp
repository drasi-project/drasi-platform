import "@typespec/json-schema";
import "@typespec/versioning";

using TypeSpec.JsonSchema;
using TypeSpec.Versioning;

@jsonSchema
@versioned(Drasi.Unpacked.Versions)
namespace Drasi.Unpacked;

@extension("title", "Versions")
enum Versions {
    v1,
}

@extension("title", "Op")
enum Op {
    Insert: "i",
    Update: "u",
    Delete: "d",
    ControlSignal: "x",
    ReloadHeader: "h",
    ReloadItem: "r"
};

@discriminator("op")
@extension("title", "Notification")
model Notification {
    "op": Op;
    ts_ms: int64;
    metadata?: Record<unknown>
}

@extension("title", "ChangeNotification")
model ChangeNotification extends Notification {
    "op": Op.Insert | Op.Update | Op.Delete;
    payload: ChangePayload;

    @doc("The sequence number of the source change")
    seq: int64;
}

@extension("title", "ControlSignalNotification")
model ControlSignalNotification extends Notification {
    "op": Op.ControlSignal;
    payload: ControlPayload;

    @doc("The sequence number of the control signal")
    seq: int64;
}

@extension("title", "ReloadHeader")
model ReloadHeader extends Notification {
    "op": Op.ReloadHeader;
    
    @doc("The sequence number of last known source change")
    seq: int64;
}

@extension("title", "ReloadItem")
model ReloadItem extends Notification {
    "op": Op.ReloadItem;
    
    payload: ChangePayload;
}

@extension("title", "ChangePayload")
model ChangePayload {    
    source: ChangeSource;
    before?: Record<unknown>;
    after?: Record<unknown>;
}

@extension("title", "ControlPayload")
model ControlPayload {    
    source: ChangeSource;
    kind: string;
}

@extension("title", "ChangeSource")
model ChangeSource {
    @doc("The ID of the query that the change originated from")
    queryId: string;
    ts_ms: int64;
}
