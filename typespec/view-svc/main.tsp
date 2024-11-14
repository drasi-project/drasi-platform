import "@typespec/json-schema";

using TypeSpec.JsonSchema;

@jsonSchema
namespace Drasi.View;

@extension("title", "ViewItem")
union ViewItem {
    header: Header;
    data: Data;
}

@extension("title", "Header")
model Header {
    header: HeaderItem;
}

@extension("title", "Data")
model Data {
    data: Record<unknown>;
}

@extension("title", "HeaderItem")
model HeaderItem {
    @doc("The sequence number of the event")
    sequence: int64;

    @doc("The time at which the source change was recorded")
    timestamp: int64;

    state?: string;
}
