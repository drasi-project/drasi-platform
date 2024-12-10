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
using System.Net.WebSockets;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.CosmosDB;


var reaction = new ReactionBuilder()
				.UseChangeEventHandler<GremlinChangeHandler>()
				.ConfigureServices((services) =>
				 {
					// Creating a singleton GremlinClient
					services.AddSingleton<GremlinClient>(sp => {
						var config = sp.GetRequiredService<IConfiguration>();
						var logger = sp.GetRequiredService<ILogger<GremlinClient>>();

						var databaseHost = config["gremlinHost"];
						var databasePort = int.TryParse(config["gremlinPort"], out var port) ? port : 443;
						var databaseEnableSSL = !bool.TryParse(config["databaseEnableSSL"], out var enableSSL) || enableSSL;

						// if databasehost ends with .gremlin.cosmos.azure.com, set useCosmos to true
						var useCosmos = databaseHost.EndsWith(".gremlin.cosmos.azure.com");
						var username = config["gremlinUsername"];
						if (useCosmos)
						{
							var connectionPoolSettings = new ConnectionPoolSettings()
							{
								MaxInProcessPerConnection = 10,
								PoolSize = 30,
								ReconnectionAttempts = 3,
								ReconnectionBaseDelay = TimeSpan.FromMilliseconds(500)
							};
							var webSocket_configuration = new Action<ClientWebSocketOptions>(options =>
							{
								options.KeepAliveInterval = TimeSpan.FromSeconds(10);
							});
							switch (config.GetIdentityType())
							{
								case IdentityType.MicrosoftEntraWorkloadID:
									logger.LogInformation("Using Microsoft Entra Workload ID");
									DefaultAzureCredential azureCredential = new();
									var armClient = new ArmClient(azureCredential);
									var subscriptionId = config.GetValue<string>("subscriptionId");
									var cosmosDbAccountName = databaseHost.Split('.')[0];
									var resourceGroupName = config.GetValue<string>("resourceGroupName");
									// Get the Cosmos DB account resource
									var cosmosAccountResourceId = CosmosDBAccountResource.CreateResourceIdentifier(
										subscriptionId, resourceGroupName, cosmosDbAccountName);
									var cosmosAccount = armClient.GetCosmosDBAccountResource(cosmosAccountResourceId);
									var keys = cosmosAccount.GetKeys();
									var primaryPassword = keys.Value.PrimaryMasterKey;
								
									return new GremlinClient(
										new GremlinServer(databaseHost, databasePort, enableSsl: databaseEnableSSL, username: username, password: primaryPassword),
										new CustomGraphSON2Reader(),
										new GraphSON2Writer(),
										"application/vnd.gremlin-v2.0+json",
										connectionPoolSettings,
										webSocket_configuration);
									break;
								case IdentityType.MicrosoftEntraApplication:
									logger.LogInformation("Using Microsoft Entra Application");

									var clientId = config.GetValue<string>("AZURE_CLIENT_ID");
									var tenantId = config.GetValue<string>("AZURE_TENANT_ID");
									var clientSecret = config.GetValue<string>("AZURE_CLIENT_SECRET");
									subscriptionId = config.GetValue<string>("subscriptionId");


									var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
									armClient = new ArmClient(credential, subscriptionId);
									cosmosDbAccountName = databaseHost.Split('.')[0];
									resourceGroupName = config.GetValue<string>("resourceGroupName");
									// Get the Cosmos DB account resource
									cosmosAccountResourceId = CosmosDBAccountResource.CreateResourceIdentifier(
										subscriptionId, resourceGroupName, cosmosDbAccountName);
									cosmosAccount = armClient.GetCosmosDBAccountResource(cosmosAccountResourceId);
									keys = cosmosAccount.GetKeys();
									primaryPassword = keys.Value.PrimaryMasterKey;
								
									return new GremlinClient(
										new GremlinServer(databaseHost, databasePort, enableSsl: databaseEnableSSL, username: username, password: primaryPassword),
										new CustomGraphSON2Reader(),
										new GraphSON2Writer(),
										"application/vnd.gremlin-v2.0+json",
										connectionPoolSettings,
										webSocket_configuration);
									break;
								default:
									logger.LogInformation("Using Access Key");
									var gremlinPassword = config["gremlinPassword"] ?? throw new Exception("Gremlin Password is required");
									return new GremlinClient(
										new GremlinServer(databaseHost, databasePort, enableSsl: databaseEnableSSL, username: username, password: gremlinPassword),
										new CustomGraphSON2Reader(),
										new GraphSON2Writer(),
										"application/vnd.gremlin-v2.0+json",
										connectionPoolSettings,
										webSocket_configuration);
									break;
							}
						}
						var password = config["gremlinPassword"];
						var gremlinServer = (password != null && username != null)
							? new GremlinServer(databaseHost, databasePort, username: username, password: password) 
							: new GremlinServer(databaseHost, databasePort);
						return new GremlinClient(gremlinServer);
						});
					services.AddSingleton<GremlinService>();
				 }).Build();



await reaction.StartAsync();

