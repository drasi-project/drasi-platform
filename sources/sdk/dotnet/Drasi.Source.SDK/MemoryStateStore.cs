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

using System;
using Dapr.Client;
using Microsoft.Extensions.Configuration;

namespace Drasi.Source.SDK
{
    public class MemoryStateStore : IStateStore
    {
        private readonly Dictionary<string, byte[]> _store = new();

        public Task Delete(string key)
        {
            _store.Remove(key);
            return Task.CompletedTask;
        }

        public Task<byte[]?> Get(string key)
        {            
            return Task.FromResult(_store.TryGetValue(key, out var value) ? value : null);
        }

        public Task Put(string key, byte[] value)
        {
            _store[key] = value;
            return Task.CompletedTask;
        }
    }
}