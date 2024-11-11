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
    
    @doc("The ID of the query that the event originated from")
    queryId: string;

    @doc("The sequence number of the event")
    sequence: int64;

    @doc("The time at which the source change was recorded")
    sourceTimeMs: int64;
    
    metadata?: Record<unknown>
}

@extension("title", "ChangeEvent")
@doc("An event that represents a changes in the result set")
model ChangeEvent extends ResultEvent {
    kind: "change";
   
    @doc("The results that were added to the result set as a consequence of the change")
    addedResults: Record<unknown>[];

    @doc("The results that were updated on the result set as a consequence of the change")
    updatedResults: UpdatePayload[];

    @doc("The results that were deleted from the result set as a consequence of the change")
    deletedResults: Record<unknown>[];
}

@extension("title", "UpdatePayload")
@doc("A payload that represents the before and after snapshots of a result")
model UpdatePayload {
    @doc("The snapshot of the result before the change")
    before: Record<unknown>;

    @doc("The snapshot of the result after the change")
    after: Record<unknown>;
}

@extension("title", "ControlEvent")
@doc("An event that represents a control signal from the query, such are start, stop, etc.")
model ControlEvent extends ResultEvent {
    kind: "control";    
    controlSignal: ControlSignal;
}

@discriminator("kind")
@extension("title", "ControlSignal")
model ControlSignal {
}

@extension("title", "BootstrapStartedSignal")
@doc("A signal that indicates that the query is starting to bootstrap")
model BootstrapStartedSignal extends ControlSignal {
    kind: "bootstrapStarted";    
}

@extension("title", "BootstrapCompletedSignal")
@doc("A signal that indicates that the query has completed bootstrapping")
model BootstrapCompletedSignal extends ControlSignal {
    kind: "bootstrapCompleted";    
}

@extension("title", "RunningSignal")
@doc("A signal that indicates that the query has entered the running state")
model RunningSignal extends ControlSignal {
    kind: "running";    
}

@extension("title", "StoppedSignal")
@doc("A signal that indicates that the query has stopped")
model StoppedSignal extends ControlSignal {
    kind: "stopped";    
}

@extension("title", "DeletedSignal")
@doc("A signal that indicates that the query has been deleted")
model DeletedSignal extends ControlSignal {
    kind: "deleted";    
}

