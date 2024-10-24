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

﻿using Dapr.Client;
using Reactivator.Models;

namespace Reactivator.Services
{
    internal class ChangePublisher(DaprClient dapr, string sourceId, string pubsubName) : IChangePublisher
    {
        private readonly DaprClient _dapr = dapr;
        private readonly string _sourceId = sourceId;
        private readonly string _pubsubName = pubsubName;

        public async Task Publish(IEnumerable<ChangeNotification> changes)
        {
            await _dapr.PublishEventAsync(_pubsubName, _sourceId + "-change", changes);
        }
    }
}
