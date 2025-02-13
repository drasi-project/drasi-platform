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

using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using static Drasi.Source.SDK.Models.SourceElement;

namespace Drasi.Source.SDK.Models;


public class SourceChange
{
    private readonly  ChangeOp op;
    private readonly long tsMS;
    private readonly long lsn;

    private readonly SourceElement element;

    /// <summary>
    /// Create a new SourceChange
    /// </summary>
    /// <param name="op">Type of change (insert/update/delete)</param>
    /// <param name="element">The current state of the node or relation</param>
    /// <param name="timestampMs">The Unix time in milliseconds of the change</param>
    /// <param name="lsn">The sequence number of the change</param>
    public SourceChange(ChangeOp op, SourceElement element, long timestampMs, long lsn)
    {
        this.op = op;
        this.tsMS = timestampMs;
        this.element = element;
        this.lsn = lsn;
    }

    public string ToJson()
    {
        var rgSource = new JsonObject
        {
            { "db", Reactivator.SourceId() },
            { "table", element.Type switch
                {
                    ElementType.Node => "node",
                    ElementType.Relation => "rel",
                    _ => throw new NotImplementedException()
                } 
            },
            { "lsn", lsn },
            { "ts_ms", tsMS }
        };

        var payload = new JsonObject
        {
            { "source", rgSource }
        };

        switch (op)
        {
            case ChangeOp.INSERT:
            case ChangeOp.UPDATE:
                payload.Add("after", element.ToJsonObject());
                break;
            case ChangeOp.DELETE:
                payload.Add("before", element.ToJsonObject());
                break;
        }

        var result = new JsonObject
        {
            { "op", op switch
                {
                    ChangeOp.INSERT => "i",
                    ChangeOp.UPDATE => "u",
                    ChangeOp.DELETE => "d",
                    _ => throw new NotImplementedException()
                }
            },
            { "ts_ms", tsMS },
            { "payload", payload }
        };

        return result.ToJsonString();
    }    
}

public enum ChangeOp
{
    INSERT,
    UPDATE,
    DELETE
}
