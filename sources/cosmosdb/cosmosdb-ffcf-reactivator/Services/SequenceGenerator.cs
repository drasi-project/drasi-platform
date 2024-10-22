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
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cosmosdb_reactivator.Services
{
    internal class SequenceGenerator : BackgroundService, ISequenceGenerator
    {
        private readonly DaprClient _dapr;
        private readonly string _stateStore;
        private long _current = 0;
        private TaskCompletionSource _init = new TaskCompletionSource();

        public SequenceGenerator(DaprClient dapr, string stateStore)
        {
            _dapr = dapr;
            _stateStore = stateStore;

        }

        public long GetNext()
        {
            _init.Task.Wait();
            return Interlocked.Increment(ref _current);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var lastPersisted = await _dapr.GetStateAsync<long>(_stateStore, "sequence");
            _current = lastPersisted;
            _init.SetResult();
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000);
                var current = Interlocked.Read(ref _current);
                if (current != lastPersisted)
                {
                    await _dapr.SaveStateAsync(_stateStore, "sequence", current);
                    lastPersisted = current;
                }
            }
        }
    }
}
