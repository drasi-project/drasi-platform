import "@typespec/json-schema";
import "@typespec/versioning";

using TypeSpec.JsonSchema;
using TypeSpec.Versioning;

@jsonSchema
@versioned(Drasi.SourceOutput.Versions)
namespace Drasi.SourceOutput;

@extension("title", "Versions")
enum Versions {
    v1,
  }

@extension("title", "SourceChange")
@discriminator("op")
model SourceChange {
    "op": "i" | "u" | "d";
    reactivatorStart_ns: uint64;
    reactivatorEnd_ns: uint64;
    metadata?: Record<unknown>
}

@extension("title", "SourceInsert")
model SourceInsert extends SourceChange {
    "op": "i";
    payload: SourceAfterPayload;
}

@extension("title", "SourceAfterPayload")
model SourceAfterPayload {
    source: ChangeSource;
    after: ChangePayload;
}

@extension("title", "SourceBeforePayload")
model SourceBeforePayload {
    source: ChangeSource;
    before: ChangePayload;
}

@extension("title", "SourceUpdate")
model SourceUpdate extends SourceChange {
    "op": "u";
    payload: SourceAfterPayload;
}

@extension("title", "SourceDelete")
model SourceDelete extends SourceChange {
    "op": "d";
    payload: SourceBeforePayload;
}

@extension("title", "ChangePayload")
model ChangePayload {
    id: string;
    labels: string[];
    properties?: Record<unknown>;
    startId?: string;
    endId?: string;
}

@extension("title", "ChangeSource")
model ChangeSource {
    db: string;
    lsn: int64;
    table: "node" | "rel";
    ts_ns: int64;    
}