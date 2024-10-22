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

﻿
using StorageQueueReaction.Models;
using System.Text.Json;

namespace StorageQueueReaction.Services
{
    public class ChangeFormatter : IChangeFormatter
    {
        public IEnumerable<ChangeNotification> FormatAdd(string queryId, JsonElement.ArrayEnumerator input)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in input)
            {
                var outputItem = new ChangeNotification
                {
                    Op = "i",
                    TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Schema = "",
                    Payload = new ChangePayload()
                    {
                        Source = new ChangeSource()
                        {
                            Db = "Drasi",
                            Table = queryId
                        },
                        Before = null,
                        After = inputItem
                    }
                };

                result.Add(outputItem);
            }

            return result;
        }

        public IEnumerable<ChangeNotification> FormatUpdate(string queryId, JsonElement.ArrayEnumerator input)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in input)
            {
                var outputItem = new ChangeNotification
                {
                    Op = "u",
                    TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Schema = "",
                    Payload = new ChangePayload()
                    {
                        Source = new ChangeSource()
                        {
                            Db = "Drasi",
                            Table = queryId
                        },
                        Before = inputItem.GetProperty("before"),
                        After = inputItem.GetProperty("after")
                    }
                };

                result.Add(outputItem);
            }

            return result;
        }

        public IEnumerable<ChangeNotification> FormatDelete(string queryId, JsonElement.ArrayEnumerator input)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in input)
            {
                var outputItem = new ChangeNotification
                {
                    Op = "d",
                    TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Schema = "",
                    Payload = new ChangePayload()
                    {
                        Source = new ChangeSource()
                        {
                            Db = "Drasi",
                            Table = queryId
                        },
                        Before = inputItem,
                        After = null
                    }
                };

                result.Add(outputItem);
            }

            return result;
        }

    }
}
