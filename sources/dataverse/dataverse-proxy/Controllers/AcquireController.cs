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

﻿using Proxy.Models;
using Proxy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Proxy.Controllers
{
    [Route("acquire")]
    [ApiController]
    public class AcquireController : ControllerBase
    {
        private readonly IInititalDataFetcher _consumer;

        public AcquireController(IInititalDataFetcher consumer)
        {
            _consumer = consumer;
        }

        [HttpPost]
        public async Task<AcquireResponse> Acquire(AcquireRequest request)
        {
            var result = new AcquireResponse();
            foreach (var nl in request.NodeLabels)
            {
                await foreach (var change in _consumer.GetBootstrapData(nl, CancellationToken.None))
                {
                    if (change != null)
                        result.Nodes.Add(change);
                }                
            }

            return result;
        }
    }
}
