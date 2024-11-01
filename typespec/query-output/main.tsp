import "@typespec/json-schema";
import "@typespec/versioning";

using TypeSpec.JsonSchema;
using TypeSpec.Versioning;

@jsonSchema
@versioned(Drasi.QueryOutput.Versions)
namespace Drasi.QueryOutput;

@extension("title", "Versions")
enum Versions {
    v1,
  }

@discriminator("kind")
@extension("title", "ResultEvent")
model ResultEvent {
    queryId: string;
    sequence: int64;
    sourceTimeMs: int64;
    metadata?: Record<unknown>
}

@extension("title", "ChangeEvent")
model ChangeEvent extends ResultEvent {
    kind: "change";
   
    @doc("The results that were added")
    addedResults: Record<unknown>[];

    @doc("The results that were updated")
    updatedResults: UpdatePayload[];

    @doc("The results that were deleted")
    deletedResults: Record<unknown>[];
}

@extension("title", "UpdatePayload")
model UpdatePayload {
    @doc("The result before the change")
    before: Record<unknown>;

    @doc("The result after the change")
    after: Record<unknown>;
}

@extension("title", "ControlEvent")
model ControlEvent extends ResultEvent {
    kind: "control";    
    controlSignal: ControlSignal;
}

@discriminator("kind")
@extension("title", "ControlSignal")
model ControlSignal {
}

@extension("title", "BootstrapStartedSignal")
model BootstrapStartedSignal extends ControlSignal {
    kind: "bootstrapStarted";    
}

@extension("title", "BootstrapCompletedSignal")
model BootstrapCompletedSignal extends ControlSignal {
    kind: "bootstrapCompleted";    
}

@extension("title", "RunningSignal")
model RunningSignal extends ControlSignal {
    kind: "running";    
}

@extension("title", "StoppedSignal")
model StoppedSignal extends ControlSignal {
    kind: "stopped";    
}

@extension("title", "DeletedSignal")
model DeletedSignal extends ControlSignal {
    kind: "deleted";    
}

