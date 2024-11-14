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
using System.Text.Json;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.StorageQueue.Models.Unpacked;

namespace Drasi.Reactions.StorageQueue.Services
{
    public class ChangeFormatter : IChangeFormatter
    {
        public IEnumerable<ChangeNotification> Format(ChangeEvent evt)
        {
            var result = new List<ChangeNotification>();
            foreach (var inputItem in evt.AddedResults)
            {
                var outputItem = new ChangeNotification
                {
                    Op = ChangeNotificationOp.I,
                    TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Payload = new PayloadClass()
                    {
                        Source = new SourceClass()
                        {
                            QueryId = evt.QueryId,
                            TsMs = evt.SourceTimeMs
                        },
                        After = inputItem
                    }
                };
                result.Add(outputItem);
            }

            foreach (var inputItem in evt.UpdatedResults)
            {
                var outputItem = new ChangeNotification
                {
                    Op = ChangeNotificationOp.U,
                    TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Payload = new PayloadClass()
                    {
                        Source = new SourceClass()
                        {
                            QueryId = evt.QueryId,
                            TsMs = evt.SourceTimeMs
                        },
                        Before = inputItem.Before,
                        After = inputItem.After
                    }
                };
                result.Add(outputItem);
            }

            foreach (var inputItem in evt.DeletedResults)
            {
                var outputItem = new ChangeNotification
                {
                    Op = ChangeNotificationOp.D,
                    TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Payload = new PayloadClass()
                    {
                        Source = new SourceClass()
                        {
                            QueryId = evt.QueryId,
                            TsMs = evt.SourceTimeMs
                        },
                        Before = inputItem
                    }
                };
                result.Add(outputItem);
            }

            return result;
        }        
    }
}
