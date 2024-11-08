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

using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Logging;
using System;

namespace Drasi.Reaction.SDK.Services
{
    internal class DefaultControlEventHandler<T>(ILogger<DefaultControlEventHandler<T>> logger) : IControlEventHandler<T> where T : class
    {
        private readonly ILogger<DefaultControlEventHandler<T>> _logger = logger;

        public Task HandleControlSignal(ControlEvent evt, T? queryConfig)
        {
            _logger.LogInformation("Received control signal: {ControlEvent}", evt?.ControlSignal?.Kind);
            return Task.CompletedTask;
        }

    }
}
