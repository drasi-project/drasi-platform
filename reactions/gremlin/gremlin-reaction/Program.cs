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


using Drasi.Reaction.SDK;
using Drasi.Reactions.Gremlin.Services;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Gremlin.Net.Structure.IO.GraphSON;
using Gremlin.Net.Driver;
using Gremlin.Net.Driver.Exceptions;
using Microsoft.Azure.Cosmos;

using System.Net.WebSockets;

using Azure.Identity;
using Azure.Core;
using HostInitActions;


var reaction = new ReactionBuilder()
				.UseChangeEventHandler<GremlinChangeHandler>()
				.ConfigureServices((services) =>
				 {
					services.AddSingleton<GremlinService>();
					services.AddAsyncServiceInitialization()
						.AddInitAction<GremlinService>(async (service, cancellationToken) =>
						 {
							await service.InitializeAsync(cancellationToken);
						 });
					 
				 }).Build();



await reaction.StartAsync();

