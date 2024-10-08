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

﻿using System.Text.Json.Serialization;

namespace EventgridReaction.Models
{
    public class ChangeNotification
    {
        [JsonPropertyName("op")]
        public string Op { get; set; }

        [JsonPropertyName("ts_ms")]
        public long TimestampMilliseconds { get; set; }

        [JsonPropertyName("schema")]
        public string Schema { get; set; }

        [JsonPropertyName("payload")]
        public ChangePayload Payload { get; set; }
    }

    public class ChangePayload
    {
        [JsonPropertyName("source")]
        public ChangeSource Source { get; set; }

        [JsonPropertyName("before")]
        public object? Before { get; set; }

        [JsonPropertyName("after")]
        public object? After { get; set; }
    }

    public class ChangeSource
    {
        [JsonPropertyName("db")]
        public string Db { get; set; }
        [JsonPropertyName("table")]
        public string Table { get; set; }
    }
}
