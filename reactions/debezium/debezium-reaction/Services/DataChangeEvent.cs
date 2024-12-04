// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

namespace Drasi.Reactions.Debezium.Services;

using System.Text.Json.Serialization;
using System.Text.Json;
using System.Collections.Generic;


public class DataChangeEventKey
{
    [JsonPropertyName("schema")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Schema? KeySchema { get; set; }

    [JsonPropertyName("payload")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public KeyPayload? KeyPayload { get; set; }

}

public class DataChangeEventValue
{

    [JsonPropertyName("schema")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Schema? ValueSchema { get; set; }

    [JsonPropertyName("payload")]
    public Payload ValuePayload { get; set; }
}

public class Schema
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("name")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Name { get; set; }

    [JsonPropertyName("optional")]
    public bool Optional { get; set; }

    [JsonPropertyName("fields")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<Field>? Fields { get; set; }
}

public class KeyPayload
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
}


public class Payload
{
    [JsonPropertyName("before")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? Before { get; set; }

    [JsonPropertyName("after")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public JsonElement? After { get; set; }

    [JsonPropertyName("source")]
    public Source Source { get; set; }

    [JsonPropertyName("op")]
    public string Operation { get; set; }

    [JsonPropertyName("ts_ms")]
    public long TimestampMs { get; set; }
}

public class Source
{
    [JsonPropertyName("version")]
    public string Version { get; set; }

    [JsonPropertyName("connector")]
    public string Connector { get; set; }


    [JsonPropertyName("ts_ms")]
    public long TimestampMs { get; set; }

    [JsonPropertyName("seq")]
    public long Sequence { get; set; }
}
public class Field
{
    [JsonPropertyName("field")]
    public string SchemaField { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("optional")]
    public bool Optional { get; set; }

    [JsonPropertyName("fields")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<Field>? Fields { get; set; }

    [JsonPropertyName("name")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Name { get; set; }
}


